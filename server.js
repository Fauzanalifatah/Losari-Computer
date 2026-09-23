require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const staticDir = path.join(__dirname, "static");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/static", express.static(staticDir));
app.use(express.static(staticDir));

function renderPage(res, page) {
  const file = path.join(__dirname, "views", `${page}.html`);
  if (!fs.existsSync(file)) return res.status(404).send("Halaman tidak ditemukan.");
  res.sendFile(file);
}

app.get(["/", "/index.html"], (req, res) => renderPage(res, "index"));
app.get(["/laptop", "/laptop.html"], (req, res) => renderPage(res, "laptop"));
app.get(["/tentang", "/tentang.html"], (req, res) => renderPage(res, "tentang"));
app.get(["/layanan", "/layanan.html"], (req, res) => renderPage(res, "layanan"));
app.get(["/kontak", "/kontak.html"], (req, res) => renderPage(res, "kontak"));
app.get(["/checkout-produk", "/checkout-produk.html"], (req, res) => renderPage(res, "checkout-produk"));
app.get(["/checkout", "/checkout.html"], (req, res) => renderPage(res, "checkout-produk"));
app.get(["/payment", "/payment.html"], (req, res) => res.sendFile(path.join(__dirname, "views", "payment", "payment-status.html")));
app.get(["/detail-produk", "/detail-produk.html", "/detail", "/detail.html", "/detail-produk/:id", "/detail/:id"], (req, res) => renderPage(res, "detail-produk"));

// Dynamic fallback route for any html page in views/
app.get("/:page", (req, res, next) => {
  const page = req.params.page.replace(/\.html$/, "");
  const file = path.join(__dirname, "views", `${page}.html`);
  if (fs.existsSync(file)) return res.sendFile(file);
  next();
});

const crypto = require("crypto");

// =========================================================
// MIDTRANS PAYMENT GATEWAY CONFIGURATION
// =========================================================
const MIDTRANS_CONFIG = {
  merchantId: process.env.MIDTRANS_MERCHANT_ID || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  isProduction: process.env.MIDTRANS_IS_PRODUCTION !== "false"
};

function getMidtransAuthHeader() {
  return "Basic " + Buffer.from(MIDTRANS_CONFIG.serverKey + ":").toString("base64");
}

function getSnapUrl() {
  return MIDTRANS_CONFIG.isProduction
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";
}

function getMidtransApiBase() {
  return MIDTRANS_CONFIG.isProduction
    ? "https://api.midtrans.com/v2"
    : "https://api.sandbox.midtrans.com/v2";
}

// Public client config for frontend
app.get("/api/midtrans/config", (req, res) => {
  res.json({
    ok: true,
    clientKey: MIDTRANS_CONFIG.clientKey,
    merchantId: MIDTRANS_CONFIG.merchantId,
    isProduction: MIDTRANS_CONFIG.isProduction,
    snapJsUrl: MIDTRANS_CONFIG.isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js"
  });
});

// Endpoint untuk membuat Snap Token pembayaran
app.post("/api/midtrans/create-transaction", async (req, res) => {
  try {
    const { orderId, amount, customerDetails, items, notes } = req.body;

    const grossAmount = Math.round(Number(amount));
    if (!grossAmount || grossAmount <= 0) {
      return res.status(400).json({ ok: false, message: "Nominal pembayaran tidak valid." });
    }

    // Format ID transaksi yang bersih & unik (maks 50 karakter)
    const cleanOrderId = (orderId ? String(orderId).replace(/[^a-zA-Z0-9\-_]/g, "").slice(0, 45) : "")
      || `LOSARI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Format detail pelanggan
    const cust = customerDetails || {};
    const formattedCustomer = {
      first_name: (cust.name || cust.first_name || "Pelanggan").slice(0, 45),
      email: cust.email || "customer@losaricomputer.com",
      phone: (cust.phone || "081234567890").slice(0, 19),
      billing_address: {
        first_name: (cust.name || "Pelanggan").slice(0, 45),
        phone: (cust.phone || "081234567890").slice(0, 19),
        address: (cust.address || "Makassar").slice(0, 100),
        city: "Makassar",
        country_code: "IDN"
      },
      shipping_address: {
        first_name: (cust.name || "Pelanggan").slice(0, 45),
        phone: (cust.phone || "081234567890").slice(0, 19),
        address: (cust.address || "Makassar").slice(0, 100),
        city: "Makassar",
        country_code: "IDN"
      }
    };

    // Format item details jika ada
    let formattedItems = [];
    if (Array.isArray(items) && items.length > 0) {
      let itemsTotal = 0;
      formattedItems = items.map((it, idx) => {
        const itemPrice = Math.round(Number(it.price) || 0);
        const itemQty = Math.max(1, Math.round(Number(it.qty || it.quantity) || 1));
        itemsTotal += itemPrice * itemQty;
        return {
          id: String(it.id || `ITEM-${idx + 1}`).slice(0, 50),
          price: itemPrice,
          quantity: itemQty,
          name: String(it.name || "Laptop Losari").slice(0, 50)
        };
      });

      // Midtrans mensyaratkan sum(item_details) == gross_amount
      if (itemsTotal !== grossAmount) {
        formattedItems = [{
          id: "TOTAL-ORDER",
          price: grossAmount,
          quantity: 1,
          name: `Pesanan ${cleanOrderId}`.slice(0, 50)
        }];
      }
    } else {
      formattedItems = [{
        id: "TOTAL-ORDER",
        price: grossAmount,
        quantity: 1,
        name: `Pesanan ${cleanOrderId}`.slice(0, 50)
      }];
    }

    const payload = {
      transaction_details: {
        order_id: cleanOrderId,
        gross_amount: grossAmount
      },
      item_details: formattedItems,
      customer_details: formattedCustomer,
      callbacks: {
        finish: `${req.headers["x-forwarded-proto"] || req.protocol || "http"}://${req.headers.host || "localhost:3000"}/payment?order_id=${cleanOrderId}&status=finish`
      }
    };

    const midtransRes = await fetch(getSnapUrl(), {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": getMidtransAuthHeader()
      },
      body: JSON.stringify(payload)
    });

    const midtransData = await midtransRes.json();

    if (!midtransRes.ok || !midtransData.token) {
      console.error("[Midtrans Error]", midtransRes.status, midtransData);
      return res.status(midtransRes.status || 500).json({
        ok: false,
        message: midtransData.error_messages ? midtransData.error_messages.join(", ") : "Gagal membuat transaksi Midtrans.",
        error: midtransData
      });
    }

    res.json({
      ok: true,
      token: midtransData.token,
      redirectUrl: midtransData.redirect_url,
      orderId: cleanOrderId,
      amount: grossAmount
    });
  } catch (err) {
    console.error("[Midtrans Server Error]", err);
    res.status(500).json({ ok: false, message: "Terjadi kesalahan internal server.", error: err.message });
  }
});

// Endpoint untuk cek status transaksi secara langsung ke Midtrans API
app.get("/api/midtrans/status/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    if (!orderId) {
      return res.status(400).json({ ok: false, message: "Order ID diperlukan." });
    }

    const midtransRes = await fetch(`${getMidtransApiBase()}/${encodeURIComponent(orderId)}/status`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": getMidtransAuthHeader()
      }
    });

    const data = await midtransRes.json();

    if (midtransRes.status === 404 || data.status_code === "404") {
      return res.json({
        ok: false,
        notFound: true,
        message: "Transaksi belum diproses atau belum memilih metode di Midtrans.",
        orderId
      });
    }

    res.json({
      ok: true,
      status: data.transaction_status,
      fraudStatus: data.fraud_status,
      paymentType: data.payment_type,
      grossAmount: data.gross_amount,
      transactionTime: data.transaction_time,
      settlementTime: data.settlement_time,
      data
    });
  } catch (err) {
    console.error("[Midtrans Status Error]", err);
    res.status(500).json({ ok: false, message: "Gagal mengecek status pembayaran.", error: err.message });
  }
});

// Webhook Notification Endpoint dari Midtrans
app.post("/api/midtrans/notification", async (req, res) => {
  try {
    const notif = req.body;
    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status, payment_type } = notif;

    // Verifikasi signature Midtrans: SHA512(order_id + status_code + gross_amount + ServerKey)
    const expectedSignature = crypto
      .createHash("sha512")
      .update(`${order_id}${status_code}${gross_amount}${MIDTRANS_CONFIG.serverKey}`)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      console.warn("[Midtrans Notification] Invalid signature for order:", order_id);
      return res.status(403).json({ ok: false, message: "Invalid signature" });
    }

    console.log(`[Midtrans Webhook] Order: ${order_id} | Status: ${transaction_status} | Tipe: ${payment_type}`);

    // Berikan respons 200 OK ke Midtrans
    res.status(200).json({ ok: true, message: "Notification handled" });
  } catch (err) {
    console.error("[Midtrans Notification Error]", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use((req, res) => res.status(404).send("404 - Halaman tidak ditemukan."));

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

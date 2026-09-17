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

app.get("/api/checkout-status", (req, res) => {
  const file = path.join(__dirname, "views", "checkout-produk.html");
  res.json({ ok: fs.existsSync(file), file });
});

app.get("/api/status", (req, res) => {
  res.json({ ok: true, message: "Server berjalan", time: new Date().toISOString() });
});

// Contoh endpoint backend untuk API key.
// API key tetap berada di server dan TIDAK dikirim ke browser.
app.get("/api/example", async (req, res) => {
  if (!process.env.API_KEY) {
    return res.status(500).json({ ok: false, message: "API_KEY belum dikonfigurasi di .env" });
  }

  // Tambahkan pemanggilan API eksternal Anda di sini.
  // Jangan pernah mengembalikan process.env.API_KEY ke client.
  res.json({ ok: true, message: "API key tersedia di server." });
});

app.use((req, res) => res.status(404).send("404 - Halaman tidak ditemukan."));

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

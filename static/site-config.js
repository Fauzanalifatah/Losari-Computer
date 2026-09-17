/**
 * Konfigurasi Kontak & Media Sosial Losari Computer
 * Anda cukup mengubah link/nomor di file ini, maka seluruh link di website akan otomatis terupdate.
 */
window.SITE_CONFIG = {
  // Nomor WhatsApp Toko
  whatsappNumber: "6285332990156",
  whatsappDisplay: "+62 853-3299-0156",
  whatsappDefaultMessage: "Halo admin Losari Computer, saya ingin konsultasi laptop second berkualitas. Apakah ada unit yang ready saat ini?",
  get whatsappLink() {
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(this.whatsappDefaultMessage)}`;
  },

  // Link Akun Instagram (ganti 'losari_computer' dengan username Instagram Anda)
  instagramUsername: "losari_computer",
  instagramLink: "https://www.instagram.com/losari_computer/",

  // Link Akun TikTok (ganti '@losaricomputer' dengan username TikTok Anda)
  tiktokUsername: "@losaricomputer",
  tiktokLink: "https://tiktok.com/@losaricomputer",

  // Alamat Toko
  storeLocation: "Karebosi Link, Makassar — Sulawesi Selatan"
};

// Script otomatis untuk memperbarui seluruh link kontak dan media sosial di halaman
(function syncSiteLinks() {
  function applyLinks() {
    const cfg = window.SITE_CONFIG;
    if (!cfg) return;

    // Update link WhatsApp di footer dan tombol WA
    document.querySelectorAll('.ld-soc-item.soc-wa a, a.js-site-wa, a[href*="wa.me"]').forEach(link => {
      try {
        const url = new URL(link.href);
        const textParam = url.searchParams.get('text');
        // Jika link sudah punya pesan spesifik unit produk laptop, pertahankan text tersebut
        if (textParam && textParam.includes('tertarik dengan laptop')) {
          link.href = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(textParam)}`;
        } else {
          link.href = cfg.whatsappLink;
        }
      } catch (e) {
        link.href = cfg.whatsappLink;
      }
    });

    // Update teks nomor WhatsApp
    document.querySelectorAll('.js-site-wa-text').forEach(el => {
      el.textContent = cfg.whatsappDisplay;
    });

    // Update link Instagram
    document.querySelectorAll('.ld-soc-item.soc-instagram a, a.js-site-ig').forEach(link => {
      link.href = cfg.instagramLink;
    });

    // Update link TikTok
    document.querySelectorAll('.ld-soc-item.soc-tiktok a, a.js-site-tiktok').forEach(link => {
      link.href = cfg.tiktokLink;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyLinks);
  } else {
    applyLinks();
  }
})();

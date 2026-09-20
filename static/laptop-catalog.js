
document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('catalogSearch');
  const category = document.getElementById('categoryFilter');
  const price = document.getElementById('priceFilter');
  const reset = document.getElementById('resetFilter');
  const cards = Array.from(document.querySelectorAll('.laptop-card'));
  const count = document.getElementById('catalogCount');
  const empty = document.getElementById('emptyState');
  const resultTitle = document.getElementById('resultTitle');

  const rupiah = (n) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0
  }).format(n);

  function runFilter() {
    const q = (search.value || '').trim().toLowerCase();
    const cat = category.value;
    const max = price.value === 'all' ? Infinity : Number(price.value) * 1000000;
    let visible = 0;

    cards.forEach(card => {
      const matchesText = !q || card.dataset.name.toLowerCase().includes(q) || card.textContent.toLowerCase().includes(q);
      const matchesCategory = cat === 'all' || card.dataset.category === cat;
      const matchesPrice = Number(card.dataset.price) <= max;
      const show = matchesText && matchesCategory && matchesPrice;
      card.hidden = !show;
      if (show) visible++;
    });

    if (count) count.textContent = `${visible} unit`;
    if (empty) empty.hidden = visible !== 0;
    if (resultTitle) resultTitle.textContent = visible ? 'Laptop pilihan untukmu' : 'Tidak ada unit yang cocok';
  }

  [search, category, price].forEach(el => el && el.addEventListener(el === search ? 'input' : 'change', runFilter));

  reset.addEventListener('click', () => {
    search.value = '';
    category.value = 'all';
    price.value = 'all';
    runFilter();
  });

  /* =========================================================
     KERANJANG — simpan di localStorage, tampil di drawer,
     dan hitung total harga semua item.
     ========================================================= */
  const CART_KEY = 'losari-cart';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch (err) {
      console.warn('Cart storage unavailable:', err);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn('Cart storage unavailable:', err);
    }
  }

  function resolveProductImage(item) {
    if (item.image) return item.image;
    const lower = (item.name || '').toLowerCase();
    if (lower.includes('thinkpad') && (lower.includes('t14') || lower.includes('gen 1'))) return '/static/images/laptop/thinkpad-t14.jpg';
    if (lower.includes('thinkpad') || lower.includes('t490')) return '/static/images/laptop/thinkpad-t490.jpg';
    if (lower.includes('tuf') || lower.includes('a15')) return '/static/images/laptop/asus-tuf-a15.jpg';
    if (lower.includes('elitebook') || lower.includes('840')) return '/static/images/laptop/hp-elitebook-840.jpg';
    if (lower.includes('macbook') || lower.includes('m1') || lower.includes('apple')) return '/static/images/laptop/macbook-air-m1.jpg';
    if (lower.includes('latitude') || lower.includes('5410')) return '/static/images/laptop/dell-latitude-5410.jpg';
    if (lower.includes('swift') || (lower.includes('acer') && lower.includes('swift'))) return '/static/images/laptop/acer-swift-3.jpg';
    if (lower.includes('nitro') || lower.includes('nitro 5')) return '/static/images/laptop/acer-nitro-5.jpg';
    if (lower.includes('ideapad') || lower.includes('gaming 3')) return '/static/images/laptop/lenovo-ideapad-gaming-3.jpg';
    if (lower.includes('xps') || lower.includes('xps 13')) return '/static/images/laptop/dell-xps-13.jpg';
    if (lower.includes('vivobook') && lower.includes('pro')) return '/static/images/laptop/asus-vivobook-pro-14.jpg';
    if (lower.includes('vivobook')) return '/static/images/laptop/asus-vivobook-14.jpg';
    return '/static/images/laptop/thinkpad-t490.jpg';
  }

  function resolveProductBrand(item) {
    if (item.brand) return item.brand.toUpperCase();
    const lower = (item.name || '').toLowerCase();
    if (lower.includes('thinkpad') || lower.includes('ideapad') || lower.includes('lenovo')) return 'LENOVO';
    if (lower.includes('tuf') || lower.includes('vivobook') || lower.includes('asus')) return 'ASUS';
    if (lower.includes('elitebook') || lower.includes('hp')) return 'HP';
    if (lower.includes('macbook') || lower.includes('apple')) return 'APPLE';
    if (lower.includes('latitude') || lower.includes('xps') || lower.includes('dell')) return 'DELL';
    if (lower.includes('nitro') || lower.includes('swift') || lower.includes('acer')) return 'ACER';
    return 'LAPTOP';
  }

  function addToCart(name, priceValue, image, brand) {
    const cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.qty += 1;
      if (image && !existing.image) existing.image = image;
      if (brand && !existing.brand) existing.brand = brand;
    } else {
      const resolvedImg = image || resolveProductImage({ name });
      const resolvedBrand = brand || resolveProductBrand({ name });
      cart.push({ name, price: priceValue, qty: 1, image: resolvedImg, brand: resolvedBrand });
    }
    saveCart(cart);
    renderCart();
    openCart();
  }

  function changeQty(name, delta) {
    const cart = getCart();
    const item = cart.find(i => i.name === name);
    if (!item) return;
    item.qty += delta;
    const next = item.qty <= 0 ? cart.filter(i => i.name !== name) : cart;
    saveCart(next);
    renderCart();
  }

  function removeFromCart(name) {
    saveCart(getCart().filter(i => i.name !== name));
    renderCart();
  }

  function clearCart() {
    saveCart([]);
    renderCart();
  }

  const cartButton = document.getElementById('cartButton');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const cartItemsEl = document.getElementById('cartItems');
  const cartEmptyEl = document.getElementById('cartEmpty');
  const cartBadge = document.getElementById('cartBadge');
  const cartClearBtn = document.getElementById('cartClear');
  const cartCheckoutBtn = document.getElementById('cartCheckout');

  function openCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.add('is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    if (cartOverlay) cartOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Pre-fill existing checkout data if any
    try {
      const saved = JSON.parse(localStorage.getItem('checkoutData') || '{}');
      const phoneInput = document.getElementById('cartPhone');
      const addressInput = document.getElementById('cartAddress');
      const notesInput = document.getElementById('cartNotes');
      if (phoneInput && !phoneInput.value && saved.phone) phoneInput.value = saved.phone;
      if (addressInput && !addressInput.value && saved.address) addressInput.value = saved.address;
      if (notesInput && !notesInput.value && saved.notes) notesInput.value = saved.notes;
    } catch (e) {}
  }

  function closeCart() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    if (cartOverlay) cartOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function syncCounts() {
    const cart = getCart();
    const cartCnt = cart.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
    const cartSubCount = document.getElementById('cartSubCount');
    const cartInnerBadge = document.getElementById('cartItemInnerBadge');
    const badgeCount = document.getElementById('userBadgeCount');
    const favSubCount = document.getElementById('favSubCount');
    if (cartSubCount) {
      cartSubCount.textContent = `Total ${cartCnt} item`;
    }
    if (cartInnerBadge) {
      cartInnerBadge.textContent = cartCnt;
      cartInnerBadge.style.display = cartCnt > 0 ? 'inline-flex' : 'none';
    }
    if (favSubCount) {
      const favCount = (typeof getFavorites === 'function') ? getFavorites().length : 0;
      favSubCount.textContent = favCount > 0 ? `${favCount} laptop tersimpan` : 'Laptop tersimpan';
    }
    if (badgeCount) {
      badgeCount.textContent = String(cartCnt);
      badgeCount.style.display = cartCnt > 0 ? 'grid' : 'none';
    }
    if (typeof updateInfoUI === 'function') {
      updateInfoUI();
    }
  }

  function renderCart() {
    if (!cartItemsEl) return;
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
    const totalPrice = cart.reduce((sum, item) => sum + (Number(item.qty) || 1) * item.price, 0);

    const cartSubtitle = document.getElementById('cartCountSubtitle');
    if (cartSubtitle) {
      cartSubtitle.textContent = `${totalQty} BARANG PILIHAN`;
    }

    const subtotalText = document.getElementById('cartSubtotalText');
    if (subtotalText) {
      subtotalText.textContent = rupiah(totalPrice);
    }

    const totalPriceEl = document.getElementById('cartTotalPrice');
    if (totalPriceEl) {
      totalPriceEl.textContent = rupiah(totalPrice);
    }

    if (cartBadge) {
      cartBadge.textContent = totalQty;
      cartBadge.hidden = totalQty === 0;
    }

    syncCounts();

    const isEmpty = cart.length === 0;
    if (cartEmptyEl) cartEmptyEl.style.display = isEmpty ? 'flex' : 'none';
    if (cartItemsEl) cartItemsEl.style.display = isEmpty ? 'none' : 'flex';

    const formSection = document.getElementById('cartFormSection');
    const breakdown = document.getElementById('cartBreakdown');
    if (formSection) formSection.style.display = isEmpty ? 'none' : 'flex';
    if (breakdown) breakdown.style.display = isEmpty ? 'none' : 'flex';

    cartItemsEl.innerHTML = cart.map(item => {
      const imgSrc = resolveProductImage(item);
      const brand = resolveProductBrand(item);
      return `
        <div class="cart-item" data-name="${item.name}">
          <div class="cart-item-thumb">
            <img src="${imgSrc}" alt="${item.name}" loading="lazy">
          </div>
          <div class="cart-item-info">
            <span class="cart-item-brand">${brand}</span>
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">${rupiah(item.price)}</div>
            <div class="cart-item-bottom">
              <div class="cart-item-stepper">
                <button type="button" class="qty-btn" data-action="minus" data-name="${item.name}" aria-label="Kurangi">−</button>
                <span class="qty-val">${item.qty}</span>
                <button type="button" class="qty-btn" data-action="plus" data-name="${item.name}" aria-label="Tambah">+</button>
              </div>
              <button type="button" class="cart-item-trash" data-action="remove" data-name="${item.name}" title="Hapus produk">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  if (cartItemsEl) {
    cartItemsEl.addEventListener('click', (event) => {
      const target = event.target.closest('[data-action]');
      if (!target) return;
      const { action, name } = target.dataset;
      if (action === 'plus') changeQty(name, 1);
      if (action === 'minus') changeQty(name, -1);
      if (action === 'remove') removeFromCart(name);
    });
  }

  if (cartButton) cartButton.addEventListener('click', openCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  if (cartClearBtn) cartClearBtn.addEventListener('click', clearCart);

  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', () => {
      const cart = getCart();
      if (!cart.length) return;

      const phoneInput = document.getElementById('cartPhone');
      const addressInput = document.getElementById('cartAddress');
      const notesInput = document.getElementById('cartNotes');

      const phone = phoneInput ? phoneInput.value.trim() : '';
      const address = addressInput ? addressInput.value.trim() : '';
      const notes = notesInput ? notesInput.value.trim() : '';

      const checkoutData = {
        orderId: 'ORD-' + Date.now().toString().slice(-8),
        phone,
        address,
        notes,
        total: cart.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.qty) || 0), 0),
        items: cart
      };

      localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
      window.location.href = '/checkout-produk';
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeCart();
  });


  document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const productCard = button.closest('.laptop-card');
      const brand = productCard ? productCard.dataset.brand : '';
      const image = button.dataset.image || (productCard ? productCard.querySelector('.product-card-img')?.getAttribute('src') : '');

      addToCart(button.dataset.product, Number(button.dataset.price), image, brand);

      const old = button.textContent;
      button.textContent = 'Ditambahkan';
      button.classList.add('added');
      setTimeout(() => {
        button.textContent = old;
        button.classList.remove('added');
      }, 1200);
    });
  });

  /* =========================================================
     TOMBOL BAGIKAN VIA WHATSAPP
     Inject otomatis ke setiap card-actions-row.
     Klik langsung buka WA dengan pesan tanya produk.
     ========================================================= */
  function buildShareWaUrl(productName, priceText, productId) {
    const pageUrl = `${window.location.origin}/detail-produk?id=${productId}`;
    const msg = [
      `Halo admin Losari Computer 👋`,
      `Saya tertarik dengan *${productName}* seharga *${priceText}* yang ada di katalog Anda.`,
      ``,
      `Apakah unit ini masih tersedia? Boleh saya tanya lebih lanjut?`,
      ``,
      `🔗 ${pageUrl}`
    ].join('\n');
    return `https://wa.me/6285332990156?text=${encodeURIComponent(msg)}`;
  }

  document.querySelectorAll('.laptop-card').forEach(card => {
    const actionsRow = card.querySelector('.card-actions-row');
    if (!actionsRow) return;

    // Ambil data produk dari card dan buy-button
    const productName = card.dataset.name || '';
    const productId   = card.dataset.id   || '';
    const rawPrice    = Number(card.dataset.price) || 0;
    const priceText   = rawPrice
      ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(rawPrice)
      : 'harga spesial';
    const waUrl = buildShareWaUrl(productName, priceText, productId);

    // Buat tombol share
    const shareBtn = document.createElement('a');
    shareBtn.className = 'share-wa-btn';
    shareBtn.href = waUrl;
    shareBtn.target = '_blank';
    shareBtn.rel = 'noopener';
    shareBtn.setAttribute('aria-label', `Tanya penjual soal ${productName}`);
    shareBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span class="share-wa-tooltip">Tanya Penjual</span>
    `;
    actionsRow.appendChild(shareBtn);
  });

  // Klik kartu laptop untuk membuka detail produk
  function slugify(text) {
    return text.toString().toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }

  /* =========================================================
     FAVORIT / WISHLIST — dikelola secara terpusat oleh favorite-drawer.js
     ========================================================= */
  function updateFavButtons() {
    if (window.LOSARI_FAVORITES && typeof window.LOSARI_FAVORITES.sync === 'function') {
      window.LOSARI_FAVORITES.sync();
    }
  }

  window.addEventListener('losari-fav-change', updateFavButtons);
  updateFavButtons();

  document.querySelectorAll('.laptop-card').forEach(card => {
    card.addEventListener('click', (event) => {
      // Jika yang diklik adalah tombol beli, tombol favorit, share, atau link, biarkan aksi aslinya
      if (
        event.target.closest('.buy-button') ||
        event.target.closest('.product-fav-btn') ||
        event.target.closest('.share-wa-btn') ||
        event.target.closest('a')
      ) return;

      const productId = card.dataset.id || slugify(card.dataset.name || '');
      if (productId) {
        window.location.href = `/detail-produk?id=${productId}`;
      }
    });
  });


  // User profile dropdown & Cart hook
  const avatarBtn = document.getElementById('userAvatarBtn');
  const dropdownCard = document.getElementById('userDropdownCard');
  if (avatarBtn && dropdownCard) {
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownCard.classList.toggle('is-open');
      avatarBtn.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!dropdownCard.contains(e.target) && !avatarBtn.contains(e.target)) {
        dropdownCard.classList.remove('is-open');
        avatarBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const itemCartBtn = document.getElementById('itemCart');
  if (itemCartBtn) {
    itemCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentCart = getCart();
      if (!Array.isArray(currentCart) || currentCart.length === 0) {
        saveCart([
          {
            name: 'Acer Nitro 5 (RAM: Bawaan, SSD: Upgrade 1TB)',
            price: 7750000,
            qty: 1,
            image: '/static/images/products/lenovo-ideapad-gaming-3.jpg',
            brand: 'ACER'
          }
        ]);
      }
      if (dropdownCard) dropdownCard.classList.remove('is-open');
      if (avatarBtn) avatarBtn.setAttribute('aria-expanded', 'false');
      openCart();
    });
  }

  // Info center drawer toggle & controller (laptop.html)
  const INFO_STORAGE_KEY = 'losari-info-read';
  const itemInfoCenter = document.getElementById('itemInfoCenter');
  const infoCenterBadge = document.getElementById('infoCenterBadge');
  const infoDrawer = document.getElementById('infoDrawer');
  const infoDrawerOverlay = document.getElementById('infoDrawerOverlay');
  const infoDrawerClose = document.getElementById('infoDrawerClose');
  const tabUnread = document.getElementById('tabUnread');
  const tabAll = document.getElementById('tabAll');
  const unreadCountBadge = document.getElementById('unreadCountBadge');
  const allCountBadge = document.getElementById('allCountBadge');
  const infoCardsList = document.getElementById('infoCardsList');
  const infoEmptyState = document.getElementById('infoEmptyState');
  const btnMarkAllRead = document.getElementById('btnMarkAllRead');

  function getReadInfoIds() {
    try {
      return JSON.parse(localStorage.getItem(INFO_STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveReadInfoIds(ids) {
    try {
      localStorage.setItem(INFO_STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {}
  }

  let currentInfoTab = 'unread';

  function updateInfoUI() {
    const readIds = getReadInfoIds();
    const unreadCount = Math.max(0, 3 - readIds.length);

    if (unreadCountBadge) unreadCountBadge.textContent = unreadCount;
    if (allCountBadge) allCountBadge.textContent = '3';

    if (infoCenterBadge) {
      infoCenterBadge.textContent = unreadCount;
      infoCenterBadge.style.display = unreadCount > 0 ? 'inline-flex' : 'none';
    }

    const cards = infoCardsList ? infoCardsList.querySelectorAll('.info-item-box') : [];
    let visibleCount = 0;

    cards.forEach(card => {
      const cardId = card.getAttribute('data-id');
      const isRead = readIds.includes(cardId);
      const readBtn = card.querySelector('.info-mark-read-btn');

      if (isRead) {
        card.classList.add('is-read');
        if (readBtn) {
          readBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Sudah Dibaca</span>
          `;
          readBtn.disabled = true;
        }
      } else {
        card.classList.remove('is-read');
        if (readBtn) {
          readBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Tandai Sudah Dibaca</span>
          `;
          readBtn.disabled = false;
        }
      }

      if (currentInfoTab === 'unread') {
        if (isRead) {
          card.style.display = 'none';
        } else {
          card.style.display = 'block';
          visibleCount++;
        }
      } else {
        card.style.display = 'block';
        visibleCount++;
      }
    });

    if (infoEmptyState) {
      infoEmptyState.style.display = (visibleCount === 0 && currentInfoTab === 'unread') ? 'block' : 'none';
    }

    if (btnMarkAllRead) {
      if (unreadCount === 0) {
        btnMarkAllRead.textContent = 'Semua Sudah Dibaca ✓';
        btnMarkAllRead.style.opacity = '0.7';
      } else {
        btnMarkAllRead.textContent = 'Tandai Semua Sudah Dibaca';
        btnMarkAllRead.style.opacity = '1';
      }
    }
  }

  function openInfoDrawer() {
    if (dropdownCard) dropdownCard.classList.remove('is-open');
    if (avatarBtn) avatarBtn.setAttribute('aria-expanded', 'false');
    if (infoDrawer) {
      infoDrawer.classList.add('is-open');
      infoDrawer.setAttribute('aria-hidden', 'false');
    }
    if (infoDrawerOverlay) infoDrawerOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    updateInfoUI();
  }

  function closeInfoDrawer() {
    if (infoDrawer) {
      infoDrawer.classList.remove('is-open');
      infoDrawer.setAttribute('aria-hidden', 'true');
    }
    if (infoDrawerOverlay) infoDrawerOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (itemInfoCenter) {
    itemInfoCenter.addEventListener('click', openInfoDrawer);
  }
  if (infoDrawerClose) {
    infoDrawerClose.addEventListener('click', closeInfoDrawer);
  }
  if (infoDrawerOverlay) {
    infoDrawerOverlay.addEventListener('click', closeInfoDrawer);
  }

  if (tabUnread) {
    tabUnread.addEventListener('click', () => {
      currentInfoTab = 'unread';
      tabUnread.classList.add('active');
      if (tabAll) tabAll.classList.remove('active');
      updateInfoUI();
    });
  }
  if (tabAll) {
    tabAll.addEventListener('click', () => {
      currentInfoTab = 'all';
      tabAll.classList.add('active');
      if (tabUnread) tabUnread.classList.remove('active');
      updateInfoUI();
    });
  }

  if (infoCardsList) {
    infoCardsList.addEventListener('click', (e) => {
      const btn = e.target.closest('.info-mark-read-btn');
      if (!btn || btn.disabled) return;
      const card = btn.closest('.info-item-box');
      if (!card) return;
      const cardId = card.getAttribute('data-id');
      const readIds = getReadInfoIds();
      if (!readIds.includes(cardId)) {
        readIds.push(cardId);
        saveReadInfoIds(readIds);
        updateInfoUI();
      }
    });
  }

  if (btnMarkAllRead) {
    btnMarkAllRead.addEventListener('click', () => {
      const readIds = ['info-1', 'info-2', 'info-3'];
      saveReadInfoIds(readIds);
      updateInfoUI();
    });
  }

  window.addEventListener('storage', (e) => {
    if (e.key === CART_KEY) {
      renderCart();
    }
    if (e.key === INFO_STORAGE_KEY) {
      updateInfoUI();
    }
  });

  updateInfoUI();
  renderCart();
  runFilter();
});

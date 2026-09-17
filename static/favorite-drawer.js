/**
 * Losari Computer - Favorite Collection Drawer (Koleksi Favorit)
 * Provides slide-over favorite collection drawer matching user mockup (Image 1 & 2)
 */

(function () {
  'use strict';

  const FAV_STORAGE_KEY = 'losari_favorites';
  const CART_STORAGE_KEY = 'losari-cart';

  // Catalog Database for looking up favorite item details
  const LOSARI_PRODUCTS = {
    'lenovo-thinkpad-t490': {
      id: 'lenovo-thinkpad-t490',
      name: 'Lenovo ThinkPad T490',
      brand: 'LENOVO',
      category: 'Office & Kuliah',
      price: 4250000,
      rating: '4.8',
      image: '/static/images/laptop/thinkpad-t490.jpg',
      url: '/detail-produk?id=lenovo-thinkpad-t490'
    },
    'asus-tuf-gaming-a15': {
      id: 'asus-tuf-gaming-a15',
      name: 'ASUS TUF Gaming A15',
      brand: 'ASUS',
      category: 'Gaming',
      price: 8900000,
      rating: '4.9',
      image: '/static/images/laptop/asus-tuf-a15.jpg',
      url: '/detail-produk?id=asus-tuf-gaming-a15'
    },
    'hp-elitebook-840-g7': {
      id: 'hp-elitebook-840-g7',
      name: 'HP EliteBook 840 G7',
      brand: 'HP',
      category: 'Bisnis',
      price: 5150000,
      rating: '4.7',
      image: '/static/images/laptop/hp-elitebook-840.jpg',
      url: '/detail-produk?id=hp-elitebook-840-g7'
    },
    'macbook-air-m1': {
      id: 'macbook-air-m1',
      name: 'MacBook Air M1',
      brand: 'APPLE',
      category: 'Desain & Kreatif',
      price: 11900000,
      rating: '5.0',
      image: '/static/images/laptop/macbook-air-m1.jpg',
      url: '/detail-produk?id=macbook-air-m1'
    },
    'asus-vivobook-14': {
      id: 'asus-vivobook-14',
      name: 'ASUS VivoBook 14',
      brand: 'ASUS',
      category: 'Office & Kuliah',
      price: 4650000,
      rating: '4.6',
      image: '/static/images/laptop/asus-vivobook-14.jpg',
      url: '/detail-produk?id=asus-vivobook-14'
    },
    'lenovo-thinkpad-t14-gen-1': {
      id: 'lenovo-thinkpad-t14-gen-1',
      name: 'Lenovo ThinkPad T14 Gen 1',
      brand: 'LENOVO',
      category: 'Bisnis',
      price: 6350000,
      rating: '4.8',
      image: '/static/images/laptop/thinkpad-t14.jpg',
      url: '/detail-produk?id=lenovo-thinkpad-t14-gen-1'
    },
    'acer-nitro-5': {
      id: 'acer-nitro-5',
      name: 'Acer Nitro 5',
      brand: 'ACER',
      category: 'Gaming',
      price: 7350000,
      rating: '4.7',
      image: '/static/images/laptop/acer-nitro-5.jpg',
      url: '/detail-produk?id=acer-nitro-5'
    },
    'asus-vivobook-pro-14': {
      id: 'asus-vivobook-pro-14',
      name: 'ASUS Vivobook Pro 14',
      brand: 'ASUS',
      category: 'Desain & Kreatif',
      price: 10900000,
      rating: '4.9',
      image: '/static/images/laptop/asus-vivobook-pro-14.jpg',
      url: '/detail-produk?id=asus-vivobook-pro-14'
    }
  };

  function formatRupiah(num) {
    if (typeof num !== 'number') num = Number(num) || 0;
    return 'Rp ' + num.toLocaleString('id-ID');
  }

  function getFavorites() {
    try {
      const favs = JSON.parse(localStorage.getItem(FAV_STORAGE_KEY) || '[]');
      return Array.isArray(favs) ? favs : [];
    } catch (e) {
      return [];
    }
  }

  function saveFavorites(favs) {
    try {
      localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favs));
    } catch (e) {}
    syncFavoriteUI();
    window.dispatchEvent(new Event('losari-fav-change'));
  }

  function toggleFavorite(productId) {
    if (!productId) return;
    let favs = getFavorites();
    const index = favs.indexOf(productId);
    let isAdded = false;
    if (index > -1) {
      favs.splice(index, 1);
      isAdded = false;
    } else {
      favs.push(productId);
      isAdded = true;
    }
    saveFavorites(favs);
    return isAdded;
  }

  function openFavoriteDrawer() {
    const drawer = document.getElementById('favoriteDrawer');
    const overlay = document.getElementById('favoriteDrawerOverlay');
    const userDropdown = document.getElementById('userDropdownCard');
    const userAvatarBtn = document.getElementById('userAvatarBtn');

    // Close user dropdown if open
    if (userDropdown) userDropdown.classList.remove('is-open');
    if (userAvatarBtn) userAvatarBtn.setAttribute('aria-expanded', 'false');

    if (drawer) {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
    }
    if (overlay) {
      overlay.classList.add('is-open');
    }
    document.body.style.overflow = 'hidden';
    renderFavoriteDrawer();
  }

  function closeFavoriteDrawer() {
    const drawer = document.getElementById('favoriteDrawer');
    const overlay = document.getElementById('favoriteDrawerOverlay');

    if (drawer) {
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
    }
    if (overlay) {
      overlay.classList.remove('is-open');
    }
    document.body.style.overflow = '';
  }

  function renderFavoriteDrawer() {
    const favs = getFavorites();
    const countText = document.getElementById('favDrawerCountText');
    const emptyState = document.getElementById('favEmptyState');
    const cardsList = document.getElementById('favCardsList');

    const totalCount = favs.length;

    // Update Header Count Text
    if (countText) {
      countText.textContent = totalCount === 1 
        ? '1 LAPTOP DISUKAI' 
        : `${totalCount} LAPTOP DISUKAI`;
    }

    if (!emptyState || !cardsList) return;

    if (totalCount === 0) {
      emptyState.style.display = 'flex';
      cardsList.style.display = 'none';
      cardsList.innerHTML = '';
      return;
    }

    emptyState.style.display = 'none';
    cardsList.style.display = 'flex';

    // Generate Cards matching Image 2
    cardsList.innerHTML = favs.map(id => {
      const prod = LOSARI_PRODUCTS[id] || {
        id,
        name: id.replace(/-/g, ' ').toUpperCase(),
        brand: 'LAPTOP',
        price: 4500000,
        rating: '4.8',
        image: '/static/images/products/thinkpad-t490.jpg',
        url: `/detail-produk?id=${id}`
      };

      return `
        <article class="fav-item-card" data-id="${prod.id}">
          <a href="${prod.url}" class="fav-item-thumb-wrap" aria-label="Lihat detail ${prod.name}">
            <img src="${prod.image}" alt="${prod.name}" class="fav-item-img" loading="lazy">
          </a>
          <div class="fav-item-info">
            <span class="fav-item-brand">${prod.brand || 'LAPTOP'}</span>
            <h4 class="fav-item-title">
              <a href="${prod.url}">${prod.name}</a>
            </h4>
            <div class="fav-item-rating">
              <span class="star">★</span>
              <span>${prod.rating || '4.8'}</span>
            </div>
            <div class="fav-item-price">${formatRupiah(prod.price)}</div>
          </div>
          <div class="fav-item-actions">
            <button type="button" class="fav-item-btn-remove" data-id="${prod.id}" aria-label="Hapus dari Favorit" title="Hapus dari favorit">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#ef4444">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
            <button type="button" class="fav-item-btn-cart" data-id="${prod.id}" aria-label="Tambah ke Keranjang" title="Tambah ke keranjang">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  function syncFavoriteUI() {
    const favs = getFavorites();
    const count = favs.length;

    // 1. Update dropdown subtitle (Image 3: "1 laptop tersimpan")
    const favSubCount = document.getElementById('favSubCount');
    if (favSubCount) {
      favSubCount.textContent = count === 1 ? '1 laptop tersimpan' : `${count} laptop tersimpan`;
    }

    // 2. Update Header / Nav favorite badge
    const favBadgeCount = document.getElementById('favBadgeCount');
    if (favBadgeCount) {
      favBadgeCount.textContent = count;
      favBadgeCount.style.display = count > 0 ? 'inline-flex' : 'none';
    }

    // 3. Update all page heart buttons (.product-fav-btn)
    document.querySelectorAll('.product-fav-btn').forEach(btn => {
      const id = btn.dataset.id;
      const isActive = favs.includes(id);
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-label', isActive ? 'Hapus dari Favorit' : 'Tambah ke Favorit');
    });

    // 4. If favorite drawer is open, re-render its list
    const drawer = document.getElementById('favoriteDrawer');
    if (drawer && drawer.classList.contains('is-open')) {
      renderFavoriteDrawer();
    }
  }

  function addProductToCart(productId) {
    const prod = LOSARI_PRODUCTS[productId];
    if (!prod) return;

    try {
      let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
      if (!Array.isArray(cart)) cart = [];

      const existing = cart.find(item => item.name === prod.name || item.id === prod.id);
      if (existing) {
        existing.qty = (Number(existing.qty) || 1) + 1;
      } else {
        cart.push({
          id: prod.id,
          name: prod.name,
          price: prod.price,
          qty: 1,
          image: prod.image,
          brand: prod.brand
        });
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event('losari-cart-change'));
      window.dispatchEvent(new Event('storage'));

      // If openCart function exists, open cart drawer
      if (typeof window.openCart === 'function') {
        closeFavoriteDrawer();
        window.openCart();
      } else {
        const cartBtn = document.getElementById('cartDrawer');
        if (typeof window.renderCart === 'function') window.renderCart();
        alert(`✓ ${prod.name} telah ditambahkan ke Keranjang Belanja!`);
      }
    } catch (e) {
      console.error('Error adding to cart:', e);
    }
  }

  // Initialize DOM event listeners
  function init() {
    // 1. User Dropdown Menu -> "Favorit Saya" click handler
    const itemFavorites = document.getElementById('itemFavorites');
    if (itemFavorites) {
      itemFavorites.addEventListener('click', (e) => {
        e.preventDefault();
        openFavoriteDrawer();
      });
    }

    // 2. Header Favorite icon buttons (.fav-nav-btn, #favNavBtn)
    document.querySelectorAll('.fav-nav-btn, #favNavBtn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openFavoriteDrawer();
      });
    });

    // 3. Close buttons
    const closeBtn = document.getElementById('favoriteDrawerClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeFavoriteDrawer);
    }

    const overlay = document.getElementById('favoriteDrawerOverlay');
    if (overlay) {
      overlay.addEventListener('click', closeFavoriteDrawer);
    }

    // 4. Delegate click events inside Favorite Drawer cards
    const cardsList = document.getElementById('favCardsList');
    if (cardsList) {
      cardsList.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.fav-item-btn-remove');
        if (removeBtn) {
          e.preventDefault();
          const id = removeBtn.dataset.id;
          const card = removeBtn.closest('.fav-item-card');
          if (card) {
            card.classList.add('removing');
            setTimeout(() => {
              toggleFavorite(id);
            }, 180);
          } else {
            toggleFavorite(id);
          }
          return;
        }

        const cartBtn = e.target.closest('.fav-item-btn-cart');
        if (cartBtn) {
          e.preventDefault();
          const id = cartBtn.dataset.id;
          addProductToCart(id);
        }
      });
    }

    // 5. Product catalog favorite toggle buttons
    document.querySelectorAll('.product-fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.id;
        if (id) {
          toggleFavorite(id);
        }
      });
    });

    // 6. Keyboard accessibility (Escape key)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const drawer = document.getElementById('favoriteDrawer');
        if (drawer && drawer.classList.contains('is-open')) {
          closeFavoriteDrawer();
        }
      }
    });

    // 7. Cross-tab & storage synchronization
    window.addEventListener('storage', (e) => {
      if (e.key === FAV_STORAGE_KEY) {
        syncFavoriteUI();
      }
    });

    window.addEventListener('losari-fav-change', syncFavoriteUI);

    // Initial sync
    syncFavoriteUI();
  }

  // Expose global methods
  window.LOSARI_FAVORITES = {
    get: getFavorites,
    save: saveFavorites,
    toggle: toggleFavorite,
    open: openFavoriteDrawer,
    close: closeFavoriteDrawer,
    render: renderFavoriteDrawer,
    sync: syncFavoriteUI,
    products: LOSARI_PRODUCTS
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

const hamburgerToggle = document.getElementById('hamburger-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
const mobileButtons = document.querySelectorAll('.mobile-btn');

if (hamburgerToggle && mobileMenu) {
  hamburgerToggle.addEventListener('change', function () {
    mobileMenu.classList.toggle('active', this.checked);
    document.body.style.overflow = this.checked ? 'hidden' : '';
  });

  mobileMenuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      hamburgerToggle.checked = false;
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  mobileButtons.forEach((button) => {
    button.addEventListener('click', () => {
      hamburgerToggle.checked = false;
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && hamburgerToggle.checked) {
      hamburgerToggle.checked = false;
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

const testimonialTrack = document.querySelector('.testimonial-grid');

if (testimonialTrack) {
  const testimonialCards = Array.from(testimonialTrack.children);
  let testimonialOffset = 0;
  let testimonialCycleWidth = 0;
  let previousFrameTime = 0;
  let testimonialPaused = false;
  const testimonialSpeed = 0.045;

  testimonialCards.forEach((card) => {
    testimonialTrack.appendChild(card.cloneNode(true));
  });

  const updateTestimonialWidth = () => {
    testimonialCycleWidth = testimonialCards.reduce((totalWidth, card) => {
      const styles = getComputedStyle(card);
      const marginLeft = Number.parseFloat(styles.marginLeft) || 0;
      return totalWidth + card.getBoundingClientRect().width + marginLeft;
    }, 0);
  };

  const animateTestimonials = (frameTime) => {
    if (testimonialPaused) {
      return;
    }

    if (!previousFrameTime) {
      previousFrameTime = frameTime;
    }

    const elapsed = frameTime - previousFrameTime;
    previousFrameTime = frameTime;
    testimonialOffset += elapsed * testimonialSpeed;

    if (testimonialOffset >= testimonialCycleWidth) {
      testimonialOffset -= testimonialCycleWidth;
    }

    testimonialTrack.style.transform = `translate3d(-${testimonialOffset}px, 0, 0)`;
    window.requestAnimationFrame(animateTestimonials);
  };

  const testimonialViewport = testimonialTrack.parentElement;

  testimonialViewport.addEventListener('mouseenter', () => {
    testimonialPaused = true;
  });

  testimonialViewport.addEventListener('mouseleave', () => {
    testimonialPaused = false;
    previousFrameTime = 0;
    window.requestAnimationFrame(animateTestimonials);
  });

  updateTestimonialWidth();
  window.addEventListener('resize', () => {
    updateTestimonialWidth();
  });
  window.requestAnimationFrame(animateTestimonials);
}

const ukuranRekomendasi = document.getElementById('ukuranRekomendasi');
const detailUkuran = document.getElementById('detailUkuran');
const cekUkuranBtn = document.getElementById('cekUkuran');
const beliSekarangBtn = document.getElementById('beliSekarang');

function hitungUkuran() {
  const tinggi = Number(document.getElementById('tinggi')?.value || 0);
  const dada = Number(document.getElementById('dada')?.value || 0);
  const pinggang = Number(document.getElementById('pinggang')?.value || 0);
  const bahu = Number(document.getElementById('bahu')?.value || 0);
  const panjang = Number(document.getElementById('panjang')?.value || 0);
  const berat = Number(document.getElementById('berat')?.value || 0);

  const selectedGender = document.querySelector('input[name="gender"]:checked')?.value || 'men';
  const bmi = tinggi > 0 ? berat / ((tinggi / 100) ** 2) : 0;

  let size = 'M';
  let bodyType = 'Average';

  if (selectedGender === 'kids') {
    if (tinggi <= 120 || berat <= 25) size = 'S';
    else if (tinggi <= 150 || berat <= 45) size = 'M';
    else size = 'L';
  } else {
    if (tinggi <= 160 && dada <= 88 && pinggang <= 74) {
      size = 'S';
    } else if (dada >= 100 || pinggang >= 86 || berat >= 68 || bmi >= 24.5) {
      size = 'L';
    }

    if (dada >= 112 || pinggang >= 96 || berat >= 82 || bmi >= 28) {
      size = 'XL';
    }

    if (dada >= 118 || pinggang >= 102 || berat >= 90 || bmi >= 32) {
      size = 'XXL';
    }
  }

  if (bmi < 18.5) {
    bodyType = 'Slim';
  } else if (bmi > 25) {
    bodyType = 'Full';
  }

  if (ukuranRekomendasi) {
    ukuranRekomendasi.textContent = size;
  }

  if (detailUkuran) {
    detailUkuran.innerHTML = `
      <li>AI: tinggi ${tinggi} cm, berat ${berat} kg</li>
      <li>Lingkar dada: ${dada} cm</li>
      <li>Lingkar pinggang: ${pinggang} cm</li>
      <li>Ukuran cocok: ${size}</li>
      <li>Body type: ${bodyType}</li>
    `;
  }
}

if (cekUkuranBtn) {
  cekUkuranBtn.addEventListener('click', hitungUkuran);
}

if (beliSekarangBtn) {
  beliSekarangBtn.addEventListener('click', () => {
    const size = ukuranRekomendasi ? ukuranRekomendasi.textContent : 'M';
    try {
      const cart = JSON.parse(localStorage.getItem('zanstore-cart') || '[]');
      cart.push({
        name: 'Classic Cotton Overshirt',
        size,
        price: 249000,
        qty: 1,
        image: 'classic'
      });
      localStorage.setItem('zanstore-cart', JSON.stringify(cart));
    } catch (error) {
      console.warn('Cart storage unavailable:', error);
    }

    window.location.href = 'cart.html';
  });
}

const productTypeInputs = document.querySelectorAll('input[name="product-type"]');
const brandInputs = document.querySelectorAll('input[name="brand"]');
const priceRange = document.getElementById('priceRange');
const priceLabel = document.getElementById('priceLabel');
const productCount = document.getElementById('productCount');
const productGrid = document.getElementById('productGrid');

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

function filterProducts() {
  const selectedType = document.querySelector('input[name="product-type"]:checked')?.value || 'all';
  const selectedBrands = Array.from(brandInputs).filter((input) => input.checked).map((input) => input.value);
  const maxPrice = Number(priceRange?.value || 20000000);

  if (!productGrid) return;

  let visibleCount = 0;
  const cards = productGrid.querySelectorAll('.product-card-filter');

  cards.forEach((card) => {
    const typeMatch = selectedType === 'all' || card.dataset.type === selectedType;
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(card.dataset.brand);
    const priceMatch = Number(card.dataset.price) <= maxPrice;
    const visible = typeMatch && brandMatch && priceMatch;

    card.style.display = visible ? 'block' : 'none';
    if (visible) visibleCount += 1;
  });

  if (productCount) {
    productCount.textContent = `${visibleCount} unit ready`;
  }

  if (priceLabel) {
    priceLabel.textContent = `Rp ${Number(maxPrice).toLocaleString('id-ID')}`;
  }
}

productTypeInputs.forEach((input) => input.addEventListener('change', filterProducts));
brandInputs.forEach((input) => input.addEventListener('change', filterProducts));
if (priceRange) {
  priceRange.addEventListener('input', filterProducts);
}

filterProducts();

const AUTH_KEY = 'zanstore-user';
const AUTH_TOKEN_KEY = 'zanstore-token';
const API_URL = 'http://localhost:3001/api';

function getCurrentUser() {
  try {
    const value = localStorage.getItem(AUTH_KEY);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn('Auth storage unavailable:', error);
    return null;
  }
}

function setCurrentUser(user) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch (error) {
    console.warn('Auth storage unavailable:', error);
  }
}

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || '';
}

function setAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

async function apiRequest(path, payload = {}, method = 'POST') {
  const body = method === 'GET' ? undefined : JSON.stringify(payload);
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
    },
    body,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request gagal.');
  }

  return data;
}

function logoutUser() {
  try {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.warn('Auth storage unavailable:', error);
  }

  updateUserBadge();
}

function updateUserBadge() {
  const badge = document.getElementById('userBadge');
  const authButtons = document.querySelectorAll('.auth-trigger');
  const user = getCurrentUser();

  if (badge) {
    if (user && user.name) {
      const initials = user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('');

      badge.innerHTML = `
        <span class="user-avatar">${initials || 'U'}</span>
        <span class="user-name">Hi, ${user.name}</span>
        <button type="button" class="logout-btn-interactive">
          <div class="logout-sign">
            <svg viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path></svg>
          </div>
          <div class="logout-text">Logout</div>
        </button>
      `;
      badge.classList.remove('is-hidden');
      badge.style.cursor = 'pointer';

      const logoutButton = badge.querySelector('.logout-btn-interactive');
      if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
          event.stopPropagation();
          logoutUser();
        });
      }

      badge.onclick = () => {
        window.location.href = 'profile.html';
      };
    } else {
      badge.innerHTML = '';
      badge.classList.add('is-hidden');
      badge.onclick = null;
    }
  }

  authButtons.forEach((button) => {
    const shouldHide = Boolean(user && user.name);
    button.style.display = shouldHide ? 'none' : 'inline-flex';
  });
}

function openAuthModal(mode = 'register') {
  const existingModal = document.getElementById('authModal');
  if (existingModal) {
    const form = existingModal.querySelector('#authForm');
    const switchButton = existingModal.querySelector(`[data-auth-mode="${mode}"]`);

    if (form) {
      form.dataset.mode = mode;
      form.reset();
    }

    existingModal.querySelectorAll('.auth-tab').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.authMode === mode);
    });

    if (switchButton) {
      switchButton.click();
    }

    return;
  }

  const modal = document.createElement('div');
  modal.id = 'authModal';
  modal.className = 'auth-modal-backdrop';
  modal.innerHTML = `
    <div class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="authTitle">
      <div class="auth-modal-header">
        <h3 id="authTitle">Akun ZanStore</h3>
        <button type="button" class="auth-close" aria-label="Tutup">×</button>
      </div>

      <div class="auth-tabs">
        <button type="button" class="auth-tab is-active" data-auth-mode="register">Daftar</button>
        <button type="button" class="auth-tab" data-auth-mode="login">Masuk</button>
      </div>

      <form id="authForm" class="auth-form" data-mode="register" data-login-type="email">
        <div class="field auth-field-name">
          <label for="fullName">Nama lengkap</label>
          <input id="fullName" name="fullName" type="text" placeholder="Masukkan nama lengkap" />
        </div>

        <div class="field auth-field-phone">
          <label for="phoneNumber">Nomor telepon</label>
          <input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+62 812-3456-7890" />
        </div>

        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" placeholder="nama@email.com" />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Minimal 6 karakter" />
        </div>

        <div class="auth-divider"><span>atau</span></div>

        <div class="auth-quick-buttons">
          <button type="button" class="auth-social auth-google">
            <span class="auth-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" aria-label="Google logo">
                <path fill="#EA4335" d="M12 10.2v3.96h5.45c-.23 1.3-1.54 3.95-5.45 3.95-3.28 0-5.95-2.7-5.95-6.06S8.72 6 12 6c1.87 0 3.13.8 3.85 1.48l2.62-2.54C16.97 3.57 14.7 2.5 12 2.5 6.86 2.5 2.5 6.84 2.5 12S6.86 21.5 12 21.5c6.82 0 11.34-4.79 11.34-11.54 0-.78-.09-1.38-.21-1.96H12Z"/>
                <path fill="#34A853" d="M3.7 7.43l3.58 2.62c.96-1.84 2.96-3.14 4.72-3.14 1.87 0 3.13.8 3.85 1.48l2.62-2.54A10.15 10.15 0 0 0 12 2.5C8.35 2.5 5.26 4.48 3.7 7.43Z"/>
                <path fill="#FBBC05" d="M3.7 16.57A9.96 9.96 0 0 1 3.2 12c0-1.12.2-2.2.56-3.2L.75 6.5A12.13 12.13 0 0 0 .5 12c0 1.96.47 3.82 1.3 5.47l1.9-1.4Z"/>
                <path fill="#4285F4" d="M12 21.5c2.54 0 4.84-.84 6.45-2.28l-2.99-2.59c-.82.55-1.9.9-3.46.9-3.92 0-5.22-2.65-5.45-3.95l-3.17 2.46A10.5 10.5 0 0 0 12 21.5Z"/>
              </svg>
            </span>
            Google
          </button>
          <button type="button" class="auth-social auth-phone">
            <span class="auth-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" aria-label="Phone icon">
                <path fill="currentColor" d="M6.62 10.79a15.45 15.45 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.42 11.42 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4.99a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.6a1 1 0 0 1-.25 1.03l-2.2 2.2Z"/>
              </svg>
            </span>
            Nomor Telepon
          </button>
        </div>

        <button type="submit" class="auth-submit">Daftar Sekarang</button>
        <button type="button" class="auth-forgot" id="forgotPasswordBtn">Lupa sandi?</button>
        <div class="auth-message" aria-live="polite"></div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const form = modal.querySelector('#authForm');
  const tabs = modal.querySelectorAll('.auth-tab');
  const closeButton = modal.querySelector('.auth-close');
  const message = modal.querySelector('.auth-message');
  const phoneField = form.querySelector('.auth-field-phone');
  const googleButton = modal.querySelector('.auth-google');
  const phoneButton = modal.querySelector('.auth-phone');
  const forgotButton = modal.querySelector('#forgotPasswordBtn');

  const resetPassword = async () => {
    const email = form.querySelector('#email').value.trim();
    const phone = form.querySelector('#phoneNumber')?.value.trim() || '';
    const newPassword = window.prompt('Masukkan sandi baru (minimal 6 karakter):');

    if (!newPassword) {
      message.textContent = 'Reset sandi dibatalkan.';
      message.className = 'auth-message';
      return;
    }

    if (newPassword.length < 6) {
      message.textContent = 'Sandi baru minimal 6 karakter.';
      message.className = 'auth-message error';
      return;
    }

    try {
      await apiRequest('/reset-password', {
        email: email || undefined,
        phone: phone || undefined,
        newPassword,
      });

      message.textContent = 'Sandi berhasil direset. Silakan masuk kembali.';
      message.className = 'auth-message success';
      form.querySelector('#password').value = newPassword;
    } catch (error) {
      message.textContent = error.message;
      message.className = 'auth-message error';
    }
  };

  const setMode = (nextMode) => {
    form.dataset.mode = nextMode;
    form.dataset.loginType = 'email';
    tabs.forEach((button) => button.classList.toggle('is-active', button.dataset.authMode === nextMode));

    const nameField = form.querySelector('.auth-field-name');
    const submitButton = form.querySelector('.auth-submit');
    const title = modal.querySelector('#authTitle');

    if (nextMode === 'register') {
      nameField.style.display = 'flex';
      submitButton.textContent = 'Daftar Sekarang';
      title.textContent = 'Buat akun baru';
    } else {
      nameField.style.display = 'none';
      submitButton.textContent = 'Masuk';
      title.textContent = 'Masuk ke akun';
    }

    phoneField.style.display = 'none';
    message.textContent = '';
    message.className = 'auth-message';
    form.reset();
  };

  tabs.forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.authMode));
  });

  forgotButton.addEventListener('click', resetPassword);

  googleButton.addEventListener('click', () => {
    const userData = {
      name: 'Google User',
      email: 'google-user@gmail.com',
      password: 'google-login',
      loginMethod: 'google'
    };

    setCurrentUser(userData);
    updateUserBadge();
    modal.remove();
    window.location.href = 'product.html';
  });

  phoneButton.addEventListener('click', () => {
    form.dataset.loginType = 'phone';
    phoneField.style.display = 'flex';
    const emailField = form.querySelector('#email');
    const passwordField = form.querySelector('#password');
    const submitButton = form.querySelector('.auth-submit');

    emailField.value = '';
    passwordField.value = '';

    if (form.dataset.mode === 'login') {
      submitButton.textContent = 'Masuk dengan Nomor Telepon';
    } else {
      submitButton.textContent = 'Daftar dengan Nomor Telepon';
    }

    message.textContent = 'Masukkan nomor telepon Anda untuk masuk.';
    message.className = 'auth-message';
  });

  closeButton.addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });

  setMode(mode);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const currentMode = form.dataset.mode;
    const loginType = form.dataset.loginType || 'email';
    const fullName = form.querySelector('#fullName')?.value.trim() || '';
    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value.trim();
    const phone = form.querySelector('#phoneNumber')?.value.trim() || '';

    try {
      if (loginType === 'phone') {
        if (!phone) {
          throw new Error('Nomor telepon harus diisi.');
        }

        if (currentMode === 'register') {
          const payload = {
            name: fullName || 'Pengguna Baru',
            email: `${phone.replace(/\D/g, '')}@phone.local`,
            phone,
            password,
          };

          const response = await apiRequest('/register', payload);
          setCurrentUser(response.user);
          setAuthToken(response.token);
          message.textContent = 'Nomor telepon berhasil didaftarkan. Mengarahkan ke halaman produk...';
          message.className = 'auth-message success';

          setTimeout(() => {
            modal.remove();
            updateUserBadge();
            window.location.href = 'product.html';
          }, 900);
          return;
        }

        const response = await apiRequest('/login', { phone, password });
        setCurrentUser(response.user);
        setAuthToken(response.token);
        message.textContent = 'Berhasil masuk dengan nomor telepon. Mengarahkan ke halaman produk...';
        message.className = 'auth-message success';

        setTimeout(() => {
          modal.remove();
          updateUserBadge();
          window.location.href = 'product.html';
        }, 700);
        return;
      }

      if (!email || !password || (currentMode === 'register' && !fullName)) {
        throw new Error(currentMode === 'register'
          ? 'Nama, email, dan password harus diisi.'
          : 'Email dan password harus diisi.');
      }

      if (password.length < 6) {
        throw new Error('Password minimal 6 karakter.');
      }

      if (currentMode === 'register') {
        const response = await apiRequest('/register', {
          name: fullName,
          email,
          password,
        });

        setCurrentUser(response.user);
        setAuthToken(response.token);
        message.textContent = 'Akun berhasil dibuat. Mengarahkan ke halaman produk...';
        message.className = 'auth-message success';

        setTimeout(() => {
          modal.remove();
          updateUserBadge();
          window.location.href = 'product.html';
        }, 900);
        return;
      }

      const response = await apiRequest('/login', { email, password });
      setCurrentUser(response.user);
      setAuthToken(response.token);
      message.textContent = 'Berhasil masuk. Mengarahkan ke halaman produk...';
      message.className = 'auth-message success';

      setTimeout(() => {
        modal.remove();
        updateUserBadge();
        window.location.href = 'product.html';
      }, 700);
    } catch (error) {
      message.textContent = error.message;
      message.className = 'auth-message error';
    }
  });
}

function requireAuth(route = 'product.html') {
  const user = getCurrentUser();
  if (user && user.email) {
    updateUserBadge();
    return;
  }

  if (route === 'product.html' || route === 'cart.html') {
    openAuthModal('register');
    return false;
  }

  return true;
}

const authButtons = document.querySelectorAll('.auth-trigger');
authButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const mode = button.dataset.authAction || 'register';
    openAuthModal(mode);
  });
});

const protectedLinks = document.querySelectorAll('a[href="cart.html"]');
protectedLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (!getCurrentUser()) {
      event.preventDefault();
      openAuthModal('register');
    }
  });
});

document.querySelectorAll('.direct-product-link').forEach((link) => {
  link.addEventListener('click', () => {
    if (!getCurrentUser()) {
      return true;
    }
  });
});

if (window.location.pathname.endsWith('profile.html')) {
  const user = getCurrentUser();
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profilePhone = document.getElementById('profilePhone');
  const profileMethod = document.getElementById('profileMethod');
  const logoutButton = document.getElementById('profileLogout');

  if (user) {
    if (profileName) profileName.textContent = user.name || 'Pengguna';
    if (profileEmail) profileEmail.textContent = user.email || '-';
    if (profilePhone) profilePhone.textContent = user.phone || 'Belum ada nomor telepon';
    if (profileMethod) profileMethod.textContent = user.loginMethod || 'Email';
  } else {
    if (profileName) profileName.textContent = 'Belum login';
    if (profileEmail) profileEmail.textContent = '-';
    if (profilePhone) profilePhone.textContent = '-';
    if (profileMethod) profileMethod.textContent = 'Belum login';
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      logoutUser();
      window.location.href = 'index.html';
    });
  }
}

updateUserBadge();

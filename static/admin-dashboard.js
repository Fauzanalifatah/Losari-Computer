/* =========================================================
   LOSARI COMPUTER — ADMIN DASHBOARD JS
   ========================================================= */
'use strict';

// ===== STORAGE KEYS =====
const KEYS = {
  auth: 'lc_admin_auth',
  creds: 'lc_admin_creds',
  products: 'lc_admin_products',
  orders: 'lc_admin_orders',
  returns: 'lc_admin_returns'
};

// ===== DEFAULT CREDENTIALS =====
const DEFAULT_CREDS = { username: 'admin', password: 'losari2026' };

// ===== SAMPLE DATA =====
const SAMPLE_PRODUCTS = [
  { id: 'lenovo-thinkpad-t490', name: 'Lenovo ThinkPad T490', category: 'business', brand: 'Lenovo', price: 4250000, grade: 'Grade A+', spec1: 'Intel Core i5-10210U', ram: '16GB', storage: 'SSD 512GB', screen: '14" FHD', desc: 'Tangkas untuk kerja, kuliah, coding, dan multitasking harian.', image: '/static/images/laptop/thinkpad-t490.jpg', status: 'active' },
  { id: 'asus-tuf-gaming-a15', name: 'ASUS TUF Gaming A15', category: 'gaming', brand: 'ASUS', price: 8900000, grade: 'Gaming Ready', spec1: 'Ryzen 5 7535HS', ram: '8GB DDR5', storage: 'SSD 512GB', screen: '15.6" FHD', desc: 'Performa gaming dan produktivitas dengan pendinginan tangguh.', image: '/static/images/laptop/asus-tuf-a15.jpg', status: 'active' },
  { id: 'hp-elitebook-840-g7', name: 'HP EliteBook 840 G7', category: 'business', brand: 'HP', price: 5150000, grade: 'Best Seller', spec1: 'Core i5 Gen 10', ram: '16GB', storage: 'SSD 512GB', screen: '14" FHD', desc: 'Tipis, profesional, dan nyaman untuk mobilitas kantor.', image: '/static/images/laptop/hp-elitebook-840.jpg', status: 'active' },
  { id: 'macbook-air-m1', name: 'MacBook Air M1', category: 'creative', brand: 'Apple', price: 11900000, grade: 'Like New', spec1: 'Apple M1', ram: '8GB', storage: 'SSD 256GB', screen: '13.3" Retina', desc: 'Ringan dan bertenaga untuk desain, konten, dan kerja mobile.', image: '/static/images/laptop/macbook-air-m1.jpg', status: 'active' },
  { id: 'asus-vivobook-14', name: 'ASUS VivoBook 14', category: 'office', brand: 'ASUS', price: 4650000, grade: 'Unit Teruji', spec1: 'Intel Core i5', ram: '8GB', storage: 'SSD 512GB', screen: '14" FHD', desc: 'Praktis untuk tugas kampus, presentasi, dan browsing.', image: '/static/images/laptop/asus-vivobook-14.jpg', status: 'active' },
  { id: 'lenovo-thinkpad-t14-gen-1', name: 'Lenovo ThinkPad T14 Gen 1', category: 'business', brand: 'Lenovo', price: 6350000, grade: 'Business Choice', spec1: 'AMD Ryzen 5 Pro 4650U', ram: '16GB', storage: 'SSD 512GB', screen: '14" FHD', desc: 'Daya tahan baterai luar biasa untuk profesional mobile.', image: '/static/images/laptop/thinkpad-t490.jpg', status: 'active' },
  { id: 'dell-latitude-5410', name: 'Dell Latitude 5410', category: 'business', brand: 'Dell', price: 5200000, grade: 'Grade A', spec1: 'Intel Core i5 Gen 10', ram: '16GB', storage: 'SSD 256GB', screen: '14" FHD', desc: 'Andalan enterprise, kokoh dan tahan banting untuk lapangan.', image: '/static/images/laptop/dell-latitude-5410.jpg', status: 'active' },
  { id: 'acer-swift-3', name: 'Acer Swift 3', category: 'office', brand: 'Acer', price: 4150000, grade: 'Grade A+', spec1: 'AMD Ryzen 5 4500U', ram: '8GB', storage: 'SSD 512GB', screen: '14" FHD', desc: 'Ultrabook tipis, ringan, dan kencang untuk mahasiswa.', image: '/static/images/laptop/acer-swift-3.jpg', status: 'active' },
  { id: 'acer-nitro-5', name: 'Acer Nitro 5', category: 'gaming', brand: 'Acer', price: 7200000, grade: 'Gaming Ready', spec1: 'AMD Ryzen 5 5600H', ram: '8GB', storage: 'SSD 512GB', screen: '15.6" FHD 144Hz', desc: 'Gaming laptop bertenaga dengan layar 144Hz yang memukau.', image: '/static/images/laptop/acer-nitro-5.jpg', status: 'active' },
  { id: 'dell-xps-13', name: 'Dell XPS 13', category: 'creative', brand: 'Dell', price: 9750000, grade: 'Like New', spec1: 'Intel Core i7-1165G7', ram: '16GB', storage: 'SSD 512GB', screen: '13.4" FHD+', desc: 'Premium ultrabook dengan layar InfinityEdge yang stunning.', image: '/static/images/laptop/dell-xps-13.jpg', status: 'active' },
  { id: 'asus-vivobook-pro-14', name: 'ASUS VivoBook Pro 14', category: 'creative', brand: 'ASUS', price: 8100000, grade: 'Grade A', spec1: 'Ryzen 5 5600H', ram: '16GB', storage: 'SSD 512GB', screen: '14" 2.8K OLED', desc: 'Layar OLED memukau untuk kreator konten dan desainer.', image: '/static/images/laptop/asus-vivobook-pro-14.jpg', status: 'active' },
  { id: 'lenovo-ideapad-gaming-3', name: 'Lenovo IdeaPad Gaming 3', category: 'gaming', brand: 'Lenovo', price: 7800000, grade: 'Gaming Ready', spec1: 'Ryzen 5 5600H', ram: '8GB', storage: 'SSD 512GB', screen: '15.6" FHD 120Hz', desc: 'Pilihan gaming terjangkau dengan performa yang garang.', image: '/static/images/laptop/lenovo-ideapad-gaming-3.jpg', status: 'active' }
];

const SAMPLE_ORDERS = [
  { id: 'LOSARI-1727920001-001', date: '2026-10-02', customer: 'Andi Prasetyo', phone: '081234567890', email: 'andi@email.com', product: 'MacBook Air M1', total: 11900000, method: 'GoPay', status: 'settlement', address: 'Jl. Sudirman No. 45, Makassar' },
  { id: 'LOSARI-1727920002-002', date: '2026-10-02', customer: 'Budi Santoso', phone: '082345678901', email: 'budi@email.com', product: 'ASUS TUF Gaming A15', total: 8900000, method: 'BCA VA', status: 'pending', address: 'Jl. Urip Sumoharjo No. 12, Makassar' },
  { id: 'LOSARI-1727920003-003', date: '2026-10-01', customer: 'Citra Wulandari', phone: '083456789012', email: 'citra@email.com', product: 'HP EliteBook 840 G7', total: 5150000, method: 'Transfer Bank', status: 'settlement', address: 'Jl. Perintis Kemerdekaan No. 8, Makassar' },
  { id: 'LOSARI-1727920004-004', date: '2026-10-01', customer: 'Dedi Kurniawan', phone: '084567890123', email: 'dedi@email.com', product: 'Dell XPS 13', total: 9750000, method: 'Kartu Kredit', status: 'cancel', address: 'Jl. AP Pettarani No. 33, Makassar' },
  { id: 'LOSARI-1727920005-005', date: '2026-09-30', customer: 'Eka Lestari', phone: '085678901234', email: 'eka@email.com', product: 'Lenovo ThinkPad T490', total: 4250000, method: 'QRIS', status: 'settlement', address: 'Jl. Lamadukelleng No. 5, Makassar' },
  { id: 'LOSARI-1727920006-006', date: '2026-09-30', customer: 'Farid Ahmadi', phone: '086789012345', email: 'farid@email.com', product: 'Acer Nitro 5', total: 7200000, method: 'BNI VA', status: 'settlement', address: 'Jl. Rappocini Raya No. 22, Makassar' },
  { id: 'LOSARI-1727920007-007', date: '2026-09-29', customer: 'Galih Saputra', phone: '087890123456', email: 'galih@email.com', product: 'ASUS VivoBook 14', total: 4650000, method: 'ShopeePay', status: 'settlement', address: 'Jl. Panakukang No. 88, Makassar' },
  { id: 'LOSARI-1727920008-008', date: '2026-09-28', customer: 'Hani Rahmawati', phone: '088901234567', email: 'hani@email.com', product: 'Dell Latitude 5410', total: 5200000, method: 'Transfer Bank', status: 'expire', address: 'Jl. Tamalate No. 17, Makassar' }
];

const SAMPLE_RETURNS = [
  { id: 'RTR-2610001', date: '2026-10-02', customer: 'Budi Santoso', phone: '082345678901', product: 'ASUS TUF Gaming A15', orderId: 'LOSARI-1727920002-002', reason: 'Layar bergaris saat dinyalakan', status: 'pending', note: 'Kerusakan terdeteksi sejak hari pertama pemakaian.' },
  { id: 'RTR-2610002', date: '2026-10-01', customer: 'Dedi Kurniawan', phone: '084567890123', product: 'Dell XPS 13', orderId: 'LOSARI-1727920004-004', reason: 'Keyboard beberapa tombol tidak berfungsi', status: 'pending', note: 'Tombol Enter, Space, dan Backspace tidak responsif.' },
  { id: 'RTR-2609001', date: '2026-09-28', customer: 'Farid Ahmadi', phone: '086789012345', product: 'Acer Nitro 5', orderId: 'LOSARI-1727920006-006', reason: 'Overheating berlebihan', status: 'processing', note: 'Suhu CPU mencapai 100°C dalam 5 menit gaming.' },
  { id: 'RTR-2609002', date: '2026-09-25', customer: 'Hani Rahmawati', phone: '088901234567', product: 'Dell Latitude 5410', orderId: 'LOSARI-1727920008-008', reason: 'Baterai tidak bisa di-charge', status: 'rejected', note: 'Kerusakan akibat kelalaian pengguna (terkena air).' }
];

// ===== STATE =====
let currentPage = 'dashboard';
let currentOrderId = null;
let currentReturnId = null;
let confirmCallback = null;
let salesChartCtx = null;
let analyticsChartCtx = null;
let salesChartDrawn = false;
let analyticsChartDrawn = false;

// ===== HELPERS =====
const rupiah = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
const formatDate = d => new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
const el = id => document.getElementById(id);
const setText = (id, v) => { const e = el(id); if (e) e.textContent = v; };

function storage(key, val) {
  if (val === undefined) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
  localStorage.setItem(key, JSON.stringify(val));
}

function getProducts() { return storage(KEYS.products) || SAMPLE_PRODUCTS; }
function getOrders() { return storage(KEYS.orders) || SAMPLE_ORDERS; }
function getReturns() { return storage(KEYS.returns) || SAMPLE_RETURNS; }
function saveProducts(p) { storage(KEYS.products, p); }
function saveOrders(o) { storage(KEYS.orders, o); }
function saveReturns(r) { storage(KEYS.returns, r); }
function getCreds() { return storage(KEYS.creds) || DEFAULT_CREDS; }

function showToast(msg, type = 'info') {
  const t = el('adminToast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'admin-toast toast--' + type;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 3200);
}

// ===== AUTH =====
function adminLogin(e) {
  if (e) e.preventDefault();
  const user = (el('loginUser').value || '').trim();
  const pass = (el('loginPass').value || '').trim();
  const creds = getCreds();
  if (user === creds.username && pass === creds.password) {
    storage(KEYS.auth, { user, loggedAt: Date.now() });
    el('loginScreen').style.display = 'none';
    el('dashboardApp').style.display = 'flex';
    setText('topAdminName', user.charAt(0).toUpperCase() + user.slice(1));
    el('topAdminAvatar').textContent = user.charAt(0).toUpperCase();
    initDashboard();
  } else {
    el('loginError').style.display = 'block';
    setTimeout(() => { el('loginError').style.display = 'none'; }, 3000);
  }
}

function adminLogout() {
  localStorage.removeItem(KEYS.auth);
  el('dashboardApp').style.display = 'none';
  el('loginScreen').style.display = 'flex';
  el('loginPass').value = '';
}

function checkAuth() {
  const auth = storage(KEYS.auth);
  if (auth && auth.user) {
    el('loginScreen').style.display = 'none';
    el('dashboardApp').style.display = 'flex';
    setText('topAdminName', auth.user.charAt(0).toUpperCase() + auth.user.slice(1));
    el('topAdminAvatar').textContent = auth.user.charAt(0).toUpperCase();
    initDashboard();
  }
}

// ===== INIT =====
function initDashboard() {
  setDashDate();
  loadDashboardPage();
  navigateTo('dashboard');
}

function setDashDate() {
  const d = new Date();
  const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const str = `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  setText('dashDate', str);
  const h = d.getHours();
  const greeting = h < 10 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam';
  setText('dashGreeting', greeting + ', Admin! Ini ringkasan toko hari ini.');
}

// ===== NAVIGATION =====
function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');
  const target = el('page-' + page);
  if (target) target.style.display = 'block';
  document.querySelectorAll('.nav-item').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });
  // Mobile: close sidebar
  el('dashSidebar').classList.remove('mobile-open');

  if (page === 'dashboard') loadDashboardPage();
  else if (page === 'products') loadProductsPage();
  else if (page === 'orders') loadOrdersPage();
  else if (page === 'payments') loadPaymentsPage();
  else if (page === 'returns') loadReturnsPage();
  else if (page === 'analytics') loadAnalyticsPage();
}

function toggleSidebar() {
  const sb = el('dashSidebar');
  const isMobile = window.innerWidth <= 768;
  if (isMobile) sb.classList.toggle('mobile-open');
  else sb.classList.toggle('collapsed');
}

// ===== DASHBOARD PAGE =====
function loadDashboardPage() {
  const prods = getProducts();
  const orders = getOrders();
  const returns = getReturns();
  setText('statTotalProd', prods.filter(p => p.status === 'active').length);
  setText('statOrders', orders.length);
  const revenue = orders.filter(o => o.status === 'settlement').reduce((s, o) => s + o.total, 0);
  const revM = revenue >= 1000000 ? (revenue / 1000000).toFixed(1) + ' jt' : rupiah(revenue);
  setText('statRevenue', 'Rp ' + revM);
  setText('statReturns', returns.filter(r => r.status === 'pending').length);
  setText('navBadgeProd', prods.length);
  const pendOrders = orders.filter(o => o.status === 'pending').length;
  setText('navBadgeOrd', pendOrders);
  setText('notifDot', pendOrders);
  setText('navBadgeRet', returns.filter(r => r.status === 'pending').length);
  renderRecentOrders(orders.slice(0, 6));
  drawSalesChart();
}

function renderRecentOrders(orders) {
  const tb = el('recentOrdersTbody');
  if (!tb) return;
  tb.innerHTML = orders.map(o => `
    <tr>
      <td><code style="font-size:12px;color:#3b82f6">${o.id}</code></td>
      <td><strong>${o.customer}</strong></td>
      <td>${o.product}</td>
      <td style="font-weight:700">${rupiah(o.total)}</td>
      <td>${o.method}</td>
      <td>${statusBadge(o.status)}</td>
      <td><button class="btn-table-action btn-table-action--blue" onclick="openOrderModal('${o.id}')">Detail</button></td>
    </tr>`).join('');
}

function statusBadge(status) {
  const map = { settlement: ['badge--green', 'Berhasil'], pending: ['badge--yellow', 'Pending'], cancel: ['badge--red', 'Dibatalkan'], expire: ['badge--gray', 'Kadaluarsa'], failure: ['badge--red', 'Gagal'] };
  const [cls, label] = map[status] || ['badge--gray', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

function returnStatusBadge(status) {
  const map = { pending: ['badge--yellow', 'Menunggu'], processing: ['badge--blue', 'Diproses'], approved: ['badge--green', 'Disetujui'], rejected: ['badge--red', 'Ditolak'], completed: ['badge--purple', 'Selesai'] };
  const [cls, label] = map[status] || ['badge--gray', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

// ===== SALES CHART =====
function drawSalesChart() {
  const canvas = el('salesChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const vals = [32, 48, 25, 67, 54, 72, 43];
  const maxV = Math.max(...vals);
  const W = canvas.offsetWidth || 500;
  const H = canvas.offsetHeight || 220;
  canvas.width = W; canvas.height = H;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  ctx.clearRect(0, 0, W, H);
  // Grid
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = '11px Inter,sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxV - (maxV / 4) * i) + 'jt', pad.left - 8, y + 4);
  }
  // Gradient area
  const barW = chartW / days.length;
  const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
  grad.addColorStop(0, 'rgba(59,130,246,.35)'); grad.addColorStop(1, 'rgba(59,130,246,.0)');
  // Line path
  ctx.beginPath();
  vals.forEach((v, i) => {
    const x = pad.left + i * barW + barW / 2;
    const y = pad.top + chartH - (v / maxV) * chartH;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2.5; ctx.stroke();
  // Fill below line
  const lastX = pad.left + (vals.length - 1) * barW + barW / 2;
  ctx.lineTo(lastX, pad.top + chartH);
  ctx.lineTo(pad.left + barW / 2, pad.top + chartH);
  ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
  // Dots & labels
  vals.forEach((v, i) => {
    const x = pad.left + i * barW + barW / 2;
    const y = pad.top + chartH - (v / maxV) * chartH;
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6'; ctx.fill();
    ctx.fillStyle = '#1e3a5f'; ctx.font = 'bold 11px Inter,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(v + 'jt', x, y - 10);
    ctx.fillStyle = '#64748b'; ctx.font = '11px Inter,sans-serif';
    ctx.fillText(days[i], x, H - 10);
  });
}

function drawAnalyticsChart() {
  const canvas = el('analyticsChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const period = el('analyticsPeriod') ? parseInt(el('analyticsPeriod').value) : 30;
  const labels = period === 7 ? ['Sen','Sel','Rab','Kam','Jum','Sab','Min'] :
    period === 30 ? ['1','5','10','15','20','25','30'] :
    ['Jan','Feb','Mar'];
  const vals = labels.map(() => Math.floor(Math.random() * 60) + 20);
  const maxV = Math.max(...vals);
  const W = canvas.offsetWidth || 500; const H = canvas.offsetHeight || 260;
  canvas.width = W; canvas.height = H;
  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = W - pad.left - pad.right; const chartH = H - pad.top - pad.bottom;
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
    ctx.fillStyle = '#94a3b8'; ctx.font = '11px Inter,sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxV - (maxV / 4) * i) + 'jt', pad.left - 8, y + 4);
  }
  const barW = chartW / labels.length;
  const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
  grad.addColorStop(0, 'rgba(139,92,246,.4)'); grad.addColorStop(1, 'rgba(139,92,246,.0)');
  ctx.beginPath();
  vals.forEach((v, i) => {
    const x = pad.left + i * barW + barW / 2;
    const y = pad.top + chartH - (v / maxV) * chartH;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 2.5; ctx.stroke();
  const lastX = pad.left + (vals.length - 1) * barW + barW / 2;
  ctx.lineTo(lastX, pad.top + chartH); ctx.lineTo(pad.left + barW / 2, pad.top + chartH);
  ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
  vals.forEach((v, i) => {
    const x = pad.left + i * barW + barW / 2;
    const y = pad.top + chartH - (v / maxV) * chartH;
    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#8b5cf6'; ctx.fill();
    ctx.fillStyle = '#64748b'; ctx.font = '11px Inter,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(labels[i], x, H - 10);
  });
}

// ===== PRODUCTS PAGE =====
function loadProductsPage() {
  renderProductTable(getProducts());
}

function renderProductTable(prods) {
  const tb = el('productsTbody');
  if (!tb) return;
  const catLabels = { office: 'Office & Kuliah', gaming: 'Gaming', creative: 'Desain & Kreatif', business: 'Bisnis', accessor: 'Aksesoris', smartphone: 'Smartphone', cctv: 'CCTV' };
  tb.innerHTML = prods.map(p => `
    <tr>
      <td><img class="product-thumb" src="${p.image}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="product-thumb-placeholder" style="display:none">💻</div></td>
      <td><strong>${p.name}</strong><br><small style="color:#64748b">${p.id}</small></td>
      <td>${catLabels[p.category] || p.category}</td>
      <td style="font-size:12.5px;color:#64748b">${p.spec1 || ''} · ${p.ram || ''} · ${p.storage || ''}</td>
      <td style="font-weight:700">${rupiah(p.price)}</td>
      <td><span class="badge badge--blue" style="font-size:11px">${p.grade}</span></td>
      <td>${p.status === 'active' ? '<span class="badge badge--green">Aktif</span>' : p.status === 'sold' ? '<span class="badge badge--gray">Terjual</span>' : '<span class="badge badge--yellow">Disembunyikan</span>'}</td>
      <td>
        <button class="btn-table-action btn-table-action--blue" onclick="openEditProductModal('${p.id}')">Edit</button>
        <button class="btn-table-action btn-table-action--danger" onclick="confirmDeleteProduct('${p.id}')">Hapus</button>
      </td>
    </tr>`).join('');
}

function filterProductTable(q) {
  const cat = el('prodCatFilter').value;
  let prods = getProducts();
  if (q) prods = prods.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || (p.brand || '').toLowerCase().includes(q.toLowerCase()));
  if (cat) prods = prods.filter(p => p.category === cat);
  renderProductTable(prods);
}

function openAddProductModal() {
  el('productModalTitle').textContent = 'Tambah Produk Baru';
  el('productForm').reset();
  el('pf_id').value = '';
  el('pf_status').value = 'active';
  el('productImgPreview').style.display = 'none';
  el('productModal').style.display = 'flex';
}

function openEditProductModal(id) {
  const prod = getProducts().find(p => p.id === id);
  if (!prod) return;
  el('productModalTitle').textContent = 'Edit Produk';
  el('pf_id').value = prod.id;
  el('pf_name').value = prod.name;
  el('pf_slug').value = prod.id;
  el('pf_price').value = prod.price;
  el('pf_category').value = prod.category;
  el('pf_brand').value = prod.brand || '';
  el('pf_grade').value = prod.grade;
  el('pf_spec1').value = prod.spec1 || '';
  el('pf_ram').value = prod.ram || '';
  el('pf_storage').value = prod.storage || '';
  el('pf_screen').value = prod.screen || '';
  el('pf_desc').value = prod.desc || '';
  el('pf_status').value = prod.status || 'active';
  el('pf_image').value = prod.image || '';
  previewProductImg(prod.image);
  el('productModal').style.display = 'flex';
}

function closeProductModal() {
  el('productModal').style.display = 'none';
}

function previewProductImg(url) {
  if (!url) { el('productImgPreview').style.display = 'none'; return; }
  el('productImgPreviewEl').src = url;
  el('productImgPreview').style.display = 'block';
}

function handleImgUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    el('pf_image').value = e.target.result;
    previewProductImg(e.target.result);
  };
  reader.readAsDataURL(file);
}

function saveProduct() {
  const name = el('pf_name').value.trim();
  const slug = el('pf_slug').value.trim();
  const price = parseInt(el('pf_price').value);
  const category = el('pf_category').value;
  if (!name || !slug || !price || !category) { showToast('Harap isi semua field yang wajib diisi!', 'error'); return; }
  const editId = el('pf_id').value;
  const prod = { id: slug, name, category, brand: el('pf_brand').value.trim(), price, grade: el('pf_grade').value, spec1: el('pf_spec1').value.trim(), ram: el('pf_ram').value.trim(), storage: el('pf_storage').value.trim(), screen: el('pf_screen').value.trim(), desc: el('pf_desc').value.trim(), status: el('pf_status').value, image: el('pf_image').value.trim() || '/static/images/laptop/thinkpad-t490.jpg' };
  let prods = getProducts();
  if (editId) prods = prods.map(p => p.id === editId ? prod : p);
  else { if (prods.find(p => p.id === slug)) { showToast('ID produk sudah digunakan!', 'error'); return; } prods.unshift(prod); }
  saveProducts(prods);
  closeProductModal();
  loadProductsPage();
  loadDashboardPage();
  showToast(editId ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!', 'success');
}

function confirmDeleteProduct(id) {
  openConfirmModal('Hapus Produk', 'Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.', () => {
    let prods = getProducts().filter(p => p.id !== id);
    saveProducts(prods);
    loadProductsPage();
    loadDashboardPage();
    showToast('Produk berhasil dihapus.', 'success');
    closeConfirmModal();
  });
}

// ===== ORDERS PAGE =====
function loadOrdersPage() {
  renderOrderTable(getOrders());
  updateOrderStats();
}

function updateOrderStats() {
  const orders = getOrders();
  setText('ordStatTotal', orders.length);
  setText('ordStatSuccess', orders.filter(o => o.status === 'settlement').length);
  setText('ordStatPending', orders.filter(o => o.status === 'pending').length);
  setText('ordStatFailed', orders.filter(o => ['cancel','expire','failure'].includes(o.status)).length);
}

function renderOrderTable(orders) {
  const tb = el('ordersTbody');
  if (!tb) return;
  tb.innerHTML = orders.map(o => `
    <tr>
      <td><code style="font-size:11.5px;color:#3b82f6">${o.id}</code></td>
      <td>${formatDate(o.date)}</td>
      <td><strong>${o.customer}</strong></td>
      <td>${o.product}</td>
      <td style="font-weight:700">${rupiah(o.total)}</td>
      <td>${o.method}</td>
      <td>${statusBadge(o.status)}</td>
      <td><button class="btn-table-action btn-table-action--blue" onclick="openOrderModal('${o.id}')">Detail</button></td>
    </tr>`).join('');
}

function filterOrderTable(q) {
  const statusFilter = el('orderStatusFilter').value;
  let orders = getOrders();
  if (q) orders = orders.filter(o => o.id.toLowerCase().includes(q.toLowerCase()) || o.customer.toLowerCase().includes(q.toLowerCase()) || o.product.toLowerCase().includes(q.toLowerCase()));
  if (statusFilter) orders = orders.filter(o => o.status === statusFilter);
  renderOrderTable(orders);
}

function openOrderModal(id) {
  const order = getOrders().find(o => o.id === id);
  if (!order) return;
  currentOrderId = id;
  el('orderModalBody').innerHTML = `
    <div class="order-detail-section">
      <h4>Informasi Pesanan</h4>
      <div class="order-detail-grid">
        <div class="order-detail-field"><label>No. Pesanan</label><span style="color:#3b82f6;font-family:monospace">${order.id}</span></div>
        <div class="order-detail-field"><label>Tanggal</label><span>${formatDate(order.date)}</span></div>
        <div class="order-detail-field"><label>Status</label><span>${statusBadge(order.status)}</span></div>
        <div class="order-detail-field"><label>Metode Pembayaran</label><span>${order.method}</span></div>
      </div>
    </div>
    <div class="order-detail-section">
      <h4>Data Pelanggan</h4>
      <div class="order-detail-grid">
        <div class="order-detail-field"><label>Nama</label><span>${order.customer}</span></div>
        <div class="order-detail-field"><label>No. HP</label><span>${order.phone || '-'}</span></div>
        <div class="order-detail-field"><label>Email</label><span>${order.email || '-'}</span></div>
        <div class="order-detail-field"><label>Alamat</label><span>${order.address || '-'}</span></div>
      </div>
    </div>
    <div class="order-detail-section">
      <h4>Produk Dipesan</h4>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:14px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0">
        <span style="font-weight:700">${order.product}</span>
        <span style="font-size:18px;font-weight:800;color:#0f172a">${rupiah(order.total)}</span>
      </div>
    </div>`;
  el('orderModal').style.display = 'flex';
}

function closeOrderModal() { el('orderModal').style.display = 'none'; currentOrderId = null; }

async function checkCurrentOrderStatus() {
  if (!currentOrderId) return;
  const btn = el('btnCheckOrderStatus');
  btn.textContent = 'Mengecek...'; btn.disabled = true;
  try {
    const res = await fetch('/api/midtrans/status/' + encodeURIComponent(currentOrderId));
    const data = await res.json();
    if (data.ok) {
      showToast(`Status: ${data.status} | Nominal: ${data.grossAmount}`, 'success');
      // Update order status
      let orders = getOrders();
      const idx = orders.findIndex(o => o.id === currentOrderId);
      if (idx >= 0) { orders[idx].status = data.status; saveOrders(orders); }
    } else {
      showToast(data.message || 'Gagal mengecek status', 'error');
    }
  } catch { showToast('Gagal terhubung ke server', 'error'); }
  btn.textContent = 'Cek Status Midtrans'; btn.disabled = false;
}

// ===== PAYMENTS PAGE =====
function loadPaymentsPage() {
  fetch('/api/midtrans/config').then(r => r.json()).then(d => {
    if (d.ok) {
      setText('cfgMerchant', d.merchantId || 'M354998408');
      setText('cfgClientKey', (d.clientKey || '').slice(0, 18) + '...');
      setText('cfgMode', d.isProduction ? 'Production' : 'Sandbox');
      const snapHost = d.snapJsUrl ? d.snapJsUrl.replace('https://', '').split('/')[0] : 'app.midtrans.com';
      setText('cfgSnapUrl', snapHost + '/snap/snap.js');
    }
  }).catch(() => {});
  renderPaymentHistory();
}

function renderPaymentHistory() {
  const orders = getOrders();
  const tb = el('paymentHistoryTbody');
  if (!tb) return;
  tb.innerHTML = orders.map(o => `
    <tr>
      <td><code style="font-size:11.5px;color:#3b82f6">${o.id}</code></td>
      <td>${o.customer}</td>
      <td style="font-weight:700">${rupiah(o.total)}</td>
      <td>${o.method}</td>
      <td>${formatDate(o.date)}</td>
      <td>${statusBadge(o.status)}</td>
      <td><button class="btn-table-action btn-table-action--blue" onclick="openOrderModal('${o.id}')">Detail</button></td>
    </tr>`).join('');
}

function loadPaymentHistory() { renderPaymentHistory(); showToast('Data transaksi dimuat!', 'info'); }

async function checkMidtransStatus() {
  const orderId = el('checkOrderId').value.trim();
  if (!orderId) { showToast('Masukkan Order ID terlebih dahulu!', 'error'); return; }
  const result = el('paymentCheckResult');
  result.style.display = 'block';
  result.innerHTML = '<em style="color:#64748b">Mengecek status...</em>';
  try {
    const res = await fetch('/api/midtrans/status/' + encodeURIComponent(orderId));
    const data = await res.json();
    if (data.ok) {
      result.innerHTML = `<div style="display:flex;flex-direction:column;gap:8px">
        <div><strong>Order ID:</strong> ${orderId}</div>
        <div><strong>Status:</strong> ${statusBadge(data.status)}</div>
        <div><strong>Nominal:</strong> <strong>${rupiah(parseFloat(data.grossAmount))}</strong></div>
        <div><strong>Metode:</strong> ${data.paymentType || '-'}</div>
        <div><strong>Waktu:</strong> ${data.transactionTime ? new Date(data.transactionTime).toLocaleString('id-ID') : '-'}</div>
      </div>`;
    } else if (data.notFound) {
      result.innerHTML = `<span style="color:#f59e0b">⚠️ ${data.message}</span>`;
    } else {
      result.innerHTML = `<span style="color:#ef4444">❌ ${data.message}</span>`;
    }
  } catch { result.innerHTML = `<span style="color:#ef4444">❌ Gagal terhubung ke Midtrans. Cek koneksi internet.</span>`; }
}

async function testMidtransConfig() {
  showToast('Menguji koneksi ke Midtrans...', 'info');
  try {
    const res = await fetch('/api/midtrans/config');
    const d = await res.json();
    if (d.ok) showToast('Midtrans terkoneksi! Mode: ' + (d.isProduction ? 'Production' : 'Sandbox'), 'success');
    else showToast('Gagal membaca konfigurasi Midtrans', 'error');
  } catch { showToast('Tidak dapat terhubung ke server', 'error'); }
}

// ===== RETURNS PAGE =====
function loadReturnsPage() {
  renderReturnsTable(getReturns());
}

function renderReturnsTable(returns) {
  const tb = el('returnsTbody');
  if (!tb) return;
  tb.innerHTML = returns.map(r => `
    <tr>
      <td><code style="font-size:11.5px;color:#8b5cf6">${r.id}</code></td>
      <td>${formatDate(r.date)}</td>
      <td><strong>${r.customer}</strong></td>
      <td>${r.product}</td>
      <td><code style="font-size:11px">${r.orderId}</code></td>
      <td style="max-width:200px;font-size:12.5px">${r.reason}</td>
      <td>${returnStatusBadge(r.status)}</td>
      <td><button class="btn-table-action btn-table-action--blue" onclick="openReturnModal('${r.id}')">Detail</button></td>
    </tr>`).join('');
}

function openReturnModal(id) {
  const ret = getReturns().find(r => r.id === id);
  if (!ret) return;
  currentReturnId = id;
  el('returnModalBody').innerHTML = `
    <div class="retur-detail-section">
      <h4>Informasi Retur</h4>
      <div class="retur-detail-row"><label>ID Retur</label><span style="color:#8b5cf6;font-family:monospace">${ret.id}</span></div>
      <div class="retur-detail-row"><label>Tanggal Pengajuan</label><span>${formatDate(ret.date)}</span></div>
      <div class="retur-detail-row"><label>Status</label><span>${returnStatusBadge(ret.status)}</span></div>
      <div class="retur-detail-row"><label>No. Pesanan Asli</label><span style="font-family:monospace;font-size:12px">${ret.orderId}</span></div>
    </div>
    <div class="retur-detail-section">
      <h4>Data Pelanggan</h4>
      <div class="retur-detail-row"><label>Nama</label><span>${ret.customer}</span></div>
      <div class="retur-detail-row"><label>No. HP</label><span>${ret.phone || '-'}</span></div>
    </div>
    <div class="retur-detail-section">
      <h4>Detail Kerusakan</h4>
      <div class="retur-detail-row"><label>Produk</label><span>${ret.product}</span></div>
      <div class="retur-detail-row"><label>Alasan Retur</label><span>${ret.reason}</span></div>
      ${ret.note ? `<div style="margin-top:10px;padding:12px;background:#fef3c7;border-radius:8px;font-size:13px;color:#92400e;border:1px solid #fde68a"><strong>Catatan:</strong> ${ret.note}</div>` : ''}
    </div>`;
  const isActionable = ret.status === 'pending' || ret.status === 'processing';
  el('btnApproveReturn').style.display = isActionable ? 'flex' : 'none';
  el('btnRejectReturn').style.display = isActionable ? 'flex' : 'none';
  el('returnModal').style.display = 'flex';
}

function closeReturnModal() { el('returnModal').style.display = 'none'; currentReturnId = null; }

function updateReturnStatus(newStatus) {
  if (!currentReturnId) return;
  let returns = getReturns();
  const idx = returns.findIndex(r => r.id === currentReturnId);
  if (idx >= 0) returns[idx].status = newStatus;
  saveReturns(returns);
  closeReturnModal();
  loadReturnsPage();
  loadDashboardPage();
  showToast(newStatus === 'approved' ? 'Retur disetujui!' : 'Retur ditolak.', newStatus === 'approved' ? 'success' : 'error');
}

// ===== ANALYTICS PAGE =====
function loadAnalyticsPage() { setTimeout(drawAnalyticsChart, 100); }
function refreshAnalytics() { drawAnalyticsChart(); }

// ===== SETTINGS PAGE =====
function saveContactSettings() {
  const waNum = el('setWaNumber').value.trim();
  const waDisplay = el('setWaDisplay').value.trim();
  const waMsg = el('setWaMsg').value.trim();
  const location = el('setLocation').value.trim();
  if (!waNum) { showToast('Nomor WhatsApp wajib diisi!', 'error'); return; }
  // Update window.SITE_CONFIG if available
  if (window.SITE_CONFIG) {
    window.SITE_CONFIG.whatsappNumber = waNum;
    window.SITE_CONFIG.whatsappDisplay = waDisplay;
    window.SITE_CONFIG.whatsappDefaultMessage = waMsg;
    window.SITE_CONFIG.storeLocation = location;
  }
  showToast('Pengaturan kontak berhasil disimpan!', 'success');
}

function saveSocialSettings() {
  const ig = el('setIg').value.trim();
  const tiktok = el('setTiktok').value.trim();
  const newUser = el('setAdminUser').value.trim();
  const newPass = el('setAdminPass').value.trim();
  if (newUser) {
    const creds = getCreds();
    storage(KEYS.creds, { username: newUser, password: newPass || creds.password });
    showToast('Kredensial admin berhasil diperbarui! Harap login ulang.', 'success');
    setTimeout(adminLogout, 2000);
  } else {
    showToast('Username tidak boleh kosong!', 'error'); return;
  }
  if (window.SITE_CONFIG) {
    if (ig) { window.SITE_CONFIG.instagramUsername = ig; window.SITE_CONFIG.instagramLink = 'https://www.instagram.com/' + ig + '/'; }
    if (tiktok) { window.SITE_CONFIG.tiktokUsername = '@' + tiktok; window.SITE_CONFIG.tiktokLink = 'https://tiktok.com/@' + tiktok; }
  }
}

// ===== CONFIRM MODAL =====
function openConfirmModal(title, msg, cb) {
  el('confirmTitle').textContent = title;
  el('confirmMsg').textContent = msg;
  confirmCallback = cb;
  el('confirmOkBtn').onclick = cb;
  el('confirmModal').style.display = 'flex';
}
function closeConfirmModal() { el('confirmModal').style.display = 'none'; confirmCallback = null; }

// ===== GLOBAL SEARCH =====
function globalSearchFn(q) {
  if (!q || q.length < 2) return;
  const prods = getProducts().filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  if (prods.length > 0) { navigateTo('products'); filterProductTable(q); }
}

// ===== WINDOW EVENTS =====
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    el('dashSidebar').classList.remove('mobile-open');
  }
});

// ===== BOOT =====
document.addEventListener('DOMContentLoaded', () => {
  // Setup login form
  const form = el('loginForm');
  if (form) form.addEventListener('submit', adminLogin);
  // Check existing auth
  checkAuth();
  // Resize chart on window resize
  window.addEventListener('resize', () => {
    if (currentPage === 'dashboard') drawSalesChart();
    if (currentPage === 'analytics') drawAnalyticsChart();
  });
});
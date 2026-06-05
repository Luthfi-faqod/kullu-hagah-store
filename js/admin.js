// ============================================================
// KULLU HAGAH STORE - Admin Dashboard Logic
// ============================================================

const ADMIN_PASSWORD = 'Nhaf2210';

// ── State ──
let adminData = null; // Working copy of categories
let adminSettings = null;
let editingProduct = null;
let editingCategory = null;
let editingSubcat = null;
let confirmCallback = null;

// ── Init ──
async function adminInit() {
  // Load admin data from Firestore
  try {
    const data = await getStoreData();
    adminData = JSON.parse(JSON.stringify(data.categories));
  } catch (e) {
    const raw = localStorage.getItem('khs_admin_categories');
    adminData = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(FALLBACK_STORE_DATA.categories));
  }

  const sRaw = localStorage.getItem('khs_settings');
  adminSettings = sRaw ? JSON.parse(sRaw) : {
    darkMode: false,
    autoConvert: { egpToIdr: false, idrToEgp: false },
    rate: { egpToIdr: 355, idrToEgp: 0.0028 }
  };

  applyAdminTheme();
  renderStatsCards();
  showAdminSection('dashboard');
}

function saveAdminData() {
  // Save to Firestore
  setStoreData({ categories: adminData });
  // Also keep local backup
  localStorage.setItem('khs_admin_categories', JSON.stringify(adminData));
}

function saveAdminSettings() {
  localStorage.setItem('khs_settings', JSON.stringify(adminSettings));
}

// ── Theme ──
function applyAdminTheme() {
  document.documentElement.setAttribute('data-theme', adminSettings.darkMode ? 'dark' : 'light');
  const btn = document.getElementById('admin-theme-btn');
  if (btn) btn.textContent = adminSettings.darkMode ? '☀️' : '🌙';
}

function toggleAdminTheme() {
  adminSettings.darkMode = !adminSettings.darkMode;
  saveAdminSettings();
  applyAdminTheme();
}

// ── Toast ──
let adminToastTimer = null;
function showAdminToast(msg, type = 'default') {
  const t = document.getElementById('admin-toast');
  t.textContent = msg;
  t.className = 'admin-toast show';
  if (type === 'success') t.classList.add('success-toast');
  if (type === 'danger') t.classList.add('danger-toast');
  clearTimeout(adminToastTimer);
  adminToastTimer = setTimeout(() => {
    t.classList.remove('show', 'success-toast', 'danger-toast');
  }, 3000);
}

// ── Navigation ──
function showAdminSection(id) {
  document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
  const sec = document.getElementById('sec-' + id);
  if (sec) sec.style.display = 'block';

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const nav = document.querySelector(`[data-nav="${id}"]`);
  if (nav) nav.classList.add('active');

  document.getElementById('topbar-title').textContent = {
    dashboard: 'Dashboard',
    categories: 'Kategori',
    products: 'Produk',
    settings: 'Pengaturan'
  }[id] || id;

  if (id === 'dashboard') renderStatsCards();
  if (id === 'categories') renderCategoriesAdmin();
  if (id === 'products') renderProductsAdmin();
  if (id === 'settings') renderSettingsAdmin();
}

// ── Stats ──
function renderStatsCards() {
  const totalCats = adminData.length;
  let totalSubcats = 0, totalProds = 0;
  adminData.forEach(c => {
    totalSubcats += c.subcategories.length;
    c.subcategories.forEach(s => totalProds += s.products.length);
  });

  document.getElementById('stat-cats').textContent = totalCats;
  document.getElementById('stat-subcats').textContent = totalSubcats;
  document.getElementById('stat-prods').textContent = totalProds;
  document.getElementById('stat-cart').textContent = JSON.parse(localStorage.getItem('khs_cart') || '[]').length;
}

// ════════════════════════════════════════
// CATEGORIES SECTION
// ════════════════════════════════════════
function renderCategoriesAdmin() {
  const tbody = document.getElementById('cats-tbody');
  tbody.innerHTML = '';
  adminData.forEach((cat, ci) => {
    const subCount = cat.subcategories.length;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${cat.icon}</td>
      <td><strong>${cat.name}</strong></td>
      <td><span class="badge badge-blue">${subCount} sub</span></td>
      <td>
        <div class="prod-row-actions">
          <button class="btn btn-sm btn-warning" onclick="openEditCategoryDrawer(${ci})">✏️ Edit</button>
          <button class="btn btn-sm btn-danger" onclick="confirmDelete('Hapus kategori "${cat.name}"?', () => deleteCategory(${ci}))">🗑️</button>
          <button class="btn btn-sm btn-outline" onclick="viewSubcats(${ci})">📂 Sub-Kategori</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// -- Add/Edit Category Drawer --
function openAddCategoryDrawer() {
  editingCategory = null;
  document.getElementById('cat-drawer-title').textContent = '➕ Tambah Kategori';
  document.getElementById('cat-name-input').value = '';
  document.getElementById('cat-icon-input').value = '';
  openDrawer('cat-drawer');
}

function openEditCategoryDrawer(ci) {
  editingCategory = ci;
  const cat = adminData[ci];
  document.getElementById('cat-drawer-title').textContent = '✏️ Edit Kategori';
  document.getElementById('cat-name-input').value = cat.name;
  document.getElementById('cat-icon-input').value = cat.icon;
  openDrawer('cat-drawer');
}

function saveCategoryDrawer() {
  const name = document.getElementById('cat-name-input').value.trim();
  const icon = document.getElementById('cat-icon-input').value.trim() || '📦';
  if (!name) { showAdminToast('Nama kategori wajib diisi!', 'danger'); return; }

  if (editingCategory !== null) {
    adminData[editingCategory].name = name;
    adminData[editingCategory].icon = icon;
    showAdminToast('✅ Kategori diperbarui', 'success');
  } else {
    adminData.push({
      id: 'cat_' + Date.now(),
      name, icon,
      subcategories: []
    });
    showAdminToast('✅ Kategori ditambahkan', 'success');
  }

  saveAdminData();
  closeDrawer('cat-drawer');
  renderCategoriesAdmin();
}

function deleteCategory(ci) {
  adminData.splice(ci, 1);
  saveAdminData();
  renderCategoriesAdmin();
  showAdminToast('Kategori dihapus', 'danger');
}

// -- Sub-categories view --
function viewSubcats(ci) {
  const cat = adminData[ci];
  document.getElementById('subcat-section-title').textContent = `Sub-Kategori: ${cat.name}`;
  document.getElementById('subcat-add-btn').onclick = () => openAddSubcatDrawer(ci);

  const tbody = document.getElementById('subcats-tbody');
  tbody.innerHTML = '';
  cat.subcategories.forEach((sub, si) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${sub.name}</strong></td>
      <td><span class="badge badge-green">${sub.products.length} produk</span></td>
      <td>
        <div class="prod-row-actions">
          <button class="btn btn-sm btn-warning" onclick="openEditSubcatDrawer(${ci},${si})">✏️ Edit</button>
          <button class="btn btn-sm btn-danger" onclick="confirmDelete('Hapus sub-kategori "${sub.name}"?', () => deleteSubcat(${ci},${si}))">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById('subcat-manager').style.display = 'block';
  document.getElementById('subcat-manager').scrollIntoView({ behavior: 'smooth' });
}

function openAddSubcatDrawer(ci) {
  editingSubcat = { ci, si: null };
  document.getElementById('subcat-drawer-title').textContent = '➕ Tambah Sub-Kategori';
  document.getElementById('subcat-name-input').value = '';
  openDrawer('subcat-drawer');
}

function openEditSubcatDrawer(ci, si) {
  editingSubcat = { ci, si };
  const sub = adminData[ci].subcategories[si];
  document.getElementById('subcat-drawer-title').textContent = '✏️ Edit Sub-Kategori';
  document.getElementById('subcat-name-input').value = sub.name;
  openDrawer('subcat-drawer');
}

function saveSubcatDrawer() {
  const name = document.getElementById('subcat-name-input').value.trim();
  if (!name) { showAdminToast('Nama wajib diisi!', 'danger'); return; }

  const { ci, si } = editingSubcat;
  if (si !== null) {
    adminData[ci].subcategories[si].name = name;
    showAdminToast('✅ Sub-kategori diperbarui', 'success');
  } else {
    adminData[ci].subcategories.push({
      id: 'sub_' + Date.now(),
      name,
      products: []
    });
    showAdminToast('✅ Sub-kategori ditambahkan', 'success');
  }

  saveAdminData();
  closeDrawer('subcat-drawer');
  viewSubcats(ci);
}

function deleteSubcat(ci, si) {
  adminData[ci].subcategories.splice(si, 1);
  saveAdminData();
  viewSubcats(ci);
  showAdminToast('Sub-kategori dihapus', 'danger');
}

// ════════════════════════════════════════
// PRODUCTS SECTION
// ════════════════════════════════════════
function renderProductsAdmin() {
  // Build category and subcategory filter dropdowns
  const catSel = document.getElementById('prod-filter-cat');
  const subSel = document.getElementById('prod-filter-sub');
  catSel.innerHTML = '<option value="">Semua Kategori</option>';
  adminData.forEach((cat, ci) => {
    catSel.innerHTML += `<option value="${ci}">${cat.name}</option>`;
  });

  catSel.onchange = () => {
    subSel.innerHTML = '<option value="">Semua Sub-Kategori</option>';
    const ci = catSel.value;
    if (ci !== '') {
      adminData[ci].subcategories.forEach((sub, si) => {
        subSel.innerHTML += `<option value="${si}">${sub.name}</option>`;
      });
    }
    renderProductTable();
  };

  subSel.onchange = renderProductTable;
  renderProductTable();
}

function renderProductTable() {
  const ci = document.getElementById('prod-filter-cat').value;
  const si = document.getElementById('prod-filter-sub').value;
  const tbody = document.getElementById('prods-tbody');
  tbody.innerHTML = '';

  adminData.forEach((cat, catIdx) => {
    if (ci !== '' && catIdx !== parseInt(ci)) return;
    cat.subcategories.forEach((sub, subIdx) => {
      if (si !== '' && subIdx !== parseInt(si)) return;
      sub.products.forEach((prod, pi) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><small class="badge badge-blue">${cat.name} › ${sub.name}</small></td>
          <td><strong>${prod.pulsa} EGP</strong></td>
          <td>${prod.data}</td>
          <td>${prod.egp} EGP</td>
          <td>IDR ${formatIDR(prod.idr)}</td>
          <td>
            <div class="prod-row-actions">
              <button class="btn btn-sm btn-warning" onclick="openEditProductDrawer(${catIdx},${subIdx},${pi})">✏️</button>
              <button class="btn btn-sm btn-danger" onclick="confirmDelete('Hapus produk ini?', () => deleteProduct(${catIdx},${subIdx},${pi}))">🗑️</button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
  });

  if (!tbody.innerHTML) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text3);padding:24px">Tidak ada produk ditemukan</td></tr>`;
  }
}

function openAddProductDrawer() {
  editingProduct = null;
  document.getElementById('prod-drawer-title').textContent = '➕ Tambah Produk';

  // Populate dropdowns
  const catSel = document.getElementById('prod-cat-sel');
  catSel.innerHTML = '<option value="">Pilih Kategori</option>';
  adminData.forEach((cat, ci) => {
    catSel.innerHTML += `<option value="${ci}">${cat.name}</option>`;
  });
  catSel.onchange = updateProdSubSel;
  document.getElementById('prod-sub-sel').innerHTML = '<option value="">Pilih Sub-Kategori</option>';

  // Clear fields
  ['prod-pulsa','prod-data','prod-egp','prod-idr'].forEach(id => {
    document.getElementById(id).value = '';
  });

  openDrawer('prod-drawer');
}

function openEditProductDrawer(ci, si, pi) {
  editingProduct = { ci, si, pi };
  const prod = adminData[ci].subcategories[si].products[pi];
  document.getElementById('prod-drawer-title').textContent = '✏️ Edit Produk';

  const catSel = document.getElementById('prod-cat-sel');
  catSel.innerHTML = '';
  adminData.forEach((cat, i) => {
    catSel.innerHTML += `<option value="${i}" ${i===ci?'selected':''}>${cat.name}</option>`;
  });
  catSel.onchange = updateProdSubSel;
  updateProdSubSel(si);

  document.getElementById('prod-pulsa').value = prod.pulsa;
  document.getElementById('prod-data').value = prod.data;
  document.getElementById('prod-egp').value = prod.egp;
  document.getElementById('prod-idr').value = prod.idr;

  openDrawer('prod-drawer');
}

function updateProdSubSel(selectedSi = null) {
  const ci = document.getElementById('prod-cat-sel').value;
  const subSel = document.getElementById('prod-sub-sel');
  subSel.innerHTML = '<option value="">Pilih Sub-Kategori</option>';
  if (ci !== '') {
    adminData[ci].subcategories.forEach((sub, si) => {
      const sel = selectedSi !== null && si === selectedSi ? 'selected' : '';
      subSel.innerHTML += `<option value="${si}" ${sel}>${sub.name}</option>`;
    });
  }
}

function saveProductDrawer() {
  const ci = parseInt(document.getElementById('prod-cat-sel').value);
  const si = parseInt(document.getElementById('prod-sub-sel').value);
  const pulsa = document.getElementById('prod-pulsa').value.trim();
  const data = document.getElementById('prod-data').value.trim();
  const egp = parseFloat(document.getElementById('prod-egp').value);
  const idr = parseFloat(document.getElementById('prod-idr').value);

  if (isNaN(ci) || isNaN(si) || !pulsa || !data || isNaN(egp) || isNaN(idr)) {
    showAdminToast('Lengkapi semua field!', 'danger');
    return;
  }

  if (editingProduct !== null) {
    const { ci: oci, si: osi, pi } = editingProduct;
    adminData[oci].subcategories[osi].products[pi] = {
      ...adminData[oci].subcategories[osi].products[pi],
      pulsa, data, egp, idr
    };
    showAdminToast('✅ Produk diperbarui', 'success');
  } else {
    adminData[ci].subcategories[si].products.push({
      id: 'p_' + Date.now(),
      pulsa, data, egp, idr
    });
    showAdminToast('✅ Produk ditambahkan', 'success');
  }

  saveAdminData();
  closeDrawer('prod-drawer');
  renderProductsAdmin();
}

function deleteProduct(ci, si, pi) {
  adminData[ci].subcategories[si].products.splice(pi, 1);
  saveAdminData();
  renderProductTable();
  showAdminToast('Produk dihapus', 'danger');
}

// ════════════════════════════════════════
// SETTINGS SECTION
// ════════════════════════════════════════
function renderSettingsAdmin() {
  document.getElementById('toggle-egp-idr').checked = adminSettings.autoConvert?.egpToIdr || false;
  document.getElementById('toggle-idr-egp').checked = adminSettings.autoConvert?.idrToEgp || false;
  document.getElementById('rate-egp-idr').value = adminSettings.rate?.egpToIdr || 355;
  document.getElementById('rate-idr-egp').value = adminSettings.rate?.idrToEgp || 0.0028;
}

function saveSettingsAdmin() {
  adminSettings.autoConvert = {
    egpToIdr: document.getElementById('toggle-egp-idr').checked,
    idrToEgp: document.getElementById('toggle-idr-egp').checked
  };
  adminSettings.rate = {
    egpToIdr: parseFloat(document.getElementById('rate-egp-idr').value) || 355,
    idrToEgp: parseFloat(document.getElementById('rate-idr-egp').value) || 0.0028
  };
  saveAdminSettings();

  // Also sync to global settings for store
  settings = { ...settings, ...adminSettings };
  saveSettings();

  showAdminToast('✅ Pengaturan disimpan', 'success');
}

// ── Drawer helpers ──
function openDrawer(id) {
  document.getElementById(id + '-overlay').classList.add('open');
}

function closeDrawer(id) {
  document.getElementById(id + '-overlay').classList.remove('open');
}

// ── Confirm Dialog ──
function confirmDelete(msg, cb) {
  confirmCallback = cb;
  document.getElementById('confirm-msg').textContent = msg;
  document.getElementById('confirm-overlay').classList.add('open');
}

function confirmYes() {
  if (confirmCallback) confirmCallback();
  confirmCallback = null;
  document.getElementById('confirm-overlay').classList.remove('open');
}

function confirmNo() {
  confirmCallback = null;
  document.getElementById('confirm-overlay').classList.remove('open');
}

// ── Login ──
function adminLogin() {
  const pw = document.getElementById('admin-pw').value;
  if (pw === ADMIN_PASSWORD) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-app').style.display = 'flex';
    adminInit();
  } else {
    document.getElementById('login-error').style.display = 'block';
    document.getElementById('admin-pw').value = '';
  }
}

function adminLogout() {
  document.getElementById('admin-app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-pw').value = '';
  document.getElementById('login-error').style.display = 'none';
}

// ── Keyboard shortcut ──
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('login-screen').style.display !== 'none') {
    adminLogin();
  }
});

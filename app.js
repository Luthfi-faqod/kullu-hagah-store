// ============================================================
// KULLU HAGAH STORE - App Logic
// ============================================================

const SELLER_WA = '6282162607389';

// ── Router ──
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  window.scrollTo(0, 0);
}

// ── Theme ──
function toggleTheme() {
  settings.darkMode = !settings.darkMode;
  saveSettings();
  applyTheme();
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = settings.darkMode ? '☀️' : '🌙';
}

// ── Cart Badge ──
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  const count = getCartCount();
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// ── Toast ──
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

// ── Render Home ──
function renderHome() {
  const wrap = document.getElementById('categories-grid');
  if (!wrap) return;
  wrap.innerHTML = '';

  // Load from admin-overridden data if available
  const adminData = localStorage.getItem('khs_admin_categories');
  const categories = adminData ? JSON.parse(adminData) : STORE_DATA.categories;

  categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `<div class="cat-icon">${cat.icon}</div><div class="cat-name">${cat.name}</div>`;
    card.onclick = () => {
      if (cat.id === 'makanan') {
        showToast('Kategori Makanan segera hadir!');
        return;
      }
      renderSubcategories(cat);
      navigate('subcategory');
    };
    wrap.appendChild(card);
  });
}

// ── Render Subcategories ──
function renderSubcategories(cat) {
  document.getElementById('subcat-title').textContent = cat.name;
  const list = document.getElementById('subcategory-list');
  list.innerHTML = '';

  const adminData = localStorage.getItem('khs_admin_categories');
  const categories = adminData ? JSON.parse(adminData) : STORE_DATA.categories;
  const liveCat = categories.find(c => c.id === cat.id) || cat;

  liveCat.subcategories.forEach(sub => {
    const item = document.createElement('div');
    item.className = 'subcategory-item';
    item.innerHTML = `<span class="sub-name">${sub.name}</span><span class="sub-arrow">›</span>`;
    item.onclick = () => {
      renderProducts(liveCat, sub);
      navigate('products');
    };
    list.appendChild(item);
  });
}

// ── Render Products ──
function renderProducts(cat, sub) {
  document.getElementById('prod-cat-name').textContent = cat.name;
  document.getElementById('prod-sub-name').textContent = sub.name;

  const tbody = document.getElementById('products-tbody');
  tbody.innerHTML = '';

  const adminData = localStorage.getItem('khs_admin_categories');
  const categories = adminData ? JSON.parse(adminData) : STORE_DATA.categories;
  const liveCat = categories.find(c => c.id === cat.id) || cat;
  const liveSub = liveCat.subcategories.find(s => s.id === sub.id) || sub;

  liveSub.products.forEach(prod => {
    const price = getPrice(prod);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="product-highlight">${prod.pulsa} <span>EGP</span></div>
      </td>
      <td>${prod.data}</td>
      <td class="price-egp">${price.egp} EGP</td>
      <td class="price-idr">${formatIDR(price.idr)}</td>
      <td><button class="btn-buy" onclick="openOrderModal(${JSON.stringify({...prod, subName: sub.name, catName: cat.name}).replace(/"/g,'&quot;')})">Beli</button></td>
    `;
    tbody.appendChild(tr);
  });

  // Store nav context
  window._currentCat = cat;
  window._currentSub = sub;
}

// ── Order Modal ──
let currentOrderProduct = null;

function openOrderModal(prod) {
  currentOrderProduct = prod;
  const price = getPrice(prod);

  document.getElementById('modal-prod-name').textContent = `${prod.catName} ${prod.subName} - ${prod.pulsa} EGP`;
  document.getElementById('modal-prod-detail').textContent = `Data: ${prod.data} | Harga: ${price.egp} EGP / IDR ${formatIDR(price.idr)}`;

  // Reset form
  document.getElementById('order-phone').value = '';
  document.getElementById('order-name').value = '';
  document.getElementById('order-address').value = '';
  document.getElementById('order-imaroh').value = '';
  setPayment('tf');
  document.getElementById('cash-form-section').style.display = 'none';

  document.getElementById('order-modal').classList.add('open');
}

function closeOrderModal() {
  document.getElementById('order-modal').classList.remove('open');
}

function setPayment(type) {
  currentOrderProduct._payment = type;
  document.querySelectorAll('.payment-opt').forEach(el => el.classList.remove('selected'));
  document.getElementById('pay-' + type).classList.add('selected');
  document.getElementById('cash-form-section').style.display = type === 'cash' ? 'block' : 'none';
}

function addToCart() {
  const phone = document.getElementById('order-phone').value.trim();
  if (!phone) { showToast('Masukkan nomor telepon Mesir!'); return; }

  const product = { ...currentOrderProduct };
  const price = getPrice(product);

  const cartItem = {
    id: Date.now(),
    productId: product.id,
    name: `${product.catName} ${product.subName}`,
    pulsa: product.pulsa,
    data: product.data,
    price_egp: price.egp,
    price_idr: price.idr,
    phone: phone,
    payment: product._payment || 'tf',
    qty: 1
  };

  if (cartItem.payment === 'cash') {
    cartItem.buyer_name = document.getElementById('order-name').value.trim();
    cartItem.address = document.getElementById('order-address').value.trim();
    const fileInput = document.getElementById('order-imaroh');
    if (fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        cartItem.imaroh_img = e.target.result;
        finalizeAddToCart(cartItem);
      };
      reader.readAsDataURL(fileInput.files[0]);
      return;
    }
  }

  finalizeAddToCart(cartItem);
}

function finalizeAddToCart(cartItem) {
  cart.push(cartItem);
  saveCart();
  updateCartBadge();
  closeOrderModal();
  showToast('✅ Ditambahkan ke keranjang!');
}

// ── Cart Page ──
function renderCart() {
  const wrap = document.getElementById('cart-content');
  if (!wrap) return;

  if (cart.length === 0) {
    wrap.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Keranjang masih kosong</p>
      </div>`;
    return;
  }

  let totalEGP = 0, totalIDR = 0;
  let itemsHTML = '';

  cart.forEach((item, idx) => {
    totalEGP += item.price_egp * item.qty;
    totalIDR += item.price_idr * item.qty;

    itemsHTML += `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">📱 ${item.name} — ${item.pulsa} EGP</div>
          <div class="cart-item-detail">
            Data: ${item.data}<br>
            No. HP: ${item.phone}<br>
            Pembayaran: <strong>${item.payment === 'cash' ? 'Cash' : 'Transfer'}</strong>
            ${item.payment === 'cash' && item.buyer_name ? `<br>Nama: ${item.buyer_name}` : ''}
            ${item.payment === 'cash' && item.address ? `<br>Alamat: ${item.address}` : ''}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
          <div class="cart-item-price">${item.price_egp} EGP</div>
          <button class="cart-item-remove" onclick="removeCartItem(${idx})">🗑️</button>
        </div>
      </div>`;
  });

  wrap.innerHTML = `
    <div class="cart-items">${itemsHTML}</div>
    <div class="cart-summary">
      <div class="cart-total-row">
        <span>Subtotal EGP</span>
        <span>${totalEGP} EGP</span>
      </div>
      <div class="cart-total-row">
        <span>Subtotal IDR</span>
        <span>IDR ${formatIDR(totalIDR)}</span>
      </div>
      <div class="cart-total-row">
        <span>Total Item</span>
        <span>${cart.length} produk</span>
      </div>
    </div>
    <button class="btn-checkout" onclick="checkoutWhatsApp()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.062.522 4.001 1.442 5.695L.054 23.63a.5.5 0 00.612.612l5.935-1.388A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.869 0-3.62-.487-5.144-1.341l-.368-.213-3.824.894.906-3.819-.226-.371A9.95 9.95 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
      Checkout via WhatsApp
    </button>
  `;
}

function removeCartItem(idx) {
  cart.splice(idx, 1);
  saveCart();
  updateCartBadge();
  renderCart();
  showToast('Item dihapus dari keranjang');
}

// ── WhatsApp Checkout ──
function checkoutWhatsApp() {
  if (cart.length === 0) return;

  let msg = '🛍️ *KULLU HAGAH STORE - ORDER BARU*\n';
  msg += '━━━━━━━━━━━━━━━━━━━━\n\n';

  cart.forEach((item, i) => {
    msg += `*Item ${i + 1}:*\n`;
    msg += `📱 Produk: ${item.name} - ${item.pulsa} EGP (${item.data})\n`;
    msg += `📞 Nomor: ${item.phone}\n`;
    msg += `💰 Harga: ${item.price_egp} EGP / IDR ${formatIDR(item.price_idr)}\n`;
    msg += `💳 Pembayaran: ${item.payment === 'cash' ? 'Cash' : 'Transfer'}\n`;
    if (item.payment === 'cash') {
      if (item.buyer_name) msg += `👤 Nama: ${item.buyer_name}\n`;
      if (item.address) msg += `📍 Alamat: ${item.address}\n`;
    }
    msg += '\n';
  });

  const totalEGP = cart.reduce((s, i) => s + i.price_egp * i.qty, 0);
  const totalIDR = cart.reduce((s, i) => s + i.price_idr * i.qty, 0);

  msg += '━━━━━━━━━━━━━━━━━━━━\n';
  msg += `*TOTAL: ${totalEGP} EGP / IDR ${formatIDR(totalIDR)}*\n`;
  msg += '━━━━━━━━━━━━━━━━━━━━\n';
  msg += '_Terima kasih sudah berbelanja di Kullu Hagah Store!_ 🙏';

  const url = `https://wa.me/${SELLER_WA}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');

  // Clear cart after checkout
  setTimeout(() => {
    cart = [];
    saveCart();
    updateCartBadge();
    renderCart();
    showToast('✅ Pesanan berhasil dikirim!');
  }, 1000);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', async () => {
  await getStoreData();
  applyTheme();
  updateCartBadge();
  renderHome();

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.textContent = settings.darkMode ? '☀️' : '🌙';

  // Close modal on overlay click
  document.getElementById('order-modal').addEventListener('click', function(e) {
    if (e.target === this) closeOrderModal();
  });
});

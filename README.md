# 🛍️ Kullu Hagah Store

Toko online untuk pulsa Mesir — dibuat untuk GitHub Pages.

## 📁 Struktur File

```
kullu-hagah-store/
├── index.html          ← Halaman utama toko
├── admin/
│   └── index.html      ← Dashboard admin (akses: /admin/)
├── css/
│   ├── style.css       ← CSS toko utama
│   └── admin.css       ← CSS dashboard admin
└── js/
    ├── firebase-config.js ← Konfigurasi Firebase (NEW)
    ├── data.js         ← Data produk + Firestore manager
    ├── app.js          ← Logika toko
    └── admin.js        ← Logika dashboard admin
```

## 🗄️ Database (Google Firestore)

Website ini sekarang menggunakan **Google Firestore** agar data produk dapat diperbarui secara real-time tanpa perlu edit kode.

### Cara Setup Database (Gratis):
1. Buka [Firebase Console](https://console.firebase.google.com/).
2. Buat project baru (misal: `kullu-hagah-store`).
3. Di menu kiri, pilih **Firestore Database** dan klik **Create database**.
4. Pilih **Start in test mode** agar database bisa diakses untuk pengembangan (atau atur rules produksi nanti).
5. Pilih lokasi server terdekat, lalu klik **Enable**.
6. Buka **Project Settings** (ikon gear) $\rightarrow$ **General**.
7. Di bagian bawah, tambahkan aplikasi baru (ikon `</>` untuk Web app).
8. Salin objek `firebaseConfig` yang muncul, lalu masukkan ke file `js/firebase-config.js` untuk mengganti placeholder yang ada.

## 🚀 Cara Deploy ke GitHub Pages

1. Buat repo baru di GitHub (misal: `kullu-hagah-store`)
2. Upload semua file ini ke repo
3. Buka **Settings → Pages**
4. Source: `Deploy from branch` $\rightarrow$ branch `main` $\rightarrow$ folder `/ (root)`
5. Klik **Save**
6. Website aktif di: `https://[username].github.io/kullu-hagah-store/`

## 🔐 Akses Admin

URL: `https://[username].github.io/kullu-hagah-store/admin/`  
Password: `Nhaf2210`

## 📱 Fitur

- Katalog pulsa (WE, Orange, Vodafone, Etisalat, Wifi Portable, Wifi Ardhi)
- Keranjang belanja dengan localStorage
- Checkout via WhatsApp otomatis
- Dark mode / Light mode
- Dashboard admin: tambah/edit/hapus kategori, sub-kategori, produk (Sinkron dengan Firestore)
- Pengaturan konversi harga EGP ↔ IDR dengan toggle

## 💬 Kontak Penjual

WhatsApp: +6282162607389

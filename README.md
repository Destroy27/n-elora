# N.Elora - Bunga Kawat Bulu Handmade

Landing page untuk **N.Elora**, toko bunga kawat bulu handmade. Dibuat dengan HTML, CSS, dan JavaScript (GSAP untuk animasi), tanpa build tool, sehingga bisa langsung dijalankan dari GitHub Pages.

## Fitur

- Hero dengan animasi GSAP dan hiasan bunga
- Katalog produk (Buket, Bunga Tunggal, Custom) dengan filter
- Foto produk yang bisa diunggah dari halaman admin
- Integrasi WhatsApp untuk pemesanan
- Tombol WhatsApp melayang
- Tampilan responsif untuk HP dan desktop
- Halaman admin untuk harga, modal, jumlah terjual, foto, omzet, dan keuntungan

## Struktur Folder

```
n-elora/
├── index.html
├── admin.html
├── firebase-config.js
├── logo-nelora.png
├── README.md
├── README-firebase.md
└── .gitignore
```

## Halaman Admin

Alamat: `https://destroy27.github.io/n-elora/admin.html`, atau klik tautan **Admin** di bagian bawah halaman utama.

Mode lokal (tanpa Firebase): kata sandi bawaan `findi`. Data tersimpan di browser yang dipakai mengedit saja.

Mode server (dengan Firebase): masuk memakai email dan kata sandi akun admin yang dibuat di Firebase Authentication. Data tersimpan di Firestore, foto di Storage, dan halaman utama membaca data yang sama.

Fitur admin:

- Ubah harga jual, harga modal, dan jumlah terjual langsung dari tabel
- Tambah, edit, dan hapus produk
- Unggah foto produk (otomatis diperkecil menjadi JPEG 900 px)
- Lihat total omzet dan total keuntungan
- Reset ke data default

Rumus keuntungan: `(harga jual - harga modal) x jumlah terjual`.

## Mengaktifkan Sinkronisasi Server

Ikuti `README-firebase.md`. Ringkasnya:

1. Buat proyek Firebase dan aplikasi web.
2. Salin `firebaseConfig` ke `firebase-config.js`.
3. Aktifkan Authentication (Email/Password), Firestore, dan Storage.
4. Pasang aturan keamanan yang disediakan.
5. Buat satu akun admin untuk Findi.

Selama `apiKey` dan `projectId` di `firebase-config.js` masih kosong, situs otomatis berjalan pada mode lokal dan tetap bisa dipakai.

## Cara Menjalankan Lokal

Buka `index.html` langsung di browser, atau jalankan server lokal:

```bash
npx serve .
```

## Kontak

WhatsApp: +62 821-4607-1595

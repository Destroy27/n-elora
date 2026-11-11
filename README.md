# N.Elora - Bunga Kawat Bulu Handmade

Landing page untuk **N.Elora**, toko bunga kawat bulu handmade. Dibuat dengan HTML, CSS, dan JavaScript (GSAP untuk animasi), tanpa build tool, sehingga bisa langsung dijalankan dari GitHub Pages.

## Fitur

- Hero dengan animasi GSAP dan hiasan bunga
- Katalog produk (Buket, Bunga Tunggal, Custom) dengan filter
- Foto produk yang diunggah dari halaman admin
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
├── firebase.json
├── firestore.rules
├── logo-nelora.png
├── README.md
├── README-firebase.md
└── .gitignore
```

## Halaman Admin

Alamat: `https://destroy27.github.io/n-elora/admin.html`, atau klik tautan **Admin** di bagian bawah halaman utama.

Admin memakai akun Firebase Authentication. Akun dibuat oleh pemilik proyek lewat konsol Firebase, bukan lewat halaman web. Jangan pernah menaruh kata sandi di dalam kode atau di repositori.

Fitur admin:

- Ubah harga jual, harga modal, dan jumlah terjual langsung dari tabel
- Tambah, edit, dan hapus produk
- Unggah foto produk, otomatis diperkecil menjadi JPEG 640 px
- Lihat total omzet dan total keuntungan
- Reset ke data default

Rumus keuntungan: `(harga jual - harga modal) x jumlah terjual`.

## Data

Data produk disimpan di **Cloud Firestore**, koleksi `produk`. Foto disimpan langsung di dalam dokumen sebagai teks `data:image/jpeg;base64,...` yang sudah diperkecil, sehingga tidak memerlukan Cloud Storage yang berbayar.

Aturan keamanan ada di `firestore.rules`: semua orang boleh membaca, hanya pengguna yang sudah login yang boleh menulis.

## Cara Menjalankan Lokal

Buka `index.html` langsung di browser, atau jalankan server lokal:

```bash
npx serve .
```

## Kontak

WhatsApp: +62 821-4607-1595

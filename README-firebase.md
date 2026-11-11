# Panduan Firebase N.Elora

Dokumen ini menjelaskan keadaan proyek Firebase N.Elora dan cara merawatnya.

## Status proyek

| Hal | Keterangan |
|---|---|
| Proyek Firebase | `nelora-b735c` |
| Konfigurasi web | `firebase-config.js` (sudah terisi) |
| Database | Cloud Firestore, lokasi `asia-southeast2` (Jakarta) |
| Login admin | Firebase Authentication, metode Email/Password |
| Foto produk | Disimpan di dalam dokumen Firestore, bukan Cloud Storage |
| Aturan keamanan | `firestore.rules` |
| Halaman admin | `https://destroy27.github.io/n-elora/admin.html` |
| Domain diizinkan | `localhost`, `nelora-b735c.firebaseapp.com`, `nelora-b735c.web.app`, `destroy27.github.io` |

## Struktur data

Koleksi Firestore: `produk`. Setiap dokumen berisi:

| Field | Tipe | Keterangan |
|---|---|---|
| nama | string | nama produk |
| kategori | string | buket, tunggal, atau custom |
| emoji | string | cadangan bila foto kosong |
| desc | string | deskripsi singkat |
| badge | string | Best Seller, Favorit, dan sebagainya |
| harga | number | harga jual dalam rupiah, tanpa titik |
| cost | number | harga modal dalam rupiah |
| sold | number | jumlah terjual |
| foto | string | foto JPEG yang sudah diperkecil, berbentuk data URL |
| urutan | number | penanda urutan tampil |

Batas satu dokumen Firestore adalah 1 MB. Karena itu foto diperkecil menjadi JPEG 640 px dengan mutu 0,72 sebelum disimpan, sehingga satu produk biasanya hanya 20 sampai 60 KB.

## Aturan keamanan

Isi `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /produk/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Artinya pengunjung boleh melihat katalog, tetapi hanya admin yang sudah login yang boleh menambah, mengubah, atau menghapus produk.

Untuk menerbitkan aturan setelah diubah:

```bash
npx firebase-tools deploy --only firestore:rules --project nelora-b735c
```

## Mengelola akun admin

1. Buka https://console.firebase.google.com/project/nelora-b735c/authentication/users
2. Untuk menambah admin baru, klik **Add user**, isi email dan kata sandi.
3. Untuk mengganti kata sandi, klik ikon titik tiga pada baris pengguna, pilih **Reset password**.
4. Untuk menghapus akses, hapus pengguna dari daftar.

Jangan menaruh kata sandi di dalam kode, di README, atau di repositori publik.

## Mengisi atau mengosongkan katalog

- Untuk mengisi enam produk contoh, masuk ke admin lalu klik **Reset Default**. Tindakan ini menghapus semua produk yang ada di Firestore lalu menulis ulang katalog awal.
- Untuk menambah produk, klik **+ Tambah Produk**, isi data, unggah foto, lalu **Simpan**.
- Untuk menghapus produk, klik **Hapus** pada baris produk.

## Catatan tentang Cloud Storage

Cloud Storage for Firebase sekarang mewajibkan paket Blaze yang memerlukan kartu kredit, walaupun pemakaian kecil tetap gratis. Karena itu foto disimpan di Firestore agar biayanya nol.

Kalau nanti ingin pindah ke Cloud Storage, langkahnya: aktifkan Blaze, buat bucket, unggah foto ke sana, lalu ganti isi field `foto` dengan URL unduhan. Kode halaman utama tidak perlu diubah karena field `foto` bisa berisi URL maupun data URL.

## Perawatan berkala

- Periksa kuota gratis Firestore di https://console.firebase.google.com/project/nelora-b735c/firestore/usage
- Periksa daftar pengguna admin secara berkala, hapus akun yang tidak dipakai.
- Bila harga terlihat tidak berubah di perangkat tertentu, muat ulang halaman tanpa cache (Ctrl + F5).

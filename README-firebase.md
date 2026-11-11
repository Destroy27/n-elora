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
| kategori | string | slug jenis produk, misalnya buket, tunggal, atau custom |
| emoji | string | cadangan bila foto kosong |
| desc | string | deskripsi singkat |
| badge | string | Best Seller, Favorit, dan sebagainya |
| harga | number | harga jual dalam rupiah, tanpa titik |
| cost | number | harga modal dalam rupiah |
| sold | number | jumlah terjual |
| foto | string | foto JPEG yang sudah diperkecil, berbentuk data URL |
| urutan | number | penanda urutan tampil |

Koleksi Firestore: `kategori`. Setiap dokumen berisi:

| Field | Tipe | Keterangan |
|---|---|---|
| nama | string | nama jenis produk yang tampil di filter dan kartu kategori |
| slug | string | kode unik, dipakai produk pada field `kategori` |
| desc | string | deskripsi di balik kartu kategori |
| foto | string | foto cover opsional, berbentuk data URL |
| urutan | number | penanda urutan tampil |

Jenis produk bisa ditambah dan diubah langsung dari halaman admin. Sebuah jenis tidak dapat dihapus selama masih ada produk yang memakainya. Saat pertama dibuka, admin otomatis membuat tiga jenis awal: `buket`, `tunggal`, dan `custom`.

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
    match /kategori/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Artinya pengunjung boleh melihat katalog dan daftar jenis produk, tetapi hanya admin yang sudah login yang boleh menambah, mengubah, atau menghapusnya.

Untuk menerbitkan aturan setelah diubah:

```bash
npx firebase-tools deploy --only firestore:rules --project nelora-b735c
```

## Mengelola akun admin

Buka https://console.firebase.google.com/project/nelora-b735c/authentication/users

- Menambah admin baru: klik **Add user**, isi email dan kata sandi.
- Menghapus akses: hapus pengguna dari daftar. Akun yang tidak dipakai sebaiknya langsung dihapus, karena aturan Firestore mengizinkan setiap akun yang berhasil login untuk menulis data.

### Mengganti kata sandi

Ada dua jalan, pilih salah satu.

**Cara 1, dari Firebase Console.** Klik ikon titik tiga pada baris pengguna, pilih **Reset password**. Firebase mengirim tautan reset ke email tersebut, jadi cara ini hanya berhasil bila kotak masuk emailnya benar-benar bisa dibuka.

**Cara 2, dengan skrip lokal.** Cara ini tidak perlu email aktif. Jalankan dari folder `n-elora`:

```bash
node ganti-password.js daftar
node ganti-password.js ganti admin@nelora.id "SandiBaruYangKuat"
```

Skrip mencari berkas service account di folder `Downloads`, atau terima path-nya sebagai argumen ketiga. Setelah kata sandi diganti, buka Firebase Console, menu akun, pilih **Revoke refresh tokens** agar sesi lama di perangkat lain langsung diputus.

Berkas service account bersifat sangat rahasia. Jangan pernah diunggah ke GitHub, dan setelah selesai dipakai sebaiknya dihapus, lalu cabut peran akun layanan tersebut di Google Cloud IAM.

Jangan menaruh kata sandi di dalam kode, di README, atau di repositori publik.

## Mengamankan repositori GitHub

Repositori `Destroy27/n-elora` bersifat publik. Siapa pun boleh melihat dan mengunduh kode, tetapi hanya pemilik dan kolaborator yang boleh mengubahnya.

Yang sudah dipasang:

- Aturan cabang **Lindungi main**: `main` tidak bisa dihapus dan tidak bisa di-*force push*. Riwayat kode tidak dapat ditimpa diam-diam.
- **Secret scanning** dan **push protection** aktif: GitHub menolak unggahan yang berisi kunci API atau kredensial yang dikenali.

Yang perlu dijaga sendiri:

1. Aktifkan dua langkah (2FA) di https://github.com/settings/security. Pakai aplikasi autentikator atau passkey, bukan hanya SMS.
2. Periksa perangkat yang masih login di https://github.com/settings/sessions, keluarkan yang tidak dikenal.
3. Periksa daftar kolaborator di https://github.com/Destroy27/n-elora/settings/access. Harus hanya akun sendiri.
4. Periksa kunci SSH dan token akses di https://github.com/settings/keys dan https://github.com/settings/tokens. Hapus yang tidak dipakai.
5. Jangan pernah menaruh berkas service account, `.env`, atau kata sandi di dalam repositori. `.gitignore` sudah menolak pola nama yang umum.
6. Amankan akun Google pemilik proyek Firebase dengan 2FA. Kunci proyek sebenarnya ada di akun Google itu, bukan di repositori.

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

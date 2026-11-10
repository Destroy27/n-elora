# Panduan Firebase N.Elora

Panduan ini untuk mengaktifkan mode server, supaya perubahan di halaman admin langsung terlihat di halaman utama pada semua perangkat, bukan hanya di browser yang dipakai mengedit.

## Status proyek

- Proyek Firebase: `nelora-b735c` (sudah dibuat, konfigurasi sudah terpasang di `firebase-config.js`).
- Yang masih perlu diselesaikan: Authentication Email/Password, akun admin, Firestore, Storage, dan aturan keamanan.

## 1. Buat proyek Firebase

1. Buka https://console.firebase.google.com lalu masuk dengan akun Google.
2. Klik **Add project**, beri nama `nelora`, lanjutkan sampai selesai. Google Analytics boleh dimatikan.
3. Di halaman proyek, klik ikon **Web** `</>` untuk menambah aplikasi, beri nama `nelora-web`, lalu daftar.
4. Firebase menampilkan objek `firebaseConfig`. Salin nilainya.

## 2. Isi konfigurasi

Buka berkas `firebase-config.js`, lalu ganti bagian kosong dengan hasil salinan tadi:

```js
window.NELORA_FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "nelora-xxxx.firebaseapp.com",
  projectId: "nelora-xxxx",
  storageBucket: "nelora-xxxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};
```

Selama `apiKey` dan `projectId` masih kosong, situs berjalan pada mode lokal (data hanya di browser).

## 3. Aktifkan layanan

### Authentication

1. Menu **Build > Authentication > Get started**.
2. Tab **Sign-in method**, aktifkan **Email/Password**.
3. Tab **Users**, klik **Add user**, isi email Findi dan kata sandi rahasia. Akun inilah yang dipakai masuk ke halaman admin.

### Firestore Database

1. Menu **Build > Firestore Database > Create database**.
2. Pilih **Production mode**, lokasi `asia-southeast2` (Jakarta).
3. Buka tab **Rules**, tempel aturan berikut, lalu **Publish**:

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

Artinya: siapa pun boleh melihat daftar produk, tetapi hanya admin yang sudah login yang boleh menambah, mengubah, atau menghapus.

### Storage

1. Menu **Build > Storage > Get started**, pilih Production mode.
2. Tab **Rules**, tempel aturan berikut, lalu **Publish**:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /foto-produk/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 4. Struktur data

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
| foto | string | URL foto dari Firebase Storage |
| urutan | number | penanda urutan tampil |

Foto diunggah ke `foto-produk/` di Storage, lalu URL-nya disimpan pada field `foto`.

## 5. Cara memakai

1. Buka `admin.html` di situs.
2. Masuk dengan email dan kata sandi yang dibuat pada langkah 3.
3. Ubah harga, modal, atau jumlah terjual. Setiap perubahan langsung ditulis ke Firestore.
4. Untuk produk baru, klik **+ Tambah Produk**, unggah foto, lalu Simpan.
5. Buka halaman utama. Data diambil dari Firestore saat halaman dimuat, jadi pengunjung melihat harga terbaru setelah memuat ulang halaman.

## 6. Catatan keamanan

- Kunci `apiKey` pada konfigurasi web Firebase memang bersifat publik. Yang melindungi data adalah aturan keamanan di atas dan login Authentication.
- Jangan pernah memakai aturan `allow write: if true`, karena siapa pun bisa mengubah harga.
- Kata sandi bawaan `findi` pada mode lokal tidak dipakai lagi setelah mode server aktif, karena login memakai akun Firebase.
- Bila Findi lupa kata sandi, atur ulang lewat menu Authentication > Users.

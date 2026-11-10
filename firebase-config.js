/* ============================================================
   KONFIGURASI FIREBASE N.Elora
   ------------------------------------------------------------
   Cara mengisi:
   1. Buka https://console.firebase.google.com lalu buat proyek baru,
      misalnya "nelora".
   2. Di halaman proyek, klik ikon Web (</>) untuk menambah aplikasi,
      beri nama "nelora-web".
   3. Firebase menampilkan objek firebaseConfig. Salin isinya ke
      bawah ini, ganti semua tulisan "ISI_...".
   4. Aktifkan produk berikut di menu Build:
      - Authentication > Sign-in method > Email/Password
      - Firestore Database (mode production, lokasi asia-southeast2)
      - Storage
   5. Buat satu akun admin di Authentication > Users > Add user,
      misalnya email Findi dan kata sandi rahasia.
   6. Tempel aturan keamanan dari README-firebase.md.

   Selama apiKey dan projectId masih kosong, situs tetap berjalan
   dengan penyimpanan lokal di browser (mode uji).
   ============================================================ */

window.NELORA_FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

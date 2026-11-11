/* ============================================================
   GANTI KATA SANDI ADMIN N.Elora
   ------------------------------------------------------------
   Skrip sekali pakai untuk melihat akun admin dan mengganti
   kata sandinya lewat Firebase Admin API, tanpa perlu kirim
   email reset dan tanpa membuka Firebase Console.

   Syarat: Node.js sudah terpasang dan berkas service account
   (kunci admin SDK) masih ada di komputer.

   Cara pakai (jalankan dari folder n-elora):
     node ganti-password.js daftar
     node ganti-password.js ganti admin@nelora.id "SandiBaru123!"

   Berkas kunci dibaca dari folder Downloads secara default,
   atau berikan sebagai argumen ketiga:
     node ganti-password.js ganti email@contoh.com "SandiBaru" "D:\path\kunci.json"

   PENTING: berkas kunci ini setara kata sandi utama proyek.
   Jangan pernah diunggah ke GitHub. Setelah selesai dipakai,
   hapus berkasnya dan cabut perannya di Google Cloud IAM.
   ============================================================ */

const fs = require("fs");
const path = require("path");
const os = require("os");
const https = require("https");
const crypto = require("crypto");

const PERINTAH = (process.argv[2] || "").toLowerCase();
const ARG_EMAIL = process.argv[3] || "";
const ARG_SANDI = process.argv[4] || "";
const ARG_KUNCI = process.argv[5] || "";

function cariKunci() {
  if (ARG_KUNCI) return ARG_KUNCI;
  const unduhan = path.join(os.homedir(), "Downloads");
  if (!fs.existsSync(unduhan)) return "";
  const cocok = fs.readdirSync(unduhan)
    .filter(n => /firebase-adminsdk.*\.json$/i.test(n))
    .map(n => path.join(unduhan, n))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  return cocok[0] || "";
}

function minta(url, opsi, badan) {
  return new Promise((selesai, gagal) => {
    const req = https.request(url, opsi, res => {
      let teks = "";
      res.on("data", d => { teks += d; });
      res.on("end", () => {
        let data = teks;
        try { data = JSON.parse(teks); } catch (e) {}
        if (res.statusCode >= 200 && res.statusCode < 300) selesai(data);
        else gagal(new Error("HTTP " + res.statusCode + ": " + teks.slice(0, 300)));
      });
    });
    req.on("error", gagal);
    if (badan) req.write(badan);
    req.end();
  });
}

function base64url(b) {
  return Buffer.from(b).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function ambilToken(kunci) {
  const sekarang = Math.floor(Date.now() / 1000);
  const isi = {
    iss: kunci.client_email,
    scope: "https://www.googleapis.com/auth/identitytoolkit https://www.googleapis.com/auth/firebase",
    aud: "https://oauth2.googleapis.com/token",
    iat: sekarang,
    exp: sekarang + 3600
  };
  const tanpaTanda = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" })) + "." + base64url(JSON.stringify(isi));
  const tanda = crypto.createSign("RSA-SHA256").update(tanpaTanda).sign(kunci.private_key);
  const jwt = tanpaTanda + "." + base64url(tanda);
  const badan = "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=" + encodeURIComponent(jwt);
  const hasil = await minta("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(badan) }
  }, badan);
  return hasil.access_token;
}

async function daftarAkun(token, projectId) {
  const url = "https://identitytoolkit.googleapis.com/v1/projects/" + projectId + "/accounts:batchGet?maxResults=200";
  const hasil = await minta(url, { method: "GET", headers: { Authorization: "Bearer " + token } });
  const akun = hasil.users || [];
  if (!akun.length) {
    console.log("Belum ada akun di Firebase Authentication.");
    return akun;
  }
  console.log("Akun yang terdaftar (" + akun.length + "):");
  akun.forEach((u, i) => {
    const masuk = u.lastLoginAt ? new Date(Number(u.lastLoginAt)).toLocaleString("id-ID") : "belum pernah";
    console.log("  " + (i + 1) + ". " + u.email + "  |  uid " + u.localId + "  |  login terakhir " + masuk);
  });
  return akun;
}

async function gantiSandi(token, projectId, email, sandi) {
  if (!email || !sandi) {
    console.log("Contoh: node ganti-password.js ganti admin@nelora.id \"SandiBaru123!\"");
    process.exit(1);
  }
  if (sandi.length < 8) {
    console.log("Kata sandi minimal 8 karakter.");
    process.exit(1);
  }
  const akun = await daftarAkun(token, projectId);
  const target = akun.find(u => (u.email || "").toLowerCase() === email.toLowerCase());
  if (!target) {
    console.log("Akun dengan email " + email + " tidak ditemukan.");
    process.exit(1);
  }
  const badan = JSON.stringify({ localId: target.localId, password: sandi });
  await minta("https://identitytoolkit.googleapis.com/v1/projects/" + projectId + "/accounts:update", {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(badan) }
  }, badan);
  console.log("Kata sandi untuk " + target.email + " berhasil diganti.");
  console.log("Sesi login lama di perangkat lain akan tetap aktif sampai kedaluwarsa.");
  console.log("Untuk memutus semuanya, buka Firebase Console > Authentication > Users > menu akun > Revoke refresh tokens.");
}

(async () => {
  const jalur = cariKunci();
  if (!jalur || !fs.existsSync(jalur)) {
    console.log("Berkas service account tidak ditemukan.");
    console.log("Unduh dari Firebase Console > Project settings > Service accounts > Generate new private key,");
    console.log("lalu jalankan lagi dengan argumen ketiga berisi path berkas tersebut.");
    process.exit(1);
  }
  const kunci = JSON.parse(fs.readFileSync(jalur, "utf8"));
  console.log("Proyek: " + kunci.project_id);
  console.log("Kunci : " + path.basename(jalur));
  console.log("");
  const token = await ambilToken(kunci);
  if (PERINTAH === "daftar") {
    await daftarAkun(token, kunci.project_id);
  } else if (PERINTAH === "ganti") {
    await gantiSandi(token, kunci.project_id, ARG_EMAIL, ARG_SANDI);
  } else {
    console.log("Perintah yang tersedia:");
    console.log("  node ganti-password.js daftar");
    console.log("  node ganti-password.js ganti email@contoh.com \"SandiBaru123!\"");
  }
})().catch(err => {
  console.log("Gagal: " + err.message);
  process.exit(1);
});

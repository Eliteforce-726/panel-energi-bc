# Panel Kontrol Energi — Buona Cita

Dashboard web (Firebase Realtime Database + Authentication) untuk panel ATS/SDP.
Repo ini sudah disiapkan sebagai **PWA** (Progressive Web App) supaya bisa:
- dibuka langsung sebagai halaman web,
- di-"Instal" ke layar utama HP dari Chrome (tanpa APK),
- dan dibungkus jadi file **.apk** lewat PWABuilder.com (lihat langkah 4).

## Isi folder

```
index.html        <- dashboard utama (sebelumnya bernama DASHBOARD_BC.html)
manifest.json      <- identitas app (nama, ikon, warna tema) untuk PWA
sw.js               <- service worker minimal, syarat wajib PWA bisa "diinstal"
vercel.json        <- header cache khusus supaya sw.js & manifest.json selalu versi terbaru
icons/              <- ikon app (beberapa ukuran + versi "maskable" untuk Android)
```

## 1. Push ke GitHub

```bash
cd panel-kontrol-energi         # folder hasil ekstrak repo ini
git init
git add .
git commit -m "Dashboard Panel Kontrol Energi + PWA"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

(Atau lewat GitHub Desktop / upload manual di github.com kalau tidak familiar dengan command line — tinggal drag semua file ke repo baru di web GitHub.)

## 2. Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → **Add New → Project**.
2. Pilih **Import Git Repository**, sambungkan akun GitHub, pilih repo ini.
3. Framework Preset: pilih **Other** (situs statis biasa, tidak ada proses build).
4. Root Directory: biarkan default (`.`) karena `index.html` ada di root repo.
5. Klik **Deploy**. Dalam ~30 detik dapat URL `https://nama-project.vercel.app`.

## 3. Tambahkan domain Vercel ke Firebase

Supaya Login (email/password) & Realtime Database bisa diakses dari domain Vercel:

- **Firebase Console → Authentication → Settings → Authorized domains** → tambahkan
  `nama-project.vercel.app` (domain Vercel yang didapat di langkah 2).

Tanpa ini, Firebase Auth akan menolak proses daftar/masuk dari domain baru.

## 4. Ubah jadi file APK (opsional, lewat PWABuilder — gratis, tanpa coding)

1. Buka [pwabuilder.com](https://www.pwabuilder.com).
2. Tempel URL Vercel Anda (`https://nama-project.vercel.app`), klik **Start**.
3. Tunggu penilaian selesai (manifest & service worker sudah disiapkan di repo ini, jadi biasanya langsung lolos).
4. Klik tab **Android → Generate Package**. Pilih **Signing key: Generate new** kalau belum punya keystore sendiri.
5. Unduh file `.apk` yang dihasilkan, lalu bagikan ke petugas untuk dipasang (aktifkan "Izinkan sumber tidak dikenal" di HP Android saat memasang pertama kali).

Catatan: karena dashboard ini bergantung pada Firebase (data real-time, login, notifikasi alarm),
APK hasilnya tetap **butuh koneksi internet** seperti versi webnya — ini normal, bukan app offline.

## 5. Update berikutnya

Setiap kali `git push` ke branch `main`, Vercel otomatis build ulang & deploy versi terbaru —
tidak perlu generate ulang APK setiap kali update dashboard, karena APK dari PWABuilder
hanya membungkus URL (Trusted Web Activity), isinya selalu mengikuti yang live di Vercel.

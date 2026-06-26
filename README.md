# Draft Pick Frontend

**Live App (Vercel):** [https://front-draftpick.vercel.app](https://front-draftpick.vercel.app)

Aplikasi *frontend* berbasis React + Vite untuk simulasi *Draft Pick* karakter (seperti pada game MOBA/Genshin Impact). Proyek ini dibangun menggunakan antarmuka modern dengan *Atomic Design* dan *TailwindCSS*.

## 🚀 Fitur Utama
- **Sistem Autentikasi**: Perlindungan sesi dengan token JWT dan *Role-Based Access Control*.
- **Manajemen Master Data**: Kelola data Karakter, Peserta, BGM, dan Pengaturan. Dilengkapi dengan **Data Table** 8 Kolom (Fitur Pencarian, Filter Bintang 4/5).
- **Draft Pick Simulator**: Fitur simulasi Ban & Pick interaktif dengan hitung mundur waktu.
- **Cetak Laporan (PDF)**: Cetak hasil akhir susunan formasi pertandingan secara otomatis ke PDF.

## 🛠️ Prasyarat
- Node.js (v18 atau lebih baru)
- Repositori Backend yang sedang berjalan

## ⚙️ Instalasi & Menjalankan di Lokal

1. Buka folder ini di terminal.
2. Jadikan file `.env.example` sebagai `.env` dan sesuaikan nilainya:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   VITE_API_TIMEOUT=10000
   ```
3. Instal semua paket *dependencies*:
   ```bash
   npm install
   ```
4. Jalankan *server* lokal:
   ```bash
   npm run dev
   ```
5. Buka `http://localhost:5173` di *browser* Anda.

## 📦 Panduan Deployment (Vercel)
Aplikasi ini dioptimalkan untuk di-*deploy* melalui **Vercel**.
1. Hubungkan repositori GitHub Anda ke Vercel.
2. Tambahkan **Environment Variable**: `VITE_API_BASE_URL` yang diisi dengan URL *Backend* Railway Anda (yaitu: `https://backdraftpick-production.up.railway.app`).
3. Vercel akan otomatis melakukan *build* dan aplikasi Anda siap dipakai secara publik!

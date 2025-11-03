# Resep Nusantara

Aplikasi web modern untuk menemukan resep masakan dan minuman khas Indonesia. Dibangun sebagai Progressive Web App (PWA), aplikasi ini dapat diinstal di perangkat Anda dan berfungsi penuh bahkan saat offline.

## Memulai Proyek

Pastikan Anda sudah menginstal Node.js di sistem Anda (disarankan v18+).

### Buat Proyek React dengan Vite
Buka terminal di lokasi folder yang Anda inginkan, lalu jalankan perintah ini untuk membuat proyek baru.

```bash
npm create vite@latest resep-nusantara -- --template react
```
lalu masuk ke direktory proyek

```bash
cd resep-nusantara
```
### Instalasi Semua Dependensi

```bash
npm install lucide-react

npm install -D vite-plugin-pwa

npm install tailwindcss @tailwindcss/vite
```
### Mulai Koding

Setup awal selesai! Sekarang Anda bisa mulai membuat struktur folder (src/components, src/pages, src/data) dan mengisi file-file kode seperti HomePage.jsx, makanan.js, dan lainnya.

### Mode Pengembangan

```bash
npm run dev
```

### Mode Produksi

```bash
npm run build
```

### Pengujian PWA di Mobile

#### Bangun aplikasi dengan perintah npm run build

#### install serve untuk menjalankan folder dist hasil build

```bash
npm install -g serve
```

#### jalankan server produksi

```bash
serve -s dist
```
Perhatikan alamat Network yang muncul di terminal (misal: http://192.168.1.10:3000).

Akses dari HP Anda:

Pastikan laptop dan HP Anda terhubung ke jaringan Wi-Fi yang sama.

Buka browser Chrome di HP Anda dan ketikkan alamat Network tadi.

Aplikasi akan terbuka, dan Anda akan melihat opsi untuk menginstalnya

## Optimasi Gambar (Lazy Load + Sequential Fetch)

Aplikasi ini menggunakan komponen `LazyImage` (`src/components/common/LazyImage.jsx`) untuk mengoptimalkan pemuatan gambar:

- Lazy load dengan IntersectionObserver dan atribut native `loading="lazy"`.
- Antrian global dengan concurrency 1 sehingga gambar diunduh satu per satu (menghindari burst jaringan).
- Dukungan gambar prioritas dengan prop `eager` untuk konten kritikal (mis. logo navbar), yang akan memuat segera dan melewati antrian.

Contoh penggunaan:

```jsx
import LazyImage from "./components/common/LazyImage";

// Lazy + ikut antrian (default)
<LazyImage src={recipe.image_url} alt={recipe.name} className="w-full h-56 object-cover" />

// Prioritas tinggi (melewati antrian, memuat segera)
<LazyImage src={logoUrl} alt="Logo" eager className="w-12 h-12" />
```

Cara cek di DevTools Network (Chrome):

1. Buka halaman daftar resep atau favorit yang banyak gambar.
2. Buka DevTools (F12) → tab Network.
3. Centang “Disable cache”.
4. Reload halaman dan scroll perlahan.
5. Lihat kolom Waterfall: permintaan gambar akan berjalan berurutan (satu selesai, berikutnya mulai). Gambar dengan `eager` akan muncul terlebih dahulu di awal.


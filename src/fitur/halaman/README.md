# 🏫 Portal Sekolah SMP Negeri 1 Majenang

> Aplikasi portal informasi sekolah berbasis React + TypeScript + Tailwind CSS.  
> Berisi 10 halaman menu dengan navigasi interaktif dan template foto siap ganti.

---

## 📋 Daftar Isi

- [Struktur Project](#-struktur-project)
- [Cara Install & Menjalankan](#-cara-install--menjalankan)
- [Daftar Menu / Halaman](#-daftar-menu--halaman)
- [Tata Cara Ganti Foto](#-tata-cara-ganti-foto)
  - [Beranda (Hero Slider)](#1-beranda-hero-slider)
  - [Beranda (Info Kegiatan)](#2-beranda-info-kegiatan)
  - [Program Keahlian](#3-program-keahlian)
  - [Sarana Prasarana](#4-sarana-prasarana)
  - [Kegiatan Sekolah](#5-kegiatan-sekolah)
  - [Berita](#6-berita)
  - [Galeri](#7-galeri)
  - [Profil (Logo & Kepala Sekolah)](#8-profil-logo--kepala-sekolah)
- [Tata Cara Edit Konten Teks](#-tata-cara-edit-konten-teks)
- [Tata Cara Tambah Menu Baru](#-tata-cara-tambah-menu-baru)
- [Daftar File & Fungsinya](#-daftar-file--fungsinya)
- [Catatan Penting](#-catatan-penting)

---

## 📁 Struktur Project

```
projeck-portal-siswa/
├── public/
│   └── images/
│       ├── Dashboard/
│       │   ├── sekolah-1.jpg      ← Hero slide 1
│       │   ├── sekolah-2.jpg      ← Hero slide 2
│       │   ├── sekolah-3.jpg      ← Hero slide 3
│       │   ├── sekolah-4.jpg      ← Hero slide 4
│       │   ├── sekolah-5.jpg      ← Kegiatan / Event
│       │   ├── sekolah-6.jpg      ← Kegiatan / Event
│       │   ├── sekolah-7.jpg      ← Kegiatan / Event
│       │   ├── sekolah-8.jpg      ← Kegiatan / Event
│       │   ├── sekolah-9.jpg      ← Kegiatan / Event
│       │   ├── sekolah-10.jpg     ← Kegiatan / Event
│       │   ├── sekolah-11.jpg     ← Ekskul
│       │   ├── sekolah-12.jpg     ← Ekskul
│       │   ├── sekolah-13.jpg     ← Ekskul
│       │   ├── sekolah-14.jpg     ← Ekskul
│       │   └── sekolah-15.jpg     ← Ekskul
│       ├── logo/
│       │   └── gambar-2.svg       ← Logo sekolah (header)
│       ├── smp.png                ← Logo sekolah (halaman Profil)
│       └── pegawai/
│           └── kepala-sekolah.jpg  ← Foto kepala sekolah
│
├── src/
│   ├── data.ts                    ← Data teks (nav, intro, berita, kegiatan)
│   ├── types.ts                   ← TypeScript interfaces
│   ├── ExpectationModal.tsx       ← Modal utama + navigasi menu
│   └── pages/
│       ├── BerandaPage.tsx        ← Halaman beranda
│       ├── ProfilPage.tsx         ← Halaman profil sekolah
│       ├── ProgramSekolahPage.tsx   ← Halaman program sekolah
│       ├── ProgramKeahlianPage.tsx  ← Halaman jurusan
│       ├── GtkSiswaPage.tsx       ← Halaman data guru & siswa
│       ├── SaranaPrasaranaPage.tsx  ← Halaman fasilitas
│       ├── KegiatanSekolahPage.tsx  ← Halaman agenda & ekskul
│       ├── BeritaPage.tsx         ← Halaman berita
│       ├── GaleriPage.tsx         ← Halaman galeri foto
│       └── KontakPage.tsx         ← Halaman kontak & form
│
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Cara Install & Menjalankan

### 1. Install Dependensi

```bash
npm install
```

### 2. Jalankan Mode Development

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### 3. Build untuk Production

```bash
npm run build
```

Hasil build ada di folder `dist/`.

---

## 📑 Daftar Menu / Halaman

| No | Menu | File | Keterangan |
|----|------|------|------------|
| 1 | **Beranda** | `BerandaPage.tsx` | Hero slider, prakata, berita, kegiatan |
| 2 | **Profil** | `ProfilPage.tsx` | Visi-misi, sambutan kepala sekolah, struktur |
| 3 | **Program Sekolah** | `ProgramSekolahPage.tsx` | 5 program unggulan |
| 4 | **Program Keahlian** | `ProgramKeahlianPage.tsx` | 6 jurusan dengan foto |
| 5 | **GTK & Siswa** | `GtkSiswaPage.tsx` | Statistik guru & siswa |
| 6 | **Sarana Prasarana** | `SaranaPrasaranaPage.tsx` | 8 fasilitas dengan foto |
| 7 | **Kegiatan Sekolah** | `KegiatanSekolahPage.tsx` | 5 agenda + 10 ekskul dengan foto |
| 8 | **Berita** | `BeritaPage.tsx` | 4 berita dengan foto |
| 9 | **Galeri** | `GaleriPage.tsx` | 9 album foto |
| 10 | **Kontak** | `KontakPage.tsx` | Info kontak + form pesan |

---

## 🖼️ Tata Cara Ganti Foto

> **Lokasi folder foto:** `public/images/Dashboard/`
> 
> **Format yang didukung:** JPG, JPEG, PNG, SVG, WEBP
> 
> **Ukuran rekomendasi:** 800x600px atau 16:9 (landscape)

---

### 1. Beranda (Hero Slider)

**File yang digunakan:**
- `sekolah-1.jpg` → Slide 1
- `sekolah-2.jpg` → Slide 2
- `sekolah-3.jpg` → Slide 3
- `sekolah-4.jpg` → Slide 4

**Cara ganti:**

1. Siapkan 4 foto sekolah (ukuran sama, landscape)
2. Copy ke folder: `public/images/Dashboard/`
3. **Ganti nama file** jadi:
   ```
   sekolah-1.jpg
   sekolah-2.jpg
   sekolah-3.jpg
   sekolah-4.jpg
   ```
4. **Timpa (replace)** file lama
5. Refresh browser (tekan `F5`)

**Kode di `BerandaPage.tsx` (baris 9-24):**
```tsx
const slides = [
  { src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.jpg`, alt: "Foto Sekolah 1" },
  { src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-2.jpg`, alt: "Foto Sekolah 2" },
  { src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-3.jpg`, alt: "Foto Sekolah 3" },
  { src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-4.jpg`, alt: "Foto Sekolah 4" },
];
```

> 💡 **Tips:** Jika mau tambah slide ke-5, copy baris baru dan tambah `sekolah-5.jpg`, lalu ubah `slides.length` otomatis terhitung.

---

### 2. Beranda (Info Kegiatan)

**File yang digunakan:**
- `sekolah-1.jpg` → Kegiatan 1
- `sekolah-2.jpg` → Kegiatan 2
- `sekolah-3.jpg` → Kegiatan 3

**Cara ganti:**

1. Siapkan 3 foto kegiatan sekolah
2. Copy ke folder: `public/images/Dashboard/`
3. Ganti nama file jadi `sekolah-1.jpg`, `sekolah-2.jpg`, `sekolah-3.jpg`
4. Timpa file lama
5. Refresh browser

**Kode di `data.ts` (baris 45-60):**
```tsx
export const activityItems: ActivityItem[] = [
  {
    title: 'Apel Pagi memperingati HUT PRAMUKA ke-55...',
    desc: 'Kegiatan apel pagi...',
    image: 'images/Dashboard/sekolah-1.jpg',  ← GANTI DI SINI
  },
  {
    title: 'Upacara Hari Senin Pagi...',
    desc: 'Kegiatan upacara...',
    image: 'images/Dashboard/sekolah-2.jpg',  ← GANTI DI SINI
  },
  {
    title: 'Pameran Produk Inovasi...',
    desc: 'SMK Negeri 1 Cimahi...',
    image: 'images/Dashboard/sekolah-3.jpg',  ← GANTI DI SINI
  },
];
```

> ⚠️ **Perhatian:** Path di `data.ts` TIDAK pakai `import.meta.env.BASE_URL`, cukup tulis `images/Dashboard/...` saja. Sudah dihandle oleh komponen.

---

### 3. Program Keahlian

**File yang digunakan:**
- `sekolah-1.jpg` → Rekayasa Perangkat Lunak
- `sekolah-2.jpg` → Teknik Komputer dan Jaringan
- `sekolah-3.jpg` → Desain Komunikasi Visual
- `sekolah-4.jpg` → Teknik Elektronika Industri
- `sekolah-5.jpg` → Teknik Pemesinan
- `sekolah-6.jpg` → Teknik Kendaraan Ringan

**Cara ganti:**

1. Siapkan 6 foto per jurusan (bisa foto lab, praktik, siswa)
2. Copy ke folder: `public/images/Dashboard/`
3. Ganti nama sesuai urutan di atas
4. Timpa file lama
5. Refresh browser

**Kode di `ProgramKeahlianPage.tsx`:**
```tsx
const majors = [
  { name: "Rekayasa Perangkat Lunak", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.jpg`, ... },
  { name: "Teknik Komputer dan Jaringan", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-2.jpg`, ... },
  { name: "Desain Komunikasi Visual", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-3.jpg`, ... },
  { name: "Teknik Elektronika Industri", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-4.jpg`, ... },
  { name: "Teknik Pemesinan", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-5.jpg`, ... },
  { name: "Teknik Kendaraan Ringan", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-6.jpg`, ... },
];
```

**Layout:**
- Grid 2 kolom (desktop), 1 kolom (mobile)
- Gambar di atas, tinggi `h-40` (160px)
- Efek zoom saat hover

---

### 4. Sarana Prasarana

**File yang digunakan:**
- `sekolah-1.jpg` → Perpustakaan
- `sekolah-2.jpg` → Laboratorium Komputer
- `sekolah-3.jpg` → Ruang Kelas Multimedia
- `sekolah-4.jpg` → Laboratorium IPA
- `sekolah-5.jpg` → Lapangan Olahraga
- `sekolah-6.jpg` → Ruang UKS
- `sekolah-7.jpg` → Masjid Sekolah
- `sekolah-8.jpg` → Kantin & Koperasi

**Cara ganti:**

1. Siapkan 8 foto fasilitas sekolah
2. Copy ke folder: `public/images/Dashboard/`
3. Ganti nama sesuai urutan di atas
4. Timpa file lama
5. Refresh browser

**Layout:**
- Grid 4 kolom (desktop), 2 kolom (tablet), 1 kolom (mobile)
- Gambar di atas, tinggi `h-36` (144px)
- Efek zoom saat hover

---

### 5. Kegiatan Sekolah

**File yang digunakan (Bagian Agenda):**
- `sekolah-1.jpg` → MPLS (Juli 2026)
- `sekolah-2.jpg` → Class Meeting (Des 2026)
- `sekolah-3.jpg` → LKS Tingkat Kota (Mar 2027)
- `sekolah-4.jpg` → Kunjungan Industri (Sep 2026)
- `sekolah-5.jpg` → Seminar Karir (Nov 2026)

**File yang digunakan (Bagian Ekstrakurikuler):**
- `sekolah-6.jpg` → Pramuka
- `sekolah-7.jpg` → OSIS & MPK
- `sekolah-8.jpg` → Rohis
- `sekolah-9.jpg` → Paskibra
- `sekolah-10.jpg` → Futsal
- `sekolah-11.jpg` → Basket
- `sekolah-12.jpg` → Voli
- `sekolah-13.jpg` → Tari Tradisional
- `sekolah-14.jpg` → Paduan Suara
- `sekolah-15.jpg` → Jurnalistik

**Cara ganti:**

1. Siapkan 15 foto (5 agenda + 10 ekskul)
2. Copy ke folder: `public/images/Dashboard/`
3. Ganti nama sesuai urutan di atas
4. Timpa file lama
5. Refresh browser

**Layout Agenda:**
- List vertikal, 1 item per baris
- Gambar di atas, tinggi `h-40` (160px)
- Border kiri amber

**Layout Ekskul:**
- Grid 5 kolom (desktop), 3 kolom (tablet), 2 kolom (mobile)
- Gambar di atas, tinggi `h-24` (96px)
- Nama ekskul di bawah gambar

---

### 6. Berita

**File yang digunakan:**
- `sekolah-1.jpg` → Juara LKS
- `sekolah-2.jpg` → Kunjungan Industri
- `sekolah-3.jpg` → Seminar Karir
- `sekolah-4.jpg` → PPDB 2026/2027

**Cara ganti:**

1. Siapkan 4 foto berita/kegiatan
2. Copy ke folder: `public/images/Dashboard/`
3. Ganti nama sesuai urutan di atas
4. Timpa file lama
5. Refresh browser

**Layout:**
- List vertikal, 1 berita per baris
- Gambar di atas, tinggi `h-44` (176px)
- Kategori badge + tanggal + judul + excerpt + tombol

---

### 7. Galeri

**File yang digunakan:**
- `sekolah-1.jpg` → Praktik Laboratorium
- `sekolah-2.jpg` → Upacara Bendera
- `sekolah-3.jpg` → Pameran Karya Siswa
- `sekolah-4.jpg` → Ekstrakurikuler
- `sekolah-5.jpg` → Kunjungan Industri
- `sekolah-6.jpg` → Pelatihan Soft Skill
- `sekolah-7.jpg` → Class Meeting 2025
- `sekolah-8.jpg` → Workshop Teknologi
- `sekolah-9.jpg` → Kegiatan Pramuka

**Cara ganti:**

1. Siapkan 9 foto dokumentasi
2. Copy ke folder: `public/images/Dashboard/`
3. Ganti nama sesuai urutan di atas
4. Timpa file lama
5. Refresh browser

**Layout:**
- Grid 3 kolom (desktop), 2 kolom (tablet), 1 kolom (mobile)
- Gambar di atas, tinggi `h-44` (176px)
- Kategori + judul di bawah
- Efek zoom saat hover

---

### 8. Profil (Logo & Kepala Sekolah)

#### Logo Sekolah (Header)

**File:** `public/images/logo/gambar-2.svg`

**Cara ganti:**
1. Siapkan logo sekolah (format SVG atau PNG)
2. Copy ke folder: `public/images/logo/`
3. Ganti nama jadi `gambar-2.svg` (atau `gambar-2.png`)
4. Jika pakai PNG, ubah kode di `ExpectationModal.tsx`:
   ```tsx
   // Dari:
   src={`${import.meta.env.BASE_URL}images/logo/gambar-2.svg`}
   // Menjadi:
   src={`${import.meta.env.BASE_URL}images/logo/gambar-2.png`}
   ```

#### Logo Sekolah (Halaman Profil)

**File:** `public/images/smp.png`

**Cara ganti:**
1. Siapkan logo sekolah
2. Copy ke folder: `public/images/`
3. Ganti nama jadi `smp.png`
4. Timpa file lama

#### Foto Kepala Sekolah

**File:** `public/images/pegawai/kepala-sekolah.jpg`

**Cara ganti:**
1. Siapkan foto kepala sekolah (ukuran 3:4 portrait)
2. Copy ke folder: `public/images/pegawai/`
3. Ganti nama jadi `kepala-sekolah.jpg`
4. Timpa file lama

---

## 📝 Tata Cara Edit Konten Teks

### 1. Edit Data Navigasi, Prakata, Berita, Kegiatan

**File:** `src/data.ts`

```typescript
// Ganti nama menu (jika perlu)
export const navItems: NavItem[] = [
  'Beranda',
  'Profil',
  'Program Sekolah',
  // ... tambah/hapus sesuai kebutuhan
];

// Ganti prakata di beranda
export const introItems: SimpleItem[] = [
  {
    title: 'Prakata Kepala Sekolah',  ← GANTI JUDUL
    content: 'Bismillahirrahmanirrahim...',  ← GANTI ISI
  },
  // ...
];

// Ganti berita
export const newsItems: NewsItem[] = [
  {
    title: 'JUDUL BERITA BARU',  ← GANTI
    date: '01/01/2026',           ← GANTI
    excerpt: 'Ringkasan berita...', ← GANTI
  },
];

// Ganti kegiatan sidebar
export const activityItems: ActivityItem[] = [
  {
    title: 'Judul Kegiatan Baru',  ← GANTI
    desc: 'Deskripsi kegiatan...',   ← GANTI
    image: 'images/Dashboard/sekolah-1.jpg',  ← GANTI FOTO
  },
];
```

### 2. Edit Konten Halaman Profil

**File:** `src/pages/ProfilPage.tsx`

| Bagian | Baris Kode | Yang Bisa Diedit |
|--------|-----------|------------------|
| Nama Sekolah | ~baris 35 | `SMP Negeri 1 Majenang` |
| Moto | ~baris 38 | `"Unggul dalam Prestasi..."` |
| Visi | ~baris 65 | `"Terwujudnya generasi..."` |
| Misi | ~baris 72-79 | Array 5 item misi |
| Nama Kepala Sekolah | ~baris 93 | `Drs. H. Mulyono, M.Pd.` |
| Sambutan | ~baris 105 | `"Selamat datang di portal..."` |
| Struktur Guru | ~baris 125-128 | Array data guru |
| Fasilitas | ~baris 145-150 | Array 6 fasilitas |
| Jam Operasional | ~baris 170-180 | Waktu layanan |

### 3. Edit Konten Halaman Program Sekolah

**File:** `src/pages/ProgramSekolahPage.tsx`

```typescript
const programs = [
  {
    title: "Judul Program Baru",  ← GANTI
    desc: "Penjelasan program...",  ← GANTI
  },
  // Tambah/hapus item sesuai kebutuhan
];
```

### 4. Edit Konten Halaman GTK & Siswa

**File:** `src/pages/GtkSiswaPage.tsx`

```typescript
const teacherData = [
  { category: "Guru Produktif", count: 45, desc: "..." },  ← GANTI ANGKA
  // ...
];

const studentStats = [
  { label: "Jumlah Siswa Aktif", value: "1.850", sub: "siswa" },  ← GANTI ANGKA
  // ...
];
```

### 5. Edit Konten Halaman Kontak

**File:** `src/pages/KontakPage.tsx`

```tsx
<p><span className="font-semibold">Alamat:</span> Jl. Mahar Martanegara No. 48, Cimahi Selatan</p>  ← GANTI
<p><span className="font-semibold">Telepon:</span> 022 - 6629683</p>  ← GANTI
<p><span className="font-semibold">Email:</span> smkn1cimahi@gmail.com</p>  ← GANTI
```

---

## ➕ Tata Cara Tambah Menu Baru

### Langkah 1: Tambah Type di `types.ts`

```typescript
export type NavItem =
  | 'Beranda'
  | 'Profil'
  | 'Program Sekolah'
  | 'Program Keahlian'
  | 'GTK & Siswa'
  | 'Sarana Prasarana'
  | 'Kegiatan Sekolah'
  | 'Berita'
  | 'Galeri'
  | 'Kontak'
  | 'Menu Baru';  ← TAMBAH INI
```

### Langkah 2: Tambah di `data.ts`

```typescript
export const navItems: NavItem[] = [
  'Beranda',
  'Profil',
  // ...
  'Kontak',
  'Menu Baru',  ← TAMBAH INI
];
```

### Langkah 3: Buat File Halaman Baru

Buat file: `src/pages/MenuBaruPage.tsx`

```tsx
import type { PageProps } from '../types';

export default function MenuBaruPage({ onNavigate }: PageProps) {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Menu Baru</h2>
        <p className="text-sm text-slate-600">Deskripsi halaman baru.</p>
      </div>
      {/* Konten halaman */}
    </section>
  );
}
```

### Langkah 4: Import & Register di `ExpectationModal.tsx`

```tsx
import MenuBaruPage from './pages/MenuBaruPage';  ← TAMBAH IMPORT

// Di dalam renderMenuPage():
if (activeMenu === 'Menu Baru') return <MenuBaruPage {...pageProps} />;  ← TAMBAH INI
```

### Langkah 5: Tambah Link di Footer (Opsional)

```tsx
<span className="cursor-pointer hover:underline" onClick={() => handleNavigate('Menu Baru')}>
  Menu Baru
</span>
```

---

## 📄 Daftar File & Fungsinya

| File | Fungsi | Jarang Diubah |
|------|--------|---------------|
| `types.ts` | Definisi tipe data TypeScript | ⭐ (hanya tambah menu) |
| `data.ts` | Data teks beranda (nav, intro, news, activity) | ⭐⭐⭐ (sering diupdate) |
| `ExpectationModal.tsx` | Modal utama, header, nav, footer, routing | ⭐⭐ (tambah menu) |
| `BerandaPage.tsx` | Hero slider, prakata, berita, kegiatan | ⭐⭐⭐ (ganti foto) |
| `ProfilPage.tsx` | Visi-misi, sambutan, struktur, fasilitas | ⭐⭐⭐ (edit konten) |
| `ProgramSekolahPage.tsx` | 5 program unggulan | ⭐⭐ (edit konten) |
| `ProgramKeahlianPage.tsx` | 6 jurusan + foto | ⭐⭐⭐ (ganti foto) |
| `GtkSiswaPage.tsx` | Statistik guru & siswa | ⭐⭐ (edit angka) |
| `SaranaPrasaranaPage.tsx` | 8 fasilitas + foto | ⭐⭐⭐ (ganti foto) |
| `KegiatanSekolahPage.tsx` | Agenda + ekskul + foto | ⭐⭐⭐ (ganti foto) |
| `BeritaPage.tsx` | 4 berita + foto | ⭐⭐⭐ (ganti foto & teks) |
| `GaleriPage.tsx` | 9 album foto | ⭐⭐⭐ (ganti foto) |
| `KontakPage.tsx` | Info kontak + form pesan | ⭐⭐ (edit kontak) |

---

## ⚠️ Catatan Penting

### 1. Path Foto

Ada **2 cara penulisan path** yang berbeda:

| Lokasi | Cara Penulisan | Contoh |
|--------|---------------|--------|
| Di dalam komponen (`.tsx`) | `${import.meta.env.BASE_URL}images/...` | `` `${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.jpg` `` |
| Di `data.ts` | `images/...` (tanpa BASE_URL) | `'images/Dashboard/sekolah-1.jpg'` |

> **Jangan sampai tertukar!** Jika salah, foto tidak akan muncul.

### 2. Nama File Foto

- **Harus sama persis** (case-sensitive): `sekolah-1.jpg` ≠ `Sekolah-1.jpg`
- **Format:** JPG, JPEG, PNG, WEBP (SVG untuk logo)
- **Ukuran optimal:** 800x600px atau 1200x800px (landscape)
- **Ukuran file:** Maksimal 500KB per foto (agar loading cepat)

### 3. Troubleshooting Foto Tidak Muncul

| Masalah | Solusi |
|---------|--------|
| Foto tidak muncul | Cek nama file (huruf besar/kecil), cek folder, cek ekstensi |
| Foto pecah/blur | Ganti dengan foto ukuran lebih besar |
| Foto tidak full | Pastikan foto landscape (lebar > tinggi) |
| Foto lama masih muncul | Hard refresh browser (`Ctrl + Shift + R` atau `Cmd + Shift + R`) |
| Error 404 | Cek path di kode, pastikan file ada di folder `public/` |

### 4. Tips Optimasi Foto

Sebelum upload, kompres foto dengan:
- [TinyPNG](https://tinypng.com/) (online, gratis)
- [Squoosh](https://squoosh.app/) (online, gratis)
- Photoshop: Export > Save for Web (quality 70-80%)

Target: **di bawah 200KB per foto** tanpa mengurangi kualitas visual.

### 5. Base URL (Vite)

Jika deploy ke subfolder (bukan root domain), ubah di `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/nama-folder/',  // ← TAMBAH INI jika deploy ke subfolder
  // ...
});
```

### 6. Warna Tema

Warna utama yang digunakan:

| Warna | Kode Tailwind | Penggunaan |
|-------|--------------|------------|
| Biru Tua | `blue-900`, `[#183b7e]` | Header, judul, tombol |
| Amber/Emas | `amber-500`, `amber-600` | Aksen, border, badge |
| Putih | `white`, `[#f8f9fc]` | Background card |
| Abu-abu | `gray-600`, `gray-700` | Teks body |

Untuk ganti tema, cari dan replace kode warna di seluruh file `.tsx`.

---

## 📞 Butuh Bantuan?

Jika ada kendala:
1. Cek **Console Browser** (tekan `F12` → tab Console) untuk error
2. Cek **Network tab** (F12 → Network) untuk foto yang gagal load
3. Pastikan semua file ada di folder `public/images/`
4. Restart dev server (`Ctrl+C` lalu `npm run dev`)

---

**Dibuat dengan ❤️ untuk SMP Negeri 1 Majenang**  
*Tim ICT 2017 - 2026*

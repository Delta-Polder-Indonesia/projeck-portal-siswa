export interface QuickLink {
  label: string;
  href: string;
}

export interface IntroSection {
  title: string;
  text: string;
}

export interface NewsItem {
  title: string;
  date: string;
  excerpt: string;
}

export interface ActivityItem {
  title: string;
  summary: string;
  image: string;
}

export const quickLinks: QuickLink[] = [
  { label: "Bunda", href: "#" },
  { label: "Profil", href: "#" },
  { label: "Program Sekolah", href: "#" },
  { label: "Program Keahlian", href: "#" },
  { label: "GTK & Staff", href: "#" },
  { label: "Sarana Prasarana", href: "#" },
  { label: "Kegiatan Sekolah", href: "#" },
  { label: "Berita", href: "#" },
  { label: "Galeri", href: "#" },
  { label: "Kontak", href: "#" },
];

export const introSections: IntroSection[] = [
  {
    title: "Prakata Kepala Sekolah",
    text: "Bismillahirrahmanirrahim Assalamu'alaikum Wr. Wb. Mengucapkan syukur kepada Allah SWT atas segala nikmat-Nya, website resmi SMKN 1 Cimahi ini hadir sebagai sarana informasi dan layanan sekolah. Semoga bermanfaat untuk siswa, orang tua, dan masyarakat.",
  },
  {
    title: "Program Sekolah",
    text: "Adanya teknologi informasi pada saat ini tidak bisa kita hindari. Sekolah menyiapkan materi pelajaran berbasis digital dengan tetap mempertahankan pembelajaran tatap muka yang kondusif untuk menciptakan generasi cerdas.",
  },
  {
    title: "Program Keahlian",
    text: "Program keahlian yang ada di SMKN Negeri 1 Cimahi ada 6. Ini menjadi sarana utama penyiapan kebutuhan program keahlian yang ada di Indonesia, menuju lulusan siap kerja dengan karakter dan kompetensi kuat.",
  },
];

export const latestNews: NewsItem[] = [
  {
    title: "ACHIEVEMENT MOTIVATION TRAINING SESSION 2, CITARIK, SUKABUMI, 19-20 APRIL 2019",
    date: "20/04/2019",
    excerpt: "Pada tanggal 19-20 April 2019, SMKN 1 Cimahi telah melaksanakan kegiatan Achievement Motivation Training di Citarik Training.",
  },
  {
    title: "DIES NATALIS SMKN 1 CIMAHI KE 42 & PEMBUKAAN PTM ANGKATAN 29",
    date: "19/04/2019",
    excerpt: "Pada hari Senin, tanggal 8 April 2019 telah dilaksanakan upacara pembukaan sekaligus Dies Natalis SMKN 1 Cimahi.",
  },
];

export const activities: ActivityItem[] = [
  {
    title: "Apel Pagi dalam rangka memperingati HUT PRAMUKA yang ke 55 di SMK Negeri 1 Cimahi",
    summary: "Berikut adalah kegiatan apel pagi dalam rangka memperingati Hari Pramuka.",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=220&q=80",
  },
  {
    title: "Upacara Hari Senin Pagi Tanggal 22 Agustus 2016 dalam rangka memperingati HUT RI yang ke-71",
    summary: "Kegiatan upacara Hari Senin Pagi Tanggal 22 Agustus 2016 di sekolah.",
    image:
      "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=220&q=80",
  },
  {
    title: "Pameran Produk Inovasi Anak Bangsa RITECH EXPO 2016 yang diselenggarakan di Gor Manahan SOLO",
    summary: "Alhamdulillah SMK Negeri 1 Cimahi melalui program keahlian berhasil meraih penghargaan.",
    image:
      "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&w=220&q=80",
  },
];
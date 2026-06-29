import type { ActivityItem, NavItem, NewsItem, SimpleItem } from './types';

export const navItems: NavItem[] = [
  'Beranda',
  'Profil',
  'Program Sekolah',
  'Program Keahlian',
  'GTK & Siswa',
  'Sarana Prasarana',
  'Kegiatan Sekolah',
  'Berita',
  'Galeri',
  'Kontak',
];

export const introItems: SimpleItem[] = [
  {
    title: 'Prakata Kepala Sekolah',
    content:
      "Bismillahirrahmanirrahim. Assalamu'alaikum Warahmatullahi Wabarakatuh. Kami mengucapkan selamat datang di website kami. Halaman ini ditujukan untuk seluruh unsur pimpinan, guru, karyawan, siswa, dan masyarakat agar mudah mengakses informasi profil, kegiatan, serta fasilitas sekolah.",
  },
  {
    title: 'Program Sekolah',
    content:
      'Berbagai kegiatan pelatihan dari luar sekolah memudahkan kolaborasi dengan dunia usaha dan dunia industri. Sekolah terus berupaya mengadopsi kemajuan teknologi yang berkembang sangat pesat agar pembelajaran semakin relevan.',
  },
  {
    title: 'Program Keahlian',
    content:
      'Program keahlian di SMK Negeri 1 Cimahi dirancang untuk membekali siswa dengan kemampuan praktis dan daya saing. Kurikulum disusun agar lulusan siap melanjutkan pendidikan maupun siap terjun ke dunia kerja.',
  },
];

export const newsItems: NewsItem[] = [
  {
    title:
      'ACHIEVEMENT MOTIVATION TRAINING SESSION 2, CITARIK, SUKABUMI, 19-20 APRIL 2019 TOGETHER IN HARMONY',
    date: '24/04/2019',
    excerpt:
      'Pada tanggal 19-20 April 2019, SMKN 1 Cimahi melaksanakan kegiatan outbound Achievement Motivation Training untuk meningkatkan karakter dan kerja sama siswa.',
  },
  {
    title: 'DIES NATALIS SMKN 1 CIMAHI KE 42 & PEMBUKAAN PFM ANGKATAN 29',
    date: '09/04/2019',
    excerpt:
      'Pada hari Senin tanggal 8 April 2019 telah dilaksanakan upacara bendera sekaligus rangkaian kegiatan Dies Natalis sekolah.',
  },
];

export const activityItems: ActivityItem[] = [
  {
    title: 'Apel Pagi memperingati HUT PRAMUKA ke-55 di SMK Negeri 1 Cimahi',
    desc: 'Kegiatan apel pagi dan pembinaan karakter siswa dilaksanakan bersama seluruh civitas sekolah.',
    image: 'images/Dashboard/sekolah-1.jpg',
  },
  {
    title: 'Upacara Hari Senin Pagi Tanggal 22 Agustus 2016 memperingati HUT RI ke-71',
    desc: 'Kegiatan upacara dilaksanakan dengan tertib, khidmat, dan diikuti seluruh warga sekolah.',
    image: 'images/Dashboard/sekolah-2.jpg',
  },
  {
    title: 'Pameran Produk Inovasi Anak Bangsa RITECH EXPO 2016 di Gor Manahan SOLO',
    desc: 'SMK Negeri 1 Cimahi berpartisipasi melalui program keahlian unggulan dan karya inovatif siswa.',
    image: 'images/Dashboard/sekolah-3.jpg',
  },
];

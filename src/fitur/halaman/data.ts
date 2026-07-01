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
  'Guru & Pegawai',
  'Kontak',
];

export const introItems: SimpleItem[] = [
  {
    title: 'Prakata Kepala Sekolah',
    content:
      "Bismillahirrahmanirrahim. Assalamu'alaikum Warahmatullahi Wabarakatuh. " +
      'Kami mengucapkan selamat datang di website resmi SMP Negeri 1 Majenang. ' +
      'Halaman ini ditujukan untuk seluruh unsur pimpinan, guru, karyawan, siswa, dan masyarakat ' +
      'agar mudah mengakses informasi profil, kegiatan, serta fasilitas sekolah.',
  },
  {
    title: 'Program Sekolah',
    content:
      'Berbagai program prioritas dirancang untuk membangun kompetensi, karakter, dan kesiapan siswa. ' +
      'Setiap program dikelola oleh tim pengajar berpengalaman dengan dukungan fasilitas modern ' +
      'dan kemitraan industri yang kuat.',
  },
  {
    title: 'Program Keahlian',
    content:
      'Program keahlian di SMP Negeri 1 Majenang dirancang untuk membekali siswa dengan ' +
      'kemampuan akademik dan karakter unggul. Kurikulum disusun agar lulusan siap melanjutkan ' +
      'pendidikan ke jenjang yang lebih tinggi dengan bekal pengetahuan yang kuat.',
  },
];

export const newsItems: NewsItem[] = [
  {
    title: 'PELAKSANAAN ASESMEN NASIONAL BERBASIS KOMPUTER (ANBK) TAHUN AJARAN 2026/2027',
    date: '10/06/2026',
    excerpt:
      'SMP Negeri 1 Majenang melaksanakan ANBK dengan lancar. Seluruh siswa mengikuti ' +
      'kegiatan dengan tertib dan didampingi oleh guru pendamping yang berpengalaman.',
  },
  {
    title: 'DIES NATALIS SMP NEGERI 1 MAJENANG KE 49 & AMBISI SEKOLAH DIGITAL',
    date: '08/04/2026',
    excerpt:
      'Pada hari Senin tanggal 8 April 2026 telah dilaksanakan upacara bendera ' +
      'sekaligus peringatan Dies Natalis SMP Negeri 1 Majenang yang ke-49.',
  },
];

export const activityItems: ActivityItem[] = [
  {
    title: 'Apel Pagi Memperingati HUT Pramuka di SMP Negeri 1 Majenang',
    desc: 'Kegiatan apel pagi dan pembinaan karakter siswa dilaksanakan bersama seluruh civitas sekolah.',
    image: 'images/Dashboard/sekolah-1.jpg',
  },
  {
    title: 'Upacara Hari Senin Pagi Memperingati HUT RI ke-79',
    desc: 'Kegiatan upacara dilaksanakan dengan tertib, khidmat, dan diikuti seluruh warga sekolah.',
    image: 'images/Dashboard/sekolah-2.jpg',
  },
  {
    title: 'Pameran Karya Siswa dan Inovasi Pendidikan Tahun 2025',
    desc: 'SMP Negeri 1 Majenang berpartisipasi melalui program unggulan dan karya inovatif siswa.',
    image: 'images/Dashboard/sekolah-3.jpg',
  },
];

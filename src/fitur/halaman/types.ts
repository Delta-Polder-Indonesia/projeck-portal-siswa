export interface ExpectationModalProps {
  open: boolean;
  onClose: () => void;
  onOpenRegistration?: () => void;
}

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
  | 'Kontak';

export interface SimpleItem {
  title: string;
  content: string;
}

export interface NewsItem {
  title: string;
  date: string;
  excerpt: string;
}

export interface ActivityItem {
  title: string;
  desc: string;
  image: string;
}

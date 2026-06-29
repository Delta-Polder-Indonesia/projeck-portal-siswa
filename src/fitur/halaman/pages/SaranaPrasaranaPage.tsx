import type { PageProps } from '../types';

const facilities = [
  {
    name: "Perpustakaan",
    detail: "5.000+ Koleksi Buku",
    desc: "Ruang baca nyaman dengan sistem digitalisasi katalog dan akses e-book.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.jpg`,
  },
  {
    name: "Laboratorium Komputer",
    detail: "40 Unit PC",
    desc: "Lab terintegrasi dengan spesifikasi tinggi untuk pemrograman, desain, dan simulasi.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-2.jpg`,
  },
  {
    name: "Ruang Kelas Multimedia",
    detail: "Proyektor & Smart TV",
    desc: "Setiap ruang kelas dilengkapi proyektor dan perangkat media pembelajaran interaktif.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-3.jpg`,
  },
  {
    name: "Laboratorium IPA",
    detail: "Praktikum Sains",
    desc: "Fasilitas lengkap untuk praktikum fisika, kimia, dan biologi dengan standar keselamatan.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-4.jpg`,
  },
  {
    name: "Lapangan Olahraga",
    detail: "Serbaguna",
    desc: "Lapangan untuk basket, voli, futsal, dan berbagai kegiatan ekstrakurikuler olahraga.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-5.jpg`,
  },
  {
    name: "Ruang UKS",
    detail: "Layanan Kesehatan",
    desc: "Unit Kesehatan Sekolah dengan perawat dan fasilitas pertolongan pertama.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-6.jpg`,
  },
  {
    name: "Masjid Sekolah",
    detail: "Kapasitas 200 Jemaah",
    desc: "Ruang ibadah dan kegiatan keagamaan siswa dengan fasilitas wudhu yang memadai.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-7.jpg`,
  },
  {
    name: "Kantin & Koperasi",
    detail: "Hygienis & Terjangkau",
    desc: "Penyediaan makanan bergizi dengan standar kebersihan dan harga terjangkau.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-8.jpg`,
  },
];

export default function SaranaPrasaranaPage({ onNavigate }: PageProps) {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Sarana Prasarana</h2>
        <p className="text-sm text-slate-600">Lingkungan belajar yang mendukung teori, praktik, dan pengembangan karakter.</p>
      </div>

      <div className="pt-6">
        <p className="text-sm leading-relaxed text-gray-700 text-justify">
          Fasilitas sekolah dirancang untuk mendukung pembelajaran teori dan praktik agar siswa mendapatkan pengalaman
          belajar yang seimbang. Semua fasilitas dikelola dan dipelihara secara rutin untuk menjamin kenyamanan dan keselamatan.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map((f) => (
            <div key={f.name} className="border border-gray-200 bg-[#f8f9fc] overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-36 w-full overflow-hidden">
                <img
                  src={f.image}
                  alt={f.name}
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h4 className="text-sm font-bold text-blue-950">{f.name}</h4>
                <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mt-0.5">{f.detail}</p>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
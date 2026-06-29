import type { PageProps } from '../types';

const news = [
  {
    title: "SMKN 1 Cimahi Raih Juara LKS Tingkat Provinsi",
    date: "15 Juni 2026",
    category: "Prestasi",
    excerpt: "Tim siswa SMKN 1 Cimahi berhasil meraih juara pertama dalam Lomba Kompetensi Siswa (LKS) bidang Rekayasa Perangkat Lunak tingkat Provinsi Jawa Barat. Prestasi ini menjadi bukti komitmen sekolah dalam mengembangkan kompetensi siswa.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.jpg`,
  },
  {
    title: "Kunjungan Industri Kelas XI ke Perusahaan Mitra",
    date: "10 Juni 2026",
    category: "Kegiatan",
    excerpt: "Siswa kelas XI melakukan kunjungan industri ke beberapa perusahaan mitra di Bandung dan Cimahi. Kegiatan ini bertujuan memberikan pengalaman langsung tentang dinamika dunia kerja.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-2.jpg`,
  },
  {
    title: "Seminar Karir dan Beasiswa untuk Siswa Kelas XII",
    date: "5 Juni 2026",
    category: "Informasi",
    excerpt: "Sekolah mengadakan seminar karir yang menghadirkan praktisi industri dan perwakilan perguruan tinggi untuk memberikan arahan jalur karir dan informasi beasiswa kepada siswa kelas XII.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-3.jpg`,
  },
  {
    title: "Pembukaan PPDB Gelombang 1 Tahun Ajaran 2026/2027",
    date: "1 Juni 2026",
    category: "Pengumuman",
    excerpt: "Penerimaan Peserta Didik Baru gelombang pertama telah resmi dibuka. Calon siswa dapat mendaftar secara online melalui portal PPDB resmi sekolah.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-4.jpg`,
  },
];

export default function BeritaPage({ onNavigate }: PageProps) {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Berita</h2>
        <p className="text-sm text-slate-600">Update terbaru seputar prestasi, kegiatan, dan pengumuman sekolah.</p>
      </div>

      <div className="pt-6">
        {/* Grid layout kesamping konsisten dengan halaman sebelumnya */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {news.map((item) => (
            <article key={item.title} className="border border-gray-200 bg-[#f8f9fc] overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-36 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[9px] font-bold uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">{item.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-blue-950 leading-snug line-clamp-2 min-h-[40px]">{item.title}</h4>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed text-justify line-clamp-4">{item.excerpt}</p>
                </div>
              </div>
              <div className="px-4 pb-4 pt-0">
                <button className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer">
                  Baca Selengkapnya →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
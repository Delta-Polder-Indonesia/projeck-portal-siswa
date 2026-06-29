import type { PageProps } from '../types';

const teacherData = [
  { 
    category: "Guru Produktif", 
    count: 45, 
    desc: "Mengajar mata pelajaran kejuruan sesuai program keahlian", 
    code: "PRD",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.jpg`
  },
  { 
    category: "Guru Normatif & Adaptif", 
    count: 30, 
    desc: "Mengajar mata pelajaran umum dan penunjang", 
    code: "NMD",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-2.jpg`
  },
  { 
    category: "Tenaga Kependidikan", 
    count: 22, 
    desc: "Staf administrasi, perpustakaan, laboran, dan tata usaha", 
    code: "TAS",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-3.jpg`
  },
];

const studentStats = [
  { label: "Jumlah Siswa Aktif", value: "1.850", sub: "Siswa Terdaftar", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-4.jpg` },
  { label: "Rasio Guru : Siswa", value: "1 : 18", sub: "Kategori Ideal", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-5.jpg` },
  { label: "Tingkat Kelulusan", value: "98,5%", sub: "Rata-rata 3 Tahun", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-6.jpg` },
  { label: "Penyerapan Kerja", value: "75%", sub: "Langsung Bekerja", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-7.jpg` },
];

export default function GtkSiswaPage({ onNavigate }: PageProps) {
  return (
    <section className="px-6 py-8">
      {/* Header Halaman */}
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">GTK & Siswa</h2>
        <p className="text-sm text-slate-600">Data ringkas tenaga pendidik, tenaga kependidikan, dan peserta didik.</p>
      </div>

      <p className="pt-6 text-sm leading-relaxed text-gray-700 text-justify">
        Data guru, tenaga kependidikan, dan siswa diperbarui secara berkala sebagai bagian dari transparansi informasi
        sekolah. Komposisi sumber daya manusia dirancang untuk mendukung pembelajaran berkualitas dengan rasio yang ideal.
      </p>

      {/* Bagian Tenaga Pendidik / GTK */}
      <h3 className="mt-8 mb-4 text-base font-bold text-blue-950 border-b border-gray-200 pb-2 flex items-center gap-2">
        <span className="h-4 w-1 bg-blue-900 inline-block rounded-sm"></span>
        Komposisi Tenaga Pendidik
      </h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teacherData.map((item) => (
          <div key={item.category} className="border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            {/* Kontainer Foto Lokal */}
            <div className="h-36 w-full bg-slate-100 relative overflow-hidden">
              <img 
                src={item.image} 
                alt={item.category} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className="text-[10px] font-bold uppercase bg-blue-900 text-white px-2 py-0.5 rounded shadow">
                  {item.code}
                </span>
              </div>
            </div>

            {/* Konten Data */}
            <div className="p-4 border-t-4 border-blue-900 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-3xl font-black text-blue-900 tracking-tight">{item.count}</p>
                <h4 className="text-sm font-bold text-blue-950 mt-2 leading-snug">{item.category}</h4>
              </div>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bagian Statistik Siswa */}
      <h3 className="mt-8 mb-4 text-base font-bold text-blue-950 border-b border-gray-200 pb-2 flex items-center gap-2">
        <span className="h-4 w-1 bg-amber-500 inline-block rounded-sm"></span>
        Statistik Peserta Didik
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {studentStats.map((stat) => (
          <div key={stat.label} className="border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            {/* Kontainer Foto Lokal */}
            <div className="h-28 w-full bg-slate-100 overflow-hidden">
              <img 
                src={stat.image} 
                alt={stat.label} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Konten Data */}
            <div className="p-4 border-t-4 border-amber-500 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-2xl font-black text-amber-600 tracking-tight">{stat.value}</p>
                <h4 className="text-xs font-bold text-blue-950 mt-2 leading-snug">{stat.label}</h4>
              </div>
              <p className="text-[10px] text-gray-400 font-medium mt-1">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Keterangan Sistem */}
      <div className="mt-8 text-center border-t border-gray-100 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-gray-400">
        <div>* Data sinkronisasi periode tahun ajaran 2025/2026.</div>
        <div className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[10px]">SIAKAD_STATUS: VERIFIED</div>
      </div>
    </section>
  );
}
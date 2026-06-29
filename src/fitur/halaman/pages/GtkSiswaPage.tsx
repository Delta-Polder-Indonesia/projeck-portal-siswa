import type { PageProps } from '../types';

const teacherData = [
  { category: "Guru Produktif", count: 45, desc: "Mengajar mata pelajaran kejuruan sesuai program keahlian" },
  { category: "Guru Normatif dan Adaptif", count: 30, desc: "Mengajar mata pelajaran umum dan penunjang" },
  { category: "Tenaga Kependidikan", count: 22, desc: "Staf administrasi, perpustakaan, laboran, dan tata usaha" },
];

const studentStats = [
  { label: "Jumlah Siswa Aktif", value: "1.850", sub: "siswa" },
  { label: "Rasio Guru : Siswa", value: "1 : 18", sub: "ideal" },
  { label: "Tingkat Kelulusan", value: "98,5%", sub: "rata-rata 3 tahun" },
  { label: "Penyerapan Kerja", value: "75%", sub: "langsung bekerja" },
];

export default function GtkSiswaPage({ onNavigate }: PageProps) {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">GTK & Siswa</h2>
        <p className="text-sm text-slate-600">Data ringkas tenaga pendidik, tenaga kependidikan, dan peserta didik.</p>
      </div>

      <p className="pt-6 text-sm leading-relaxed text-gray-700 text-justify">
        Data guru, tenaga kependidikan, dan siswa diperbarui secara berkala sebagai bagian dari transparansi informasi
        sekolah. Komposisi sumber daya manusia dirancang untuk mendukung pembelajaran berkualitas dengan rasio yang ideal.
      </p>

      {/* Statistik Guru */}
      <h3 className="mt-8 mb-3 text-base font-bold text-blue-950 border-b border-gray-200 pb-2">Komposisi Tenaga Pendidik</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {teacherData.map((item) => (
          <div key={item.category} className="border border-slate-200 bg-[#f8f9fc] p-4">
            <p className="text-2xl font-bold text-blue-900">{item.count}</p>
            <p className="text-sm font-semibold text-gray-800 mt-1">{item.category}</p>
            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Statistik Siswa */}
      <h3 className="mt-8 mb-3 text-base font-bold text-blue-950 border-b border-gray-200 pb-2">Statistik Peserta Didik</h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {studentStats.map((stat) => (
          <div key={stat.label} className="border border-slate-200 bg-white p-4 text-center">
            <p className="text-xl font-bold text-amber-600">{stat.value}</p>
            <p className="text-xs font-semibold text-gray-700 mt-1">{stat.label}</p>
            <p className="text-[10px] text-gray-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 text-xs text-gray-500 text-center">
        * Data periode tahun ajaran 2025/2026. Diperbarui setiap semester.
      </div>
    </section>
  );
}
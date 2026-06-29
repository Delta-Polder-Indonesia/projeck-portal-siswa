import type { PageProps } from '../types';

const programs = [
  {
    title: "Penguatan Karakter dan Kedisiplinan Siswa",
    desc: "Program unggulan untuk membentuk siswa yang berakhlak mulia, disiplin, mandiri, dan bertanggung jawab melalui kegiatan rutin harian, pembinaan mental, serta pembiasaan budaya positif di lingkungan sekolah.",
  },
  {
    title: "Kelas Industri dan Pembelajaran Berbasis Proyek",
    desc: "Kolaborasi dengan dunia usaha dan industri untuk menyelenggarakan pembelajaran yang relevan dengan kebutuhan pasar kerja. Siswa belajar langsung dari praktisi industri melalui proyek nyata.",
  },
  {
    title: "Program Magang Siswa di Dunia Usaha dan Industri",
    desc: "Penempatan siswa kelas XI dan XII di perusahaan mitra untuk mengasah keterampilan kerja, membangun jaringan profesional, dan mempersiapkan diri menghadapi dunia kerja.",
  },
  {
    title: "Pelatihan Sertifikasi Kompetensi Siswa",
    desc: "Program pendampingan dan uji kompetensi untuk memperoleh sertifikat keahlian yang diakui industri, meningkatkan daya saing lulusan di pasar kerja nasional maupun internasional.",
  },
  {
    title: "Pendampingan Karir dan Bursa Kerja Khusus",
    desc: "Layanan bimbingan karir, workshop persiapan kerja, dan penyelenggaraan bursa kerja yang menghubungkan lulusan dengan perusahaan rekruter mitra sekolah.",
  },
];

export default function ProgramSekolahPage({ onNavigate }: PageProps) {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Program Sekolah</h2>
        <p className="text-sm text-slate-600">Program prioritas untuk membangun kompetensi, karakter, dan kesiapan kerja siswa.</p>
      </div>

      <div className="pt-6">
        <p className="text-sm leading-relaxed text-gray-700 text-justify">
          Program sekolah dirancang untuk menyeimbangkan kompetensi akademik, keterampilan kerja, dan pembentukan
          karakter agar siswa siap melanjutkan pendidikan maupun bekerja. Setiap program dikelola oleh tim pengajar
          berpengalaman dengan dukungan fasilitas modern dan kemitraan industri yang kuat.
        </p>

        <div className="mt-6 space-y-4">
          {programs.map((program, idx) => (
            <div key={idx} className="border-l-4 border-blue-900 bg-[#f8f9fc] px-5 py-4">
              <h3 className="text-sm font-bold text-blue-950 mb-1">{program.title}</h3>
              <p className="text-xs leading-relaxed text-gray-600 text-justify">{program.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs text-amber-800 text-center">
            <span className="font-bold">Catatan:</span> Program-program di atas dapat berkembang sesuai kebutuhan dan masukan dari dunia industri serta komunitas pemangku kepentingan sekolah.
          </p>
        </div>
      </div>
    </section>
  );
}
import type { PageProps } from '../types';

const programs = [
  {
    title: "Penguatan Karakter dan Kedisiplinan Siswa",
    desc: "Program unggulan untuk membentuk siswa yang berakhlak mulia, disiplin, mandiri, dan bertanggung jawab melalui kegiatan rutin harian, pembinaan mental, serta pembiasaan budaya positif di lingkungan sekolah.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.jpg`,
  },
  {
    title: "Kelas Industri dan Pembelajaran Berbasis Proyek",
    desc: "Kolaborasi dengan dunia usaha dan industri untuk menyelenggarakan pembelajaran yang relevan dengan kebutuhan pasar kerja. Siswa belajar langsung dari praktisi industri melalui proyek nyata.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-2.jpg`,
  },
  {
    title: "Program Magang Siswa di Dunia Usaha dan Industri",
    desc: "Penempatan siswa kelas XI dan XII di perusahaan mitra untuk mengasah keterampilan kerja, membangun jaringan profesional, dan mempersiapkan diri menghadapi dunia kerja.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-3.jpg`,
  },
  {
    title: "Pelatihan Sertifikasi Kompetensi Siswa",
    desc: "Program pendampingan dan uji kompetensi untuk memperoleh sertifikat keahlian yang diakui industri, meningkatkan daya saing lulusan di pasar kerja nasional maupun internasional.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-4.jpg`,
  },
  {
    title: "Pendampingan Karir dan Bursa Kerja Khusus",
    desc: "Layanan bimbingan karir, workshop persiapan kerja, dan penyelenggaraan bursa kerja yang menghubungkan lulusan dengan perusahaan rekruter mitra sekolah.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-5.jpg`,
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

        {/* Grid layout 4 kolom dengan tampilan foto konsisten dengan halaman sebelumnya */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program, idx) => (
            <div key={idx} className="border border-gray-200 bg-[#f8f9fc] overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-36 w-full overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 border-t-4 border-blue-900">
                  <h4 className="text-sm font-bold text-blue-950 leading-snug line-clamp-2 min-h-[40px]">
                    {program.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed text-justify line-clamp-5">
                    {program.desc}
                  </p>
                </div>
              </div>
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
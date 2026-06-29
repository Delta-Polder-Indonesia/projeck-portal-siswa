import type { PageProps } from '../types';

const majors = [
  {
    name: "Rekayasa Perangkat Lunak",
    desc: "Membekali siswa dengan keterampilan pemrograman, pengembangan aplikasi web dan mobile, database management, serta persiapan sertifikasi kompetensi bidang teknologi informasi.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.jpg`,
  },
  {
    name: "Teknik Komputer dan Jaringan",
    desc: "Fokus pada instalasi, konfigurasi, dan pemeliharaan jaringan komputer, sistem keamanan jaringan, serta troubleshooting perangkat keras dan lunak.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-2.jpg`,
  },
  {
    name: "Desain Komunikasi Visual",
    desc: "Mengasah kemampuan desain grafis, fotografi, videografi, animasi, dan branding. Siswa mempelajari software industri standar untuk menghasilkan karya visual yang komunikatif.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-3.jpg`,
  },
  {
    name: "Teknik Elektronika Industri",
    desc: "Pembelajaran tentang sistem kontrol elektronik, pemrograman PLC, perawatan peralatan elektronik industri, dan otomasi sistem produksi.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-4.jpg`,
  },
  {
    name: "Teknik Pemesinan",
    desc: "Keterampilan pengoperasian mesin CNC, konvensi pemesinan, pembacaan gambar teknik, dan pemrograman mesin produksi sesuai standar industri manufaktur.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-5.jpg`,
  },
  {
    name: "Teknik Kendaraan Ringan",
    desc: "Praktik perawatan dan perbaikan sistem mesin, kelistrikan, chasis, dan transmisi kendaraan ringan modern dengan standar bengkel industri.",
    image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-6.jpg`,
  },
];

export default function ProgramKeahlianPage({ onNavigate }: PageProps) {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Program Keahlian</h2>
        <p className="text-sm text-slate-600">Pilihan jurusan berbasis kebutuhan industri dan teknologi terbaru.</p>
      </div>

      <div className="pt-6">
        {/* Grid layout 4 kolom yang konsisten dengan halaman sebelumnya */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {majors.map((major) => (
            <div key={major.name} className="border border-gray-200 bg-[#f8f9fc] overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-36 w-full overflow-hidden">
                  <img
                    src={major.image}
                    alt={major.name}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-bold text-blue-950 leading-snug line-clamp-2 min-h-[40px]">
                    {major.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed text-justify line-clamp-4">
                    {major.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center border-t border-gray-100 pt-4">
        <p className="text-xs text-gray-500">
          Semua program keahlian dilengkapi dengan laboratorium/workshop modern dan instruktur bersertifikat industri.
        </p>
      </div>
    </section>
  );
}
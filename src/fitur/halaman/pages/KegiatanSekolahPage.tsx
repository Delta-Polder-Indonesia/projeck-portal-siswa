import type { PageProps } from '../types';

const events = [
  {
    title: "Masa Pengenalan Lingkungan Sekolah",
    time: "Juli 2026",
    desc: "Kegiatan orientasi bagi siswa baru untuk mengenal lingkungan sekolah, tata tertib, program kegiatan, dan membangun rasa kekeluargaan antar siswa.",
    type: "Orientasi",
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/photo-1.jpg`,
  },
  {
    title: "Class Meeting dan Expo Karya Siswa",
    time: "Desember 2026",
    desc: "Pameran karya siswa dari berbagai program keahlian, lomba antar kelas, dan pentas seni yang menampilkan bakat dan kreativitas siswa.",
    type: "Pameran",
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/photo-1.jpg`,
  },
  {
    title: "Lomba Kompetensi Siswa Tingkat Kota",
    time: "Maret 2027",
    desc: "Seleksi dan pelatihan siswa berprestasi untuk mengikuti kompetisi keahlian tingkat kota dan provinsi.",
    type: "Kompetisi",
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/photo-1.jpg`,
  },
  {
    title: "Kunjungan Industri Kelas XI",
    time: "September 2026",
    desc: "Kunjungan ke perusahaan mitra untuk memperkenalkan siswa pada lingkungan kerja nyata dan memperkuat pemahaman industri.",
    type: "Kunjungan",
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/photo-1.jpg`,
  },
  {
    title: "Seminar Karir dan Beasiswa",
    time: "November 2026",
    desc: "Pemberian informasi jalur karir, beasiswa pendidikan lanjut, dan motivasi dari alumni sukses.",
    type: "Seminar",
    image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/photo-1.jpg`,
  },
];

const extracurriculars = [
  { name: "Pramuka", image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png` },
  { name: "OSIS & MPK", image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png` },
  { name: "Rohis (Rohani Islam)", image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png` },
  { name: "Paskibra", image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png` },
  { name: "Futsal", image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png` },
  { name: "Basket", image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png` },
  { name: "Voli", image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png` },
  { name: "Tari Tradisional", image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png` },
  { name: "Paduan Suara", image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png` },
  { name: "Jurnalistik", image: `${import.meta.env.BASE_URL}images/HalamanKami/KegiatanSekolah/Ekstrakurikuler/photo-1.png` },
];

export default function KegiatanSekolahPage({ onNavigate }: PageProps) {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Kegiatan Sekolah</h2>
        <p className="text-sm text-slate-600">Agenda tahunan dan kegiatan pengembangan minat bakat siswa.</p>
      </div>

      <div className="pt-6">
        {/* Agenda Utama dalam susunan grid kesamping */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((event) => (
            <div key={event.title} className="border border-gray-200 bg-[#f8f9fc] overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="h-36 w-full overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 border-t-4 border-amber-500">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                      {event.type}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">{event.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-blue-950 leading-snug">{event.title}</h4>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed text-justify">{event.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="mt-8 mb-3 text-base font-bold text-blue-950 border-b border-gray-200 pb-2">Ekstrakurikuler</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {extracurriculars.map((ex) => (
          <div key={ex.name} className="border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-24 w-full overflow-hidden">
              <img
                src={ex.image}
                alt={ex.name}
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="px-3 py-2 text-center">
              <p className="text-xs font-semibold text-gray-700">{ex.name}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
import type { PageProps } from '../types';

const galleryItems = [
  { title: "Kegiatan Praktik Laboratorium", category: "Praktik", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.jpg` },
  { title: "Dokumentasi Upacara Bendera", category: "Upacara", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-2.jpg` },
  { title: "Pameran Karya Siswa", category: "Pameran", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-3.jpg` },
  { title: "Kegiatan Ekstrakurikuler", category: "Ekskul", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-4.jpg` },
  { title: "Kunjungan Industri", category: "Kunjungan", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-5.jpg` },
  { title: "Pelatihan Soft Skill", category: "Pelatihan", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-6.jpg` },
  { title: "Class Meeting 2025", category: "Event", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-7.jpg` },
  { title: "Workshop Teknologi", category: "Seminar", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-8.jpg` },
  { title: "Kegiatan Pramuka", category: "Ekskul", image: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-9.jpg` },
];

export default function GaleriPage({ onNavigate }: PageProps) {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Galeri</h2>
        <p className="text-sm text-slate-600">Dokumentasi visual aktivitas siswa, guru, dan kegiatan sekolah.</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {galleryItems.map((item) => (
          <div key={item.title} className="border border-gray-200 bg-[#f8f9fc] overflow-hidden group cursor-pointer hover:shadow-md transition-all">
            <div className="h-44 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <span className="text-[10px] font-semibold uppercase text-amber-600">{item.category}</span>
              <p className="text-sm text-gray-700 font-medium mt-0.5">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
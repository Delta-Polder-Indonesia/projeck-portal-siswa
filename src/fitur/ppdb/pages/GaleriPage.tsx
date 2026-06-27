const galleryItems = [
  "Kegiatan Praktik Laboratorium",
  "Dokumentasi Upacara Bendera",
  "Pameran Karya Siswa",
  "Kegiatan Ekstrakurikuler",
  "Kunjungan Industri",
  "Pelatihan Soft Skill",
];

export default function GaleriPage() {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Galeri</h2>
        <p className="text-sm text-slate-600">Dokumentasi visual aktivitas siswa, guru, dan kegiatan sekolah.</p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {galleryItems.map((item) => (
          <div key={item} className="border border-gray-200 bg-[#f8f9fc] p-3">
            <img
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=640&q=80"
              alt={item}
              className="h-28 w-full object-cover"
            />
            <p className="pt-2 text-sm text-gray-700">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
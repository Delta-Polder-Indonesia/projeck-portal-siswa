const events = [
  {
    title: "Masa Pengenalan Lingkungan Sekolah",
    time: "Juli 2026",
  },
  {
    title: "Class Meeting dan Expo Karya Siswa",
    time: "Desember 2026",
  },
  {
    title: "Lomba Kompetensi Siswa Tingkat Kota",
    time: "Maret 2027",
  },
];

export default function KegiatanSekolahPage() {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Kegiatan Sekolah</h2>
        <p className="text-sm text-slate-600">Agenda tahunan dan kegiatan pengembangan minat bakat siswa.</p>
      </div>
      <div className="mt-6 space-y-3">
        {events.map((event) => (
          <div key={event.title} className="border-l-4 border-amber-500 bg-[#f8f9fc] px-4 py-3">
            <h3 className="text-base font-bold text-blue-950">{event.title}</h3>
            <p className="text-sm text-gray-600">Pelaksanaan: {event.time}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
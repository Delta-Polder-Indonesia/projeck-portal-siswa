const facilities = [
  "Laboratorium Komputer dan Jaringan",
  "Workshop Teknik Otomotif",
  "Studio Desain dan Multimedia",
  "Perpustakaan Digital",
  "Masjid Sekolah",
  "Lapangan Olahraga",
];

export default function SaranaPrasaranaPage() {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Sarana Prasarana</h2>
        <p className="text-sm text-slate-600">Lingkungan belajar yang mendukung teori, praktik, dan pengembangan karakter.</p>
      </div>
      <div className="pt-6">
        <p className="text-sm leading-relaxed text-gray-700">
          Fasilitas sekolah dirancang untuk mendukung pembelajaran teori dan praktik agar siswa mendapatkan pengalaman
          belajar yang seimbang.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {facilities.map((facility) => (
            <div key={facility} className="border border-gray-200 bg-[#f8f9fc] px-4 py-4 text-sm text-gray-700">
              {facility}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
const majors = [
  "Rekayasa Perangkat Lunak",
  "Teknik Komputer dan Jaringan",
  "Desain Komunikasi Visual",
  "Teknik Elektronika Industri",
  "Teknik Pemesinan",
  "Teknik Kendaraan Ringan",
];

export default function ProgramKeahlianPage() {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Program Keahlian</h2>
        <p className="text-sm text-slate-600">Pilihan jurusan berbasis kebutuhan industri dan teknologi terbaru.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-2">
        {majors.map((major) => (
          <div key={major} className="border border-gray-200 bg-[#f8f9fc] p-5">
            <h3 className="text-base font-bold text-blue-950">{major}</h3>
            <p className="pt-1 text-sm leading-relaxed text-gray-600">
              Program fokus pada keterampilan praktik, sertifikasi kompetensi, dan proyek kolaborasi industri.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
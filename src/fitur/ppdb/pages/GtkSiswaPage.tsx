const teachers = [
  "Guru Produktif: 45 orang",
  "Guru Normatif dan Adaptif: 30 orang",
  "Tenaga Kependidikan: 22 orang",
  "Jumlah Siswa Aktif: 1.850 siswa",
];

export default function GtkSiswaPage() {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">GTK & Siswa</h2>
        <p className="text-sm text-slate-600">Data ringkas tenaga pendidik, tenaga kependidikan, dan peserta didik.</p>
      </div>
      <p className="pt-6 text-sm leading-relaxed text-gray-700">
        Data guru, tenaga kependidikan, dan siswa diperbarui secara berkala sebagai bagian dari transparansi informasi
        sekolah.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {teachers.map((item) => (
          <div key={item} className="border border-slate-200 bg-[#f8f9fc] p-4 text-sm text-gray-700">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
const programs = [
  "Penguatan karakter dan kedisiplinan siswa",
  "Kelas industri dan pembelajaran berbasis proyek",
  "Program magang siswa di dunia usaha dan industri",
  "Pelatihan sertifikasi kompetensi siswa",
  "Pendampingan karir dan bursa kerja khusus",
];

export default function ProgramSekolahPage() {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Program Sekolah</h2>
        <p className="text-sm text-slate-600">Program prioritas untuk membangun kompetensi, karakter, dan kesiapan kerja siswa.</p>
      </div>
      <div className="pt-6">
        <p className="text-sm leading-relaxed text-gray-700">
          Program sekolah dirancang untuk menyeimbangkan kompetensi akademik, keterampilan kerja, dan pembentukan
          karakter agar siswa siap melanjutkan pendidikan maupun bekerja.
        </p>
        <ul className="mt-5 space-y-2 text-sm text-gray-700">
          {programs.map((program) => (
            <li key={program} className="border-l-4 border-blue-900 bg-[#f8f9fc] px-4 py-3">
              {program}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
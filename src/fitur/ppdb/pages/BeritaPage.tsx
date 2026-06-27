const headlines = [
  "SMKN 1 Cimahi Raih Juara LKS Tingkat Provinsi",
  "Kunjungan Industri Kelas XI ke Perusahaan Mitra",
  "Seminar Karir dan Beasiswa untuk Siswa Kelas XII",
  "Pembukaan PPDB Gelombang 1 Tahun Ajaran 2026/2027",
];

export default function BeritaPage() {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Berita</h2>
        <p className="text-sm text-slate-600">Update terbaru seputar prestasi, kegiatan, dan pengumuman sekolah.</p>
      </div>
      <div className="mt-6 space-y-3">
        {headlines.map((headline, index) => (
          <article key={headline} className="border border-gray-200 bg-[#f8f9fc] p-4">
            <p className="text-[11px] text-gray-500">{index + 1}. Berita Sekolah</p>
            <h3 className="pt-1 text-base font-bold text-blue-950">{headline}</h3>
            <p className="pt-1 text-sm text-gray-600">Baca ringkasan berita dan dokumentasi kegiatan terbaru sekolah.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
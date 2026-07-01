import { useState } from 'react';
import type { PageProps } from '../types';

// ============================================================================
// ⬇️ TIPE DATA GURU & PEGAWAI
// Semua definisi tipe ada di file ini agar tidak mencar-mencar.
// ============================================================================

interface GuruPegawaiItem {
  id: number;
  nama: string;
  nip: string;
  jabatan: string;
  status: 'Guru' | 'Pegawai';
  mataPelajaran?: string;
  foto?: string;
  tingkatan: number;    // 1=Kepala Sekolah, 2=Wakil, 3=Koordinator, 4=Guru, 5=Pegawai
  tingkatLabel: string;
}

// ============================================================================
// ⬇️ DATA GURU & PEGAWAI
//
// CARA GANTI FOTO:
// 1. Simpan file foto ke folder: public/images/GuruPegawai/
// 2. Format yang didukung: .jpg, .jpeg, .png, .webp
// 3. Ukuran foto yang disarankan: 300x375 piksel (rasio 4:5, seperti pas foto)
// 4. Ganti nilai "foto" di bawah sesuai nama file yang kamu simpan
//
// Contoh:
//   foto: 'images/GuruPegawai/nama-guru.jpg',
//
// Kalau belum ada foto, kosongkan saja atau hapus baris "foto":
//   foto: '',
//   atau hapus baris foto-nya
//
// ============================================================================

const dataGuruPegawai: GuruPegawaiItem[] = [
  // ──────────────────────────────────────────
  // TINGKAT 1 — KEPALA SEKOLAH (Puncak Piramida)
  // ──────────────────────────────────────────
  {
    id: 1,
    nama: 'Drs. H. Surya Darma, M.Pd.',
    nip: '196512121990031001',
    jabatan: 'Kepala Sekolah',
    status: 'Guru',
    mataPelajaran: 'Pendidikan Agama Islam',
    foto: 'images/GuruPegawai/kepala-sekolah.jpg',
    tingkatan: 1,
    tingkatLabel: 'Pimpinan',
  },

  // ──────────────────────────────────────────
  // TINGKAT 2 — WAKIL KEPALA SEKOLAH
  // ──────────────────────────────────────────
  {
    id: 2,
    nama: 'Dra. Sri Hartati',
    nip: '197003151995022001',
    jabatan: 'Wakil Kepala Sekolah Bidang Kurikulum',
    status: 'Guru',
    mataPelajaran: 'Bahasa Indonesia',
    foto: 'images/GuruPegawai/guru-1.jpg',
    tingkatan: 2,
    tingkatLabel: 'Wakil Kepala Sekolah',
  },
  {
    id: 3,
    nama: 'Drs. Bambang Santoso',
    nip: '196808081992031002',
    jabatan: 'Wakil Kepala Sekolah Bidang Kesiswaan',
    status: 'Guru',
    mataPelajaran: 'Pendidikan Jasmani',
    foto: 'images/GuruPegawai/guru-2.jpg',
    tingkatan: 2,
    tingkatLabel: 'Wakil Kepala Sekolah',
  },

  // ──────────────────────────────────────────
  // TINGKAT 4 — GURU
  // ──────────────────────────────────────────
  {
    id: 4,
    nama: 'Siti Aminah, S.Pd.',
    nip: '198505052010012005',
    jabatan: 'Guru Matematika',
    status: 'Guru',
    mataPelajaran: 'Matematika',
    foto: 'images/GuruPegawai/guru-3.jpg',
    tingkatan: 4,
    tingkatLabel: 'Guru',
  },
  {
    id: 5,
    nama: 'Ahmad Fauzi, S.Pd.',
    nip: '198712122011011003',
    jabatan: 'Guru IPA',
    status: 'Guru',
    mataPelajaran: 'Ilmu Pengetahuan Alam',
    foto: 'images/GuruPegawai/guru-4.jpg',
    tingkatan: 4,
    tingkatLabel: 'Guru',
  },
  {
    id: 6,
    nama: 'Rina Wulandari, S.Pd.',
    nip: '199002152014022004',
    jabatan: 'Guru Bahasa Inggris',
    status: 'Guru',
    mataPelajaran: 'Bahasa Inggris',
    foto: 'images/GuruPegawai/guru-5.jpg',
    tingkatan: 4,
    tingkatLabel: 'Guru',
  },
  {
    id: 7,
    nama: 'Drs. Hadi Sucipto',
    nip: '196910101993031004',
    jabatan: 'Guru IPS',
    status: 'Guru',
    mataPelajaran: 'Ilmu Pengetahuan Sosial',
    foto: 'images/GuruPegawai/guru-6.jpg',
    tingkatan: 4,
    tingkatLabel: 'Guru',
  },
  {
    id: 8,
    nama: 'Nurul Hidayah, S.Pd.',
    nip: '199205202016022006',
    jabatan: 'Guru Seni Budaya',
    status: 'Guru',
    mataPelajaran: 'Seni Budaya',
    foto: 'images/GuruPegawai/guru-7.jpg',
    tingkatan: 4,
    tingkatLabel: 'Guru',
  },
  {
    id: 9,
    nama: 'Lestari Indah, S.Pd.',
    nip: '199108152015022010',
    jabatan: 'Guru Bahasa Indonesia',
    status: 'Guru',
    mataPelajaran: 'Bahasa Indonesia',
    foto: 'images/GuruPegawai/guru-8.jpg',
    tingkatan: 4,
    tingkatLabel: 'Guru',
  },

  // ──────────────────────────────────────────
  // TINGKAT 5 — PEGAWAI / STAF
  // ──────────────────────────────────────────
  {
    id: 10,
    nama: 'Agus Supriyanto',
    nip: '197512151999031007',
    jabatan: 'Tata Usaha',
    status: 'Pegawai',
    foto: 'images/GuruPegawai/pegawai-1.jpg',
    tingkatan: 5,
    tingkatLabel: 'Pegawai',
  },
  {
    id: 11,
    nama: 'Dewi Kusumawati',
    nip: '198003102005022008',
    jabatan: 'Bendahara',
    status: 'Pegawai',
    foto: 'images/GuruPegawai/pegawai-2.jpg',
    tingkatan: 5,
    tingkatLabel: 'Pegawai',
  },
  {
    id: 12,
    nama: 'Eko Prasetyo',
    nip: '198810102010011009',
    jabatan: 'Operator Sekolah',
    status: 'Pegawai',
    foto: 'images/GuruPegawai/pegawai-3.jpg',
    tingkatan: 5,
    tingkatLabel: 'Pegawai',
  },
];

// ============================================================================
// ⬇️ KOMPONEN HALAMAN
// ============================================================================

export default function GuruPegawaiPage({ onNavigate }: PageProps) {
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Guru' | 'Pegawai'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<GuruPegawaiItem | null>(null);

  // Urutkan berdasarkan tingkatan
  const sortedItems = [...dataGuruPegawai].sort((a, b) => a.tingkatan - b.tingkatan);

  const filteredItems = sortedItems.filter((item) => {
    const matchStatus = filterStatus === 'Semua' || item.status === filterStatus;
    const matchSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.mataPelajaran?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Kelompokkan berdasarkan tingkatan untuk piramida
  const groupedByTingkatan = filteredItems.reduce((acc, item) => {
    if (!acc[item.tingkatan]) acc[item.tingkatan] = [];
    acc[item.tingkatan].push(item);
    return acc;
  }, {} as Record<number, GuruPegawaiItem[]>);

  const tingkatanOrder = [1, 2, 3, 4, 5].filter((t) => groupedByTingkatan[t]?.length > 0);

  const guruCount = dataGuruPegawai.filter((i) => i.status === 'Guru').length;
  const pegawaiCount = dataGuruPegawai.filter((i) => i.status === 'Pegawai').length;

  // Ukuran foto per tingkatan — semakin atas semakin besar (rasio 4:5 pas foto)
  const getPhotoSize = (tingkatan: number) => {
    switch (tingkatan) {
      case 1: return { width: 'w-[120px]', height: 'h-[150px]' };
      case 2: return { width: 'w-[104px]', height: 'h-[130px]' };
      case 3: return { width: 'w-[96px]',  height: 'h-[120px]' };
      case 4: return { width: 'w-[88px]',  height: 'h-[110px]' };
      case 5: return { width: 'w-[80px]',  height: 'h-[100px]' };
      default: return { width: 'w-[88px]', height: 'h-[110px]' };
    }
  };

  const getNameSize = (tingkatan: number) => {
    switch (tingkatan) {
      case 1: return 'text-[13px]';
      case 2: return 'text-[12px]';
      default: return 'text-[11px]';
    }
  };

  return (
    <section className="px-6 py-8">
      {/* Header */}
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Guru & Pegawai</h2>
        <p className="text-sm text-slate-600">
          Struktur organisasi tenaga pendidik dan kependidikan SMP Negeri 1 Majenang.
        </p>
      </div>

      <div className="pt-6">
        <p className="text-sm leading-relaxed text-gray-700 text-justify">
          Sekolah memiliki tenaga pengajar dan staf administrasi yang kompeten dan berpengalaman.
          Setiap individu berperan aktif dalam menciptakan lingkungan belajar yang kondusif,
          mendukung perkembangan akademik maupun karakter siswa secara menyeluruh.
        </p>

        {/* Statistik */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="border border-gray-200 bg-[#f8f9fc] p-4 text-center">
            <p className="text-xl font-bold text-blue-900">{dataGuruPegawai.length}</p>
            <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mt-1">Total Personil</p>
          </div>
          <div className="border border-gray-200 bg-[#f8f9fc] p-4 text-center">
            <p className="text-xl font-bold text-blue-900">{guruCount}</p>
            <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mt-1">Guru</p>
          </div>
          <div className="border border-gray-200 bg-[#f8f9fc] p-4 text-center">
            <p className="text-xl font-bold text-blue-900">{pegawaiCount}</p>
            <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wide mt-1">Pegawai</p>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex rounded-lg border border-gray-200 bg-white p-1">
            {(['Semua', 'Guru', 'Pegawai'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`rounded-md px-4 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  filterStatus === tab
                    ? 'bg-blue-900 text-white'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama, jabatan, atau mata pelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-700 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 sm:w-72"
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* PIRAMIDA FOTO                                                 */}
        {/* ============================================================ */}
        <div className="mt-10">
          {filteredItems.length === 0 ? (
            <div className="border border-dashed border-gray-300 bg-[#f8f9fc] py-16 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="mt-3 text-sm font-medium text-slate-500">
                Tidak ada data yang cocok dengan pencarian Anda.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {tingkatanOrder.map((tingkatan, idx) => {
                const items = groupedByTingkatan[tingkatan];
                const size = getPhotoSize(tingkatan);
                const nameSize = getNameSize(tingkatan);

                return (
                  <div key={tingkatan} className="flex flex-col items-center w-full">
                    {/* Garis penghubung vertikal */}
                    {idx > 0 && (
                      <div className="flex flex-col items-center">
                        <div className="w-px h-6 bg-gray-300" />
                        {items.length > 1 && (
                          <div
                            className="h-px bg-gray-300"
                            style={{ width: `${Math.min(items.length * 120, 600)}px` }}
                          />
                        )}
                      </div>
                    )}

                    {/* Label tingkatan */}
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-3 mt-1">
                      {items[0].tingkatLabel}
                    </p>

                    {/* Baris foto */}
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 sm:gap-x-8">
                      {items.map((person) => (
                        <div
                          key={person.id}
                          className="flex flex-col items-center cursor-pointer group"
                          style={{ maxWidth: '140px' }}
                          onClick={() => setSelectedPerson(person)}
                        >
                          {/* Garis kecil ke foto */}
                          {idx > 0 && items.length > 1 && (
                            <div className="w-px h-3 bg-gray-300 mb-1" />
                          )}

                          {/* FOTO */}
                          <div className={`${size.width} ${size.height} relative overflow-hidden border-2 border-gray-200 group-hover:border-amber-400 transition-colors duration-300`}>
                            {person.foto && (
                              <img
                                src={`${import.meta.env.BASE_URL}${person.foto}`}
                                alt={person.nama}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            )}
                            {/* Fallback silhouette */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 -z-10">
                              <svg className="h-10 w-10 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                            </div>
                          </div>

                          {/* Nama & Jabatan */}
                          <p className={`${nameSize} font-semibold text-blue-950 text-center mt-2 leading-tight`}>
                            {person.nama}
                          </p>
                          <p className="text-[9px] font-medium text-amber-600 text-center mt-0.5 leading-tight uppercase tracking-wide">
                            {person.jabatan}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL DETAIL                                                  */}
      {/* ============================================================ */}
      {selectedPerson && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-28 bg-gradient-to-br from-blue-900 to-[#0b1f46]">
              <button
                onClick={() => setSelectedPerson(null)}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30 cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gray-100 shadow-lg overflow-hidden">
                  {selectedPerson.foto && (
                    <img
                      src={`${import.meta.env.BASE_URL}${selectedPerson.foto}`}
                      alt={selectedPerson.nama}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <svg className="h-10 w-10 text-gray-300 absolute" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 pt-12 text-center">
              <span
                className={`inline-block text-[10px] font-semibold uppercase tracking-wide px-3 py-0.5 ${
                  selectedPerson.status === 'Guru'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {selectedPerson.status}
              </span>
              <h2 className="mt-2 text-lg font-bold text-blue-950">{selectedPerson.nama}</h2>
              <p className="text-sm font-semibold text-amber-600">{selectedPerson.jabatan}</p>

              <div className="mt-5 space-y-3 border border-gray-200 bg-[#f8f9fc] p-4 text-left">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 6v11.25A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">NIP</p>
                    <p className="text-xs font-medium text-gray-700">{selectedPerson.nip}</p>
                  </div>
                </div>
                {selectedPerson.mataPelajaran && (
                  <div className="flex items-start gap-3">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Mata Pelajaran</p>
                      <p className="text-xs font-medium text-gray-700">{selectedPerson.mataPelajaran}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006V5.25A2.25 2.25 0 0018.75 3h-13.5A2.25 2.25 0 003 5.25v12.5c0 1.094.787 2.036 1.872 2.18 2.087.277 4.216.42 6.378.42s4.291-.143 6.378-.42c1.085-.144 1.872-1.086 1.872-2.18z" />
                  </svg>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Jabatan</p>
                    <p className="text-xs font-medium text-gray-700">{selectedPerson.jabatan}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedPerson(null)}
                className="mt-4 w-full bg-blue-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-800 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
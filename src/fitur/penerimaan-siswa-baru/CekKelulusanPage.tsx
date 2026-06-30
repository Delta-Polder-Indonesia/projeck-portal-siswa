import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, GraduationCap, ArrowLeft } from 'lucide-react';
import { getPPDBApplications } from '../../data/store';

// ============================================
// KOMPONEN UTAMA
// ============================================
export default function CekKelulusanPage({ onBack }: { onBack?: () => void }) {
  // Form state
  const [noReg, setNoReg] = useState('');
  const [nama, setNama] = useState('');

  // Data from store
  const allApplications = useMemo(() => getPPDBApplications(), []);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filtered data
  const [filteredData, setFilteredData] = useState(allApplications);
  const [hasSearched, setHasSearched] = useState(false);

  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    
    const filtered = allApplications.filter((item) => {
      const matchReg = noReg ? item.registrationNo.toLowerCase().includes(noReg.toLowerCase()) : true;
      const matchNama = nama ? item.namaLengkap.toLowerCase().includes(nama.toLowerCase()) : true;
      return matchReg && matchNama;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ACCEPTED') {
      return (
        <div>
          <span className="inline-flex items-center rounded bg-blue-600 px-2 py-1 text-[10px] font-bold text-white uppercase">
            LULUS
          </span>
          <p className="mt-1 text-[9px] text-blue-600 font-medium italic">Silahkan daftar ulang</p>
        </div>
      );
    }
    if (status === 'REJECTED') {
      return (
        <span className="inline-flex items-center rounded bg-red-600 px-2 py-1 text-[10px] font-bold text-white uppercase">
          TIDAK LULUS
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded bg-amber-500 px-2 py-1 text-[10px] font-bold text-white uppercase">
        PROSES
      </span>
    );
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white border-b border-slate-200 px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Cek Kelulusan</h1>
            <p className="text-xs text-slate-500">Penerimaan Siswa Baru</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-xs font-bold text-slate-900">UNIVERSITAS HANDAYANI</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Portal PMB Online</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 lg:p-8">
        {/* SEARCH BOX */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Search className="h-4 w-4" />
              Pencarian Status Kelulusan
            </h2>
          </div>
          <form onSubmit={handleSearch} className="p-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  No. Registrasi
                </label>
                <input
                  type="text"
                  value={noReg}
                  onChange={(e) => setNoReg(e.target.value)}
                  placeholder="Contoh: PPDB-24-NAS-000001"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama lengkap pendaftar"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 active:scale-95"
                >
                  <Search className="h-4 w-4" />
                  Cari Data
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* RESULTS TABLE */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Hasil Pengumuman</h3>
            <span className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
              Total: {totalRecords} Pendaftar
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">No. Registrasi</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Nama Lengkap</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Asal Sekolah</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Jalur</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? (
                  filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item, idx) => (
                    <tr key={item.id} className="transition hover:bg-blue-50/30">
                      <td className="px-6 py-4 font-mono text-xs text-blue-600 font-semibold">{item.registrationNo}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{item.namaLengkap}</td>
                      <td className="px-6 py-4 text-slate-600">{item.sekolahAsal}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {item.jalurPendaftaran}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <Search className="h-6 w-6" />
                        </div>
                        <p className="text-slate-500 font-medium">Data tidak ditemukan</p>
                        <p className="text-xs text-slate-400">Pastikan nomor registrasi atau nama yang anda masukkan benar</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              {filteredData.length > 0 && (
                <tfoot>
                  <tr className="border-t border-slate-200 bg-slate-50/50">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">Tampilkan</span>
                          <select
                            value={pageSize}
                            onChange={(e) => {
                              setPageSize(Number(e.target.value));
                              setCurrentPage(1);
                            }}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-700 outline-none focus:border-blue-500"
                          >
                            {[5, 10, 25, 50].map((size) => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 transition-all"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          
                          <div className="flex items-center gap-1 mx-2">
                            {getPageNumbers().map((page, idx) => (
                              <button
                                key={idx}
                                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                disabled={typeof page !== 'number'}
                                className={`
                                  h-8 w-8 rounded-lg text-xs font-bold transition-all
                                  ${currentPage === page
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    : page === '...' ? 'text-slate-400 cursor-default' : 'text-slate-600 hover:bg-white border border-slate-200'
                                  }
                                `}
                              >
                                {page}
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 transition-all"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center gap-2 text-center">
          <p className="text-xs font-bold text-slate-800">UNIVERSITAS HANDAYANI</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Copyright &copy; {new Date().getFullYear()} &bull; Version 2.4.0</p>
        </div>
      </footer>
    </div>
  );
}

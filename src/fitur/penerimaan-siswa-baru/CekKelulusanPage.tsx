import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, GraduationCap, ArrowLeft } from 'lucide-react';
import { getPPDBApplications } from '../../data/store';

export default function CekKelulusanPage({ onBack }: { onBack?: () => void }) {
  const [noReg, setNoReg] = useState('');
  const [nama, setNama] = useState('');
  const allApplications = useMemo(() => getPPDBApplications(), []);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
        <span className="inline-flex items-center bg-[#2E86C1] px-3 py-1 text-xs font-bold text-white">
          LULUS
        </span>
      );
    }
    if (status === 'REJECTED') {
      return (
        <span className="inline-flex items-center bg-[#E74C3C] px-3 py-1 text-xs font-bold text-white">
          TIDAK LULUS
        </span>
      );
    }
    return (
      <span className="inline-flex items-center bg-[#F39C12] px-3 py-1 text-xs font-bold text-white">
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
    <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
      {/* HEADER */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-[#2E86C1] px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white">Cek Kelulusan</h1>
            <p className="text-[11px] text-white/80">Penerimaan Siswa Baru</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-xs font-bold text-white">UNIVERSITAS HANDAYANI</span>
            <span className="text-[10px] text-white/70 uppercase tracking-wider">Portal PMB Online</span>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/20 bg-white/10 flex items-center justify-center p-1 shrink-0">
            <img
                  src={`${import.meta.env.BASE_URL}images/logo/logo-sekolah.svg`}
                  alt="Logo SMP 1 Majenang"
                  className="w-full h-full object-cover"
                />
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 lg:p-6">
        {/* SEARCH BOX */}
        <div className="mb-6 bg-white border border-[#DDD]">
          <div className="border-b-2 border-[#F39C12] px-5 py-3">
            <h2 className="text-sm font-bold text-[#333]">
              Silahkan Masukkan NO. Registrasi / Nama
            </h2>
          </div>
          <form onSubmit={handleSearch} className="p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#333]">
                  No. Registrasi
                </label>
                <input
                  type="text"
                  value={noReg}
                  onChange={(e) => setNoReg(e.target.value)}
                  placeholder="Contoh: PPDB-24-NAS-000001"
                  className="w-full border border-[#CCC] bg-white px-3 py-2 text-sm text-[#333] outline-none focus:border-[#2E86C1] transition-colors"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#333]">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama lengkap pendaftar"
                  className="w-full border border-[#CCC] bg-white px-3 py-2 text-sm text-[#333] outline-none focus:border-[#2E86C1] transition-colors"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-[#2E86C1] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#2471A3]"
                >
                  <Search className="h-4 w-4" />
                  Cari
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* RESULTS TABLE */}
        <div className="bg-white border border-[#DDD]">
          <div className="border-b-2 border-[#F39C12] px-5 py-3">
            <h3 className="text-lg font-bold text-[#333]">Daftar Pengumuman Lulus PMB</h3>
          </div>

          <div className="px-5 py-2 border-b border-[#EEE]">
            <span className="text-xs text-[#666]">
              Total Camaba : <strong className="text-[#333]">{totalRecords}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#DDD] bg-[#FAFAFA]">
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#333] uppercase">No. Registrasi</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#333] uppercase">Nama Lengkap</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#333] uppercase">Asal Sekolah</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#333] uppercase">Jalur</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-[#333] uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
                    <tr key={item.id} className="border-b border-[#EEE] transition hover:bg-[#F9F9F9]">
                      <td className="px-4 py-3 font-mono text-xs text-[#2E86C1] font-semibold">{item.registrationNo}</td>
                      <td className="px-4 py-3 font-bold text-[#333]">{item.namaLengkap}</td>
                      <td className="px-4 py-3 text-[#666]">{item.sekolahAsal}</td>
                      <td className="px-4 py-3 text-[#666] text-xs">{item.jalurPendaftaran}</td>
                      <td className="px-4 py-3">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-10 w-10 border border-[#CCC] bg-[#F5F5F5] flex items-center justify-center text-[#999]">
                          <Search className="h-5 w-5" />
                        </div>
                        <p className="text-[#666] font-medium text-sm">Data tidak ditemukan</p>
                        <p className="text-xs text-[#999]">Pastikan nomor registrasi atau nama yang anda masukkan benar</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              {filteredData.length > 0 && (
                <tfoot>
                  <tr className="border-t border-[#DDD] bg-[#FAFAFA]">
                    <td colSpan={5} className="px-4 py-3">
                      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#666]">Tampilkan</span>
                          <select
                            value={pageSize}
                            onChange={(e) => {
                              setPageSize(Number(e.target.value));
                              setCurrentPage(1);
                            }}
                            className="border border-[#CCC] bg-white px-2 py-1 text-xs text-[#333] outline-none"
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
                            className="px-2 py-1 border border-[#CCC] text-[#666] hover:bg-[#F5F5F5] disabled:opacity-40 transition-all text-xs"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          
                          <div className="flex items-center gap-1 mx-1">
                            {getPageNumbers().map((page, idx) => (
                              <button
                                key={idx}
                                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                disabled={typeof page !== 'number'}
                                className={`
                                  h-7 w-7 text-xs font-bold transition-all
                                  ${currentPage === page
                                    ? 'bg-[#2E86C1] text-white'
                                    : page === '...' ? 'text-[#999] cursor-default' : 'text-[#333] hover:bg-[#F5F5F5] border border-[#CCC]'
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
                            className="px-2 py-1 border border-[#CCC] text-[#666] hover:bg-[#F5F5F5] disabled:opacity-40 transition-all text-xs"
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

      <footer className="bg-[#2E86C1] text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:justify-between md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">PPDB Nasional</p>
            <p className="mt-2 text-sm text-white/90">Sistem Penerimaan Peserta Didik Baru Terpadu</p>
          </div>
          <div className="text-sm text-white/90">
            <p>(021) 1234-5678</p>
            <p>ppdb@domain.go.id</p>
            <p>Jl. Pendidikan Nasional No. 1</p>
          </div>
          <div className="text-sm text-white/90">
            <p>Senin - Jumat 08.00 - 16.00</p>
            <p>Sabtu 08.00 - 12.00</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { Users, BookOpen, UserCheck, ShoppingCart, ChevronDown, Clock, Calendar, BookMarked, User } from 'lucide-react';
import { getBooks, getLibraryMembers, getLibraryTransactions, getStudents } from '../../../data/store';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import { useState, useMemo } from 'react';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function PerpusDashboard() {
  const storeVersion = useStoreVersion();
  const [selectedMonth, setSelectedMonth] = useState('');

  const books = useMemo(() => getBooks(), [storeVersion]);
  const members = useMemo(() => getLibraryMembers(), [storeVersion]);
  const transactions = useMemo(() => getLibraryTransactions(), [storeVersion]);
  const students = useMemo(() => getStudents(), [storeVersion]);

  const activeTx = transactions.filter(t => t.status === 'dipinjam');

  const STATS = [
    { label: 'ANGGOTA', value: members.length, icon: Users, color: 'bg-[#00c0ef]', textColor: 'text-[#00c0ef]' },
    { label: 'BUKU', value: books.length, icon: BookOpen, color: 'bg-[#dd4b39]', textColor: 'text-[#dd4b39]' },
    { label: 'PENGUNJUNG', value: 0, icon: UserCheck, color: 'bg-[#00a65a]', textColor: 'text-[#00a65a]' },
    { label: 'PEMINJAMAN', value: activeTx.length, icon: ShoppingCart, color: 'bg-[#f39c12]', textColor: 'text-[#f39c12]' },
  ];

  // Helper: hitung sisa hari
  const getSisaHari = (returnDate: string) => {
    const today = new Date();
    const due = new Date(returnDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Helper: format tanggal Indonesia
  const formatTanggal = (dateStr: string) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Helper: ambil nama buku dari ID
  const getBookTitle = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    return book ? book.title : bookId;
  };

  // Helper: ambil info siswa
  const getStudentInfo = (memberId: string) => {
    const student = students.find(s => s.id === memberId);
    const member = members.find(m => m.id === memberId);
    return {
      name: student?.name || member?.name || 'Tidak Diketahui',
      nis: student?.nis || member?.nis || '-',
      className: student?.className || member?.className || '-'
    };
  };

  // Urutkan transaksi aktif: yang paling dekat deadline di atas
  const sortedActiveTx = useMemo(() => {
    return [...activeTx].sort((a, b) => {
      return new Date(a.returnDate).getTime() - new Date(b.returnDate).getTime();
    });
  }, [activeTx]);

  return (
    <div className="space-y-4">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded shadow-sm flex overflow-hidden">
            <div className={`${stat.color} w-20 flex items-center justify-center py-5`}>
              <stat.icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 p-3 flex flex-col justify-center">
              <p className={`text-xl font-bold ${stat.textColor}`}>{stat.value}</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABEL PEMINJAMAN AKTIF - BARU */}
      <div className="bg-white rounded shadow-sm border-t-4 border-[#3c8dbc]">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-[#3c8dbc]" />
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight">
              Daftar Peminjaman Aktif
            </h3>
            <span className="ml-2 px-2 py-0.5 bg-[#3c8dbc] text-white text-[10px] font-bold rounded-full">
              {sortedActiveTx.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-3 text-left font-bold text-gray-600 uppercase text-[10px] tracking-wider">No</th>
                <th className="px-3 py-3 text-left font-bold text-gray-600 uppercase text-[10px] tracking-wider">ID Transaksi</th>
                <th className="px-3 py-3 text-left font-bold text-gray-600 uppercase text-[10px] tracking-wider">Nama Peminjam</th>
                <th className="px-3 py-3 text-left font-bold text-gray-600 uppercase text-[10px] tracking-wider">ID/NIS</th>
                <th className="px-3 py-3 text-left font-bold text-gray-600 uppercase text-[10px] tracking-wider">Judul Buku</th>
                <th className="px-3 py-3 text-left font-bold text-gray-600 uppercase text-[10px] tracking-wider">ID Buku</th>
                <th className="px-3 py-3 text-left font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Tgl Pinjam
                  </div>
                </th>
                <th className="px-3 py-3 text-left font-bold text-gray-600 uppercase text-[10px] tracking-wider">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Tgl Kembali
                  </div>
                </th>
                <th className="px-3 py-3 text-center font-bold text-gray-600 uppercase text-[10px] tracking-wider">Sisa Hari</th>
                <th className="px-3 py-3 text-center font-bold text-gray-600 uppercase text-[10px] tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedActiveTx.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center text-gray-400">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Tidak ada peminjaman aktif saat ini</p>
                  </td>
                </tr>
              ) : (
                sortedActiveTx.map((tx, index) => {
                  const sisaHari = getSisaHari(tx.returnDate);
                  const studentInfo = getStudentInfo(tx.memberId);
                  const bookTitle = getBookTitle(tx.bookId);

                  let statusBadge = '';
                  let statusClass = '';
                  let sisaClass = '';

                  if (sisaHari < 0) {
                    statusBadge = 'TERLAMBAT';
                    statusClass = 'bg-red-100 text-red-700 border border-red-200';
                    sisaClass = 'text-red-600 font-bold';
                  } else if (sisaHari <= 2) {
                    statusBadge = 'SEGERA';
                    statusClass = 'bg-amber-100 text-amber-700 border border-amber-200';
                    sisaClass = 'text-amber-600 font-bold';
                  } else {
                    statusBadge = 'AKTIF';
                    statusClass = 'bg-emerald-100 text-emerald-700 border border-emerald-200';
                    sisaClass = 'text-emerald-600';
                  }

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 text-gray-500 font-mono">{index + 1}</td>
                      <td className="px-3 py-3">
                        <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                          {tx.id}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#3c8dbc] text-white flex items-center justify-center text-[10px] font-bold">
                            {studentInfo.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-xs">{studentInfo.name}</p>
                            <p className="text-[10px] text-gray-400">{studentInfo.className}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-600 font-mono text-[10px]">{studentInfo.nis}</td>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-gray-800 text-xs max-w-[180px] truncate" title={bookTitle}>
                          {bookTitle}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                          {tx.bookId}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-gray-600">{formatTanggal(tx.borrowDate)}</td>
                      <td className="px-3 py-3 text-gray-600">{formatTanggal(tx.returnDate)}</td>
                      <td className="px-3 py-3 text-center">
                        <span className={`text-xs ${sisaClass}`}>
                          {sisaHari < 0 ? `${Math.abs(sisaHari)} hari telat` : `${sisaHari} hari`}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${statusClass}`}>
                          {statusBadge}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        {sortedActiveTx.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500">
            <span>Menampilkan {sortedActiveTx.length} peminjaman aktif</span>
            <span>Diurutkan berdasarkan tanggal pengembalian terdekat</span>
          </div>
        )}
      </div>

      {/* Statistik Chart */}
      <div className="bg-white rounded shadow-sm p-4">
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
          <h3 className="text-sm font-semibold text-gray-700">Statistik Pengunjung Perpustakaan</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Bulan :</span>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 pr-6 outline-none appearance-none bg-white"
              >
                <option value="">--Pilih--</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>

        <div className="h-48 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-sm font-semibold text-gray-500 mb-2">Statistik</p>
            <div className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden mx-auto">
              <div className="w-1/3 h-full bg-gray-300" />
            </div>
            <p className="text-xs mt-2">Total Pengunjung Perpustakaan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
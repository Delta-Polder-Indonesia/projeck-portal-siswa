import { Users, BookOpen, UserCheck, ShoppingCart, ChevronDown } from 'lucide-react';
import { getBooks, getLibraryMembers, getLibraryTransactions } from '../../../data/store';
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

  const activeTx = transactions.filter(t => t.status === 'dipinjam');

  const STATS = [
    { label: 'ANGGOTA', value: members.length, icon: Users, color: 'bg-[#00c0ef]', textColor: 'text-[#00c0ef]' },
    { label: 'BUKU', value: books.length, icon: BookOpen, color: 'bg-[#dd4b39]', textColor: 'text-[#dd4b39]' },
    { label: 'PENGUNJUNG', value: 0, icon: UserCheck, color: 'bg-[#00a65a]', textColor: 'text-[#00a65a]' },
    { label: 'PEMINJAMAN', value: activeTx.length, icon: ShoppingCart, color: 'bg-[#f39c12]', textColor: 'text-[#f39c12]' },
  ];

  return (
    <div className="space-y-4">
      {/* Alert Info */}
      <div className="bg-[#00c0ef] text-white p-3 rounded text-sm shadow-sm">
        Harap rapikan kembali buku ke tempatnya saat siswa mengembalikan buku yang telah dipinjam
      </div>

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
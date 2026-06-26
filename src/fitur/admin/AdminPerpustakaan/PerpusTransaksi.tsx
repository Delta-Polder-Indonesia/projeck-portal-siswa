import { useState, useMemo } from 'react';
import { Plus, X, RotateCcw, Trash2, Check, Ban } from 'lucide-react';
import {
  getBooks, getStudents, borrowBook, returnBook, getLibraryTransactions,
  approveLibraryLoan, rejectLibraryLoan
} from '../../../data/store';
import { useStoreVersion } from '../../../hooks/useStoreVersion';

interface PerpusTransaksiProps {
  activeSubTab: 'pinjam' | 'kembali';
}

export default function PerpusTransaksi({ activeSubTab }: PerpusTransaksiProps) {
  const storeVersion = useStoreVersion();
  const isPinjam = activeSubTab === 'pinjam';

  const allBooks = useMemo(() => getBooks(), [storeVersion]);
  const allStudents = useMemo(() => getStudents(), [storeVersion]);
  const allTx = useMemo(() => getLibraryTransactions(), [storeVersion]);

  const pendingLoans = useMemo(() => allTx.filter(t => t.status === 'menunggu'), [allTx]);

  const [selectedBooks, setSelectedBooks] = useState<Array<{ id: string; title: string; qty: number }>>([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [idPeminjaman, setIdPeminjaman] = useState(`TX-${Date.now().toString().slice(-6)}`);
  const [tglPinjam, setTglPinjam] = useState(new Date().toISOString().slice(0, 10));
  const [tglKembali, setTglKembali] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [keterangan, setKeterangan] = useState('Pinjam');

  const handleApprove = (txId: string) => {
    const res = approveLibraryLoan(txId);
    if (!res.ok) alert(res.message);
  };

  const handleReject = (txId: string) => {
    const note = prompt('Alasan penolakan:');
    if (note !== null) {
      rejectLibraryLoan(txId, note);
    }
  };

  const handleAddBook = () => {
    if (!selectedBookId) return;
    const book = allBooks.find(b => b.id === selectedBookId);
    if (book && !selectedBooks.find(sb => sb.id === book.id)) {
      if (book.available <= 0) {
        alert('Stok buku habis!');
        return;
      }
      setSelectedBooks([...selectedBooks, { id: book.id, title: book.title, qty: 1 }]);
    }
    setSelectedBookId('');
  };

  const handleRemoveBook = (id: string) => {
    setSelectedBooks(selectedBooks.filter(b => b.id !== id));
  };

  const handleProcess = () => {
    if (!selectedMemberId) {
      alert('Pilih anggota terlebih dahulu.');
      return;
    }

    if (isPinjam) {
      if (selectedBooks.length === 0) {
        alert('Pilih minimal satu buku.');
        return;
      }

      const student = allStudents.find(s => s.id === selectedMemberId);
      const studentName = student ? student.name : 'Unknown';

      let successCount = 0;
      selectedBooks.forEach(b => {
        const res = borrowBook(b.id, selectedMemberId, studentName, tglPinjam, tglKembali);
        if (res.ok) successCount++;
      });

      alert(`${successCount} buku berhasil diajukan pinjamannya.`);
      setSelectedBooks([]);
    } else {
      alert('Gunakan menu kembali di dashboard atau riwayat untuk pengembalian cepat.');
    }
  };

  return (
    <div className="space-y-6">
      {/* TABEL PERMOHONAN TERTUNDA (NEW) */}
      {isPinjam && pendingLoans.length > 0 && (
        <div className="bg-white rounded shadow-sm border-l-4 border-amber-500">
          <div className="p-4 border-b border-gray-200 bg-amber-50/50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-amber-800 uppercase tracking-tight">
              Permohonan Peminjaman Tertunda ({pendingLoans.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold">
                  <th className="px-4 py-2 text-left">Siswa</th>
                  <th className="px-4 py-2 text-left">Judul Buku</th>
                  <th className="px-4 py-2 text-left">Tgl Pinjam</th>
                  <th className="px-4 py-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingLoans.map(tx => (
                  <tr key={tx.id} className="hover:bg-amber-50/30">
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">{tx.memberName}</div>
                      <div className="text-gray-500 italic text-[10px]">ID: {tx.memberId}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {allBooks.find(b => b.id === tx.bookId)?.title}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{tx.borrowDate}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove(tx.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 transition"
                        >
                          <Check className="w-3.5 h-3.5" /> SETUJUI
                        </button>
                        <button
                          onClick={() => handleReject(tx.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition"
                        >
                          <Ban className="w-3.5 h-3.5" /> TOLAK
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {isPinjam ? 'Form Peminjaman Baru' : 'Form Pengembalian Buku'}
          </h2>
        </div>

        <div className="p-6 max-w-3xl mx-auto">
          {/* Form Grid */}
          <div className="grid grid-cols-[140px_1fr] gap-4 items-center mb-6">
            <label className="text-sm font-semibold text-gray-700 text-right pr-4">ID Peminjaman</label>
            <input
              type="text"
              value={idPeminjaman}
              onChange={(e) => setIdPeminjaman(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
              readOnly={!isPinjam}
            />

            <label className="text-sm font-semibold text-gray-700 text-right pr-4">Tgl Pinjam</label>
            <input
              type="date"
              value={tglPinjam}
              onChange={(e) => setTglPinjam(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />

            <label className="text-sm font-semibold text-gray-700 text-right pr-4">Tgl Kembali</label>
            <input
              type="date"
              value={tglKembali}
              onChange={(e) => setTglKembali(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />

            <label className="text-sm font-semibold text-gray-700 text-right pr-4">Anggota</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">Pilih Anggota (Siswa)</option>
              {allStudents.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.nis})</option>
              ))}
            </select>

            <label className="text-sm font-semibold text-gray-700 text-right pr-4">Keterangan</label>
            <textarea
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm h-20 resize-none"
            />
          </div>

          {/* Book Selection */}
          {isPinjam && (
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex gap-2 mb-4">
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">Pilih Buku</option>
                  {allBooks.filter(b => b.available > 0).map(b => (
                    <option key={b.id} value={b.id}>{b.title} (Sisa: {b.available})</option>
                  ))}
                </select>
                <button
                  onClick={handleAddBook}
                  className="px-4 py-2 bg-[#00c0ef] text-white text-sm font-bold rounded hover:bg-[#00acd6]"
                >
                  TAMBAH
                </button>
              </div>

              {selectedBooks.length > 0 && (
                <table className="w-full text-xs border border-gray-200 mb-4">
                  <thead className="bg-[#dff0d8]">
                    <tr>
                      <th className="px-3 py-2 text-left border-b">ID</th>
                      <th className="px-3 py-2 text-left border-b">Judul</th>
                      <th className="px-3 py-2 text-left border-b">Qty</th>
                      <th className="px-3 py-2 text-left border-b">Hapus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBooks.map((book) => (
                      <tr key={book.id} className="border-b border-gray-100">
                        <td className="px-3 py-2">{book.id}</td>
                        <td className="px-3 py-2">{book.title}</td>
                        <td className="px-3 py-2">{book.qty}</td>
                        <td className="px-3 py-2">
                          <button
                            onClick={() => handleRemoveBook(book.id)}
                            className="text-[#dd4b39] hover:text-[#c9302c]"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end border-t border-gray-200 pt-4">
            <button
              onClick={() => { setSelectedBooks([]); setSelectedMemberId(''); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#dd4b39] text-white text-xs font-bold rounded hover:bg-[#c9302c]">
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
            <button
              onClick={handleProcess}
              className="flex items-center gap-2 px-4 py-2 bg-[#3c8dbc] text-white text-xs font-bold rounded hover:bg-[#357ca5]">
              <RotateCcw className="w-3.5 h-3.5" />
              Proses Transaksi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useMemo } from 'react';
import {
  BookOpen, Search, Clock, RotateCcw, User, LogOut, Library,
  Bookmark, History, Filter, Home, ShoppingCart, Trash2, CheckCircle2
} from 'lucide-react';
import { getBooks, getLibraryTransactions, borrowBook, returnBook } from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';

interface DashboardPerpustakaanProps {
  studentData: {
    nisn: string;
    nama: string;
    kelas: string;
  };
  onLogout: () => void;
  onBackToPortal: () => void;
}

export default function DashboardPerpustakaan({ studentData, onLogout, onBackToPortal }: DashboardPerpustakaanProps) {
  const storeVersion = useStoreVersion();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'katalog' | 'pinjaman' | 'riwayat' | 'keranjang'>('katalog');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // State untuk fitur Keranjang Buku (Menampung ID Buku)
  const [cart, setCart] = useState<string[]>([]);

  const allBooks = useMemo(() => getBooks(), [storeVersion]);
  const allHistory = useMemo(() => getLibraryTransactions(), [storeVersion]);

  const categories = ['Semua', ...new Set(allBooks.map(b => b.category))];

  const filteredBooks = allBooks.filter((book) => {
    const matchSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'Semua' || book.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const studentHistory = allHistory.filter(h => h.memberId === studentData.nisn);
  const activeLoans = studentHistory.filter(h => h.status === 'dipinjam');
  const returnedBooks = studentHistory.filter(h => h.status === 'dikembalikan');

  // Fungsi Keranjang
  const toggleCart = (bookId: string) => {
    setCart(prev =>
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  const removeFromCart = (bookId: string) => {
    setCart(prev => prev.filter(id => id !== bookId));
  };

  const handleBorrow = (bookId: string, bookTitle: string) => {
    const borrowDate = new Date().toISOString().slice(0, 10);
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + 7);
    const dueDate = dueDateObj.toISOString().slice(0, 10);

    const res = borrowBook(bookId, studentData.nisn, studentData.nama, borrowDate, dueDate);
    if (res.ok) {
      alert(res.message);
      removeFromCart(bookId);
    } else {
      alert(res.message);
    }
  };

  const handleBorrowAllFromCart = () => {
    if (cart.length === 0) return;

    let successCount = 0;
    cart.forEach(bookId => {
      const book = allBooks.find(b => b.id === bookId);
      if (book && book.available > 0) {
        const borrowDate = new Date().toISOString().slice(0, 10);
        const dueDateObj = new Date();
        dueDateObj.setDate(dueDateObj.getDate() + 7);
        const dueDate = dueDateObj.toISOString().slice(0, 10);

        const res = borrowBook(bookId, studentData.nisn, studentData.nama, borrowDate, dueDate);
        if (res.ok) successCount++;
      }
    });

    alert(`${successCount} buku berhasil diajukan untuk peminjaman.`);
    setCart([]);
    setActiveTab('pinjaman');
  };

  const handleReturn = (txId: string, bookTitle: string) => {
    const returnDate = new Date().toISOString().slice(0, 10);
    const res = returnBook(txId, returnDate);
    if (res.ok) {
      alert(`Buku ${bookTitle} telah dikembalikan. Terima kasih.`);
    } else {
      alert(res.message);
    }
  };

  // Cek notifikasi (pinjaman yang baru disetujui atau ditolak)
  const notifications = useMemo(() => {
    return studentHistory.filter(h => h.status === 'disetujui' || h.status === 'ditolak');
  }, [studentHistory]);

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-800 antialiased flex flex-col">

      {/* HEADER UTAMA */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="mx-auto px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-900 flex items-center justify-center text-white rounded">
              <Library className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-neutral-950 leading-none">Sistem Informasi Perpustakaan</h1>
              <p className="text-[11px] text-neutral-500 mt-0.5">SMP Negeri 1 Majenang</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* JAM OPERASIONAL */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-tight">
                Jam Buka: 08:30 - 15:30 WIB
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right text-xs">
                <span className="font-semibold text-neutral-900 block">{studentData.nama}</span>
                <span className="text-neutral-500 block">Kelas {studentData.kelas} &bull; NISN {studentData.nisn}</span>
              </div>
              <div className="flex items-center gap-1 border-l border-neutral-200 pl-4">
                <button
                  onClick={onBackToPortal}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900 px-2 py-1 transition"
                >
                  Portal
                </button>
                <button
                  onClick={onLogout}
                  className="text-xs font-medium text-red-600 hover:text-red-800 px-2 py-1 rounded transition"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* CONTAINER UTAMA DENGAN SIDEBAR */}
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto">

        {/* SIDEBAR KIRI (Standard Web Portal) */}
        <aside className="w-64 border-r border-neutral-200 bg-white p-4 flex flex-col justify-between hidden md:flex">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block px-3 mb-2">Navigasi Utama</span>
              <nav className="space-y-1">
                {[
                  { key: 'katalog' as const, label: 'Katalog Literatur', icon: BookOpen },
                  { key: 'pinjaman' as const, label: `Status Pinjaman (${studentHistory.filter(h => h.status === 'menunggu' || h.status === 'disetujui').length})`, icon: Bookmark },
                  { key: 'riwayat' as const, label: 'Arsip Riwayat', icon: History },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded transition ${activeTab === item.key
                        ? 'bg-neutral-100 text-neutral-950 font-semibold'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                      }`}
                  >
                    <item.icon className="w-4 h-4 text-neutral-500" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {notifications.length > 0 && (
              <div className="px-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">Notifikasi Terbaru</span>
                <div className="space-y-2">
                  {notifications.slice(0, 3).map(n => (
                    <div key={n.id} className={`p-2 rounded border text-[10px] leading-snug ${n.status === 'disetujui' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                      <span className="font-bold block uppercase mb-0.5">{n.status === 'disetujui' ? 'Disetujui' : 'Ditolak'}</span>
                      {allBooks.find(b => b.id === n.bookId)?.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block px-3 mb-2">Penanda Buku</span>
              <button
                onClick={() => setActiveTab('keranjang')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition ${activeTab === 'keranjang'
                    ? 'bg-neutral-100 text-neutral-950 font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-4 h-4 text-neutral-500" />
                  <span>Keranjang Pinjam</span>
                </div>
                {cart.length > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-neutral-900 text-white rounded font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 text-[11px] text-neutral-400">
            <p>Log Akun: {studentData.nisn}</p>
            <p className="font-mono text-[9px] mt-0.5">Status: Terautentikasi</p>
          </div>
        </aside>

        {/* KONTEN UTAMA */}
        <main className="flex-1 p-6 md:p-8">

          {/* HEADER HALAMAN */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-neutral-950 uppercase tracking-tight">
                {activeTab === 'katalog' && 'Katalog Literatur Perpustakaan'}
                {activeTab === 'pinjaman' && 'Daftar Pinjaman & Status'}
                {activeTab === 'riwayat' && 'Log Arsip Riwayat Sirkulasi'}
                {activeTab === 'keranjang' && 'Daftar Rencana Pinjaman Buku'}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {activeTab === 'katalog' && 'Pilih, tandai, atau ajukan permohonan sirkulasi literatur akademik.'}
                {activeTab === 'pinjaman' && 'Pantau status permohonan dan batas tanggal pengembalian.'}
                {activeTab === 'riwayat' && 'Catatan historis pengembalian buku yang telah diselesaikan.'}
                {activeTab === 'keranjang' && 'Daftar buku yang Anda tandai untuk dipinjam bersamaan.'}
              </p>
            </div>

            {/* Pencarian khusus tab katalog */}
            {activeTab === 'katalog' && (
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul atau pengarang..."
                  className="w-full pl-9 pr-4 py-1.5 bg-white border border-neutral-300 rounded text-xs focus:outline-none focus:border-neutral-900"
                />
              </div>
            )}
          </div>

          {/* TAB 1: KATALOG BUKU */}
          {activeTab === 'katalog' && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 border-b border-neutral-100">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mr-2 flex items-center gap-1">
                  <Filter className="w-3 h-3" /> Bidang:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded text-xs font-medium border transition ${selectedCategory === cat
                        ? 'bg-neutral-900 border-neutral-900 text-white'
                        : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="bg-white border border-neutral-200 rounded overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      <th className="py-2.5 px-4">Informasi Buku</th>
                      <th className="py-2.5 px-4">Kategori / Bidang</th>
                      <th className="py-2.5 px-4 text-center">Stok</th>
                      <th className="py-2.5 px-4 text-right">Tandai / Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {filteredBooks.length > 0 ? (
                      filteredBooks.map((book) => (
                        <tr key={book.id} className="hover:bg-neutral-50/50 transition">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-neutral-900">{book.title}</div>
                            <div className="text-neutral-500 mt-0.5">Penulis: {book.author}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded border border-neutral-200 text-[11px]">
                              {book.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {book.available > 0 ? (
                              <span className="text-emerald-700 font-medium">{book.available} Tersedia</span>
                            ) : (
                              <span className="text-neutral-400">Kosong</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              {/* Tombol Keranjang */}
                              <button
                                onClick={() => toggleCart(book.id)}
                                disabled={book.available === 0}
                                title={cart.includes(book.id) ? "Hapus penanda" : "Tandai di keranjang"}
                                className={`p-1.5 border rounded transition ${book.available === 0
                                    ? 'bg-neutral-50 text-neutral-200 border-neutral-200 cursor-not-allowed'
                                    : cart.includes(book.id)
                                      ? 'bg-neutral-900 text-white border-neutral-900'
                                      : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                                  }`}
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                              </button>

                              {/* Tombol Pinjam Langsung */}
                              <button
                                onClick={() => handleBorrow(book.id, book.title)}
                                disabled={book.available === 0}
                                className={`px-2.5 py-1.5 font-medium border rounded transition ${book.available > 0
                                    ? 'bg-white border-neutral-300 text-neutral-800 hover:border-neutral-900 hover:bg-neutral-50'
                                    : 'bg-neutral-50 border-neutral-200 text-neutral-300 cursor-not-allowed'
                                  }`}
                              >
                                {studentHistory.some(h => h.bookId === book.id && h.status === 'menunggu') ? 'Menunggu...' : 'Pinjam'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-10 text-neutral-400">
                          Tidak ada koleksi literatur yang cocok dengan kriteria pencarian.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PINJAMAN AKTIF & STATUS */}
          {activeTab === 'pinjaman' && (
            <div className="bg-white border border-neutral-200 rounded overflow-hidden">
              {studentHistory.filter(h => h.status !== 'dikembalikan').length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      <th className="py-2.5 px-4">Judul Literatur</th>
                      <th className="py-2.5 px-4">Tgl Pinjam</th>
                      <th className="py-2.5 px-4">Status / Batas</th>
                      <th className="py-2.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {studentHistory.filter(h => h.status !== 'dikembalikan').map((loan) => (
                      <tr key={loan.id} className="hover:bg-neutral-50/50">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-neutral-900">
                            {allBooks.find(b => b.id === loan.bookId)?.title || 'Buku Tidak Diketahui'}
                          </span>
                          {loan.note && <p className="text-[10px] text-red-500 mt-1 italic">Catatan: {loan.note}</p>}
                        </td>
                        <td className="py-3 px-4 text-neutral-600">{loan.borrowDate}</td>
                        <td className="py-3 px-4">
                          {loan.status === 'menunggu' && (
                            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full border border-neutral-200 font-bold uppercase text-[9px]">
                              Menunggu Konfirmasi
                            </span>
                          )}
                          {loan.status === 'disetujui' && (
                            <div className="flex flex-col">
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 font-bold uppercase text-[9px] w-fit mb-1">
                                Disetujui
                              </span>
                              <span className="text-red-600 font-bold">Batas: {loan.dueDate}</span>
                            </div>
                          )}
                          {loan.status === 'ditolak' && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full border border-red-200 font-bold uppercase text-[9px]">
                              Ditolak
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {loan.status === 'disetujui' && (
                            <button
                              onClick={() => handleReturn(loan.id, allBooks.find(b => b.id === loan.bookId)?.title || 'Buku')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 border border-neutral-300 hover:border-emerald-600 text-neutral-700 hover:text-emerald-700 rounded transition font-medium"
                            >
                              <RotateCcw className="w-3 h-3" />
                              Kembalikan Buku
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 text-neutral-400 text-xs">
                  Siswa tidak tercatat memiliki beban pinjaman aktif atau permohonan tertunda.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ARSIP RIWAYAT */}
          {activeTab === 'riwayat' && (
            <div className="bg-white border border-neutral-200 rounded overflow-hidden">
              {returnedBooks.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      <th className="py-2.5 px-4">Judul Literatur</th>
                      <th className="py-2.5 px-4">Rentang Durasi Sirkulasi</th>
                      <th className="py-2.5 px-4 text-right">Status Record</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {returnedBooks.map((loan) => (
                      <tr key={loan.id} className="hover:bg-neutral-50/50">
                        <td className="py-3 px-4 font-semibold text-neutral-800">
                          {allBooks.find(b => b.id === loan.bookId)?.title || 'Buku'}
                        </td>
                        <td className="py-3 px-4 text-neutral-500">
                          {loan.borrowDate} <span className="mx-1">&rarr;</span> {loan.returnDate}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Sudah Dikembalikan
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 text-neutral-400 text-xs">
                  Belum ada log riwayat peminjaman dalam arsip akun ini.
                </div>
              )}
            </div>
          )}

          {/* TAB NEW: KERANJANG PENANDA BUKU */}
          {activeTab === 'keranjang' && (
            <div className="bg-white border border-neutral-200 rounded overflow-hidden">
              {cart.length > 0 ? (
                <div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        <th className="py-2.5 px-4">Judul Buku Terpilih</th>
                        <th className="py-2.5 px-4">Kategori</th>
                        <th className="py-2.5 px-4 text-right">Opsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-xs">
                      {cart.map((bookId) => {
                        const targetBook = allBooks.find(b => b.id === bookId);
                        if (!targetBook) return null;
                        return (
                          <tr key={targetBook.id} className="hover:bg-neutral-50/50">
                            <td className="py-3 px-4">
                              <div className="font-semibold text-neutral-900">{targetBook.title}</div>
                              <div className="text-neutral-500 text-[11px]">{targetBook.author}</div>
                            </td>
                            <td className="py-3 px-4 text-neutral-600">{targetBook.category}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => removeFromCart(targetBook.id)}
                                className="text-red-600 hover:text-red-800 p-1 rounded transition"
                                title="Hapus"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Panel Eksekusi Kolektif */}
                  <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-xs text-neutral-500">
                      Total ditandai: <strong className="text-neutral-900">{cart.length} Buku</strong>
                    </span>
                    <button
                      onClick={handleBorrowAllFromCart}
                      className="px-4 py-2 bg-neutral-900 text-white rounded text-xs font-bold hover:bg-neutral-800 transition"
                    >
                      Ajukan Semua Pinjaman Beruntun
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-400 text-xs space-y-2">
                  <p>Keranjang penanda buku Anda masih kosong.</p>
                  <p className="text-[11px]">Gunakan ikon keranjang pada tabel Katalog Literatur untuk menandai buku.</p>
                  <button
                    onClick={() => setActiveTab('katalog')}
                    className="text-neutral-950 font-semibold underline mt-2"
                  >
                    Buka Katalog Buku
                  </button>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 bg-white py-4 mt-auto">
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between text-xs text-neutral-400">
          <p>&copy; 2026 UPT Perpustakaan SMP Negeri 1 Majenang. All Rights Reserved.</p>
          <p className="font-mono text-[10px]">v2.2.0-stable</p>
        </div>
      </footer>

    </div>
  );
}
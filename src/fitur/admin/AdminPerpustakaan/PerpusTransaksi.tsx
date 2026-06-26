import { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, X, RotateCcw, Trash2, Check, Ban, BookOpen, User, CalendarDays, AlertCircle, Printer, Settings, Receipt, Search, PenLine } from 'lucide-react';
import {
  getBooks, getStudents, borrowBook, returnBook, getLibraryTransactions,
  approveLibraryLoan, rejectLibraryLoan
} from '../../../data/store';
import { useStoreVersion } from '../../../hooks/useStoreVersion';

interface PerpusTransaksiProps {
  activeSubTab: 'pinjam' | 'kembali';
}

// ==================== KONFIGURASI DENDA ====================
const DEFAULT_DENDA_PER_HARI = 1000;

function getDendaConfig(): number {
  const saved = localStorage.getItem('perpus-denda-per-hari');
  return saved ? parseInt(saved, 10) : DEFAULT_DENDA_PER_HARI;
}

function setDendaConfig(amount: number) {
  localStorage.setItem('perpus-denda-per-hari', String(amount));
}

// ==================== HELPER: HIGHLIGHT MATCH ====================
function highlightMatch(text: string, query: string): JSX.Element {
  if (!query.trim()) return <>{text}</>;

  const q = query.toLowerCase().trim();
  const queryWords = q.split(/\s+/);
  const textLower = text.toLowerCase();

  const highlights: { start: number; end: number }[] = [];

  for (const qWord of queryWords) {
    const wordRegex = /\S+/g;
    let match;
    while ((match = wordRegex.exec(textLower)) !== null) {
      if (match[0].startsWith(qWord)) {
        highlights.push({ start: match.index, end: match.index + qWord.length });
      }
    }
  }

  if (highlights.length === 0) {
    const idx = textLower.indexOf(q);
    if (idx >= 0) {
      highlights.push({ start: idx, end: idx + q.length });
    }
  }

  if (highlights.length === 0) return <>{text}</>;

  highlights.sort((a, b) => a.start - b.start);
  const merged: { start: number; end: number }[] = [];
  for (const h of highlights) {
    if (merged.length > 0 && h.start <= merged[merged.length - 1].end) {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, h.end);
    } else {
      merged.push({ ...h });
    }
  }

  const parts: JSX.Element[] = [];
  let lastIndex = 0;
  merged.forEach((h, i) => {
    if (h.start > lastIndex) {
      parts.push(<span key={`t-${i}`}>{text.slice(lastIndex, h.start)}</span>);
    }
    parts.push(
      <span key={`h-${i}`} className="bg-yellow-200 text-yellow-900 font-bold rounded px-0.5">
        {text.slice(h.start, h.end)}
      </span>
    );
    lastIndex = h.end;
  });
  if (lastIndex < text.length) {
    parts.push(<span key="last">{text.slice(lastIndex)}</span>);
  }

  return <>{parts}</>;
}

// ==================== KOMPONEN PENGEMBALIAN ====================

interface FormPengembalianProps {
  allTx: ReturnType<typeof getLibraryTransactions>;
  allBooks: ReturnType<typeof getBooks>;
  allStudents: ReturnType<typeof getStudents>;
}

interface StrukData {
  txId: string;
  bookTitle: string;
  studentName: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string;
  daysLate: number;
  denda: number;
  dendaPerHari: number;
}

function FormPengembalian({ allTx, allBooks, allStudents }: FormPengembalianProps) {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [showDendaSettings, setShowDendaSettings] = useState(false);
  const [dendaPerHari, setDendaPerHari] = useState(getDendaConfig());
  const [struk, setStruk] = useState<StrukData | null>(null);

  const [memberSearch, setMemberSearch] = useState('');
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const memberDropdownRef = useRef<HTMLDivElement>(null);
  const memberInputRef = useRef<HTMLInputElement>(null);

  const studentsWithLoans = useMemo(() => {
    const memberIds = new Set(allTx.filter(t => t.status === 'dipinjam').map(t => t.memberId));
    return allStudents.filter(s => memberIds.has(s.id));
  }, [allTx, allStudents]);

  const filteredMembers = useMemo(() => {
    if (!memberSearch.trim()) {
      return studentsWithLoans.map(s => ({ student: s, matchType: 'prefix' as const }));
    }

    const q = memberSearch.toLowerCase().trim();
    const results: { student: typeof allStudents[0]; matchType: 'prefix' | 'word-start' | 'contains'; score: number }[] = [];

    studentsWithLoans.forEach(s => {
      const nameLower = s.name.toLowerCase();
      const nisLower = s.nis.toLowerCase();
      const nameWords = nameLower.split(/\s+/);
      const queryWords = q.split(/\s+/);

      let score = 0;
      let matched = false;
      let matchType: 'prefix' | 'word-start' | 'contains' = 'contains';

      if (nisLower.startsWith(q)) {
        score = 900; matchType = 'prefix'; matched = true;
      } else if (nisLower.includes(q)) {
        score = 200; matchType = 'contains'; matched = true;
      }

      let allWordsMatch = true;
      let nameScore = 0;
      const usedWordIndices = new Set<number>();

      for (const qWord of queryWords) {
        let wordMatched = false;
        for (let i = 0; i < nameWords.length; i++) {
          if (!usedWordIndices.has(i) && nameWords[i].startsWith(qWord)) {
            wordMatched = true;
            usedWordIndices.add(i);
            nameScore += (nameWords.length - i) * 10 + (qWord.length / Math.max(nameWords[i].length, 1)) * 5;
            break;
          }
        }
        if (!wordMatched) { allWordsMatch = false; break; }
      }

      if (allWordsMatch) {
        if (nameLower.startsWith(q)) {
          score = Math.max(score, 1000 + nameScore); matchType = 'prefix';
        } else {
          score = Math.max(score, 500 + nameScore);
          if (matchType !== 'prefix') matchType = 'word-start';
        }
        matched = true;
      } else if (!matched && nameLower.includes(q)) {
        score = Math.max(score, 100 - nameLower.indexOf(q));
        matchType = 'contains'; matched = true;
      }

      if (matched) results.push({ student: s, matchType, score });
    });

    results.sort((a, b) => b.score - a.score);
    return results.map(r => ({ student: r.student, matchType: r.matchType }));
  }, [memberSearch, studentsWithLoans]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(e.target as Node)) {
        setShowMemberDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMemberSearchChange = (query: string) => {
    setMemberSearch(query);
    setSelectedMemberId('');
    setShowMemberDropdown(true);
    setStruk(null);
  };

  const handleSelectMember = (student: typeof allStudents[0]) => {
    setSelectedMemberId(student.id);
    setMemberSearch(`${student.name} (${student.nis})`);
    setShowMemberDropdown(false);
    setStruk(null);
  };

  const memberLoans = useMemo(() => {
    if (!selectedMemberId) return [];
    return allTx.filter(t => t.memberId === selectedMemberId && t.status === 'dipinjam');
  }, [allTx, selectedMemberId]);

  const getSisaHari = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getDenda = (dueDate: string) => {
    const sisa = getSisaHari(dueDate);
    if (sisa >= 0) return 0;
    return Math.abs(sisa) * dendaPerHari;
  };

  const handleReturn = (txId: string, bookTitle: string) => {
    const returnDate = new Date().toISOString().slice(0, 10);
    const tx = allTx.find(t => t.id === txId);
    if (!tx) return;

    const res = returnBook(txId, returnDate);
    if (res.ok) {
      const sisaHari = getSisaHari(tx.dueDate);
      const denda = getDenda(tx.dueDate);
      const daysLate = sisaHari < 0 ? Math.abs(sisaHari) : 0;
      const student = allStudents.find(s => s.id === tx.memberId);
      setStruk({ txId, bookTitle, studentName: student?.name || tx.memberName, borrowDate: tx.borrowDate, dueDate: tx.dueDate, returnDate, daysLate, denda, dendaPerHari });

      if (denda > 0) {
        alert(`Buku "${bookTitle}" berhasil dikembalikan.\nDenda keterlambatan: Rp ${denda.toLocaleString('id-ID')}\n(${daysLate} hari x Rp ${dendaPerHari.toLocaleString('id-ID')})`);
      } else {
        alert(`Buku "${bookTitle}" berhasil dikembalikan tepat waktu.`);
      }
    } else {
      alert(res.message);
    }
  };

  const handleSaveDenda = () => {
    setDendaConfig(dendaPerHari);
    setShowDendaSettings(false);
    alert(`Tarif denda diperbarui: Rp ${dendaPerHari.toLocaleString('id-ID')} per hari`);
  };

  const handlePrintStruk = () => {
    if (!struk) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const html = `<!DOCTYPE html><html><head><title>Struk Pengembalian - ${struk.txId}</title><style>body{font-family:'Courier New',monospace;padding:20px;max-width:320px;margin:0 auto}.header{text-align:center;border-bottom:2px dashed #333;padding-bottom:10px;margin-bottom:15px}.header h2{margin:0;font-size:14px}.header p{margin:5px 0 0;font-size:11px;color:#666}.row{display:flex;justify-content:space-between;margin:6px 0;font-size:12px}.row.label{font-weight:bold;margin-top:10px}.divider{border-top:1px dashed #ccc;margin:10px 0}.total{font-size:14px;font-weight:bold;border-top:2px solid #333;padding-top:8px;margin-top:10px}.footer{text-align:center;margin-top:20px;font-size:10px;color:#999}@media print{body{padding:0}.no-print{display:none}}</style></head><body><div class="header"><h2>PERPUSTAKAAN SMPN 1 MAJENANG</h2><p>Struk Pengembalian Buku</p></div><div class="row"><span>No. Transaksi:</span><span>${struk.txId}</span></div><div class="row"><span>Tanggal:</span><span>${struk.returnDate}</span></div><div class="divider"></div><div class="row label"><span>Nama Peminjam:</span></div><div class="row"><span>${struk.studentName}</span></div><div class="row label"><span>Judul Buku:</span></div><div class="row"><span>${struk.bookTitle}</span></div><div class="divider"></div><div class="row"><span>Tgl Pinjam:</span><span>${struk.borrowDate}</span></div><div class="row"><span>Tgl Jatuh Tempo:</span><span>${struk.dueDate}</span></div><div class="row"><span>Tgl Kembali:</span><span>${struk.returnDate}</span></div><div class="divider"></div><div class="row"><span>Keterlambatan:</span><span>${struk.daysLate} hari</span></div><div class="row"><span>Denda per Hari:</span><span>Rp ${struk.dendaPerHari.toLocaleString('id-ID')}</span></div><div class="total row"><span>TOTAL DENDA:</span><span>Rp ${struk.denda.toLocaleString('id-ID')}</span></div><div class="footer"><p>Terima kasih telah meminjam buku di perpustakaan kami.</p><p>Harap kembalikan buku tepat waktu.</p></div><div style="text-align:center;margin-top:20px" class="no-print"><button onclick="window.print()" style="padding:8px 20px;font-size:12px;cursor:pointer">🖨️ Cetak Struk</button></div></body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const selectedStudent = allStudents.find(s => s.id === selectedMemberId);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#3c8dbc]" />
            Form Pengembalian Buku
          </h2>
          <button
            onClick={() => setShowDendaSettings(!showDendaSettings)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition"
          >
            <Settings className="w-3.5 h-3.5" />
            Pengaturan Denda
          </button>
        </div>

        {showDendaSettings && (
          <div className="p-4 bg-amber-50 border-b border-amber-200">
            <div className="flex items-center gap-4 max-w-md">
              <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Denda per Hari:</label>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-sm font-bold text-gray-600">Rp</span>
                <input
                  type="number"
                  value={dendaPerHari}
                  onChange={(e) => setDendaPerHari(Math.max(0, parseInt(e.target.value) || 0))}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                  min="0"
                  step="500"
                />
              </div>
              <button onClick={handleSaveDenda} className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700 transition">
                Simpan
              </button>
            </div>
            <p className="text-[10px] text-amber-700 mt-2">
              Tarif saat ini: Rp {dendaPerHari.toLocaleString('id-ID')} per hari per buku. Standar perpustakaan sekolah: Rp 500 - Rp 1.000 per hari.
            </p>
          </div>
        )}

        <div className="p-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-[140px_1fr] gap-4 items-center mb-2">
            <label className="text-sm font-semibold text-gray-700 text-right pr-4">Pilih Siswa</label>
            <div className="relative" ref={memberDropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  ref={memberInputRef}
                  type="text"
                  value={memberSearch}
                  onChange={(e) => handleMemberSearchChange(e.target.value)}
                  onFocus={() => setShowMemberDropdown(true)}
                  placeholder="Ketik nama atau NIS siswa yang meminjam..."
                  className="w-full border border-gray-300 rounded pl-9 pr-8 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                />
                {memberSearch && (
                  <button
                    type="button"
                    onClick={() => { setMemberSearch(''); setSelectedMemberId(''); setShowMemberDropdown(false); setStruk(null); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {showMemberDropdown && !selectedMemberId && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {filteredMembers.length > 0 ? (
                    <>
                      <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100 sticky top-0">
                        <p className="text-[10px] text-gray-500 font-medium">
                          {memberSearch.trim()
                            ? `${filteredMembers.length} siswa ditemukan untuk "${memberSearch}"`
                            : `${filteredMembers.length} siswa dengan pinjaman aktif`
                          }
                        </p>
                      </div>
                      {filteredMembers.map(({ student, matchType }) => {
                        const loanCount = allTx.filter(t => t.memberId === student.id && t.status === 'dipinjam').length;
                        return (
                          <button
                            key={student.id}
                            type="button"
                            onClick={() => handleSelectMember(student)}
                            className="w-full text-left px-3 py-2.5 hover:bg-blue-50 text-sm flex items-center gap-3 transition border-b border-gray-50 last:border-0"
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${
                              matchType === 'prefix'
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                                : matchType === 'word-start'
                                ? 'bg-gradient-to-br from-sky-400 to-sky-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 truncate">
                                {highlightMatch(student.name, memberSearch)}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-gray-500">
                                  NIS: {highlightMatch(student.nis, memberSearch)}
                                </span>
                                {student.classId && (
                                  <span className="text-[10px] text-gray-400">• Kelas: {student.classId}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                loanCount > 2 ? 'bg-red-100 text-red-700' :
                                loanCount > 0 ? 'bg-amber-100 text-amber-700' :
                                'bg-gray-100 text-gray-500'
                              }`}>
                                {loanCount} buku
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </>
                  ) : (
                    <div className="p-4 text-center">
                      <User className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-xs text-gray-400">
                        Tidak ditemukan siswa dengan pinjaman aktif untuk &quot;{memberSearch}&quot;
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedMemberId && selectedStudent && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3c8dbc] text-white flex items-center justify-center font-bold text-sm">
                {selectedStudent.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">{selectedStudent.name}</p>
                <p className="text-xs text-gray-500">NIS: {selectedStudent.nis} | Kelas: {selectedStudent.classId || '-'}</p>
              </div>
              <button
                onClick={() => { setSelectedMemberId(''); setMemberSearch(''); setStruk(null); }}
                className="text-gray-400 hover:text-red-500 transition"
                title="Ganti siswa"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedMemberId && (
        <div className="bg-white rounded shadow-sm border-t-4 border-emerald-500">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Daftar Buku yang Dipinjam ({memberLoans.length})
            </h3>
            {struk && (
              <button
                onClick={handlePrintStruk}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3c8dbc] text-white text-xs font-bold rounded hover:bg-[#357ca5] transition"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Struk Terakhir
              </button>
            )}
          </div>

          {memberLoans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold">
                    <th className="px-4 py-3 text-left">No</th>
                    <th className="px-4 py-3 text-left">ID Transaksi</th>
                    <th className="px-4 py-3 text-left">Judul Buku</th>
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />Tgl Pinjam</div>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <div className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />Tgl Kembali</div>
                    </th>
                    <th className="px-4 py-3 text-center">Sisa Hari</th>
                    <th className="px-4 py-3 text-right">Denda</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {memberLoans.map((loan, idx) => {
                    const book = allBooks.find(b => b.id === loan.bookId);
                    const sisaHari = getSisaHari(loan.dueDate);
                    const denda = getDenda(loan.dueDate);
                    return (
                      <tr key={loan.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">{loan.id}</span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800">{book?.title || 'Buku Tidak Diketahui'}</td>
                        <td className="px-4 py-3 text-gray-600">{loan.borrowDate}</td>
                        <td className="px-4 py-3 text-gray-600 font-medium">{loan.dueDate}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs font-bold ${sisaHari < 0 ? 'text-red-600' : sisaHari <= 2 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {sisaHari < 0 ? `${Math.abs(sisaHari)} hari telat` : sisaHari === 0 ? 'Hari ini' : `${sisaHari} hari lagi`}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {denda > 0 ? (
                            <span className="text-red-600 font-bold">Rp {denda.toLocaleString('id-ID')}</span>
                          ) : (
                            <span className="text-emerald-600 text-[10px]">Tidak ada</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleReturn(loan.id, book?.title || 'Buku')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 transition text-[10px]"
                          >
                            <Check className="w-3 h-3" />
                            KEMBALIKAN
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Siswa ini tidak memiliki buku yang sedang dipinjam.</p>
            </div>
          )}
        </div>
      )}

      {!selectedMemberId && (
        <div className="bg-amber-50 border border-amber-200 rounded p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">Cara Mengembalikan Buku</p>
            <ol className="text-xs text-amber-700 mt-1 space-y-1 list-decimal list-inside">
              <li>Ketik nama atau NIS siswa di kolom pencarian di atas</li>
              <li>Pilih siswa dari hasil pencarian yang muncul</li>
              <li>Sistem akan menampilkan semua buku yang sedang dipinjam siswa tersebut</li>
              <li>Klik tombol <strong>KEMBALIKAN</strong> pada buku yang ingin dicatat pengembaliannya</li>
              <li>Stok buku akan otomatis bertambah dan status berubah menjadi &quot;dikembalikan&quot;</li>
              <li>Struk pengembalian bisa dicetak untuk arsip</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
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

  const [memberSearch, setMemberSearch] = useState('');
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const memberDropdownRef = useRef<HTMLDivElement>(null);
  const memberInputRef = useRef<HTMLInputElement>(null);

  const [bookSearch, setBookSearch] = useState('');
  const [showBookDropdown, setShowBookDropdown] = useState(false);
  const bookDropdownRef = useRef<HTMLDivElement>(null);
  const bookInputRef = useRef<HTMLInputElement>(null);

  const [tglPinjam, setTglPinjam] = useState(new Date().toISOString().slice(0, 10));
  const [tglKembali, setTglKembali] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().slice(0, 10);
  });
  const [keterangan, setKeterangan] = useState('Pinjam');

  // ==================== SMART SEARCH: ANGGOTA ====================
  const filteredMembers = useMemo(() => {
    if (!memberSearch.trim()) {
      return allStudents.slice(0, 20).map(s => ({ student: s, matchType: 'prefix' as const }));
    }
    const q = memberSearch.toLowerCase().trim();
    const results: { student: typeof allStudents[0]; matchType: 'prefix' | 'word-start' | 'contains'; score: number }[] = [];

    allStudents.forEach(s => {
      const nameLower = s.name.toLowerCase();
      const nisLower = s.nis.toLowerCase();
      const nameWords = nameLower.split(/\s+/);
      const queryWords = q.split(/\s+/);

      let score = 0; let matched = false;
      let matchType: 'prefix' | 'word-start' | 'contains' = 'contains';

      if (nisLower.startsWith(q)) { score = 900; matchType = 'prefix'; matched = true; }
      else if (nisLower.includes(q)) { score = 200; matchType = 'contains'; matched = true; }

      let allWordsMatch = true; let nameScore = 0;
      const usedWordIndices = new Set<number>();

      for (const qWord of queryWords) {
        let wordMatched = false;
        for (let i = 0; i < nameWords.length; i++) {
          if (!usedWordIndices.has(i) && nameWords[i].startsWith(qWord)) {
            wordMatched = true; usedWordIndices.add(i);
            nameScore += (nameWords.length - i) * 10 + (qWord.length / Math.max(nameWords[i].length, 1)) * 5;
            break;
          }
        }
        if (!wordMatched) { allWordsMatch = false; break; }
      }

      if (allWordsMatch) {
        if (nameLower.startsWith(q)) { score = Math.max(score, 1000 + nameScore); matchType = 'prefix'; }
        else { score = Math.max(score, 500 + nameScore); if (matchType !== 'prefix') matchType = 'word-start'; }
        matched = true;
      } else if (!matched && nameLower.includes(q)) {
        score = Math.max(score, 100 - nameLower.indexOf(q)); matchType = 'contains'; matched = true;
      }

      if (matched) results.push({ student: s, matchType, score });
    });

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 30).map(r => ({ student: r.student, matchType: r.matchType }));
  }, [memberSearch, allStudents]);

  // ==================== SMART SEARCH: BUKU ====================
  const filteredBooks = useMemo(() => {
    const alreadySelected = new Set(selectedBooks.map(b => b.id));

    if (!bookSearch.trim()) {
      return allBooks
        .filter(b => b.available > 0 && !alreadySelected.has(b.id))
        .slice(0, 20)
        .map(b => ({ book: b, matchType: 'prefix' as const, matchField: 'title' as const }));
    }

    const q = bookSearch.toLowerCase().trim();
    const results: { book: typeof allBooks[0]; matchType: 'prefix' | 'word-start' | 'contains'; matchField: 'title' | 'author' | 'id'; score: number }[] = [];

    allBooks.forEach(b => {
      if (b.available <= 0 || alreadySelected.has(b.id)) return;

      const titleLower = b.title.toLowerCase();
      const authorLower = b.author.toLowerCase();
      const idLower = b.id.toLowerCase();
      const queryWords = q.split(/\s+/);

      let bestScore = 0;
      let bestMatchType: 'prefix' | 'word-start' | 'contains' = 'contains';
      let bestMatchField: 'title' | 'author' | 'id' = 'title';

      // Cek judul
      const titleWords = titleLower.split(/\s+/);
      let allTitleWordsMatch = true; let titleScore = 0;
      const usedTitleIndices = new Set<number>();
      for (const qWord of queryWords) {
        let wm = false;
        for (let i = 0; i < titleWords.length; i++) {
          if (!usedTitleIndices.has(i) && titleWords[i].startsWith(qWord)) {
            wm = true; usedTitleIndices.add(i);
            titleScore += (titleWords.length - i) * 10 + (qWord.length / Math.max(titleWords[i].length, 1)) * 5;
            break;
          }
        }
        if (!wm) { allTitleWordsMatch = false; break; }
      }
      if (allTitleWordsMatch) {
        bestScore = titleLower.startsWith(q) ? 1000 + titleScore : 500 + titleScore;
        bestMatchType = titleLower.startsWith(q) ? 'prefix' : 'word-start';
        bestMatchField = 'title';
      } else if (titleLower.includes(q)) {
        bestScore = 100 - titleLower.indexOf(q); bestMatchType = 'contains'; bestMatchField = 'title';
      }

      // Cek pengarang
      const authorWords = authorLower.split(/\s+/);
      let allAuthorWordsMatch = true; let authorScore = 0;
      const usedAuthorIndices = new Set<number>();
      for (const qWord of queryWords) {
        let wm = false;
        for (let i = 0; i < authorWords.length; i++) {
          if (!usedAuthorIndices.has(i) && authorWords[i].startsWith(qWord)) {
            wm = true; usedAuthorIndices.add(i);
            authorScore += (authorWords.length - i) * 10 + (qWord.length / Math.max(authorWords[i].length, 1)) * 5;
            break;
          }
        }
        if (!wm) { allAuthorWordsMatch = false; break; }
      }
      if (allAuthorWordsMatch) {
        const aScore = authorLower.startsWith(q) ? 800 + authorScore : 400 + authorScore;
        if (aScore > bestScore) { bestScore = aScore; bestMatchType = authorLower.startsWith(q) ? 'prefix' : 'word-start'; bestMatchField = 'author'; }
      } else if (authorLower.includes(q)) {
        const aScore = 80 - authorLower.indexOf(q);
        if (aScore > bestScore) { bestScore = aScore; bestMatchType = 'contains'; bestMatchField = 'author'; }
      }

      // Cek ID
      if (idLower.startsWith(q)) {
        if (700 > bestScore) { bestScore = 700; bestMatchType = 'prefix'; bestMatchField = 'id'; }
      } else if (idLower.includes(q)) {
        if (150 > bestScore) { bestScore = 150; bestMatchType = 'contains'; bestMatchField = 'id'; }
      }

      if (bestScore > 0) results.push({ book: b, matchType: bestMatchType, matchField: bestMatchField, score: bestScore });
    });

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 30).map(r => ({ book: r.book, matchType: r.matchType, matchField: r.matchField }));
  }, [bookSearch, allBooks, selectedBooks]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(e.target as Node)) setShowMemberDropdown(false);
      if (bookDropdownRef.current && !bookDropdownRef.current.contains(e.target as Node)) setShowBookDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApprove = (txId: string) => { const res = approveLibraryLoan(txId); if (!res.ok) alert(res.message); };
  const handleReject = (txId: string) => { const note = prompt('Alasan penolakan:'); if (note !== null) rejectLibraryLoan(txId, note); };

  const handleMemberSearchChange = (query: string) => { setMemberSearch(query); setSelectedMemberId(''); setShowMemberDropdown(true); };
  const handleSelectMember = (student: typeof allStudents[0]) => { setSelectedMemberId(student.id); setMemberSearch(`${student.name} (${student.nis})`); setShowMemberDropdown(false); };
  const handleClearMember = () => { setMemberSearch(''); setSelectedMemberId(''); setShowMemberDropdown(false); memberInputRef.current?.focus(); };

  const handleBookSearchChange = (query: string) => { setBookSearch(query); setSelectedBookId(''); setShowBookDropdown(true); };
  const handleSelectBook = (book: typeof allBooks[0]) => { setSelectedBookId(book.id); setBookSearch(book.title); setShowBookDropdown(false); };
  const handleClearBook = () => { setBookSearch(''); setSelectedBookId(''); setShowBookDropdown(false); bookInputRef.current?.focus(); };

  const handleAddBook = () => {
    if (!selectedBookId) return;
    const book = allBooks.find(b => b.id === selectedBookId);
    if (book && !selectedBooks.find(sb => sb.id === book.id)) {
      if (book.available <= 0) { alert('Stok buku habis!'); return; }
      setSelectedBooks([...selectedBooks, { id: book.id, title: book.title, qty: 1 }]);
    }
    setSelectedBookId(''); setBookSearch(''); setShowBookDropdown(false);
    setTimeout(() => bookInputRef.current?.focus(), 100);
  };

  const handleRemoveBook = (id: string) => setSelectedBooks(selectedBooks.filter(b => b.id !== id));

  const handleProcess = () => {
    if (!selectedMemberId) { alert('Pilih anggota terlebih dahulu.'); return; }
    if (isPinjam) {
      if (selectedBooks.length === 0) { alert('Pilih minimal satu buku.'); return; }
      const student = allStudents.find(s => s.id === selectedMemberId);
      const studentName = student ? student.name : 'Unknown';
      let successCount = 0;
      selectedBooks.forEach(b => { const res = borrowBook(b.id, selectedMemberId, studentName, tglPinjam, tglKembali); if (res.ok) successCount++; });
      alert(`${successCount} buku berhasil diajukan pinjamannya.`);
      setSelectedBooks([]); setSelectedMemberId(''); setMemberSearch(''); setBookSearch(''); setSelectedBookId('');
      setIdPeminjaman(`TX-${Date.now().toString().slice(-6)}`);
    }
  };

  const handleReset = () => {
    setSelectedBooks([]); setSelectedMemberId(''); setMemberSearch(''); setBookSearch(''); setSelectedBookId('');
    setShowMemberDropdown(false); setShowBookDropdown(false);
    setIdPeminjaman(`TX-${Date.now().toString().slice(-6)}`);
  };

  return (
    <div className="space-y-6">
      {/* TABEL PERMOHONAN TERTUNDA */}
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
                    <td className="px-4 py-3 text-gray-700">{allBooks.find(b => b.id === tx.bookId)?.title}</td>
                    <td className="px-4 py-3 text-gray-600">{tx.borrowDate}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleApprove(tx.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700 transition">
                          <Check className="w-3.5 h-3.5" /> SETUJUI
                        </button>
                        <button onClick={() => handleReject(tx.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition">
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

      {/* FORM PEMINJAMAN BARU */}
      {isPinjam && (
        <div className="bg-white rounded shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Form Peminjaman Baru</h2>
          </div>

          <div className="p-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-[140px_1fr] gap-4 items-center mb-6">
              <label className="text-sm font-semibold text-gray-700 text-right pr-4">ID Peminjaman</label>
              <div className="relative">
                <input type="text" value={idPeminjaman} readOnly className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-100 text-gray-500 font-mono" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">Auto</span>
              </div>

              <label className="text-sm font-semibold text-gray-700 text-right pr-4">Tgl Pinjam</label>
              <input type="date" value={tglPinjam} onChange={(e) => setTglPinjam(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm" />

              <label className="text-sm font-semibold text-gray-700 text-right pr-4">Tgl Kembali</label>
              <input type="date" value={tglKembali} onChange={(e) => setTglKembali(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm" />

              {/* AUTOCOMPLETE ANGGOTA */}
              <label className="text-sm font-semibold text-gray-700 text-right pr-4">Anggota</label>
              <div className="relative" ref={memberDropdownRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    ref={memberInputRef}
                    type="text"
                    value={memberSearch}
                    onChange={(e) => handleMemberSearchChange(e.target.value)}
                    onFocus={() => setShowMemberDropdown(true)}
                    placeholder="Ketik nama atau NIS siswa..."
                    className={`w-full border rounded pl-9 pr-8 py-2 text-sm outline-none transition ${
                      selectedMemberId ? 'border-emerald-400 bg-emerald-50/50 focus:border-emerald-500' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30'
                    }`}
                  />
                  {memberSearch && (
                    <button type="button" onClick={handleClearMember} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {showMemberDropdown && !selectedMemberId && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                    {filteredMembers.length > 0 ? (
                      <>
                        <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                          <p className="text-[10px] text-gray-500 font-medium">
                            {memberSearch.trim()
                              ? <>Menampilkan <strong>{filteredMembers.length}</strong> siswa untuk &quot;<strong>{memberSearch}</strong>&quot;</>
                              : <>Ketik untuk mencari atau pilih dari daftar ({filteredMembers.length} ditampilkan)</>
                            }
                          </p>
                        </div>
                        {filteredMembers.map(({ student, matchType }) => (
                          <button
                            key={student.id}
                            type="button"
                            onClick={() => handleSelectMember(student)}
                            className={`w-full text-left px-3 py-2.5 hover:bg-blue-50 text-sm flex items-center gap-3 transition border-b border-gray-50 last:border-0 ${matchType === 'prefix' ? 'bg-blue-50/30' : ''}`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${
                              matchType === 'prefix' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                              : matchType === 'word-start' ? 'bg-gradient-to-br from-sky-400 to-sky-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                            }`}>
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 truncate">{highlightMatch(student.name, memberSearch)}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] text-gray-500">NIS: {highlightMatch(student.nis, memberSearch)}</span>
                                {student.classId && <span className="text-[10px] text-gray-400">• Kelas: {student.classId}</span>}
                              </div>
                            </div>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="p-4 text-center">
                        <User className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-xs text-gray-400">Tidak ditemukan siswa untuk &quot;{memberSearch}&quot;</p>
                        <p className="text-[10px] text-gray-300 mt-1">Coba ketik huruf awal nama atau nomor NIS</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedMemberId && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="text-xs text-emerald-700 font-medium flex-1">
                      Anggota terpilih: <strong>{allStudents.find(s => s.id === selectedMemberId)?.name}</strong>
                    </span>
                    <button type="button" onClick={handleClearMember} className="text-emerald-400 hover:text-red-500 transition">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <label className="text-sm font-semibold text-gray-700 text-right pr-4">Keterangan</label>
              <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className="border border-gray-300 rounded px-3 py-2 text-sm h-20 resize-none" />
            </div>

            {/* AUTOCOMPLETE BUKU */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#3c8dbc]" />
                Pilih Buku yang Akan Dipinjam
              </h3>

              <div className="flex gap-2 mb-4" ref={bookDropdownRef}>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    ref={bookInputRef}
                    type="text"
                    value={bookSearch}
                    onChange={(e) => handleBookSearchChange(e.target.value)}
                    onFocus={() => setShowBookDropdown(true)}
                    placeholder="Ketik judul buku, pengarang, atau ID buku..."
                    className={`w-full border rounded pl-9 pr-8 py-2 text-sm outline-none transition ${
                      selectedBookId ? 'border-emerald-400 bg-emerald-50/50' : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30'
                    }`}
                  />
                  {bookSearch && (
                    <button type="button" onClick={handleClearBook} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {showBookDropdown && !selectedBookId && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 overflow-y-auto">
                      {filteredBooks.length > 0 ? (
                        <>
                          <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                            <p className="text-[10px] text-gray-500 font-medium">
                              {bookSearch.trim()
                                ? <>Menampilkan <strong>{filteredBooks.length}</strong> buku untuk &quot;<strong>{bookSearch}</strong>&quot;</>
                                : <>Ketik untuk mencari atau pilih dari daftar ({filteredBooks.length} ditampilkan)</>
                              }
                            </p>
                          </div>
                          {filteredBooks.map(({ book, matchType, matchField }) => (
                            <button
                              key={book.id}
                              type="button"
                              onClick={() => handleSelectBook(book)}
                              className={`w-full text-left px-3 py-2.5 hover:bg-blue-50 text-sm flex items-center gap-3 transition border-b border-gray-50 last:border-0 ${matchType === 'prefix' ? 'bg-blue-50/30' : ''}`}
                            >
                              <div className="w-10 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200">
                                {book.coverImage ? (
                                  <img src={book.coverImage} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <BookOpen className="w-4 h-4 text-gray-300" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 truncate">{highlightMatch(book.title, bookSearch)}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  {/* Ikon penulis pakai PenLine dari lucide */}
                                  <PenLine className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                  <span className="text-[10px] text-gray-500 truncate">
                                    {matchField === 'author'
                                      ? highlightMatch(book.author, bookSearch)
                                      : book.author
                                    }
                                  </span>
                                  {matchField === 'id' && (
                                    <span className="text-[10px] text-gray-400 ml-1">
                                      • ID: {highlightMatch(book.id, bookSearch)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  book.available <= 2 ? 'bg-red-100 text-red-700' :
                                  book.available <= 5 ? 'bg-amber-100 text-amber-700' :
                                  'bg-emerald-100 text-emerald-700'
                                }`}>
                                  Sisa: {book.available}
                                </span>
                              </div>
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="p-4 text-center">
                          <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-xs text-gray-400">Tidak ditemukan buku untuk &quot;{bookSearch}&quot;</p>
                          <p className="text-[10px] text-gray-300 mt-1">Coba ketik huruf awal judul atau nama pengarang</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAddBook}
                  disabled={!selectedBookId}
                  className="px-4 py-2 bg-[#00c0ef] text-white text-sm font-bold rounded hover:bg-[#00acd6] disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  TAMBAH
                </button>
              </div>

              {selectedBooks.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-xs">
                    <thead className="bg-[#dff0d8]">
                      <tr>
                        <th className="px-3 py-2 text-left border-b font-bold text-gray-700">No</th>
                        <th className="px-3 py-2 text-left border-b font-bold text-gray-700">ID Buku</th>
                        <th className="px-3 py-2 text-left border-b font-bold text-gray-700">Judul</th>
                        <th className="px-3 py-2 text-center border-b font-bold text-gray-700">Qty</th>
                        <th className="px-3 py-2 text-center border-b font-bold text-gray-700">Hapus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBooks.map((book, idx) => (
                        <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
                          <td className="px-3 py-2"><span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">{book.id}</span></td>
                          <td className="px-3 py-2 font-semibold text-gray-800">{book.title}</td>
                          <td className="px-3 py-2 text-center">{book.qty}</td>
                          <td className="px-3 py-2 text-center">
                            <button onClick={() => handleRemoveBook(book.id)} className="text-[#dd4b39] hover:text-[#c9302c] transition" title="Hapus buku">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-3 py-2 text-right font-bold text-gray-600">Total Buku:</td>
                        <td className="px-3 py-2 text-center font-bold text-gray-800">{selectedBooks.reduce((sum, b) => sum + b.qty, 0)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end border-t border-gray-200 pt-4">
              <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-[#dd4b39] text-white text-xs font-bold rounded hover:bg-[#c9302c] transition">
                <X className="w-3.5 h-3.5" /> Reset
              </button>
              <button onClick={handleProcess} className="flex items-center gap-2 px-4 py-2 bg-[#3c8dbc] text-white text-xs font-bold rounded hover:bg-[#357ca5] transition">
                <RotateCcw className="w-3.5 h-3.5" /> Proses Peminjaman
              </button>
            </div>
          </div>
        </div>
      )}

      {!isPinjam && <FormPengembalian allTx={allTx} allBooks={allBooks} allStudents={allStudents} />}
    </div>
  );
}
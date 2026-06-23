import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getClasses, getStudents, getSuratIzin, getTeachers, updateStatusSuratIzin } from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { Calendar, ChevronLeft, ChevronRight, MailOpen } from 'lucide-react';

type LetterItem = ReturnType<typeof getSuratIzin>[number] & { studentName: string; studentNis: string; className: string };

export default function KotakSuratGuru() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedLetterId, setSelectedLetterId] = useState('');
  
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'semua' | LetterItem['status']>('semua');
  const [showCalendar, setShowCalendar] = useState(false);

  // 1. Mengambil data Guru Pengampu
  const teacher = useMemo(() => getTeachers().find(item => item.id === user?.id), [user, storeVersion]);

  // 2. Optimasi pengambilan data surat menggunakan Hash Map
  const letters = useMemo(() => {
    if (!teacher) return [];
    
    const studentMap = new Map(getStudents().map(s => [s.id, s]));
    const classMap = new Map(getClasses().map(c => [c.id, c]));
    
    return getSuratIzin()
      .filter(item => teacher.classIds.includes(item.classId))
      .map(item => {
        const student = studentMap.get(item.studentId);
        const className = classMap.get(item.classId)?.name || '-';
        return {
          ...item,
          studentName: student?.name || 'Siswa tidak ditemukan',
          studentNis: student?.nis || '-',
          className,
        };
      });
  }, [teacher, storeVersion]);

  // 3. Filter data surat berdasarkan tanggal/status terpilih
  const filteredLetters = useMemo(() => {
    return letters.filter(item => {
      const dateMatch = selectedDate ? item.letterDate === selectedDate : true;
      const statusMatch = selectedStatus === 'semua' ? true : item.status === selectedStatus;
      return dateMatch && statusMatch;
    });
  }, [letters, selectedDate, selectedStatus]);

  // 4. Menentukan surat aktif yang sedang dibuka detailnya
  const selectedLetter = useMemo(
    () => filteredLetters.find(item => item.id === selectedLetterId) || null,
    [filteredLetters, selectedLetterId],
  );

  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  }, [selectedMonth]);

  // 5. Kalkulasi matriks tanggal kalender
  const calendarData = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();

    const monthLetters = letters.filter(item => item.letterDate.startsWith(selectedMonth));
    const countMap: Record<string, number> = {};
    monthLetters.forEach(item => {
      countMap[item.letterDate] = (countMap[item.letterDate] || 0) + 1;
    });

    const weeks: { day: number; date: string; count: number }[][] = [];
    let currentWeek: { day: number; date: string; count: number }[] = [];

    for (let i = 0; i < startWeekday; i += 1) {
      currentWeek.push({ day: 0, date: '', count: 0 });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      currentWeek.push({ day, date, count: countMap[date] || 0 });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({ day: 0, date: '', count: 0 });
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    return { weeks, monthLettersCount: monthLetters.length };
  }, [letters, selectedMonth]);

  const navigateMonth = (offset: number) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const next = new Date(year, month - 1 + offset, 1);
    setSelectedMonth(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
    setSelectedDate(null);
  };

  const typeLabel: Record<LetterItem['type'], string> = {
    izin: 'Izin',
    sakit: 'Sakit',
    dispensasi: 'Dispensasi',
    lainnya: 'Lainnya',
  };

  const statusLabel: Record<LetterItem['status'], string> = {
    menunggu: 'Menunggu',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
  };

  // Komparasi badge status arsitektural mono (Bukan warna pastel cerah)
  const getStatusBadgeStyle = (status: LetterItem['status'], isSelectedSidebar: boolean = false) => {
    if (isSelectedSidebar) return 'bg-slate-800 border-slate-700 text-white font-mono';
    switch (status) {
      case 'disetujui': return 'border-slate-900 bg-slate-900 text-white';
      case 'menunggu': return 'border-slate-900 bg-white text-slate-900';
      case 'ditolak': return 'border-slate-300 bg-white text-slate-400 line-through';
      default: return 'border-slate-200 bg-white text-slate-400';
    }
  };

  return (
     <div className="space-y-4 max-w-[1400px] mx-auto p-2 antialiased text-slate-600 bg-white selection:bg-slate-200">
      {/* HEADER PANEL */}
      <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs">
        <h1 className="text-sm font-bold text-slate-900 tracking-tight uppercase">KOTAK SURAT SISWA</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Pencatatan evaluasi berkas masuk, dokumen perizinan, dan laporan sakit berkala per kompartemen kelas.
        </p>
      </div>

      {/* FILTERS BAR */}
      <section className="bg-white rounded-lg p-3 shadow-xs border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-2">Filter Status:</span>
          <button
            onClick={() => {
              setSelectedStatus('semua');
              setSelectedLetterId('');
            }}
            className={`px-3 py-1 rounded border text-xs font-mono font-bold transition-all uppercase tracking-wide cursor-pointer ${
              selectedStatus === 'semua' ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Semua
          </button>
          {(['menunggu', 'disetujui', 'ditolak'] as const).map(status => (
            <button
              key={status}
              onClick={() => {
                setSelectedStatus(status);
                setSelectedLetterId('');
              }}
              className={`px-3 py-1 rounded border text-xs font-mono font-bold transition-all uppercase tracking-wide cursor-pointer ${
                selectedStatus === status ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {statusLabel[status]}
            </button>
          ))}
        </div>

        {/* INTERFACE DROPDOWN KALENDER */}
        <div className="w-full sm:w-auto flex items-center justify-end relative">
          <button
            onClick={() => setShowCalendar(current => !current)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-1 rounded border border-slate-200 text-xs font-mono font-bold text-slate-800 bg-white hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-900" />
            KALENDER_SURAT
          </button>

          {showCalendar && (
            <div className="absolute right-0 top-full mt-2 w-[290px] bg-white border border-slate-900 rounded shadow-xs p-3 z-20">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-mono font-bold text-slate-900 text-[10px] uppercase tracking-wider">Arsip Bulanan</h2>
                <div className="flex items-center gap-1">
                  <button onClick={() => navigateMonth(-1)} className="p-1 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 cursor-pointer"><ChevronLeft className="w-3.5 h-3.5" /></button>
                  <span className="text-xs font-mono font-bold text-slate-900 min-w-[100px] text-center uppercase">{monthLabel}</span>
                  <button onClick={() => navigateMonth(1)} className="p-1 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 cursor-pointer"><ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                  <div key={day} className="text-center text-[9px] font-mono font-bold text-slate-400 py-0.5 uppercase">{day}</div>
                ))}
              </div>

              <div className="space-y-1">
                {calendarData.weeks.map((week, weekIndex) => (
                  <div key={`${selectedMonth}_${weekIndex}`} className="grid grid-cols-7 gap-1">
                    {week.map((day, dayIndex) => (
                      <button
                        key={`${day.date}_${dayIndex}`}
                        disabled={day.day === 0}
                        onClick={() => {
                          setSelectedDate(day.date || null);
                          setSelectedLetterId('');
                          setShowCalendar(false);
                        }}
                        className={`relative aspect-square rounded text-[11px] font-mono font-bold transition-all border ${
                          day.day === 0
                            ? 'bg-transparent border-transparent'
                            : selectedDate === day.date
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : day.count > 0 ? 'border-slate-900 bg-white text-slate-900' : 'border-transparent text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {day.day > 0 ? day.day : ''}
                        {day.count > 0 && selectedDate !== day.date && (
                          <span className="absolute right-1 bottom-0.5 text-[8px] font-black text-slate-900 font-mono">.{day.count}</span>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between uppercase">
                <span>Total surat:</span>
                <strong className="text-slate-900 font-bold">{calendarData.monthLettersCount}</strong>
              </div>
              {selectedDate && (
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedLetterId('');
                    setShowCalendar(false);
                  }}
                  className="mt-1.5 w-full text-center border border-slate-200 hover:bg-slate-50 text-[10px] text-slate-600 font-mono font-bold py-1 rounded cursor-pointer uppercase"
                >
                  Hapus filter tanggal
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* NOTIFIKASI FILTER AKTIF */}
      {(selectedDate || selectedStatus !== 'semua') && (
        <div className="bg-white border border-slate-900 rounded px-3 py-1.5 text-[11px] text-slate-900 font-mono font-bold uppercase shadow-xs">
          Filter aktif:{' '}
          <span className="text-slate-950 font-black">
            {selectedDate ? `TANGGAL_${selectedDate}` : 'Semua Tanggal'}
          </span>
          <span className="mx-2 text-slate-300">|</span>
          Status: <span className="text-slate-950 font-black">{selectedStatus.toUpperCase()}</span>
        </div>
      )}

      {/* DUA KOLOM DATA UTAMA (STRUKTUR STRUKTURAL UTUH) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* DAFTAR SURAT (KIRI) */}
        <section className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 lg:col-span-4 w-full">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">DAFTAR BERKAS MASUK</h2>
          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-0.5">
            {filteredLetters.map(item => {
              const isSelected = selectedLetterId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedLetterId(item.id)}
                  className={`w-full text-left border rounded p-2.5 transition-all flex flex-col cursor-pointer ${
                    isSelected ? 'border-slate-900 bg-slate-900 text-white shadow-xs' : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <p className={`text-xs font-bold uppercase truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>{item.studentName}</p>
                    <span className={`inline-flex items-center px-1.5 py-0.5 border rounded-xs text-[9px] font-mono font-bold uppercase shrink-0 ${getStatusBadgeStyle(item.status, isSelected)}`}>
                      {statusLabel[item.status]}
                    </span>
                  </div>
                  <p className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>{item.studentNis} &bull; {item.className.toUpperCase()}</p>
                  <p className={`text-[11px] font-mono mt-1.5 truncate p-1 rounded-xs w-full ${isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-50 text-slate-600'}`}>
                    <span className={`text-[10px] font-bold mr-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>[{typeLabel[item.type].toUpperCase()}]</span>
                    {item.subject}
                  </p>
                </button>
              );
            })}
            {filteredLetters.length === 0 && (
              <div className="text-center py-8 border border-dashed border-slate-200 rounded">
                <p className="text-[11px] font-mono font-bold text-slate-400 uppercase">Tidak ada surat ditemukan</p>
                <p className="text-[10px] text-slate-400 mt-0.5 px-2">Sesuaikan filter atau tanggal arsip Anda.</p>
              </div>
            )}
          </div>
        </section>

        {/* DETAIL PRATINJAU SURAT AKTIF (KANAN) */}
        <section className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 lg:col-span-8 w-full min-h-[380px] flex flex-col justify-between">
          {!selectedLetter ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <div className="w-10 h-10 bg-white border border-slate-200 text-slate-400 flex items-center justify-center rounded mb-2">
                <MailOpen className="w-4 h-4 text-slate-900" />
              </div>
              <h3 className="text-xs font-mono font-bold text-slate-800 uppercase">Pratinjau Dokumen</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">Silakan pilih salah satu surat siswa pada daftar menu di sebelah kiri untuk melihat isi pesan secara lengkap.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[9px] font-mono font-bold text-slate-900 bg-white border border-slate-900 px-1.5 py-0.5 rounded-xs uppercase">
                  Jenis Dokumen: {typeLabel[selectedLetter.type].toUpperCase()}
                </span>
                <h2 className="text-sm font-black text-slate-900 mt-2 uppercase tracking-tight">{selectedLetter.subject}</h2>
                
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] font-mono text-slate-400">
                  <p>
                    Siswa: <span className="text-slate-800 font-bold uppercase">{selectedLetter.studentName}</span> ({selectedLetter.studentNis}) &bull; <span className="text-slate-800 font-bold">{selectedLetter.className.toUpperCase()}</span>
                  </p>
                  <p>Kirim: {new Date(selectedLetter.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">Pesan Lengkap:</span>
                <div className="bg-slate-50/50 border border-slate-100 rounded p-3">
                  <p className="text-xs leading-relaxed text-slate-800 font-medium whitespace-pre-line">{selectedLetter.message}</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0 font-mono">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Berkas Lampiran</span>
                  <p className="text-xs font-bold text-slate-900 uppercase truncate">{selectedLetter.attachmentName || 'Tidak ada berkas fisik'}</p>
                </div>
                {selectedLetter.attachmentDataUrl && (
                  <a
                    href={selectedLetter.attachmentDataUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center px-2.5 py-1 bg-white border border-slate-900 hover:bg-slate-50 text-slate-900 rounded text-xs font-mono font-bold transition-all shrink-0 cursor-pointer uppercase"
                  >
                    Buka Lampiran
                  </a>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Validasi Status Persetujuan:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(['menunggu', 'disetujui', 'ditolak'] as const).map(status => {
                    const isActive = selectedLetter.status === status;
                    return (
                      <button
                        key={status}
                        onClick={() => updateStatusSuratIzin(selectedLetter.id, status)}
                        className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all uppercase cursor-pointer border ${
                          isActive
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {status === 'menunggu' ? 'Set Menunggu' : status === 'disetujui' ? 'Setujui' : 'Tolak'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
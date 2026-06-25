import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getClasses, getStudents, getSuratIzin, getTeachers, updateStatusSuratIzin } from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { Calendar, ChevronLeft, ChevronRight, MailOpen } from 'lucide-react';

type LetterItem = ReturnType<typeof getSuratIzin>[number] & {
  studentName: string;
  studentNis: string;
  className: string;
};

export default function KotakSuratGuru() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedLetterId, setSelectedLetterId] = useState<string>('');

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<'semua' | LetterItem['status']>('semua');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const teacher = useMemo(() => {
    return getTeachers().find(item => item.id === user?.id);
  }, [user, storeVersion]);

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

  const filteredLetters = useMemo(() => {
    return letters.filter(item => {
      const dateMatch = selectedDate ? item.letterDate === selectedDate : true;
      const statusMatch = selectedStatus === 'semua' ? true : item.status === selectedStatus;
      return dateMatch && statusMatch;
    });
  }, [letters, selectedDate, selectedStatus]);

  const selectedLetter = useMemo(() => {
    return filteredLetters.find(item => item.id === selectedLetterId) || null;
  }, [filteredLetters, selectedLetterId]);

  useEffect(() => {
    if (selectedLetterId && !filteredLetters.some(item => item.id === selectedLetterId)) {
      setSelectedLetterId('');
    }
  }, [filteredLetters, selectedLetterId]);

  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  }, [selectedMonth]);

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

  const handleUpdateStatus = (id: string, status: LetterItem['status']) => {
    updateStatusSuratIzin(id, status);
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

  const getStatusBadgeStyle = (status: LetterItem['status'], isSelectedSidebar = false) => {
    if (isSelectedSidebar) return 'bg-slate-800 border-slate-700 text-white';
    switch (status) {
      case 'disetujui': return 'border-slate-900 bg-slate-900 text-white';
      case 'menunggu':  return 'border-slate-900 bg-white text-slate-900';
      case 'ditolak':   return 'border-slate-300 bg-white text-slate-400 line-through';
      default:          return 'border-slate-200 bg-white text-slate-400';
    }
  };

  return (
    <div className="w-full bg-white p-4 text-xs text-slate-700 antialiased space-y-4">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b border-slate-300 pb-3">
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-950 uppercase">
            Sistem Informasi Akademik
          </h1>
          <p className="text-[11px] text-slate-500">
            Pencatatan evaluasi berkas masuk, dokumen perizinan, dan laporan sakit berkala per kompartemen kelas.
          </p>
        </div>

        {/* Tombol kalender di pojok kanan header */}
        <div className="flex items-center gap-2 border-l border-slate-300 pl-4 relative">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Arsip Kalender
            </span>
            <button
              onClick={() => setShowCalendar(prev => !prev)}
              className="mt-0.5 inline-flex items-center gap-1.5 border border-slate-900 bg-white px-2 py-1 text-xs font-bold text-slate-900 uppercase outline-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              {selectedDate ? selectedDate : monthLabel.toUpperCase()}
            </button>
          </div>

          {/* KALENDER DROPDOWN */}
          {showCalendar && (
            <div className="absolute right-0 top-full mt-2 w-[290px] bg-white border border-slate-900 p-3 z-20 shadow-none">
              {/* Nav bulan */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-900">
                  Arsip Bulanan
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-1 border border-slate-300 text-slate-600 hover:border-slate-900 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-bold text-slate-900 min-w-[100px] text-center uppercase">
                    {monthLabel}
                  </span>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-1 border border-slate-300 text-slate-600 hover:border-slate-900 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Label hari */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                  <div
                    key={day}
                    className="text-center text-[9px] font-bold text-slate-400 py-0.5 uppercase"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid tanggal */}
              <div className="space-y-1">
                {calendarData.weeks.map((week, wIdx) => (
                  <div key={`${selectedMonth}_${wIdx}`} className="grid grid-cols-7 gap-1">
                    {week.map((day, dIdx) => (
                      <button
                        key={`${day.date}_${dIdx}`}
                        disabled={day.day === 0}
                        onClick={() => {
                          setSelectedDate(day.date || null);
                          setSelectedLetterId('');
                          setShowCalendar(false);
                        }}
                        className={`relative aspect-square text-[11px] font-bold border cursor-pointer transition-colors ${
                          day.day === 0
                            ? 'bg-transparent border-transparent'
                            : selectedDate === day.date
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : day.count > 0
                                ? 'border-slate-900 bg-white text-slate-900 hover:bg-slate-50'
                                : 'border-transparent text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        {day.day > 0 ? day.day : ''}
                        {day.count > 0 && selectedDate !== day.date && (
                          <span className="absolute right-0.5 bottom-0 text-[8px] font-black text-slate-900">
                            .{day.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ))}
              </div>

              {/* Footer kalender */}
              <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 uppercase">
                <span>Total surat bulan ini:</span>
                <strong className="text-slate-900">{calendarData.monthLettersCount}</strong>
              </div>

              {selectedDate && (
                <button
                  onClick={() => {
                    setSelectedDate(null);
                    setSelectedLetterId('');
                    setShowCalendar(false);
                  }}
                  className="mt-1.5 w-full border border-slate-300 text-[10px] text-slate-600 font-bold py-1 uppercase hover:border-slate-900 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Hapus Filter Tanggal
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ── FILTER STATUS BAR ───────────────────────────────────── */}
      <section className="border border-slate-300 p-3 bg-white">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
            Filter Status:
          </span>

          <button
            onClick={() => { setSelectedStatus('semua'); setSelectedLetterId(''); }}
            className={`px-3 py-1 border text-[10px] font-bold uppercase tracking-wide cursor-pointer transition-colors ${
              selectedStatus === 'semua'
                ? 'bg-slate-900 border-slate-900 text-white'
                : 'bg-white border-slate-300 text-slate-600 hover:border-slate-900'
            }`}
          >
            Semua
          </button>

          {(['menunggu', 'disetujui', 'ditolak'] as const).map(status => (
            <button
              key={status}
              onClick={() => { setSelectedStatus(status); setSelectedLetterId(''); }}
              className={`px-3 py-1 border text-[10px] font-bold uppercase tracking-wide cursor-pointer transition-colors ${
                selectedStatus === status
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-300 text-slate-600 hover:border-slate-900'
              }`}
            >
              {statusLabel[status]}
            </button>
          ))}
        </div>
      </section>

      {/* ── NOTIFIKASI FILTER AKTIF ─────────────────────────────── */}
      {(selectedDate || selectedStatus !== 'semua') && (
        <div className="border border-slate-900 px-3 py-2 bg-slate-50 text-[11px] text-slate-900 font-bold uppercase tracking-tight">
          Filter Aktif:{' '}
          <span className="font-black">
            {selectedDate ? `TANGGAL · ${selectedDate}` : 'SEMUA TANGGAL'}
          </span>
          <span className="mx-2 text-slate-300">|</span>
          Status:{' '}
          <span className="font-black">{selectedStatus.toUpperCase()}</span>
        </div>
      )}

      {/* ── TWO-COLUMN WORKSPACE ────────────────────────────────── */}
      <div className="grid items-start gap-4 lg:grid-cols-12">

        {/* PANEL KIRI — DAFTAR SURAT */}
        <section className="border border-slate-300 p-3 lg:col-span-4">

          {/* Section header — seragam dengan Code 1 */}
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-3 text-[10px] font-bold tracking-wider text-slate-900 uppercase">
            <MailOpen className="h-4 w-4 text-slate-950" />
            <span>Daftar Berkas Masuk ({filteredLetters.length})</span>
          </div>

          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-0.5">
            {filteredLetters.map(item => {
              const isSelected = selectedLetterId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedLetterId(item.id)}
                  className={`w-full text-left border p-2.5 flex flex-col cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {/* Baris atas: nama + badge status */}
                  <div className="flex items-center justify-between gap-2 w-full">
                    <p className={`text-xs font-bold uppercase truncate ${
                      isSelected ? 'text-white' : 'text-slate-800'
                    }`}>
                      {item.studentName}
                    </p>
                    <span className={`inline-flex items-center px-1.5 py-0.5 border text-[9px] font-bold uppercase shrink-0 ${
                      getStatusBadgeStyle(item.status, isSelected)
                    }`}>
                      {statusLabel[item.status]}
                    </span>
                  </div>

                  {/* NIS & kelas */}
                  <p className={`text-[10px] mt-0.5 ${
                    isSelected ? 'text-slate-300' : 'text-slate-400'
                  }`}>
                    {item.studentNis} &bull; {item.className.toUpperCase()}
                  </p>

                  {/* Subject preview */}
                  <p className={`text-[11px] mt-1.5 truncate px-1.5 py-1 w-full ${
                    isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-50 text-slate-600'
                  }`}>
                    <span className={`text-[10px] font-bold mr-1 ${
                      isSelected ? 'text-white' : 'text-slate-900'
                    }`}>
                      [{typeLabel[item.type].toUpperCase()}]
                    </span>
                    {item.subject}
                  </p>
                </button>
              );
            })}

            {filteredLetters.length === 0 && (
              <div className="border border-dashed border-slate-300 bg-slate-50/50 py-14 text-center">
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  EMPTY_MAILBOX_FEED
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Tidak ada surat sesuai filter aktif.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* PANEL KANAN — DETAIL SURAT */}
        <section className="border border-slate-300 p-3 lg:col-span-8 min-h-[380px] flex flex-col">

          {/* Section header */}
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-3 text-[10px] font-bold tracking-wider text-slate-900 uppercase">
            <MailOpen className="h-4 w-4 text-slate-950" />
            <span>Pratinjau Dokumen</span>
          </div>

          {!selectedLetter ? (
            /* Empty state */
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-300 bg-slate-50/50 py-14 text-center">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                AWAITING_DOCUMENT_SELECTION
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400 max-w-xs">
                Pilih salah satu surat pada panel kiri untuk melihat isi dokumen secara lengkap.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {/* Meta header dokumen */}
              <div className="border-b border-slate-300 pb-3">
                <span className="text-[9px] font-bold text-slate-900 bg-white border border-slate-900 px-1.5 py-0.5 uppercase">
                  Jenis: {typeLabel[selectedLetter.type].toUpperCase()}
                </span>
                <h2 className="text-sm font-black text-slate-900 mt-2 uppercase tracking-tight">
                  {selectedLetter.subject}
                </h2>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-slate-400">
                  <p>
                    Siswa:{' '}
                    <span className="text-slate-800 font-bold uppercase">
                      {selectedLetter.studentName}
                    </span>{' '}
                    ({selectedLetter.studentNis}) &bull;{' '}
                    <span className="text-slate-800 font-bold">
                      {selectedLetter.className.toUpperCase()}
                    </span>
                  </p>
                  <p>
                    Dikirim:{' '}
                    {new Date(selectedLetter.createdAt)
                      .toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                      .toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Isi pesan */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600">
                  Pesan Lengkap
                </label>
                <div className="border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs leading-relaxed text-slate-800 whitespace-pre-line">
                    {selectedLetter.message}
                  </p>
                </div>
              </div>

              {/* Lampiran */}
              <div className="border border-slate-300 bg-white p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    Berkas Lampiran
                  </span>
                  <p className="text-xs font-bold text-slate-900 uppercase truncate">
                    {selectedLetter.attachmentName || 'Tidak ada berkas fisik'}
                  </p>
                </div>
                {selectedLetter.attachmentDataUrl && (
                  <a
                    href={selectedLetter.attachmentDataUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center px-3 py-1.5 bg-white border border-slate-900 text-slate-900 text-[10px] font-bold uppercase shrink-0 hover:bg-slate-50 transition-colors"
                  >
                    Buka Lampiran
                  </a>
                )}
              </div>

              {/* Validasi status */}
              <div className="pt-3 border-t border-slate-300">
                <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600 mb-2">
                  Validasi Status Persetujuan
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {(['menunggu', 'disetujui', 'ditolak'] as const).map(status => {
                    const isActive = selectedLetter.status === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleUpdateStatus(selectedLetter.id, status)}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase border cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-white border-slate-300 text-slate-500 hover:border-slate-900 hover:text-slate-900'
                        }`}
                      >
                        {status === 'menunggu'
                          ? 'Set Menunggu'
                          : status === 'disetujui'
                            ? 'Setujui'
                            : 'Tolak'}
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
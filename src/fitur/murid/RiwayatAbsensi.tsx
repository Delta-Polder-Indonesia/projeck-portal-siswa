import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAttendanceByStudent } from '../../data/store';
import { Calendar, ChevronLeft, ChevronRight, Clock, FileText, Info } from 'lucide-react';
import { useStoreVersion } from '../../hooks/useStoreVersion';

export default function HistoryPage() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const allAttendance = useMemo(() => {
    if (!user) return [];
    return getAttendanceByStudent(user.id).sort((a, b) => b.date.localeCompare(a.date));
  }, [user, storeVersion]);

  const calendarData = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();

    const monthAttendance = allAttendance.filter(a => a.date.startsWith(selectedMonth));
    const attendanceMap: Record<string, (typeof monthAttendance)[number]> = {};
    monthAttendance.forEach(record => {
      attendanceMap[record.date] = record;
    });

    const weeks: { day: number; date: string; record?: (typeof monthAttendance)[number] }[][] = [];
    let currentWeek: { day: number; date: string; record?: (typeof monthAttendance)[number] }[] = [];

    for (let i = 0; i < startWeekday; i += 1) {
      currentWeek.push({ day: 0, date: '' });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      currentWeek.push({ day, date, record: attendanceMap[date] });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({ day: 0, date: '' });
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return { weeks, monthAttendance };
  }, [allAttendance, selectedMonth]);

  const monthLabel = useMemo(() => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return new Date(year, month - 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  }, [selectedMonth]);

  const selectedRecord = useMemo(() => {
    if (!selectedDate) return null;
    return allAttendance.find(item => item.date === selectedDate) || null;
  }, [allAttendance, selectedDate]);

  const navigateMonth = (offset: number) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const next = new Date(year, month - 1 + offset, 1);
    setSelectedMonth(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
    setSelectedDate(null);
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'hadir': return 'Hadir';
      case 'izin': return 'Izin';
      case 'sakit': return 'Sakit';
      case 'alpha': return 'Alpha (Tanpa Keterangan)';
      default: return '-';
    }
  };

  // Konfigurasi CSS Kalender berdasarkan Instruksi Warna Baru
  const statusClasses = (status?: string, isSelected?: boolean) => {
    if (isSelected) return 'ring-2 ring-slate-800 ring-offset-1 z-10';
    switch (status) {
      case 'hadir': return 'bg-emerald-500 text-white border border-emerald-600'; // Hijau
      case 'izin': return 'bg-blue-500 text-white border border-blue-600';     // Biru
      case 'sakit': return 'bg-amber-400 text-slate-900 border border-amber-500'; // Kuning
      case 'alpha': return 'bg-rose-500 text-white border border-rose-600';     // Merah
      default: return 'bg-transparent text-slate-400 hover:bg-slate-50';
    }
  };

  // Konfigurasi Dot Status pada Panel Detail Informasi
  const statusDotClass = (status: string) => {
    switch (status) {
      case 'hadir': return 'bg-emerald-500';
      case 'izin': return 'bg-blue-500';
      case 'sakit': return 'bg-amber-400';
      case 'alpha': return 'bg-rose-500';
      default: return 'bg-slate-200';
    }
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto p-1 antialiased text-slate-600">
      
      {/* Top Bar Header */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-xs">
        <h1 className="text-base font-semibold text-slate-800 tracking-tight">Riwayat Absensi & Kehadiran</h1>
        <p className="text-xs text-slate-400 mt-0.5">Pantau log data presensi harian individual dan catatan verifikasi instruktur.</p>
      </div>

      {/* Main Split Interface Layout */}
      <div className="grid lg:grid-cols-[340px_1fr] gap-4 items-start">
        
        {/* Left Side: Calendar Control Station */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200/60 h-fit space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <h2 className="font-semibold text-slate-700 text-xs uppercase tracking-wide">Navigasi Kalender</h2>
            </div>
            <div className="flex items-center gap-1">
              <button 
                type="button"
                onClick={() => navigateMonth(-1)} 
                className="p-1 hover:bg-slate-50 border border-slate-200 rounded transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
              </button>
              <span className="text-xs font-mono font-semibold text-slate-700 min-w-[100px] text-center">{monthLabel}</span>
              <button 
                type="button"
                onClick={() => navigateMonth(1)} 
                className="p-1 hover:bg-slate-50 border border-slate-200 rounded transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Weekday Grid Label */}
          <div className="grid grid-cols-7 gap-1">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-0.5">{day}</div>
            ))}
          </div>

          {/* Calendar Day Grid Matrix */}
          <div className="space-y-1">
            {calendarData.weeks.map((week, weekIndex) => (
              <div key={`${selectedMonth}-w-${weekIndex}`} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => {
                  const isBlank = day.day === 0;
                  const isSelected = selectedDate === day.date;
                  return (
                    <button
                      type="button"
                      key={`${day.date}-${dayIndex}`}
                      disabled={isBlank}
                      onClick={() => setSelectedDate(day.date)}
                      className={`aspect-square rounded text-xs font-mono font-semibold transition-all ${
                        isBlank ? 'bg-transparent border-0 pointer-events-none' : ''
                      } ${statusClasses(day.record?.status, isSelected)}`}
                    >
                      {!isBlank ? day.day : ''}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend Warna Sesuai Instruksi Baru */}
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-400">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Hadir</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-xs bg-blue-500" /> Izin</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-xs bg-amber-400" /> Sakit</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-xs bg-rose-500" /> Alpha</div>
            <span className="text-[10px] font-mono font-semibold text-slate-500 ml-auto bg-slate-50 px-1.5 py-0.5 border border-slate-200 rounded">{calendarData.monthAttendance.length} Log</span>
          </div>
        </div>

        {/* Right Side: Operational Log Specifications */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200/60 min-h-[305px]">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5 mb-4">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <h2 className="font-semibold text-slate-700 text-xs uppercase tracking-wide">Spesifikasi Catatan Harian</h2>
          </div>
          
          {!selectedDate ? (
            <div className="h-[200px] flex flex-col items-center justify-center text-center">
              <Calendar className="w-8 h-8 text-slate-200 mb-1.5" />
              <p className="text-xs font-semibold text-slate-700">Pangkalan Data Siap</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Pilih indeks tanggal aktif pada kalender untuk memuat ringkasan log.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50/60 border border-slate-100 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tanggal Terpilih</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span className="text-xs font-mono font-medium text-slate-400 bg-white px-2 py-0.5 border border-slate-200 rounded">{selectedDate}</span>
              </div>

              {selectedRecord ? (
                <div className="space-y-3.5">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="border border-slate-200/70 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <div className={`w-2.5 h-2.5 rounded-xs ${statusDotClass(selectedRecord.status)}`} />
                        <span className="text-[10px] uppercase font-bold tracking-wider ml-0.5">Status Kehadiran</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 mt-1">{statusLabel(selectedRecord.status)}</p>
                    </div>
                    
                    <div className="border border-slate-200/70 rounded-lg p-3">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Waktu Sinkronisasi</span>
                      </div>
                      <p className="text-sm font-mono font-semibold text-slate-800 mt-1">
                        {new Date(selectedRecord.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
                      </p>
                    </div>
                  </div>

                  <div className="border border-slate-200/70 rounded-lg p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Catatan Evaluasi / Keterangan</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed pt-0.5 font-medium">{selectedRecord.note || 'Tidak ada klausa catatan tambahan dari instruktur.'}</p>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-slate-200 rounded-lg p-8 text-center text-slate-400">
                  <p className="text-xs font-semibold text-slate-600">Kosong (No Record)</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tidak ditemukan berkas komparasi absensi siswa pada pangkalan sistem untuk tanggal ini.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
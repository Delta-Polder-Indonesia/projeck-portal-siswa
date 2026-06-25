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
      case 'alpha': return 'Alpha';
      default: return '-';
    }
  };

  const statusClasses = (status?: string, isSelected?: boolean) => {
    if (isSelected) return 'ring-2 ring-slate-900 ring-offset-1 z-10';
    switch (status) {
      case 'hadir': return 'bg-emerald-500 text-white hover:bg-emerald-600';
      case 'izin': return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'sakit': return 'bg-amber-400 text-slate-900 hover:bg-amber-500';
      case 'alpha': return 'bg-rose-500 text-white hover:bg-rose-600';
      default: return 'bg-transparent text-slate-400 hover:bg-slate-50 border border-transparent';
    }
  };

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
    <div className="space-y-4 max-w-[1400px] mx-auto p-2 antialiased text-slate-600 bg-white selection:bg-slate-200">
      
      {/* HEADER HALAMAN */}
      <header className="mb-4 pb-2 border-b border-slate-100">
        <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">Riwayat Presensi</h1>
        <p className="text-[11px] text-slate-400 mt-1 leading-none">Lihat rekam jejak absensi harian dan catatan evaluasi bulanan Anda.</p>
      </header>

      {/* WORKSPACE MULTI-KOLOM */}
      <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
        
        {/* PANEL KALENDER (Kiri) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-700" />
              <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Kalender</h2>
            </div>
            <div className="flex items-center gap-1">
              <button 
                type="button"
                onClick={() => navigateMonth(-1)} 
                className="p-0.5 hover:bg-slate-50 border border-slate-200 rounded-sm transition-colors"
              >
                <ChevronLeft className="w-3 h-3 text-slate-600" />
              </button>
              <span className="text-[11px] font-semibold text-slate-800 min-w-[80px] text-center">{monthLabel}</span>
              <button 
                type="button"
                onClick={() => navigateMonth(1)} 
                className="p-0.5 hover:bg-slate-50 border border-slate-200 rounded-sm transition-colors"
              >
                <ChevronRight className="w-3 h-3 text-slate-600" />
              </button>
            </div>
          </div>

          {/* Nama-Nama Hari */}
          <div className="grid grid-cols-7 gap-1">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
              <div key={day} className="text-center text-[10px] font-medium text-slate-400 py-0.5">{day}</div>
            ))}
          </div>

          {/* Grid Matriks Tanggal */}
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
                      className={`aspect-square rounded-sm text-[11px] font-mono font-semibold transition-all flex items-center justify-center ${
                        isBlank ? 'bg-transparent border-0 pointer-events-none' : 'cursor-pointer'
                      } ${statusClasses(day.record?.status, isSelected)}`}
                    >
                      {!isBlank ? day.day : ''}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Keterangan Warna Minimalis */}
          <div className="flex flex-wrap gap-x-2 gap-y-1 pt-2 border-t border-slate-100 text-[10px] font-medium text-slate-400">
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Hadir</div>
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Izin</div>
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Sakit</div>
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Alpha</div>
            <span className="text-[9px] font-mono font-medium text-slate-400 ml-auto bg-slate-50 px-1 py-0.5 border border-slate-100 rounded-sm">
              {calendarData.monthAttendance.length} Entri
            </span>
          </div>
        </div>

        {/* DETAIL DOKUMENTASI HARIAN (Kanan) */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Info className="w-3.5 h-3.5 text-slate-700" />
            <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Detail Catatan Harian</h2>
          </div>
          
          {!selectedDate ? (
            <div className="py-12 border border-dashed border-slate-200 rounded-sm text-center bg-slate-50/30">
              <Calendar className="w-6 h-6 text-slate-300 mx-auto mb-1" />
              <p className="text-[11px] text-slate-400 italic">Pilih salah satu tanggal aktif pada kalender untuk melihat rincian.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50/50 border border-slate-100 rounded-sm px-3 py-2 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Tanggal Terpilih</span>
                  <p className="text-xs font-bold text-slate-900 mt-1 leading-none">
                    {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 border border-slate-200 rounded-sm">{selectedDate}</span>
              </div>

              {selectedRecord ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="border border-slate-100 rounded-sm p-3 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <div className={`w-1.5 h-1.5 rounded-full ${statusDotClass(selectedRecord.status)}`} />
                        <span className="text-[9px] uppercase font-bold tracking-wider">Status Kehadiran</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 pt-0.5">{statusLabel(selectedRecord.status)}</p>
                    </div>
                    
                    <div className="border border-slate-100 rounded-sm p-3 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-[9px] uppercase font-bold tracking-wider">Waktu Sinkronisasi</span>
                      </div>
                      <p className="text-xs font-mono font-bold text-slate-900 pt-0.5">
                        {new Date(selectedRecord.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
                      </p>
                    </div>
                  </div>

                  <div className="border border-slate-100 rounded-sm p-3 space-y-1.5 bg-white">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span className="text-[9px] uppercase font-bold tracking-wider">Catatan / Keterangan</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-normal font-medium">
                      {selectedRecord.note || 'Tidak ada catatan tambahan dari instruktur atau guru pamong.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 border border-dashed border-slate-200 rounded-sm text-center bg-slate-50/20">
                  <p className="text-[11px] text-slate-400 italic">Tidak ada catatan presensi yang terekam pada tanggal ini.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
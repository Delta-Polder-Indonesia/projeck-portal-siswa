import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getAttendance,
  getClasses,
  getStudents,
  getTeachers,
} from '../../data/store';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Users, XCircle, Layers, HelpCircle } from 'lucide-react';
import { useStoreVersion } from '../../hooks/useStoreVersion';

export default function DasborGuru() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();

  const stats = useMemo(() => {
    const teacher = getTeachers().find(t => t.id === user?.id);
    const classes = getClasses().filter(c => teacher?.classIds.includes(c.id));
    const classIds = classes.map(c => c.id);
    const students = getStudents().filter(s => classIds.includes(s.classId));
    const allAttendance = getAttendance().filter(a => classIds.includes(a.classId));

    const today = new Date().toISOString().split('T')[0];
    const todayAtt = allAttendance.filter(a => a.date === today);

    const totalStudents = students.length;
    const todayHadir = todayAtt.filter(a => a.status === 'hadir').length;
    const todayIzin = todayAtt.filter(a => a.status === 'izin').length;
    const todaySakit = todayAtt.filter(a => a.status === 'sakit').length;
    const todayAlpha = todayAtt.filter(a => a.status === 'alpha').length;
    const todayBelum = totalStudents - todayAtt.length;

    const last7Days: { date: string; percentage: number }[] = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const dayAtt = allAttendance.filter(a => a.date === ds);
      const dayHadir = dayAtt.filter(a => a.status === 'hadir').length;
      const pct = dayAtt.length > 0 ? Math.round((dayHadir / dayAtt.length) * 100) : 0;
      last7Days.push({
        date: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }).toUpperCase(),
        percentage: pct,
      });
    }

    const classStats = classes.map(cls => {
      const clsStudents = students.filter(s => s.classId === cls.id);
      const clsToday = todayAtt.filter(a => a.classId === cls.id);
      const clsHadir = clsToday.filter(a => a.status === 'hadir').length;
      return {
        ...cls,
        totalStudents: clsStudents.length,
        todayPresent: clsHadir,
        todayRecorded: clsToday.length,
      };
    });

    return {
      totalStudents,
      todayHadir,
      todayIzin,
      todaySakit,
      todayAlpha,
      todayBelum,
      last7Days,
      classStats,
    };
  }, [user, storeVersion]);

  const maxBar = Math.max(...stats.last7Days.map(d => d.percentage), 1);

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto p-2 antialiased text-slate-600 bg-white selection:bg-slate-200">
      
      {/* HEADER BANNER LOG CONTAINER */}
      <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs">
        <h1 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Panel Kendali Eksekutif Guru</h1>
        <p className="text-xs text-slate-400 mt-0.5">Metrik analitik kehadiran hari ini, pengawasan log absensi siswa, dan ringkasan operasional mengajar.</p>
        <p className="text-[11px] font-mono text-slate-500 mt-2 pt-2 border-t border-slate-100">
          OPERATOR_ID: <span className="font-bold text-slate-800">{user?.name?.toUpperCase() || 'NULL_USER'}</span>
        </p>
      </div>

      {/* METRICS METRIC HUB GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'TOTAL_STUDENTS', value: stats.totalStudents, icon: Users, border: 'border-slate-200' },
          { label: 'ATTENDANCE_PRESENT', value: stats.todayHadir, icon: CheckCircle, border: 'border-slate-200' },
          { label: 'ATTENDANCE_PERMIT', value: stats.todayIzin, icon: AlertCircle, border: 'border-slate-200' },
          { label: 'ATTENDANCE_SICK', value: stats.todaySakit, icon: Clock, border: 'border-slate-200' },
          { label: 'ATTENDANCE_ABSENT', value: stats.todayAlpha, icon: XCircle, border: 'border-slate-200' },
          { label: 'UNRECORDED_LOG', value: stats.todayBelum, icon: HelpCircle, border: 'border-slate-200 font-bold' }
        ].map((card, idx) => (
          <div key={idx} className={`bg-white rounded-lg p-3 border ${card.border} shadow-xs flex flex-col justify-between min-h-[85px]`}>
            <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
              <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400">{card.label}</span>
              <card.icon className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="mt-1">
              <p className="text-xl font-bold font-mono text-slate-900 tracking-tight">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS & DATA LIST MATRIX */}
      <div className="grid md:grid-cols-12 gap-4">
        
        {/* PANEL KIRI: LOG HISTOGRAM 7 HARI */}
        <section className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs md:col-span-6 space-y-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            <TrendingUp className="w-3 h-3 text-slate-500" />
            <span>Grafik Tren Kehadiran Rata-rata (7 Hari Terakhir)</span>
          </div>
          
          <div className="flex items-end justify-between gap-3 h-36 pt-4 px-2">
            {stats.last7Days.map(day => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 group">
                <span className="text-[10px] font-mono font-bold text-slate-700 opacity-80">{day.percentage}%</span>
                <div className="w-full bg-slate-100 rounded-t-sm relative h-24">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-slate-900 group-hover:bg-slate-950 rounded-t-sm transition-all"
                    style={{ height: `${maxBar > 0 ? (day.percentage / maxBar) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-400 font-bold tracking-tighter whitespace-nowrap">{day.date}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PANEL KANAN: RINGKASAN PERSENTASE KELAS */}
        <section className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs md:col-span-6 space-y-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            <Layers className="w-3 h-3 text-slate-500" />
            <span>Matriks Kapasitas & Rekap Log Kelas Binaan</span>
          </div>

          <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-0.5">
            {stats.classStats.map(cls => {
              const pct = cls.totalStudents > 0 ? Math.round((cls.todayPresent / cls.totalStudents) * 100) : 0;
              return (
                <div key={cls.id} className="flex items-center gap-4 text-xs">
                  <div className="w-14 font-mono font-bold text-slate-800 tracking-tight">{cls.name.toUpperCase()}</div>
                  
                  {/* Progress Line Bar Custom Mono */}
                  <div className="flex-1 bg-slate-100 rounded-sm h-4 relative overflow-hidden border border-slate-200/20">
                    <div
                      className="h-full bg-slate-800 transition-all flex items-center justify-end pr-1.5"
                      style={{ width: `${Math.max(pct, 0)}%` }}
                    >
                      {pct > 25 && <span className="text-[9px] font-mono font-bold text-white">{pct}%</span>}
                    </div>
                  </div>
                  
                  <div className="text-[10px] font-mono text-slate-400 font-bold w-24 text-right shrink-0">
                    {cls.todayRecorded}/{cls.totalStudents} INDEXED
                  </div>
                </div>
              );
            })}

            {stats.classStats.length === 0 && (
              <p className="text-[11px] font-mono text-slate-400 text-center py-6 uppercase">NO_ACTIVE_CLASS_FOUND</p>
            )}
          </div>
        </section>
      </div>

      {/* FOOTER METADATA INFO */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 font-mono text-[11px] text-slate-500 space-y-1">
        <p className="font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1">
          <span>&bull;</span> SYSTEM_NOTIFICATION: DECOUPLING_COMPLETE
        </p>
        <p className="pl-2 leading-relaxed">
          Modul konfigurasi kurikulum dan manajemen data transaksional kelas mandiri telah didelegasikan sepenuhnya ke sub-menu fungsional eksternal. Silakan operasikan submenu <span className="text-slate-800 font-bold underline">Atur Roster</span>, <span className="text-slate-800 font-bold underline">Atur Pengumuman</span>, dan <span className="text-slate-800 font-bold underline">Atur Tugas Online</span> melalui kompartemen bilah sisi utama.
        </p>
      </div>
    </div>
  );
}
import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getAttendance,
  getClasses,
  getStudents,
  getTeachers,
} from '../../data/store';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  XCircle,
  Layers,
  HelpCircle,
} from 'lucide-react';
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
        date: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' }),
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
    <div className="mx-auto w-full max-w-5xl space-y-4 bg-white p-3 text-xs text-slate-700 antialiased">
      {/* HEADER BANNER LOG CONTAINER */}
      <header className="border-b border-slate-200 pb-2">
        <p className="mt-2 border-t border-slate-100/70 pt-2 text-xs text-slate-600">
          NAMA:{' '}
          <span className="font-bold text-slate-900">
            {user?.name?.toUpperCase() || 'NULL_USER'}
          </span>
        </p>
      </header>

      {/* METRICS METRIC HUB GRID */}
      <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-4 md:grid-cols-3 lg:grid-cols-6">
        {[
          { label: 'Total Siswa', value: stats.totalStudents, icon: Users, alert: false },
          { label: 'Hadir', value: stats.todayHadir, icon: CheckCircle, alert: false },
          { label: 'Izin', value: stats.todayIzin, icon: AlertCircle, alert: false },
          { label: 'Sakit', value: stats.todaySakit, icon: Clock, alert: false },
          { label: 'Alpha', value: stats.todayAlpha, icon: XCircle, alert: true },
          {
            label: 'Belum Sinkron',
            value: stats.todayBelum,
            icon: HelpCircle,
            alert: stats.todayBelum > 0,
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={`flex min-h-[78px] flex-col justify-between rounded-sm border p-2.5 transition-colors ${
              card.alert
                ? 'border-rose-300 bg-rose-50/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div
              className={`flex items-center justify-between border-b pb-1.5 ${
                card.alert ? 'border-rose-200' : 'border-slate-100'
              }`}
            >
              <span
                className={`text-[10px] font-semibold uppercase tracking-wide ${
                  card.alert ? 'text-rose-600' : 'text-slate-500'
                }`}
              >
                {card.label}
              </span>
              <card.icon
                className={`h-3.5 w-3.5 ${card.alert ? 'text-rose-500' : 'text-slate-400'}`}
              />
            </div>

            <div className="mt-2 text-center">
              <p
                className={`text-xl font-bold tracking-tight ${
                  card.alert ? 'text-rose-700' : 'text-slate-900'
                }`}
              >
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS & DATA LIST MATRIX */}
      <div className="grid items-start gap-3 md:grid-cols-12">
        {/* PANEL KIRI: LOG HISTOGRAM 7 HARI */}
        <section className="space-y-3 md:col-span-6">
          <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1.5 text-xs font-bold uppercase tracking-wide text-slate-600">
            <TrendingUp className="h-3.5 w-3.5 text-slate-500" />
            <span>Tren Kehadiran (7 Hari)</span>
          </div>

          <div className="flex h-40 items-end justify-between gap-2 rounded-sm border border-slate-100 bg-slate-50/50 px-1.5 pt-3">
            {stats.last7Days.map(day => (
              <div key={day.date} className="group flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-700">{day.percentage}%</span>
                <div className="relative h-28 w-full rounded-t bg-slate-200/70 transition-colors hover:bg-slate-300/50">
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t bg-slate-800 transition-all duration-500 ease-out group-hover:bg-slate-900"
                    style={{ height: `${maxBar > 0 ? (day.percentage / maxBar) * 100 : 0}%` }}
                  />
                </div>
                <span className="whitespace-nowrap pt-0.5 text-[10px] font-bold text-slate-500">
                  {day.date}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* PANEL KANAN: RINGKASAN PERSENTASE KELAS */}
        <section className="space-y-3 md:col-span-6">
          <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1.5 text-xs font-bold uppercase tracking-wide text-slate-600">
            <Layers className="h-3.5 w-3.5 text-slate-500" />
            <span>Matriks Kapasitas Kelas</span>
          </div>

          <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
            {stats.classStats.map(cls => {
              const pct = cls.totalStudents > 0 ? Math.round((cls.todayPresent / cls.totalStudents) * 100) : 0;
              return (
                <div
                  key={cls.id}
                  className="flex items-center gap-2 rounded-sm border border-slate-100 bg-white p-2.5"
                >
                  <div className="w-16 shrink-0 font-bold tracking-tight text-slate-900">
                    {cls.name.toUpperCase()}
                  </div>

                  {/* Progress Line Bar */}
                  <div className="relative h-5 flex-1 overflow-hidden rounded border border-slate-200/60 bg-slate-100">
                    <div
                      className="flex h-full items-center justify-end bg-slate-800 pr-2 transition-all duration-1000 ease-in-out"
                      style={{ width: `${Math.max(pct, 0)}%` }}
                    >
                      {pct > 15 && <span className="text-[10px] font-bold text-white">{pct}%</span>}
                    </div>
                  </div>

                  <div className="w-20 shrink-0 text-right text-[10px] font-bold text-slate-500">
                    <span className="text-slate-900">{cls.todayRecorded}</span> / {cls.totalStudents}
                  </div>
                </div>
              );
            })}

            {stats.classStats.length === 0 && (
              <div className="rounded-sm border border-dashed border-slate-300 bg-slate-50 py-8 text-center">
                <p className="text-xs uppercase text-slate-500">Tidak Ada Data Kelas</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* FOOTER METADATA INFO */}
      <footer className="mt-4 space-y-1.5 rounded-sm border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        <p className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-slate-900">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Pembaruan Modul Sistem
        </p>
        <p className="border-l-2 border-slate-300 pl-3 text-[11px] leading-4 text-slate-600">
          Beberapa modul konfigurasi kelas mandiri telah terintegrasi ke dalam sub-menu di bilah sisi
          utama untuk mempermudah akses. Anda dapat mengatur Roster, Pengumuman, dan Tugas Online
          langsung melalui navigasi sebelah kiri tanpa harus mengelola beberapa layar secara
          bersamaan.
        </p>
      </footer>
    </div>
  );
}
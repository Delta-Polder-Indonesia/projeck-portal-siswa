import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getClassAnnouncements,
  getClassRosters,
  getClasses,
  getStudents,
  getAttendanceByStudent,
} from '../../data/store';
import { Megaphone, Calendar } from 'lucide-react';
import { useStoreVersion } from '../../hooks/useStoreVersion';

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function StudentDashboard() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [currentDayOfWeek, setCurrentDayOfWeek] = useState(() => new Date().getDay());

  useEffect(() => {
    let intervalId: number | undefined;
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = nextMidnight.getTime() - now.getTime();

    const timeout = window.setTimeout(() => {
      setCurrentDayOfWeek(new Date().getDay());
      intervalId = window.setInterval(() => {
        setCurrentDayOfWeek(new Date().getDay());
      }, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);

    return () => {
      window.clearTimeout(timeout);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  const student = useMemo(() => getStudents().find(s => s.id === user?.id), [user, storeVersion]);
  const className = useMemo(() => {
    if (!student) return '';
    return getClasses().find(c => c.id === student.classId)?.name || '';
  }, [student, storeVersion]);

  const allAttendance = useMemo(() => {
    if (!user) return [];
    return getAttendanceByStudent(user.id).sort((a, b) => b.date.localeCompare(a.date));
  }, [user, storeVersion]);

  const classRosters = useMemo(() => {
    if (!student) return [];
    return getClassRosters(student.classId);
  }, [student, storeVersion]);

  const classAnnouncements = useMemo(() => {
    if (!student) return [];
    return getClassAnnouncements(student.classId);
  }, [student, storeVersion]);

  const stats = useMemo(() => {
    const hadir = allAttendance.filter(a => a.status === 'hadir').length;
    const izin = allAttendance.filter(a => a.status === 'izin').length;
    const sakit = allAttendance.filter(a => a.status === 'sakit').length;
    const alpha = allAttendance.filter(a => a.status === 'alpha').length;
    const total = hadir + izin + sakit + alpha;
    const percentage = total > 0 ? Math.round((hadir / total) * 100) : 0;
    return { hadir, izin, sakit, alpha, total, percentage };
  }, [allAttendance]);

  const todayRosters = useMemo(
    () => classRosters
      .filter(item => item.dayOfWeek === currentDayOfWeek)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [classRosters, currentDayOfWeek],
  );

  const todayRosterRows = useMemo(() => {
    if (currentDayOfWeek === 0) return [];
    const minimumPeriods = 6;
    const totalRows = Math.max(minimumPeriods, todayRosters.length);
    return Array.from({ length: totalRows }, (_, index) => ({
      periodLabel: `JP ${index + 1}`,
      roster: todayRosters[index],
    }));
  }, [todayRosters, currentDayOfWeek]);

  return (
    <div className="max-w-5xl mx-auto px-3 py-4 antialiased text-slate-600 bg-white selection:bg-slate-100">
      
      {/* HEADER UTAMA (High-Density & Sharp Layout) */}
      <header className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">{student?.name}</h1>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1 leading-none">
            <span>NIS {student?.nis}</span>
            <span>·</span>
            <span>Kelas {className}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium bg-slate-50 border border-slate-200/60 rounded-sm px-1.5 py-0.5 self-start sm:self-auto leading-none">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{dayNames[currentDayOfWeek]}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </header>

      {/* METRIK PERFORMA (Compact & Compressed Grid) */}
      <section className="mb-5 bg-slate-50/50 border border-slate-100 rounded-sm p-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <div className="border-r border-slate-200/40 last:border-0 pr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Rasio Hadir</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block leading-none">
              {stats.percentage}<span className="text-[10px] font-normal text-slate-400 ml-0.5">%</span>
            </span>
          </div>
          <div className="border-r border-slate-200/40 last:border-0 pr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Hadir</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block leading-none">
              {stats.hadir}<span className="text-[10px] font-normal text-slate-400 ml-0.5">/{stats.total} d</span>
            </span>
          </div>
          <div className="border-r border-slate-200/40 last:border-0 pr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Sakit</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block leading-none">{stats.sakit}</span>
          </div>
          <div className="border-r border-slate-200/40 last:border-0 pr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Izin</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block leading-none">{stats.izin}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">Alpha</span>
            <span className="text-base font-bold text-rose-600 mt-0.5 block leading-none">{stats.alpha}</span>
          </div>
        </div>
      </section>

      {/* GRID KONTEN UTAMA (Rapat & Seimbang) */}
      <div className="grid lg:grid-cols-12 gap-4">

        {/* JADWAL HARI INI (Tabel Administrasi Super Padat) */}
        <section className="lg:col-span-8">
          <div className="mb-2 border-b border-slate-100 pb-1">
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Jadwal Kelas Hari Ini</h2>
          </div>

          {currentDayOfWeek === 0 ? (
            <div className="py-2 text-[11px] text-slate-400 font-medium italic">
              Tidak ada jadwal pelajaran pada hari Minggu.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left table-fixed">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-1 pr-2 w-10">Sesi</th>
                    <th className="py-1 px-1.5 w-auto">Mata Pelajaran</th>
                    <th className="py-1 px-1.5 w-24">Waktu</th>
                    <th className="py-1 px-1.5 w-14">Ruang</th>
                    <th className="py-1 pl-1.5 w-36">Guru Pengajar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px] text-slate-600">
                  {todayRosterRows.map(row => (
                    <tr key={`${currentDayOfWeek}-${row.periodLabel}`} className="hover:bg-slate-50 transition-colors">
                      <td className="py-1 pr-2 font-mono font-medium text-slate-400 leading-tight">{row.periodLabel}</td>
                      <td className="py-1 px-1.5 font-medium text-slate-900 truncate leading-tight">
                        {row.roster?.subject || <span className="text-slate-300 font-normal">—</span>}
                      </td>
                      <td className="py-1 px-1.5 font-mono text-slate-400 text-[10px] leading-tight">
                        {row.roster ? `${row.roster.startTime} - ${row.roster.endTime}` : '—'}
                      </td>
                      <td className="py-1 px-1.5 leading-tight">
                        {row.roster?.room ? (
                          <span className="font-mono text-[9px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-1 py-0.2 rounded-sm">
                            {row.roster.room}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="py-1 pl-1.5 text-slate-500 truncate leading-tight">
                        {row.roster?.teacherName || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {currentDayOfWeek !== 0 && todayRosters.length === 0 && (
            <div className="py-2 text-[11px] text-slate-400 italic">
              Belum ada data jadwal pelajaran untuk hari ini.
            </div>
          )}
        </section>

        {/* PENGUMUMAN KELAS (High Density List) */}
        <section className="lg:col-span-4">
          <div className="flex items-center gap-1 mb-2 border-b border-slate-100 pb-1">
            <Megaphone className="w-3 h-3 text-slate-400" />
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Pengumuman</h2>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {classAnnouncements.map(item => (
              <div key={item.id} className="text-[11px] bg-slate-50/40 p-1.5 border border-slate-100 rounded-sm">
                <div className="flex items-baseline justify-between gap-1.5 border-b border-slate-200/60 pb-0.5">
                  <h3 className="font-bold text-slate-900 leading-tight truncate max-w-[70%]">{item.title}</h3>
                  <span className="text-[9px] font-mono text-slate-400 shrink-0">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <p className="text-slate-500 mt-1 leading-tight whitespace-pre-line font-normal text-[11px]">
                  {item.message}
                </p>
              </div>
            ))}

            {classAnnouncements.length === 0 && (
              <div className="py-1 text-[11px] text-slate-400 italic">
                Tidak ada pengumuman terbaru.
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
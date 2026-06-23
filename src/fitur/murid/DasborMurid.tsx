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
    <div className="w-full max-w-5xl mx-auto h-full p-3 antialiased text-slate-700 bg-white">

      {/* HEADER UTAMA */}
      <header className="mb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">{student?.name}</h1>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
            <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded-sm">NIS {student?.nis}</span>
            <span>&bull;</span>
            <span className="font-semibold text-slate-700">Kelas {className}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-medium bg-white border border-slate-200 rounded-sm px-2 py-1 shadow-sm shrink-0 self-start sm:self-end">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>{dayNames[currentDayOfWeek]}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </header>

      {/* METRIK PERFORMA */}
      <section className="mb-3 bg-white border border-slate-200 rounded-sm p-3 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="border-r border-slate-100 last:border-0 pr-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Rasio Hadir</span>
            <span className="text-lg font-bold text-slate-900 flex items-baseline gap-0.5 leading-tight">
              {stats.percentage}<span className="text-[11px] font-normal text-slate-500">%</span>
            </span>
          </div>
          <div className="border-r border-slate-100 last:border-0 pr-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Hadir (Hari)</span>
            <span className="text-lg font-bold text-slate-900 flex items-baseline gap-0.5 leading-tight">
              {stats.hadir}<span className="text-[11px] font-normal text-slate-500">/ {stats.total} total</span>
            </span>
          </div>
          <div className="border-r border-slate-100 last:border-0 pr-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Sakit</span>
            <span className="text-lg font-bold text-amber-600 block leading-tight">{stats.sakit}</span>
          </div>
          <div className="border-r border-slate-100 last:border-0 pr-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Izin</span>
            <span className="text-lg font-bold text-sky-600 block leading-tight">{stats.izin}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Alpha</span>
            <span className="text-lg font-bold text-rose-600 block leading-tight">{stats.alpha}</span>
          </div>
        </div>
      </section>

      {/* GRID KONTEN UTAMA */}
      <div className="grid lg:grid-cols-12 gap-3 items-start">

        {/* JADWAL HARI INI */}
        <section className="lg:col-span-8">
          <div className="mb-2 border-b border-slate-200 pb-1">
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Jadwal Kelas Hari Ini</h2>
          </div>

          {currentDayOfWeek === 0 ? (
            <div className="py-4 text-xs text-slate-500 font-medium italic bg-slate-50 rounded-sm text-center border border-dashed border-slate-200">
              Tidak ada jadwal pelajaran pada hari Minggu.
            </div>
          ) : (
            <div className="overflow-x-auto bg-white border border-slate-200 rounded-sm shadow-sm">
              <table className="w-full text-left table-fixed">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-1.5 px-2.5 w-14">Sesi</th>
                    <th className="py-1.5 px-2.5 w-auto">Mata Pelajaran</th>
                    <th className="py-1.5 px-2.5 w-24">Waktu</th>
                    <th className="py-1.5 px-2.5 w-20">Ruang</th>
                    <th className="py-1.5 px-2.5 w-40">Guru Pengajar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {todayRosterRows.map(row => (
                    <tr key={`${currentDayOfWeek}-${row.periodLabel}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-1 px-2.5 font-mono font-semibold text-slate-500">{row.periodLabel}</td>
                      <td className="py-1 px-2.5 font-semibold text-slate-900 truncate">
                        {row.roster?.subject || <span className="text-slate-300 font-normal">—</span>}
                      </td>
                      <td className="py-1 px-2.5 font-mono text-slate-500 text-[11px]">
                        {row.roster ? `${row.roster.startTime} - ${row.roster.endTime}` : '—'}
                      </td>
                      <td className="py-1 px-2.5">
                        {row.roster?.room ? (
                          <span className="font-mono text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-1 py-0.5 rounded-sm">
                            {row.roster.room}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="py-1 px-2.5 text-slate-600 truncate">
                        {row.roster?.teacherName || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {currentDayOfWeek !== 0 && todayRosters.length === 0 && (
            <div className="py-4 text-xs text-slate-500 italic bg-slate-50 rounded-sm text-center border border-dashed border-slate-200 mt-2">
              Belum ada data jadwal pelajaran untuk hari ini.
            </div>
          )}
        </section>

        {/* PENGUMUMAN KELAS */}
        <section className="lg:col-span-4">
          <div className="flex items-center gap-1.5 mb-2 border-b border-slate-200 pb-1">
            <Megaphone className="w-3.5 h-3.5 text-slate-500" />
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Pengumuman Kelas</h2>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {classAnnouncements.map(item => (
              <div key={item.id} className="text-xs bg-white p-2.5 border border-slate-200 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-1.5 border-b border-slate-100 pb-1 mb-1">
                  <h3 className="font-bold text-slate-900 leading-tight truncate">{item.title}</h3>
                  <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-50 px-1 py-0.5 rounded-sm shrink-0">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <p className="text-slate-600 leading-normal whitespace-pre-line text-[11px]">
                  {item.message}
                </p>
              </div>
            ))}

            {classAnnouncements.length === 0 && (
              <div className="py-4 text-xs text-slate-500 italic text-center rounded-sm border border-dashed border-slate-200 bg-slate-50">
                Tidak ada pengumuman kelas terbaru.
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
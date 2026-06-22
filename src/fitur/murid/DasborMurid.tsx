import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getClassAnnouncements,
  getClassRosters,
  getClasses,
  getStudents,
  getAttendanceByStudent,
} from '../../data/store';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Megaphone,
  XCircle,
} from 'lucide-react';
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
  const studentInitial = (student?.name || '?').charAt(0).toUpperCase();
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
      periodLabel: `JP-${index + 1}`,
      roster: todayRosters[index],
    }));
  }, [todayRosters, currentDayOfWeek]);

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto p-2 antialiased text-slate-600">

      {/* Header Profile Section - Clean All-White Corporate Look */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-lg font-semibold text-slate-700">
            {studentInitial}
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 tracking-tight">{student?.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">NIS: {student?.nis} &bull; Kelas {className}</p>
          </div>
        </div>

        {/* Compact Quick Stats */}
        <div className="flex gap-2 border-t border-slate-100 pt-3 sm:pt-0 sm:border-0">
          <div className="bg-slate-50/60 border border-slate-200/80 rounded px-3 py-1 text-center min-w-[80px]">
            <p className="text-xs font-semibold text-slate-800">{stats.percentage}%</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Rasio</p>
          </div>
          <div className="bg-slate-50/60 border border-slate-200/80 rounded px-3 py-1 text-center min-w-[80px]">
            <p className="text-xs font-semibold text-slate-800">{stats.hadir}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Hadir</p>
          </div>
          <div className="bg-slate-50/60 border border-slate-200/80 rounded px-3 py-1 text-center min-w-[80px]">
            <p className="text-xs font-semibold text-slate-800">{stats.total}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total</p>
          </div>
        </div>
      </div>

      {/* Attendance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-200/80 flex items-center gap-3">
          <div className="w-8 h-8 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 bg-slate-50">
            <CheckCircle className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Hadir</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{stats.hadir}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-200/80 flex items-center gap-3">
          <div className="w-8 h-8 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 bg-slate-50">
            <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Izin</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{stats.izin}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-200/80 flex items-center gap-3">
          <div className="w-8 h-8 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 bg-slate-50">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Sakit</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{stats.sakit}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-200/80 flex items-center gap-3">
          <div className="w-8 h-8 border border-slate-200 rounded flex items-center justify-center flex-shrink-0 bg-slate-50">
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Alpha</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{stats.alpha}</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Panel Split */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Roster Section */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200/80 flex flex-col">
          <div className="border-b border-slate-100 pb-3 mb-3">
            <h2 className="text-xs uppercase font-bold tracking-wider text-slate-800">Roster Hari Ini</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Hari {dayNames[currentDayOfWeek]} &bull; Sinkronisasi sistem terjadwal berkala.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[420px]">
            {currentDayOfWeek === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">Hari Minggu, tidak terdapat aktivitas pendaftaran kelas.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[550px] text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                      <th className="text-left py-2 w-16">JP</th>
                      <th className="text-left py-2">Mata Pelajaran</th>
                      <th className="text-left py-2 w-28">Waktu</th>
                      <th className="text-left py-2 w-20">Ruang</th>
                      <th className="text-left py-2 w-44">Tenaga Pengajar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {todayRosterRows.map(row => (
                      <tr key={`${currentDayOfWeek}-${row.periodLabel}`} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-2.5 font-semibold text-slate-800">{row.periodLabel}</td>
                        <td className="py-2.5 text-slate-800">{row.roster?.subject || '-'}</td>
                        <td className="py-2.5 text-slate-500 font-mono">{row.roster ? `${row.roster.startTime} - ${row.roster.endTime}` : '-'}</td>
                        <td className="py-2.5 text-slate-500">
                          {row.roster?.room ? (
                            <span className="border border-slate-200 bg-slate-50 px-1.5 py-0.5 rounded text-[11px] font-mono font-medium text-slate-600">
                              {row.roster.room}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="py-2.5 text-slate-400 truncate max-w-[170px]">{row.roster?.teacherName || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {currentDayOfWeek !== 0 && todayRosters.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">Belum ada entri jadwal di rilis untuk hari ini.</div>
            )}
          </div>
        </div>

        {/* Class Announcement Section */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-slate-200/80 flex flex-col">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
            <Megaphone className="w-3.5 h-3.5 text-slate-400" />
            <h2 className="text-xs uppercase font-bold tracking-wider text-slate-800">Lembar Pengumuman Kelas</h2>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[420px] space-y-2.5 pr-1">
            {classAnnouncements.map(item => (
              <div key={item.id} className="border border-slate-200/60 bg-slate-50/30 p-3 rounded hover:border-slate-300 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                  <p className="text-[10px] font-mono text-slate-400 shrink-0">{new Date(item.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed whitespace-pre-line font-medium">{item.message}</p>
              </div>
            ))}
            {classAnnouncements.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">Belum ada maklumat pengumuman khusus kelas.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import { useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getClassRosters, getClasses, getStudents } from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';

const schoolDays = [
  { value: 1, label: 'Senin' },
  { value: 2, label: 'Selasa' },
  { value: 3, label: 'Rabu' },
  { value: 4, label: 'Kamis' },
  { value: 5, label: 'Jumat' },
  { value: 6, label: 'Sabtu' },
];

function getDefaultDay() {
  const today = new Date().getDay();
  return today >= 1 && today <= 6 ? today : 1;
}

export default function RosterPage() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedDay, setSelectedDay] = useState(getDefaultDay);

  const student = useMemo(() => getStudents().find(s => s.id === user?.id), [user, storeVersion]);
  const classRoom = useMemo(() => {
    if (!student) return undefined;
    return getClasses().find(c => c.id === student.classId);
  }, [student, storeVersion]);

  const classRosters = useMemo(() => {
    if (!student) return [];
    return getClassRosters(student.classId).filter(item => item.dayOfWeek >= 1 && item.dayOfWeek <= 6);
  }, [student, storeVersion]);

  const selectedDayRosters = useMemo(
    () => classRosters
      .filter(item => item.dayOfWeek === selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [classRosters, selectedDay],
  );

  const selectedDayTableRows = useMemo(() => {
    const minimumPeriods = 6;
    const totalRows = Math.max(minimumPeriods, selectedDayRosters.length);
    return Array.from({ length: totalRows }, (_, index) => ({
      periodLabel: `JP-${index + 1}`,
      roster: selectedDayRosters[index],
    }));
  }, [selectedDayRosters]);

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto p-2 text-slate-600 antialiased">
      {/* Header Panel */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
        <h1 className="text-base font-semibold text-slate-900 tracking-tight">Roster Kelas</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Jadwal pelajaran kelas {classRoom?.name || '-'} dari Senin sampai Sabtu. Sinkronisasi otomatis dengan perubahan dari sistem administrasi akademik.
        </p>
      </div>

      {/* Day Selector Tabs (Clean Solid Style) */}
      <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {schoolDays.map(day => (
            <button
              key={day.value}
              onClick={() => setSelectedDay(day.value)}
              className={`px-3 py-2 rounded text-xs font-semibold tracking-tight transition-all ${
                selectedDay === day.value
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Section Container */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          <h2 className="text-xs uppercase font-bold tracking-wider text-slate-800">
            Daftar Mata Pelajaran {schoolDays.find(day => day.value === selectedDay)?.label}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-xs">
            <thead>
              <tr className="text-slate-400 font-semibold border-b border-slate-100">
                <th className="text-left px-2 py-3 w-24">JP</th>
                <th className="text-left px-2 py-3">Mata Pelajaran</th>
                <th className="text-left px-2 py-3 w-44">Jam Pelajaran</th>
                <th className="text-left px-2 py-3 w-40">Ruang Kelas</th>
                <th className="text-left px-2 py-3 w-56">Tenaga Pengajar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {selectedDayTableRows.map(row => (
                <tr key={`${selectedDay}-${row.periodLabel}`} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-2 py-3 font-semibold text-slate-800">
                    {row.periodLabel}
                  </td>
                  <td className="px-2 py-3 text-slate-800 font-medium">
                    {row.roster?.subject || '-'}
                  </td>
                  <td className="px-2 py-3 text-slate-500 font-mono">
                    {row.roster ? `${row.roster.startTime} - ${row.roster.endTime}` : '-'}
                  </td>
                  <td className="px-2 py-3 text-slate-500">
                    {row.roster?.room || '-'}
                  </td>
                  <td className="px-2 py-3 text-slate-400">
                    {row.roster?.teacherName || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
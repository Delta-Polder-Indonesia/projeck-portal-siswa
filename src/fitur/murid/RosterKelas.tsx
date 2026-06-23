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
    <div className="max-w-5xl mx-auto px-3 py-4 antialiased text-slate-600 bg-white selection:bg-slate-100">
      
      {/* HEADER HALAMAN */}
      <header className="mb-4 pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">Jadwal Pelajaran</h1>
          <p className="text-[11px] text-slate-400 mt-1 leading-none">Manajemen waktu kelas dan informasi ruang kuliah aktif Anda.</p>
        </div>
        {classRoom && (
          <div className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-sm border border-slate-200/60 self-start sm:self-auto leading-none">
            Kelas: <span className="text-slate-800 font-bold">{classRoom.name}</span>
          </div>
        )}
      </header>

      {/* FILTER TABS HARI */}
      <div className="mb-4 pb-2 border-b border-slate-100">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5">
          {schoolDays.map(day => (
            <button
              key={day.value}
              type="button"
              onClick={() => setSelectedDay(day.value)}
              className={`px-2 py-1 rounded-sm text-xs font-medium transition-all cursor-pointer text-center leading-normal ${
                selectedDay === day.value
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {/* STRUKTUR TABEL ROSTER */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 pb-0.5">
          <CalendarDays className="w-3.5 h-3.5 text-slate-700" />
          <h2 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">
            Daftar Agenda Hari {schoolDays.find(day => day.value === selectedDay)?.label}
          </h2>
        </div>

        <div className="border border-slate-100 rounded-sm overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold text-[10px] uppercase tracking-wider border-b border-slate-100">
                  <th className="px-3 py-2 w-20 shrink-0">Jam Ke</th>
                  <th className="px-3 py-2">Mata Pelajaran</th>
                  <th className="px-3 py-2 w-36 shrink-0">Alokasi Waktu</th>
                  <th className="px-3 py-2 w-32 shrink-0">Ruang Kelas</th>
                  <th className="px-3 py-2 w-52 shrink-0">Tenaga Pengajar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                {selectedDayTableRows.map(row => (
                  <tr key={`${selectedDay}-${row.periodLabel}`} className="hover:bg-slate-50/10 transition-colors leading-tight">
                    <td className="px-3 py-1.5 font-bold text-slate-900 font-mono">
                      {row.periodLabel}
                    </td>
                    <td className="px-3 py-1.5 font-semibold text-slate-900">
                      {row.roster?.subject || <span className="text-slate-300 font-normal">-</span>}
                    </td>
                    <td className="px-3 py-1.5 text-slate-500 font-mono text-[11px]">
                      {row.roster ? `${row.roster.startTime} - ${row.roster.endTime}` : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="px-3 py-1.5 text-slate-500 text-[11px]">
                      {row.roster?.room || <span className="text-slate-300">-</span>}
                    </td>
                    <td className="px-3 py-1.5 text-slate-400 text-[11px] truncate max-w-[13rem]">
                      {row.roster?.teacherName || <span className="text-slate-200">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
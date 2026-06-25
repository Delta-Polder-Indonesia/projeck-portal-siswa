import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTeachers, getClasses, getStudentsByClass, getAttendanceByDate, addAttendanceRecords } from '../../data/store';
import { AttendanceRecord } from '../../types';
import { CheckCircle, XCircle, AlertCircle, Clock, Save, RotateCcw, ClipboardCheck } from 'lucide-react';

type Status = AttendanceRecord['status'];

// Konfigurasi status monokrom stark dengan penanda visual tegas tanpa sudut bulat
const statusConfig: Record<Status, { label: string; bg: string; icon: React.ReactNode }> = {
  hadir: { label: 'HADIR', bg: 'bg-slate-900 border-slate-900 text-white', icon: <CheckCircle className="h-3.5 w-3.5" /> },
  izin: { label: 'IZIN', bg: 'bg-white border-slate-900 text-slate-900 font-bold', icon: <AlertCircle className="h-3.5 w-3.5" /> },
  sakit: { label: 'SAKIT', bg: 'bg-white border-slate-400 text-slate-600 font-bold', icon: <Clock className="h-3.5 w-3.5" /> },
  alpha: { label: 'ALPHA', bg: 'bg-white border-slate-300 text-slate-400 line-through', icon: <XCircle className="h-3.5 w-3.5" /> },
};

export default function AttendancePage() {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, Status>>({});
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const teacher = useMemo(() => getTeachers().find(t => t.id === user?.id), [user]);
  const classes = useMemo(() => getClasses().filter(c => teacher?.classIds.includes(c.id)), [teacher]);

  const students = useMemo(() => {
    if (!selectedClass) return [];
    return getStudentsByClass(selectedClass).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedClass, refresh]);

  useEffect(() => {
    if (!selectedClass || !selectedDate) return;
    const existing = getAttendanceByDate(selectedDate, selectedClass);
    const map: Record<string, Status> = {};
    const notes: Record<string, string> = {};
    existing.forEach(r => {
      map[r.studentId] = r.status;
      if (r.note) notes[r.studentId] = r.note;
    });
    setAttendanceMap(map);
    setNoteMap(notes);
    setSaved(false);
  }, [selectedClass, selectedDate, refresh]);

  const setStatus = useCallback((studentId: string, status: Status) => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
    setSaved(false);
  }, []);

  const setAllStatus = useCallback((status: Status) => {
    const map: Record<string, Status> = {};
    students.forEach(s => { map[s.id] = status; });
    setAttendanceMap(map);
    setSaved(false);
  }, [students]);

  const handleSave = () => {
    if (!user || !selectedClass) return;
    const records: AttendanceRecord[] = students
      .filter(s => attendanceMap[s.id])
      .map(s => ({
        id: `att_${s.id}_${selectedDate}`,
        studentId: s.id,
        classId: selectedClass,
        date: selectedDate,
        status: attendanceMap[s.id],
        note: noteMap[s.id] || undefined,
        markedBy: user.id,
        timestamp: Date.now(),
      }));

    addAttendanceRecords(records);
    setSaved(true);
    setRefresh(r => r + 1);
  };

  const totalMarked = Object.keys(attendanceMap).length;
  const totalStudents = students.length;
  const summary = {
    hadir: Object.values(attendanceMap).filter(s => s === 'hadir').length,
    izin: Object.values(attendanceMap).filter(s => s === 'izin').length,
    sakit: Object.values(attendanceMap).filter(s => s === 'sakit').length,
    alpha: Object.values(attendanceMap).filter(s => s === 'alpha').length,
  };

  return (
    <div className="w-full bg-white p-4 text-xs text-slate-700 antialiased selection:bg-slate-200">
      
      {/* HEADER BAR */}
      <header className="border-b border-slate-300 pb-3">
        <h1 className="text-base font-bold tracking-tight text-slate-950 uppercase">
          Input Log Absensi & Kehadiran Siswa
        </h1>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Pencatatan status kehadiran berkala, pemeliharaan data absensi kelas binaan, dan dokumentasi parameter keterangan.
        </p>
      </header>

      {/* CONTROL FILTERS BAR */}
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border border-slate-300 p-3 bg-white">
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wide text-slate-600 uppercase">Tanggal Operasional</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-slate-800 outline-none focus:border-slate-900"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wide text-slate-600 uppercase">Target Kompartemen Kelas</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="min-w-[160px] cursor-pointer border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-slate-900"
            >
              <option value="">SELECT_CLASS...</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedClass && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAllStatus('hadir')}
              className="cursor-pointer border border-slate-900 bg-white px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-slate-900 transition-colors hover:bg-slate-50"
            >
              SET_ALL_HADIR
            </button>
            <button
              type="button"
              onClick={() => { setAttendanceMap({}); setNoteMap({}); setSaved(false); }}
              className="inline-flex cursor-pointer items-center gap-1 border border-slate-300 bg-white px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-slate-500 transition-colors hover:border-slate-900 hover:text-slate-900"
            >
              <RotateCcw className="h-3 w-3" /> 
              <span>RESET_MAP</span>
            </button>
          </div>
        )}
      </div>

      {!selectedClass ? (
        <div className="mt-4 border border-dashed border-slate-300 bg-slate-50/50 py-24 text-center">
          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">AWAITING_CLASS_SELECTION</p>
          <p className="mt-0.5 text-[10px] text-slate-400">Silakan pilih salah satu kelas binaan di atas untuk memuat manifest list data siswa.</p>
        </div>
      ) : (
        <>
          {/* LOG COUNTER SUMMARY BAR */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-300 bg-white p-3">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
              <ClipboardCheck className="h-4 w-4 text-slate-400" />
              <span>
                LOGGED: <span className="font-bold text-slate-900">{totalMarked}</span> / <span className="font-bold text-slate-800">{totalStudents}</span> STUDENTS_INDEXED
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(summary) as [Status, number][]).map(([status, count]) => (
                <span key={status} className="border border-slate-300 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                  {status.toUpperCase()}: <span className="font-extrabold text-slate-950">{count}</span>
                </span>
              ))}
            </div>
          </div>

          {/* TABLE INTERFACE COMPONENT */}
          <div className="mt-4 border border-slate-300 bg-white overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-50 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="w-12 px-4 py-2.5 text-center border-r border-slate-200">NO</th>
                  <th className="px-4 py-2.5 border-r border-slate-200">IDENTITAS_SISWA</th>
                  <th className="w-24 px-4 py-2.5 border-r border-slate-200">NIS_CODE</th>
                  <th className="w-[340px] px-4 py-2.5 text-center border-r border-slate-200">ATTENDANCE_STATUS_SELECTOR</th>
                  <th className="px-4 py-2.5">PARAM_REMARKS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((student, idx) => (
                  <tr key={student.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400 text-center border-r border-slate-200">{idx + 1}</td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <div className="flex items-center gap-3">
                        {student.avatar ? (
                          <img
                            src={student.avatar}
                            alt={student.name}
                            className="h-7 w-7 border border-slate-300 p-0.5 object-cover filter grayscale rounded-none"
                          />
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center bg-slate-900 font-mono text-[10px] font-bold text-white">
                            {student.gender.toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold tracking-tight text-slate-900">{student.name.toUpperCase()}</p>
                          <p className="font-mono text-[9px] tracking-wide text-slate-400">{student.gender === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-600 border-r border-slate-200">{student.nis}</td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <div className="flex justify-center gap-1">
                        {(Object.entries(statusConfig) as [Status, typeof statusConfig[Status]][]).map(([status, cfg]) => {
                          const isSelected = attendanceMap[student.id] === status;
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setStatus(student.id, status)}
                              className={`inline-flex items-center gap-1 border px-2 py-1 font-mono text-[10px] font-bold transition-all cursor-pointer rounded-none ${
                                isSelected
                                  ? `${cfg.bg} border-slate-900 z-10`
                                  : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600'
                              }`}
                            >
                              {cfg.icon}
                              <span>{cfg.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={noteMap[student.id] || ''}
                        onChange={e => {
                          setNoteMap(prev => ({ ...prev, [student.id]: e.target.value }));
                          setSaved(false);
                        }}
                        placeholder="ENTRY_NOTE..."
                        className="w-full border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-slate-800 outline-none placeholder:text-slate-300 focus:border-slate-900"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FORM ACTION CONTROL BUTTON */}
          <div className="flex justify-end pt-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={totalMarked === 0}
              className={`inline-flex items-center gap-1.5 border px-4 py-2 font-mono text-xs font-bold tracking-wide transition-all cursor-pointer rounded-none ${
                saved
                  ? 'bg-white border-slate-900 text-slate-900'
                  : totalMarked === 0
                    ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                    : 'bg-slate-900 border-slate-900 hover:bg-slate-950 text-white'
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5" /> 
                  <span>COMMIT_SUCCESS</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" /> 
                  <span>EXECUTE_SAVE_RECORDS</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
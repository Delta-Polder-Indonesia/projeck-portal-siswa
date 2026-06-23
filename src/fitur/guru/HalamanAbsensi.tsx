import { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTeachers, getClasses, getStudentsByClass, getAttendanceByDate, addAttendanceRecords } from '../../data/store';
import { AttendanceRecord } from '../../types';
import { CheckCircle, XCircle, AlertCircle, Clock, Save, RotateCcw, ClipboardCheck, Layers } from 'lucide-react';

type Status = AttendanceRecord['status'];

// Konfigurasi status monokrom dengan variasi ketebalan border & teks slate eksekutif
const statusConfig: Record<Status, { label: string; bg: string; icon: React.ReactNode }> = {
  hadir: { label: 'HADIR', bg: 'bg-slate-900 border-slate-900 text-white', icon: <CheckCircle className="w-3.5 h-3.5" /> },
  izin: { label: 'IZIN', bg: 'bg-white border-slate-900 text-slate-900 font-bold', icon: <AlertCircle className="w-3.5 h-3.5" /> },
  sakit: { label: 'SAKIT', bg: 'bg-white border-slate-400 text-slate-600 font-bold', icon: <Clock className="w-3.5 h-3.5" /> },
  alpha: { label: 'ALPHA', bg: 'bg-white border-slate-300 text-slate-400 line-through', icon: <XCircle className="w-3.5 h-3.5" /> },
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
    <div className="space-y-4 max-w-[1400px] mx-auto p-2 antialiased text-slate-600 bg-white selection:bg-slate-200">
      
      {/* HEADER BAR */}
      <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs">
        <h1 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Input Log Absensi & Kehadiran Siswa</h1>
        <p className="text-xs text-slate-400 mt-0.5">Pencatatan status kehadiran berkala, pemeliharaan data absensi kelas binaan, dan dokumentasi parameter keterangan.</p>
      </div>

      {/* CONTROL FILTERS BAR */}
      <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Tanggal Operasional</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-900 rounded text-xs font-mono font-bold text-slate-800 outline-none transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Kompartemen Kelas</label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-900 rounded text-xs font-mono font-bold text-slate-800 outline-none cursor-pointer transition-colors min-w-[160px]"
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
              onClick={() => setAllStatus('hadir')}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-900 text-slate-900 text-xs font-mono font-bold rounded transition-colors cursor-pointer"
            >
              SET_ALL_HADIR
            </button>
            <button
              onClick={() => { setAttendanceMap({}); setNoteMap({}); setSaved(false); }}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 text-xs font-mono font-bold rounded transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> RESET_MAP
            </button>
          </div>
        )}
      </div>

      {!selectedClass ? (
        <div className="py-24 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/40">
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">AWAITING_CLASS_SELECTION</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Silakan pilih salah satu kelas binaan di atas untuk memuat manifest list data siswa.</p>
        </div>
      ) : (
        <>
          {/* LOG COUNTER SUMMARY BAR */}
          <div className="bg-white rounded-lg p-3 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
              <ClipboardCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>
                LOGGED: <span className="font-bold text-slate-900">{totalMarked}</span> / <span className="font-bold text-slate-800">{totalStudents}</span> STUDENTS_INDEXED
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {(Object.entries(summary) as [Status, number][]).map(([status, count]) => (
                <span key={status} className="text-[10px] font-mono font-bold px-2 py-0.5 border border-slate-200 rounded-sm bg-slate-50 text-slate-700">
                  {status.toUpperCase()}: <span className="text-slate-900 font-extrabold">{count}</span>
                </span>
              ))}
            </div>
          </div>

          {/* TABLE INTERFACE COMPONENT */}
          <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-200 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-2.5 w-12 text-center">NO</th>
                    <th className="px-4 py-2.5">IDENTITAS_SISWA</th>
                    <th className="px-4 py-2.5 w-24">NIS_CODE</th>
                    <th className="px-4 py-2.5 text-center w-[340px]">ATTENDANCE_STATUS_SELECTOR</th>
                    <th className="px-4 py-2.5">PARAM_REMARKS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-slate-400 text-center">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {student.avatar ? (
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200 p-0.5 filter grayscale"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-900 text-white text-[10px] font-mono font-bold">
                              {student.gender.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-bold text-slate-900 tracking-tight">{student.name.toUpperCase()}</p>
                            <p className="text-[10px] font-mono text-slate-400">{student.gender === 'L' ? 'LAKI-LAKI' : 'PEREMPUAN'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-500 font-bold">{student.nis}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1.5">
                          {(Object.entries(statusConfig) as [Status, typeof statusConfig[Status]][]).map(([status, cfg]) => {
                            const isSelected = attendanceMap[student.id] === status;
                            return (
                              <button
                                key={status}
                                onClick={() => setStatus(student.id, status)}
                                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-sm border transition-all flex items-center gap-1 cursor-pointer ${
                                  isSelected
                                    ? `${cfg.bg} border-slate-900 shadow-xs z-10`
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
                          className="w-full px-2 py-1 text-xs font-mono bg-white border border-slate-100 hover:border-slate-200 focus:border-slate-900 rounded-sm text-slate-800 outline-none placeholder:text-slate-300 transition-colors"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FORM ACTION CONTROL BUTTON */}
          <div className="flex justify-end pt-1">
            <button
              onClick={handleSave}
              disabled={totalMarked === 0}
              className={`px-4 py-2 rounded text-xs font-mono font-bold tracking-wide border transition-all flex items-center gap-1.5 cursor-pointer ${
                saved
                  ? 'bg-white border-slate-900 text-slate-900'
                  : totalMarked === 0
                    ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                    : 'bg-slate-900 border-slate-900 hover:bg-slate-950 text-white'
              }`}
            >
              {saved ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" /> COMMIT_SUCCESS
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> EXECUTE_SAVE_RECORDS
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
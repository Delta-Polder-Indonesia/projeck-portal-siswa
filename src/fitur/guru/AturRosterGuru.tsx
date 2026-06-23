import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addClassRoster, deleteClassRoster, getClassRosters, getClasses, getTeachers } from '../../data/store';
import { Trash2, Plus, Calendar, Clock, MapPin } from 'lucide-react';
import { useStoreVersion } from '../../hooks/useStoreVersion';

const dayNames: Record<number, string> = {
  1: 'Senin',
  2: 'Selasa',
  3: 'Rabu',
  4: 'Kamis',
  5: 'Jumat',
  6: 'Sabtu',
};

const schoolDayOptions = [
  { value: 1, label: 'SENIN' },
  { value: 2, label: 'SELASA' },
  { value: 3, label: 'RABU' },
  { value: 4, label: 'KAMIS' },
  { value: 5, label: 'JUMAT' },
  { value: 6, label: 'SABTU' },
];

export default function AturRosterGuru() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [subject, setSubject] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('1');
  const [startTime, setStartTime] = useState('07:30');
  const [endTime, setEndTime] = useState('09:00');
  const [room, setRoom] = useState('');

  const teacherClasses = useMemo(() => {
    const teacher = getTeachers().find(item => item.id === user?.id);
    return getClasses().filter(item => teacher?.classIds.includes(item.id));
  }, [user, storeVersion]);

  useEffect(() => {
    if (!selectedClassId && teacherClasses.length > 0) {
      setSelectedClassId(teacherClasses[0].id);
    }
  }, [teacherClasses, selectedClassId]);

  const classRosters = useMemo(
    () => (selectedClassId ? getClassRosters(selectedClassId) : []),
    [selectedClassId, storeVersion],
  );

  const handleAddRoster = () => {
    if (!selectedClassId || !subject.trim() || !startTime || !endTime || !user) return;
    addClassRoster({
      id: `r_${Date.now()}`,
      classId: selectedClassId,
      subject: subject.trim(),
      dayOfWeek: Number(dayOfWeek),
      startTime,
      endTime,
      room: room.trim() || undefined,
      teacherName: user.name,
      updatedBy: user.id,
      updatedAt: Date.now(),
    });
    setSubject('');
    setRoom('');
  };

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto p-2 antialiased text-slate-600 bg-white selection:bg-slate-200">
      
      {/* HEADER CONTROL BAR */}
      <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Konfigurasi Roster & Matrikulasi Jadwal</h1>
          <p className="text-xs text-slate-400 mt-0.5">Alokasi plot penugasan jam mengajar, penataan ruang, dan validasi jadwal akademik mingguan siswa.</p>
        </div>

        {/* Dropdown - Line Style Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Kelas:</label>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-800 outline-none focus:border-slate-900 cursor-pointer transition-colors"
          >
            {teacherClasses.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name.toUpperCase()}</option>
            ))}
            {teacherClasses.length === 0 && <option value="">NULL_CLASS</option>}
          </select>
        </div>
      </div>

      {/* TWO-COLUMN MATRIX WORKSPACE */}
      <div className="grid lg:grid-cols-12 gap-4 items-start">
        
        {/* PANEL KIRI: EDITOR ALOKASI JADWAL */}
        <section className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs lg:col-span-5 space-y-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>Tambah Jadwal Distribusi Baru</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Mata Pelajaran</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Contoh: Matematika Diskrit"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded text-xs text-slate-800 outline-none placeholder:text-slate-300 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Ruangan / Laboratorium</label>
              <input
                type="text"
                value={room}
                onChange={e => setRoom(e.target.value)}
                placeholder="Contoh: LAB_KOM_02 (Opsional)"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded text-xs font-mono text-slate-800 outline-none placeholder:text-slate-300 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Hari Operasional</label>
              <select
                value={dayOfWeek}
                onChange={e => setDayOfWeek(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded text-xs font-bold text-slate-800 outline-none cursor-pointer transition-colors"
              >
                {schoolDayOptions.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Durasi Interval Waktu</label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded text-xs font-mono font-bold text-slate-800 outline-none transition-colors"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded text-xs font-mono font-bold text-slate-800 outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleAddRoster}
              disabled={!subject.trim() || !startTime || !endTime}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-950 border border-slate-900 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded text-xs font-bold font-mono transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> INJECT_ROSTER_DATA
            </button>
          </div>
        </section>

        {/* PANEL KANAN: MANIFEST ROSTER AKTIF */}
        <section className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs lg:col-span-7 flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Matriks Jadwal Terdaftar ({classRosters.length})</span>
          </div>

          <div className="space-y-2 max-h-[510px] overflow-y-auto pr-0.5">
            {classRosters.map(item => (
              <div key={item.id} className="flex items-center justify-between gap-4 border border-slate-200 rounded p-3 bg-white hover:border-slate-300 transition-colors">
                <div className="space-y-1 truncate">
                  <p className="text-xs font-bold text-slate-900 tracking-tight truncate">{item.subject.toUpperCase()}</p>
                  
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] font-mono text-slate-400">
                    <span className="font-bold text-slate-700 bg-slate-100 px-1 py-0.5 rounded-sm">
                      {dayNames[item.dayOfWeek]?.toUpperCase() || 'HARI_NULL'}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" /> {item.startTime} - {item.endTime}
                    </span>
                    {item.room && (
                      <span className="flex items-center gap-0.5 text-slate-500">
                        <MapPin className="w-2.5 h-2.5" /> {item.room.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Button Delete - Line Style Minimalis */}
                <button
                  type="button"
                  onClick={() => deleteClassRoster(item.id)}
                  className="p-1.5 bg-white border border-slate-200 hover:border-slate-900 text-slate-400 hover:text-slate-900 rounded transition-colors cursor-pointer shrink-0"
                  title="Hapus manifest roster"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {classRosters.length === 0 && (
              <div className="py-20 text-center border border-dashed border-slate-200 rounded bg-slate-50/40">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">EMPTY_ROSTER_MATRIX</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Belum ada entri plot jadwal yang dimasukkan untuk kelas ini.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
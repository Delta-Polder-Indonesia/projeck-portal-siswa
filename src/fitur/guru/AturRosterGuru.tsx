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
    <div className="w-full bg-white p-4 text-xs text-slate-700 antialiased">
      
      {/* HEADER CONTROL BAR */}
      <header className="flex items-center justify-between border-b border-slate-300 pb-3">
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-950 uppercase">
            Sistem Informasi Akademik
          </h1>
          <p className="text-[11px] text-slate-500">
            Konfigurasi roster, alokasi plot penugasan jam mengajar, dan penataan ruang akademis.
          </p>
        </div>

        <div className="flex items-center gap-2 border-l border-slate-300 pl-4 text-right">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Target Kelas
            </span>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="mt-0.5 cursor-pointer border border-slate-900 bg-white px-2 py-1 text-xs font-bold text-slate-900 uppercase outline-none"
            >
              {teacherClasses.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name.toUpperCase()}</option>
              ))}
              {teacherClasses.length === 0 && <option value="">NULL_CLASS</option>}
            </select>
          </div>
        </div>
      </header>

      {/* TWO-COLUMN MATRIX WORKSPACE */}
      <div className="grid items-start gap-4 pt-4 lg:grid-cols-12">
        
        {/* PANEL KIRI: EDITOR ALOKASI JADWAL */}
        <section className="space-y-3 border border-slate-300 p-3 lg:col-span-5">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2 text-xs font-bold tracking-wider text-slate-900 uppercase">
            <Calendar className="h-4 w-4 text-slate-950" />
            <span>Tambah Jadwal Distribusi Baru</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wide text-slate-600 uppercase">Mata Pelajaran</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Contoh: Matematika Diskrit"
                className="w-full border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-300 focus:border-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wide text-slate-600 uppercase">Ruangan / Laboratorium</label>
              <input
                type="text"
                value={room}
                onChange={e => setRoom(e.target.value)}
                placeholder="Contoh: LAB_KOM_02"
                className="w-full border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-300 focus:border-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wide text-slate-600 uppercase">Hari Operasional</label>
              <select
                value={dayOfWeek}
                onChange={e => setDayOfWeek(e.target.value)}
                className="w-full cursor-pointer border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-slate-900"
              >
                {schoolDayOptions.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold tracking-wide text-slate-600 uppercase">Durasi Interval Waktu</label>
              <div className="grid grid-cols-2 gap-1">
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full border border-slate-300 bg-white px-2 py-1.5 font-mono text-xs font-bold text-slate-800 outline-none focus:border-slate-900"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full border border-slate-300 bg-white px-2 py-1.5 font-mono text-xs font-bold text-slate-800 outline-none focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleAddRoster}
              disabled={!subject.trim() || !startTime || !endTime}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 border border-slate-900 bg-slate-900 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase transition-colors hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>SUNTIK DATA ROSTER</span>
            </button>
          </div>
        </section>

        {/* PANEL KANAN: MANIFEST ROSTER AKTIF */}
        <section className="flex flex-col border border-slate-300 p-3 lg:col-span-7">
          <div className="mb-3 flex items-center gap-2 border-b border-slate-900 pb-2 text-xs font-bold tracking-wider text-slate-900 uppercase">
            <Clock className="h-4 w-4 text-slate-950" />
            <span>Matriks Jadwal Terdaftar ({classRosters.length})</span>
          </div>

          <div className="max-h-[510px] space-y-3 overflow-y-auto pr-0.5">
            {classRosters.map(item => (
              <div key={item.id} className="border border-slate-300 bg-white p-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 space-y-1.5 truncate">
                    <p className="text-sm font-bold tracking-tight text-slate-900 truncate">
                      {item.subject.toUpperCase()}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
                      <span className="border border-blue-200 bg-blue-50 px-1.5 py-0.5 font-bold text-blue-700 uppercase">
                        {dayNames[item.dayOfWeek] || 'HARI_NULL'}
                      </span>
                      <span className="flex items-center gap-1 font-mono font-medium text-slate-700">
                        <Clock className="h-3 w-3 text-slate-500" /> 
                        {item.startTime} - {item.endTime}
                      </span>
                      {item.room && (
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <MapPin className="h-3 w-3 text-slate-500" /> 
                          {item.room.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Button Delete - Minimalis Stark */}
                  <button
                    type="button"
                    onClick={() => deleteClassRoster(item.id)}
                    className="shrink-0 cursor-pointer border border-slate-300 bg-white p-1.5 text-slate-500 transition-colors hover:border-rose-600 hover:bg-rose-50 hover:text-rose-600"
                    title="Hapus manifest roster"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {classRosters.length === 0 && (
              <div className="border border-dashed border-slate-300 bg-slate-50/50 py-20 text-center">
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  EMPTY_ROSTER_MATRIX
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Belum ada entri plot jadwal yang dimasukkan untuk kelas ini.
                </p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
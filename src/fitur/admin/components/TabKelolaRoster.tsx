import { useEffect, useMemo, useState } from 'react';
import { addClassRoster, deleteClassRoster, getClassRosters, getClasses, getTeachers } from '../../../data/store';
import { Trash2, Plus, Calendar, Clock, MapPin, UserCheck } from 'lucide-react';
import { useStoreVersion } from '../../../hooks/useStoreVersion';

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

export default function TabKelolaRoster({ setNotice }: { setNotice: (msg: string) => void }) {
    const storeVersion = useStoreVersion();
    const allClasses = useMemo(() => getClasses(), [storeVersion]);
    const allTeachers = useMemo(() => getTeachers(), [storeVersion]);

    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [subject, setSubject] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('1');
    const [startTime, setStartTime] = useState('07:30');
    const [endTime, setEndTime] = useState('09:00');
    const [room, setRoom] = useState('');

    useEffect(() => {
        if (!selectedClassId && allClasses.length > 0) {
            setSelectedClassId(allClasses[0].id);
        }
    }, [allClasses, selectedClassId]);

    const classRosters = useMemo(
        () => (selectedClassId ? getClassRosters(selectedClassId) : []),
        [selectedClassId, storeVersion],
    );

    const handleAddRoster = () => {
        if (!selectedClassId || !subject.trim() || !startTime || !endTime) {
            setNotice('Lengkapi data roster terlebih dahulu.');
            return;
        }

        const teacher = allTeachers.find(t => t.id === selectedTeacherId);

        addClassRoster({
            id: `r_${Date.now()}`,
            classId: selectedClassId,
            subject: subject.trim(),
            dayOfWeek: Number(dayOfWeek),
            startTime,
            endTime,
            room: room.trim() || undefined,
            teacherName: teacher ? teacher.name : 'Unknown Teacher',
            updatedBy: 'admin_master',
            updatedAt: Date.now(),
        });
        setSubject('');
        setRoom('');
        setNotice('Jadwal roster berhasil ditambahkan.');
    };

    return (
        <div className="w-full space-y-5">
            <div className="border-b border-gray-100 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">Manajemen Roster Pelajaran</h2>
                <p className="text-[10px] text-gray-500 mt-0.5">Atur jadwal mata pelajaran untuk seluruh kelas dan guru.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                {/* Editor */}
                <section className="space-y-4">
                    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-400">Pilih Kelas</label>
                                <select
                                    value={selectedClassId}
                                    onChange={e => setSelectedClassId(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 bg-gray-50"
                                >
                                    {allClasses.map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-400">Guru Pengampu</label>
                                <select
                                    value={selectedTeacherId}
                                    onChange={e => setSelectedTeacherId(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 bg-gray-50"
                                >
                                    <option value="">-- Pilih Guru --</option>
                                    {allTeachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-400">Mata Pelajaran</label>
                                <input
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    placeholder="Contoh: Matematika"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-400">Ruangan</label>
                                <input
                                    value={room}
                                    onChange={e => setRoom(e.target.value)}
                                    placeholder="Contoh: Kelas 7A / Lab 1"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-400">Hari</label>
                                <select
                                    value={dayOfWeek}
                                    onChange={e => setDayOfWeek(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 bg-gray-50"
                                >
                                    {schoolDayOptions.map(day => (
                                        <option key={day.value} value={day.value}>{day.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-gray-400">Waktu (Mulai - Selesai)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={e => setStartTime(e.target.value)}
                                        className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs outline-none focus:border-blue-500"
                                    />
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={e => setEndTime(e.target.value)}
                                        className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAddRoster}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Tambah ke Roster
                        </button>
                    </div>
                </section>

                {/* List */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                        <h3 className="text-[11px] font-bold uppercase text-gray-400 tracking-widest">
                            Roster Kelas: <span className="text-blue-600">{allClasses.find(c => c.id === selectedClassId)?.name || '-'}</span>
                        </h3>
                        <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full tabular-nums">
                            {classRosters.length} Entri
                        </span>
                    </div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {classRosters.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)).map(item => (
                            <div key={item.id} className="bg-white border border-gray-100 rounded-lg p-3 group hover:border-blue-200 transition-all shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded leading-none">
                                                {dayNames[item.dayOfWeek]?.toUpperCase()}
                                            </span>
                                            <h4 className="text-xs font-bold text-gray-900">{item.subject}</h4>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                <Clock className="w-3 h-3 text-gray-400" />
                                                <span>{item.startTime} - {item.endTime}</span>
                                            </div>
                                            {item.room && (
                                                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                    <MapPin className="w-3 h-3 text-gray-400" />
                                                    <span>{item.room}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 text-[10px] font-medium text-blue-600/70">
                                                <UserCheck className="w-3 h-3" />
                                                <span>{item.teacherName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => deleteClassRoster(item.id)}
                                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {classRosters.length === 0 && (
                            <div className="py-20 text-center bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
                                <Calendar className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Belum ada roster</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

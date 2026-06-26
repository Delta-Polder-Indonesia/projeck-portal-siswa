import { useEffect, useMemo, useState } from 'react';
import { Trash2, Plus, Clock, MapPin, UserCheck, RefreshCw, AlertCircle, Calendar, CheckCircle2, HelpCircle } from 'lucide-react';
import { addClassRoster, deleteClassRoster, getClassRosters, getClasses, getTeachers } from '../../../data/store';
import { useStoreVersion } from '../../../hooks/useStoreVersion';

// ==========================================
// Types & Constants
// ==========================================
interface ClassRoster {
    id: string;
    classId: string;
    subject: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    room?: string;
    teacherName: string;
    updatedBy: string;
    updatedAt: number;
}

const DAY_NAMES: Record<number, string> = {
    1: 'Senin',
    2: 'Selasa',
    3: 'Rabu',
    4: 'Kamis',
    5: 'Jumat',
    6: 'Sabtu',
};

const SCHOOL_DAY_OPTIONS = [
    { value: 1, label: 'SENIN' },
    { value: 2, label: 'SELASA' },
    { value: 3, label: 'RABU' },
    { value: 4, label: 'KAMIS' },
    { value: 5, label: 'JUMAT' },
    { value: 6, label: 'SABTU' },
];

// ==========================================
// Helper Functions
// ==========================================
const addMinutes = (timeStr: string, minutes: number): string => {
    if (!timeStr || !timeStr.includes(':')) return '07:30';
    const [hours, mins] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutes, 0);
    return date.toTimeString().slice(0, 5);
};

// ==========================================
// Main Component
// ==========================================
export default function TabKelolaRoster({ setNotice }: { setNotice: (msg: string) => void }) {
    const storeVersion = useStoreVersion();
    const allClasses = useMemo(() => getClasses(), [storeVersion]);
    const allTeachers = useMemo(() => getTeachers(), [storeVersion]);

    // Form States
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [subject, setSubject] = useState('');
    const [dayOfWeek, setDayOfWeek] = useState('1');
    const [startTime, setStartTime] = useState('07:30');
    const [endTime, setEndTime] = useState('09:00');
    const [room, setRoom] = useState('');
    const [durationMinutes, setDurationMinutes] = useState('90');

    // Notifikasi & Konfirmasi States
    const [localNotice, setLocalNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    // Sync default class ID
    useEffect(() => {
        if (!selectedClassId && allClasses.length > 0) {
            setSelectedClassId(allClasses[0].id);
        }
    }, [allClasses, selectedClassId]);

    // Rosters Selectors
    const classRosters = useMemo<ClassRoster[]>(
        () => (selectedClassId ? (getClassRosters(selectedClassId) as ClassRoster[]) : []),
        [selectedClassId, storeVersion],
    );

    const filteredRosters = useMemo(() => {
        const rosters = selectedDayFilter === 'all'
            ? classRosters
            : classRosters.filter(r => r.dayOfWeek === selectedDayFilter);

        return [...rosters].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
    }, [classRosters, selectedDayFilter]);

    // Auto calculate schedule time
    const hitungWaktuOtomatis = () => {
        const rostersHariIni = classRosters.filter(r => r.dayOfWeek === Number(dayOfWeek));

        if (rostersHariIni.length > 0) {
            const lastRoster = [...rostersHariIni].sort((a, b) => b.endTime.localeCompare(a.endTime))[0];
            setStartTime(lastRoster.endTime);
            setEndTime(addMinutes(lastRoster.endTime, Number(durationMinutes)));
        } else {
            setStartTime('07:30');
            setEndTime(addMinutes('07:30', Number(durationMinutes)));
        }
        setLocalNotice(null);
    };

    // Recalculate when day or duration changes
    useEffect(() => {
        hitungWaktuOtomatis();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dayOfWeek, selectedClassId, durationMinutes]);

    const handleStartTimeChange = (newStart: string) => {
        setStartTime(newStart);
        setEndTime(addMinutes(newStart, Number(durationMinutes)));
        setLocalNotice(null);
    };

    // Validasi sebelum konfirmasi
    const preCheckValidation = () => {
        if (!selectedClassId || !subject.trim() || !startTime || !endTime) {
            setLocalNotice({ message: '⚠️ Gagal: Lengkapi seluruh data elemen materi pengajaran.', type: 'error' });
            return;
        }

        const isConflict = classRosters.some(r => {
            if (r.dayOfWeek !== Number(dayOfWeek)) return false;
            return startTime < r.endTime && endTime > r.startTime;
        });

        if (isConflict) {
            setLocalNotice({ message: `⚠️ Jadwal bentrok dengan roster eksis di jam ${startTime} - ${endTime}!`, type: 'error' });
            return;
        }

        setLocalNotice(null);
        setShowConfirm(true);
    };

    // Eksekusi simpan
    const handleExecuteSimpan = () => {
        const teacher = allTeachers.find(t => t.id === selectedTeacherId);

        const saved = addClassRoster({
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

        if (!saved) {
            setLocalNotice({ message: '⚠️ Gagal menyimpan. Penyimpanan penuh, hapus data lama.', type: 'error' });
            setShowConfirm(false);
            return;
        }

        setSubject('');
        setRoom('');
        setLocalNotice({ message: '✅ Jadwal roster berhasil ditambahkan.', type: 'success' });
        setShowConfirm(false);
    };

    // Hapus roster
    const handleDeleteRoster = (id: string) => {
        setDeleteTargetId(id);
    };

    const handleConfirmDelete = () => {
        if (deleteTargetId) {
            deleteClassRoster(deleteTargetId);
            setLocalNotice({ message: '✅ Roster berhasil dihapus.', type: 'success' });
            setDeleteTargetId(null);
        }
    };

    return (
        <div className="w-full space-y-6">

            {/* ======== FORM INPUT ROSTER ======== */}
            <div className="w-full border border-black bg-white p-4 rounded-xl space-y-4">

                {/* STRIP HEADER */}
                <div className="flex items-center justify-between border-b border-black pb-2">
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-black">
                            Tambah Roster Pelajaran
                        </h3>
                        <p className="mt-0.5 text-[10px] text-black">
                            Sistem input fleksibel dengan indikator warning bentrok sejajar bar aksi eksekusi.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={hitungWaktuOtomatis}
                        className="inline-flex items-center gap-1 rounded-md border border-black px-2.5 py-1 text-[10px] font-bold text-black bg-white transition-colors hover:bg-black hover:text-white"
                    >
                        <RefreshCw className="w-3 h-3" /> Set Jam Otomatis
                    </button>
                </div>

                {/* GRID KONTROL FORM */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-3 items-end">

                    {/* Kelas */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-black">Kelas</label>
                        <select
                            value={selectedClassId}
                            onChange={e => {
                                setSelectedClassId(e.target.value);
                                setLocalNotice(null);
                                setShowConfirm(false);
                            }}
                            className="w-full rounded-md border border-black px-2 py-1.5 text-xs text-black outline-none bg-white"
                        >
                            {allClasses.map(cls => (
                                <option key={cls.id} value={cls.id}>{cls.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Hari */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-black">Hari</label>
                        <select
                            value={dayOfWeek}
                            onChange={e => {
                                setDayOfWeek(e.target.value);
                                setLocalNotice(null);
                                setShowConfirm(false);
                            }}
                            className="w-full rounded-md border border-black px-2 py-1.5 text-xs font-bold text-black outline-none bg-white"
                        >
                            {SCHOOL_DAY_OPTIONS.map(day => (
                                <option key={day.value} value={day.value}>{day.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Set Durasi */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-black">Set Durasi</label>
                        <select
                            value={durationMinutes}
                            onChange={e => {
                                setDurationMinutes(e.target.value);
                                setEndTime(addMinutes(startTime, Number(e.target.value)));
                                setLocalNotice(null);
                                setShowConfirm(false);
                            }}
                            className="w-full rounded-md border border-black px-2 py-1.5 text-xs text-black outline-none bg-white"
                        >
                            <option value="45">45 Menit (1 JP)</option>
                            <option value="90">90 Menit (2 JP)</option>
                            <option value="120">120 Menit (3 JP)</option>
                            <option value="180">180 Menit (4 JP)</option>
                        </select>
                    </div>

                    {/* Jam Mulai */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-black">Jam Mulai</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={e => handleStartTimeChange(e.target.value)}
                            className="w-full rounded-md border border-black px-2 py-1.5 text-xs font-mono font-bold text-black outline-none bg-white"
                        />
                    </div>

                    {/* Jam Selesai */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-black">Jam Selesai</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={e => {
                                setEndTime(e.target.value);
                                setLocalNotice(null);
                                setShowConfirm(false);
                            }}
                            className="w-full rounded-md border border-black px-2 py-1.5 text-xs font-mono font-bold text-black outline-none bg-white"
                        />
                    </div>

                    {/* Mata Pelajaran */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-black">Mata Pelajaran</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={e => {
                                setSubject(e.target.value);
                                setLocalNotice(null);
                                setShowConfirm(false);
                            }}
                            placeholder="Matematika"
                            className="w-full rounded-md border border-black px-3 py-1.5 text-xs text-black outline-none bg-white placeholder:text-neutral-400"
                        />
                    </div>

                    {/* Ruang Kelas */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-black">Ruang Kelas</label>
                        <input
                            type="text"
                            value={room}
                            onChange={e => {
                                setRoom(e.target.value);
                                setLocalNotice(null);
                                setShowConfirm(false);
                            }}
                            placeholder="LAB-01"
                            className="w-full rounded-md border border-black px-3 py-1.5 text-xs text-black outline-none bg-white placeholder:text-neutral-400"
                        />
                    </div>

                    {/* Pengajar */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-black">Pengajar</label>
                        <select
                            value={selectedTeacherId}
                            onChange={e => {
                                setSelectedTeacherId(e.target.value);
                                setLocalNotice(null);
                                setShowConfirm(false);
                            }}
                            className="w-full rounded-md border border-black px-2 py-1.5 text-xs text-black outline-none bg-white"
                        >
                            <option value="">-- Pilih Guru --</option>
                            {allTeachers.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* BAR BAWAH: NOTIFIKASI & TOMBOL DENGAN POPUP KONFIRMASI */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black pt-3 min-h-[44px] relative">

                    {/* Sisi Kiri: Notifikasi Status Inline */}
                    <div className="w-full sm:w-auto flex-1 flex items-center">
                        {localNotice ? (
                            <div
                                className={`flex items-center gap-1.5 text-[11px] font-bold tracking-tight ${
                                    localNotice.type === 'error' ? 'text-red-600' : 'text-black'
                                }`}
                            >
                                {localNotice.type === 'error' ? (
                                    <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                ) : (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                                )}
                                <span>{localNotice.message}</span>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-black font-bold tracking-tight">
                                <Clock className="w-3.5 h-3.5 text-black shrink-0" />
                                <span>Estimasi urutan auto-increment aktif.</span>
                            </div>
                        )}
                    </div>

                    {/* Sisi Kanan: Wadah Tombol & Pop-up Kustom */}
                    <div className="w-full sm:w-auto relative flex flex-col items-end gap-2 shrink-0">

                        {/* POP-UP KONFIRMASI KECIL */}
                        {showConfirm && (
                            <div className="absolute bottom-full right-0 mb-2 w-64 bg-white border border-black p-2.5 rounded-lg shadow-md z-10 space-y-2 text-right">
                                <div className="flex items-start gap-1.5 text-left">
                                    <HelpCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-black font-bold leading-tight">
                                        Yakin ingin menyimpan roster pelajaran ini sekarang?
                                    </p>
                                </div>
                                <div className="flex justify-end gap-1.5 text-[10px]">
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="px-2.5 py-1 border border-black rounded bg-white text-black font-bold hover:bg-gray-100 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleExecuteSimpan}
                                        className="px-2.5 py-1 border border-black rounded bg-black text-white font-bold hover:bg-neutral-800 transition-colors"
                                    >
                                        Ya, Simpan
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* TOMBOL UTAMA */}
                        <button
                            onClick={preCheckValidation}
                            className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-md border border-black px-4 py-2 text-xs font-bold transition-colors shrink-0 ${
                                showConfirm
                                    ? 'bg-gray-100 text-black cursor-not-allowed opacity-60'
                                    : 'bg-white text-black hover:bg-black hover:text-white'
                            }`}
                            disabled={showConfirm}
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Simpan Roster
                        </button>
                    </div>
                </div>
            </div>

            {/* ======== TABEL DAFTAR ROSTER ======== */}
            <div className="w-full border border-black bg-white p-4 rounded-xl space-y-4">

                {/* HEADER TABEL */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-black pb-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-black" />
                        <h3 className="text-xs font-bold uppercase tracking-wide text-black">
                            Daftar Susunan Roster Pelajaran
                        </h3>
                    </div>

                    <select
                        value={selectedDayFilter}
                        onChange={e => setSelectedDayFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                        className="rounded-md border border-black px-2 py-1 text-[11px] font-bold text-black outline-none bg-white"
                    >
                        <option value="all">Semua Hari</option>
                        {SCHOOL_DAY_OPTIONS.map(day => (
                            <option key={day.value} value={day.value}>{day.label}</option>
                        ))}
                    </select>
                </div>

                {/* TABEL */}
                <div className="overflow-x-auto border border-black rounded-md">
                    <table className="w-full text-left border-collapse bg-white">
                        <thead>
                            <tr className="border-b border-black text-[10px] font-bold uppercase tracking-wide text-black">
                                <th className="p-3 border-r border-black w-[100px]">Hari</th>
                                <th className="p-3 border-r border-black w-[90px] text-center">Jam Ke</th>
                                <th className="p-3 border-r border-black">Mata Pelajaran</th>
                                <th className="p-3 border-r border-black w-[150px]">Alokasi Waktu</th>
                                <th className="p-3 border-r border-black w-[120px]">Ruang Kelas</th>
                                <th className="p-3 border-r border-black">Tenaga Pengajar</th>
                                <th className="p-3 text-center w-[60px]">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/20 text-xs text-black">
                            {filteredRosters.map((item) => {
                                const rostersHariIni = classRosters
                                    .filter(r => r.dayOfWeek === item.dayOfWeek)
                                    .sort((a, b) => a.startTime.localeCompare(b.startTime));

                                const indexHariIni = rostersHariIni.findIndex(r => r.id === item.id);
                                const jpLabel = `JP-${indexHariIni + 1}`;

                                return (
                                    <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="p-3 font-bold border-r border-black/20 text-black">
                                            {DAY_NAMES[item.dayOfWeek]}
                                        </td>
                                        <td className="p-3 font-mono font-bold text-black text-center border-r border-black/20">
                                            {jpLabel}
                                        </td>
                                        <td className="p-3 font-bold text-black border-r border-black/20">
                                            {item.subject}
                                        </td>
                                        <td className="p-3 font-mono text-[11px] border-r border-black/20 text-black">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3 h-3 text-black" />
                                                {item.startTime} - {item.endTime}
                                            </div>
                                        </td>
                                        <td className="p-3 border-r border-black/20 text-black">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-3 h-3 text-black" />
                                                {item.room || '-'}
                                            </div>
                                        </td>
                                        <td className="p-3 border-r border-black/20 text-black font-bold">
                                            <div className="flex items-center gap-1.5">
                                                <UserCheck className="w-3 h-3 text-black" />
                                                {item.teacherName}
                                            </div>
                                        </td>
                                        <td className="p-3 text-center relative">
                                            {/* POP-UP KONFIRMASI HAPUS */}
                                            {deleteTargetId === item.id && (
                                                <div className="absolute bottom-full right-0 mb-2 w-56 bg-white border border-black p-2.5 rounded-lg shadow-md z-10 space-y-2 text-right">
                                                    <div className="flex items-start gap-1.5 text-left">
                                                        <HelpCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
                                                        <p className="text-[10px] text-black font-bold leading-tight">
                                                            Yakin ingin menghapus roster ini?
                                                        </p>
                                                    </div>
                                                    <div className="flex justify-end gap-1.5 text-[10px]">
                                                        <button
                                                            onClick={() => setDeleteTargetId(null)}
                                                            className="px-2.5 py-1 border border-black rounded bg-white text-black font-bold hover:bg-gray-100 transition-colors"
                                                        >
                                                            Batal
                                                        </button>
                                                        <button
                                                            onClick={handleConfirmDelete}
                                                            className="px-2.5 py-1 border border-black rounded bg-black text-white font-bold hover:bg-neutral-800 transition-colors"
                                                        >
                                                            Ya, Hapus
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteRoster(item.id)}
                                                className="shrink-0 rounded-md border border-black p-1.5 text-black transition-colors hover:text-white hover:bg-black"
                                                title="Hapus Roster"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredRosters.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center">
                                        <p className="text-[10px] uppercase tracking-widest text-black font-bold">
                                            — Belum ada data roster untuk kelas ini —
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
import { useState, useMemo, useEffect } from 'react';
import { UserPlus, Trash2, Save, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import {
    getClasses, getTeachers, getStudents, saveClasses, saveTeachers, getAttendance,
    getClassRosters, getClassAnnouncements, getOnlineAssignmentsByClass,
    deleteClassRoster, deleteClassAnnouncement, deleteOnlineAssignment, saveAttendance,
    saveStudents
} from '../../../data/store';
import { ClassRoom } from '../../../types';

type ClassEditMap = Record<string, { name: string; grade: string }>;

interface TabKelolaKelasProps {
    setNotice: (msg: string) => void;
}

export default function TabKelolaKelas({ setNotice }: TabKelolaKelasProps) {
    const storeVersion = useStoreVersion();
    const classes = useMemo(() => getClasses(), [storeVersion]);
    const teachers = useMemo(() => getTeachers(), [storeVersion]);
    const students = useMemo(() => getStudents(), [storeVersion]);

    const [classEdits, setClassEdits] = useState<ClassEditMap>({});
    const [newClassName, setNewClassName] = useState('');
    const [newClassGrade, setNewClassGrade] = useState('');
    const [moveTargets, setMoveTargets] = useState<Record<string, string>>({});

    // Notifikasi & Konfirmasi
    const [localNotice, setLocalNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [showAddConfirm, setShowAddConfirm] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const [moveConfirmId, setMoveConfirmId] = useState<string | null>(null);

    // Hitung jumlah siswa per kelas
    const studentCountByClass = useMemo(() => {
        const countMap = new Map<string, number>();
        students.forEach((item) => {
            countMap.set(item.classId, (countMap.get(item.classId) || 0) + 1);
        });
        return countMap;
    }, [students]);

    // Sinkronisasi data kelas ke state edit lokal
    useEffect(() => {
        const nextClassEdits: ClassEditMap = {};
        classes.forEach((classItem) => {
            nextClassEdits[classItem.id] = {
                name: classItem.name,
                grade: classItem.grade,
            };
        });
        setClassEdits(nextClassEdits);
    }, [classes]);

    const setClassField = (classId: string, field: keyof ClassEditMap[string], value: string) => {
        setClassEdits((prev) => ({
            ...prev,
            [classId]: { ...prev[classId], [field]: value },
        }));
        setLocalNotice(null);
        setShowSaveConfirm(false);
    };

    // ── SIMPAN PERUBAHAN KELAS ──
    const preCheckSave = () => {
        const classNames = new Set<string>();
        for (const item of classes) {
            const edit = classEdits[item.id];
            const name = (edit?.name || '').trim();
            const grade = (edit?.grade || '').trim();
            if (!name) { setLocalNotice({ message: '⚠️ Nama kelas tidak boleh kosong.', type: 'error' }); return; }
            if (!grade) { setLocalNotice({ message: '⚠️ Tingkat kelas tidak boleh kosong.', type: 'error' }); return; }
            const lowerName = name.toLowerCase();
            if (classNames.has(lowerName)) { setLocalNotice({ message: '⚠️ Ada nama kelas yang duplikat.', type: 'error' }); return; }
            classNames.add(lowerName);
        }
        setLocalNotice(null);
        setShowSaveConfirm(true);
    };

    const handleExecuteSave = () => {
        const nextClasses: ClassRoom[] = classes.map((item) => {
            const edit = classEdits[item.id];
            return { ...item, name: edit.name.trim(), grade: edit.grade.trim() };
        });
        saveClasses(nextClasses);
        setLocalNotice({ message: '✅ Daftar kelas berhasil diperbarui.', type: 'success' });
        setShowSaveConfirm(false);
        setNotice('✅ Daftar kelas berhasil diperbarui.');
    };

    // ── TAMBAH KELAS ──
    const preCheckAdd = () => {
        const name = newClassName.trim();
        const grade = newClassGrade.trim();
        if (!name || !grade) {
            setLocalNotice({ message: '⚠️ Isi nama kelas dan tingkat kelas terlebih dahulu.', type: 'error' });
            return;
        }
        const duplicate = classes.some((item) => item.name.toLowerCase() === name.toLowerCase());
        if (duplicate) {
            setLocalNotice({ message: '⚠️ Nama kelas sudah ada. Gunakan nama lain.', type: 'error' });
            return;
        }
        setLocalNotice(null);
        setShowAddConfirm(true);
    };

    const handleExecuteAdd = () => {
        const newClass: ClassRoom = {
            id: `c_${Date.now()}`,
            name: newClassName.trim(),
            grade: newClassGrade.trim(),
            teacherId: '',
        };
        saveClasses([...classes, newClass]);
        setNewClassName('');
        setNewClassGrade('');
        setLocalNotice({ message: '✅ Kelas baru berhasil ditambahkan.', type: 'success' });
        setShowAddConfirm(false);
        setNotice('✅ Kelas baru berhasil ditambahkan.');
    };

    // ── HAPUS KELAS ──
    const preCheckDelete = (classId: string) => {
        const classItem = classes.find((item) => item.id === classId);
        if (!classItem) return;
        const studentCount = studentCountByClass.get(classId) || 0;
        if (studentCount > 0) {
            setLocalNotice({
                message: `⚠️ Kelas ${classItem.name} tidak bisa dihapus — masih ada ${studentCount} siswa.`,
                type: 'error',
            });
            return;
        }
        setDeleteTargetId(classId);
    };

    const handleExecuteDelete = () => {
        if (!deleteTargetId) return;
        const classItem = classes.find((item) => item.id === deleteTargetId);
        if (!classItem) return;

        const nextClasses = classes.filter((item) => item.id !== deleteTargetId);
        const nextTeachers = teachers.map((item) => ({
            ...item,
            classIds: item.classIds.filter((id) => id !== deleteTargetId),
        }));
        const nextAttendance = getAttendance().filter((item) => item.classId !== deleteTargetId);
        const rosters = getClassRosters(deleteTargetId);
        const announcements = getClassAnnouncements(deleteTargetId);
        const assignments = getOnlineAssignmentsByClass(deleteTargetId);

        saveTeachers(nextTeachers);
        saveClasses(nextClasses);
        saveAttendance(nextAttendance);
        rosters.forEach((item) => deleteClassRoster(item.id));
        announcements.forEach((item) => deleteClassAnnouncement(item.id));
        assignments.forEach((item) => deleteOnlineAssignment(item.id));

        setLocalNotice({ message: `✅ Kelas ${classItem.name} berhasil dihapus.`, type: 'success' });
        setDeleteTargetId(null);
        setNotice(`✅ Kelas ${classItem.name} berhasil dihapus.`);
    };

    // ── PINDAH SISWA ──
    const preCheckMove = (sourceClassId: string) => {
        const sourceClass = classes.find((item) => item.id === sourceClassId);
        if (!sourceClass) return;
        const studentCount = studentCountByClass.get(sourceClassId) || 0;
        if (studentCount === 0) {
            setLocalNotice({ message: `⚠️ Kelas ${sourceClass.name} tidak memiliki siswa.`, type: 'error' });
            return;
        }
        const targetClassId = moveTargets[sourceClassId];
        if (!targetClassId || targetClassId === sourceClassId) {
            setLocalNotice({ message: '⚠️ Pilih kelas tujuan pemindahan siswa terlebih dahulu.', type: 'error' });
            return;
        }
        setLocalNotice(null);
        setMoveConfirmId(sourceClassId);
    };

    const handleExecuteMove = () => {
        if (!moveConfirmId) return;
        const sourceClass = classes.find((item) => item.id === moveConfirmId);
        const targetClassId = moveTargets[moveConfirmId];
        const targetClass = classes.find((item) => item.id === targetClassId);
        if (!sourceClass || !targetClass) return;

        const studentCount = studentCountByClass.get(moveConfirmId) || 0;
        const nextStudents = students.map((item) =>
            item.classId === moveConfirmId ? { ...item, classId: targetClassId } : item,
        );
        saveStudents(nextStudents);
        setMoveTargets((prev) => ({ ...prev, [moveConfirmId]: '' }));
        setLocalNotice({
            message: `✅ ${studentCount} siswa dipindahkan dari ${sourceClass.name} ke ${targetClass.name}.`,
            type: 'success',
        });
        setMoveConfirmId(null);
        setNotice(`✅ Berhasil memindahkan siswa dari ${sourceClass.name} ke ${targetClass.name}.`);
    };

    return (
        <div className="w-full bg-white p-4 rounded-xl space-y-4">

            {/* ── FORM TAMBAH KELAS ── */}
            <div className="border-b border-black pb-4 space-y-3">

                {/* Strip Header */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wide text-black">
                        Tambah Kelas Baru
                    </h3>
                    <p className="mt-0.5 text-[10px] text-black">
                        Daftarkan kelas baru ke dalam sistem dengan nama dan tingkat yang unik.
                    </p>
                </div>
				
				<div className="h-px w-full bg-black"></div>

                {/* Input Row */}
                <div className="flex flex-wrap items-end gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                            Nama Kelas Baru
                        </label>
                        <input
                            type="text"
                            value={newClassName}
                            onChange={(e) => {
                                setNewClassName(e.target.value);
                                setLocalNotice(null);
                                setShowAddConfirm(false);
                            }}
                            placeholder="Contoh: X-IPA-1"
                            className="w-52 rounded-md border border-black px-3 py-1.5 text-xs text-black outline-none bg-white placeholder:text-neutral-400"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                            Tingkat
                        </label>
                        <input
                            type="text"
                            value={newClassGrade}
                            onChange={(e) => {
                                setNewClassGrade(e.target.value);
                                setLocalNotice(null);
                                setShowAddConfirm(false);
                            }}
                            placeholder="Contoh: X, XI, XII"
                            className="w-36 rounded-md border border-black px-3 py-1.5 text-xs text-black outline-none bg-white placeholder:text-neutral-400"
                        />
                    </div>

                    {/* Tombol + Popup Konfirmasi Tambah */}
                    <div className="relative flex flex-col items-start gap-2">
                        {showAddConfirm && (
                            <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-black p-2.5 rounded-lg shadow-md z-10 space-y-2">
                                <div className="flex items-start gap-1.5">
                                    <HelpCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-black font-bold leading-tight">
                                        Yakin ingin menambahkan kelas{' '}
                                        <span className="font-mono">"{newClassName.trim()}"</span>?
                                    </p>
                                </div>
                                <div className="flex justify-end gap-1.5 text-[10px]">
                                    <button
                                        onClick={() => setShowAddConfirm(false)}
                                        className="px-2.5 py-1 border border-black rounded bg-white text-black font-bold hover:bg-gray-100 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleExecuteAdd}
                                        className="px-2.5 py-1 border border-black rounded bg-black text-white font-bold hover:bg-neutral-800 transition-colors"
                                    >
                                        Ya, Tambahkan
                                    </button>
                                </div>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={preCheckAdd}
                            disabled={showAddConfirm}
                            className={`inline-flex items-center gap-1.5 rounded-md border border-black px-3.5 py-1.5 text-xs font-bold transition-colors ${
                                showAddConfirm
                                    ? 'bg-gray-100 text-black cursor-not-allowed opacity-60'
                                    : 'bg-white text-black hover:bg-black hover:text-white'
                            }`}
                        >
                            <UserPlus className="h-3.5 w-3.5" />
                            Tambah Kelas
                        </button>
                    </div>
                </div>
            </div>

            {/* ── TABEL KELAS ── */}
            <div className="overflow-x-auto border border-black rounded-md">
                <table className="w-full min-w-[720px] border-collapse text-left bg-white">
                    <thead>
                        <tr className="border-b border-black text-[10px] font-bold uppercase tracking-wide text-black">
                            {['Kode Kelas', 'Nama Kelas', 'Tingkat', 'Guru PJ', 'Siswa', 'Aksi'].map((h) => (
                                <th key={h} className="pb-2.5 pt-2 px-3" scope="col">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 text-xs text-black">
                        {classes.map((classItem) => {
                            const edit = classEdits[classItem.id];
                            const teacherName =
                                teachers.find((item) => item.id === classItem.teacherId)?.name || '-';
                            const studentCount = studentCountByClass.get(classItem.id) || 0;
                            const canDelete = studentCount === 0;

                            return (
                                <tr key={classItem.id} className="hover:bg-neutral-50 transition-colors">

                                    {/* Kode */}
                                    <td className="px-3 py-2.5 text-[11px] font-mono text-black">
                                        {classItem.id}
                                    </td>

                                    {/* Nama Kelas Input */}
                                    <td className="px-3 py-2 pr-4">
                                        <input
                                            type="text"
                                            value={edit?.name || ''}
                                            onChange={(e) => setClassField(classItem.id, 'name', e.target.value)}
                                            className="w-full max-w-[180px] rounded-md border border-black px-2.5 py-1 text-xs text-black outline-none bg-white"
                                        />
                                    </td>

                                    {/* Tingkat Input */}
                                    <td className="px-3 py-2 pr-4">
                                        <input
                                            type="text"
                                            value={edit?.grade || ''}
                                            onChange={(e) => setClassField(classItem.id, 'grade', e.target.value)}
                                            className="w-20 rounded-md border border-black px-2.5 py-1 text-xs text-black outline-none bg-white"
                                        />
                                    </td>

                                    {/* Guru PJ */}
                                    <td className="px-3 py-2.5 text-xs font-bold text-black">
                                        {teacherName}
                                    </td>

                                    {/* Jumlah Siswa */}
                                    <td className="px-3 py-2.5">
                                        <span className={`text-xs font-bold font-mono tabular-nums ${
                                            studentCount > 0 ? 'text-black' : 'text-black/30'
                                        }`}>
                                            {studentCount}
                                        </span>
                                    </td>

                                    {/* Aksi */}
                                    <td className="px-3 py-2 relative">
                                        {canDelete ? (
                                            <div className="relative inline-block">
                                                {/* Popup Konfirmasi Hapus */}
                                                {deleteTargetId === classItem.id && (
                                                    <div className="absolute bottom-full right-0 mb-2 w-60 bg-white border border-black p-2.5 rounded-lg shadow-md z-10 space-y-2">
                                                        <div className="flex items-start gap-1.5">
                                                            <HelpCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
                                                            <p className="text-[10px] text-black font-bold leading-tight">
                                                                Hapus kelas{' '}
                                                                <span className="font-mono">"{classItem.name}"</span>?
                                                                Roster, pengumuman, tugas, dan absensi juga terhapus.
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
                                                                onClick={handleExecuteDelete}
                                                                className="px-2.5 py-1 border border-black rounded bg-black text-white font-bold hover:bg-neutral-800 transition-colors"
                                                            >
                                                                Ya, Hapus
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => preCheckDelete(classItem.id)}
                                                    title="Hapus kelas"
                                                    className="inline-flex items-center gap-1 rounded-md border border-black px-2.5 py-1 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    Hapus Kelas
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-1 min-w-[220px]">
                                                <p className="text-[10px] font-bold text-black">
                                                    {studentCount} siswa aktif — migrasikan data
                                                </p>
                                                <div className="flex gap-1.5 relative">
                                                    <select
                                                        value={moveTargets[classItem.id] || ''}
                                                        onChange={(e) => {
                                                            setMoveTargets((prev) => ({
                                                                ...prev,
                                                                [classItem.id]: e.target.value,
                                                            }));
                                                            setLocalNotice(null);
                                                            setMoveConfirmId(null);
                                                        }}
                                                        className="flex-1 rounded-md border border-black px-2 py-1 text-[11px] text-black bg-white outline-none"
                                                    >
                                                        <option value="">Pilih kelas tujuan</option>
                                                        {classes
                                                            .filter((item) => item.id !== classItem.id)
                                                            .map((item) => (
                                                                <option key={item.id} value={item.id}>
                                                                    {classEdits[item.id]?.name || item.name}
                                                                </option>
                                                            ))}
                                                    </select>

                                                    {/* Popup Konfirmasi Pindah */}
                                                    {moveConfirmId === classItem.id && (
                                                        <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-black p-2.5 rounded-lg shadow-md z-10 space-y-2">
                                                            <div className="flex items-start gap-1.5">
                                                                <HelpCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
                                                                <p className="text-[10px] text-black font-bold leading-tight">
                                                                    Pindahkan{' '}
                                                                    <span className="font-mono">{studentCount}</span>{' '}
                                                                    siswa dari{' '}
                                                                    <span className="font-mono">"{classItem.name}"</span>{' '}
                                                                    ke kelas tujuan?
                                                                </p>
                                                            </div>
                                                            <div className="flex justify-end gap-1.5 text-[10px]">
                                                                <button
                                                                    onClick={() => setMoveConfirmId(null)}
                                                                    className="px-2.5 py-1 border border-black rounded bg-white text-black font-bold hover:bg-gray-100 transition-colors"
                                                                >
                                                                    Batal
                                                                </button>
                                                                <button
                                                                    onClick={handleExecuteMove}
                                                                    className="px-2.5 py-1 border border-black rounded bg-black text-white font-bold hover:bg-neutral-800 transition-colors"
                                                                >
                                                                    Ya, Pindahkan
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => preCheckMove(classItem.id)}
                                                        disabled={classes.length <= 1 || moveConfirmId === classItem.id}
                                                        className={`rounded-md border px-2 py-1 text-[10px] font-bold transition-colors ${
                                                            classes.length <= 1 || moveConfirmId === classItem.id
                                                                ? 'cursor-not-allowed border-black/20 text-black/30'
                                                                : 'border-black text-black hover:bg-black hover:text-white'
                                                        }`}
                                                    >
                                                        Pindahkan
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}

                        {classes.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-12 text-center">
                                    <p className="text-[10px] uppercase tracking-widest text-black font-bold">
                                        — Belum ada kelas yang terdaftar —
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── BAR BAWAH: NOTIFIKASI & SIMPAN ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black pt-3 min-h-[44px] relative">

                {/* Sisi Kiri: Notifikasi Inline */}
                <div className="w-full sm:w-auto flex-1 flex items-center">
                    {localNotice && (
                        <div className={`flex items-center gap-1.5 text-[11px] font-bold tracking-tight ${
                            localNotice.type === 'error' ? 'text-red-600' : 'text-black'
                        }`}>
                            {localNotice.type === 'error' ? (
                                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                            ) : (
                                <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                            )}
                            <span>{localNotice.message}</span>
                        </div>
                    )}
                </div>

                {/* Sisi Kanan: Tombol Simpan + Popup Konfirmasi */}
                <div className="w-full sm:w-auto relative flex flex-col items-end gap-2 shrink-0">
                    {showSaveConfirm && (
                        <div className="absolute bottom-full right-0 mb-2 w-64 bg-white border border-black p-2.5 rounded-lg shadow-md z-10 space-y-2 text-right">
                            <div className="flex items-start gap-1.5 text-left">
                                <HelpCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
                                <p className="text-[10px] text-black font-bold leading-tight">
                                    Yakin ingin menyimpan semua perubahan nama dan tingkat kelas?
                                </p>
                            </div>
                            <div className="flex justify-end gap-1.5 text-[10px]">
                                <button
                                    onClick={() => setShowSaveConfirm(false)}
                                    className="px-2.5 py-1 border border-black rounded bg-white text-black font-bold hover:bg-gray-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleExecuteSave}
                                    className="px-2.5 py-1 border border-black rounded bg-black text-white font-bold hover:bg-neutral-800 transition-colors"
                                >
                                    Ya, Simpan
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={preCheckSave}
                        disabled={showSaveConfirm}
                        className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-md border border-black px-4 py-2 text-xs font-bold transition-colors shrink-0 ${
                            showSaveConfirm
                                ? 'bg-gray-100 text-black cursor-not-allowed opacity-60'
                                : 'bg-white text-black hover:bg-black hover:text-white'
                        }`}
                    >
                        <Save className="h-3.5 w-3.5" />
                        Simpan Perubahan Kelas
                    </button>
                </div>
            </div>
        </div>
    );
}
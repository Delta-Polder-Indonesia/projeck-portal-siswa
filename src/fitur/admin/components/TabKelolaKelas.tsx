import { useState, useMemo, useEffect } from 'react';
import { UserPlus, Trash2, Save } from 'lucide-react';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import {
    getClasses, getTeachers, getStudents, saveClasses, saveTeachers, getAttendance,
    getClassRosters, getClassAnnouncements, getOnlineAssignmentsByClass,
    deleteClassRoster, deleteClassAnnouncement, deleteOnlineAssignment, saveAttendance,
    saveStudents
} from '../../../data/store';
import { ClassRoom } from '../../../types';

type ClassEditMap = Record<string, { name: string; grade: string }>;

export default function TabKelolaKelas({ setNotice }: { setNotice: (msg: string) => void }) {
    const storeVersion = useStoreVersion();
    const classes = useMemo(() => getClasses(), [storeVersion]);
    const teachers = useMemo(() => getTeachers(), [storeVersion]);
    const students = useMemo(() => getStudents(), [storeVersion]);

    const [classEdits, setClassEdits] = useState<ClassEditMap>({});
    const [newClassName, setNewClassName] = useState('');
    const [newClassGrade, setNewClassGrade] = useState('');
    const [moveTargets, setMoveTargets] = useState<Record<string, string>>({});

    const studentCountByClass = useMemo(() => {
        const countMap = new Map<string, number>();
        students.forEach((item) => {
            countMap.set(item.classId, (countMap.get(item.classId) || 0) + 1);
        });
        return countMap;
    }, [students]);

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
    };

    const handleSaveClasses = () => {
        const classNames = new Set<string>();
        const nextClasses: ClassRoom[] = [];

        for (const item of classes) {
            const edit = classEdits[item.id];
            const name = (edit?.name || '').trim();
            const grade = (edit?.grade || '').trim();

            if (!name) { setNotice('Nama kelas tidak boleh kosong.'); return; }
            if (!grade) { setNotice('Tingkat kelas tidak boleh kosong.'); return; }

            const lowerName = name.toLowerCase();
            if (classNames.has(lowerName)) { setNotice('Ada nama kelas yang duplikat.'); return; }
            classNames.add(lowerName);

            nextClasses.push({ ...item, name, grade });
        }

        saveClasses(nextClasses);
        setNotice('Daftar kelas berhasil diperbarui.');
    };

    const handleAddClass = () => {
        const name = newClassName.trim();
        const grade = newClassGrade.trim();
        if (!name || !grade) {
            setNotice('Isi nama kelas dan tingkat kelas terlebih dahulu.');
            return;
        }

        const duplicate = classes.some((item) => item.name.toLowerCase() === name.toLowerCase());
        if (duplicate) {
            setNotice('Nama kelas sudah ada. Gunakan nama kelas lain.');
            return;
        }

        const newClass: ClassRoom = { id: `c_${Date.now()}`, name, grade, teacherId: '' };
        saveClasses([...classes, newClass]);
        setNewClassName('');
        setNewClassGrade('');
        setNotice('Kelas baru berhasil ditambahkan.');
    };

    const handleDeleteClass = (classId: string) => {
        const classItem = classes.find((item) => item.id === classId);
        if (!classItem) return;

        const studentCount = studentCountByClass.get(classId) || 0;
        if (studentCount > 0) {
            setNotice(`Kelas ${classItem.name} tidak bisa dihapus karena masih memiliki ${studentCount} siswa.`);
            return;
        }

        const confirmed = window.confirm(
            `Hapus kelas ${classItem.name}? Data roster, pengumuman, tugas, dan absensi kelas ini juga akan dihapus.`,
        );
        if (!confirmed) return;

        const nextClasses = classes.filter((item) => item.id !== classId);
        const nextTeachers = teachers.map((item) => ({
            ...item,
            classIds: item.classIds.filter((id) => id !== classId),
        }));

        const nextAttendance = getAttendance().filter((item) => item.classId !== classId);
        const rosters = getClassRosters(classId);
        const announcements = getClassAnnouncements(classId);
        const assignments = getOnlineAssignmentsByClass(classId);

        saveTeachers(nextTeachers);
        saveClasses(nextClasses);
        saveAttendance(nextAttendance);
        rosters.forEach((item) => deleteClassRoster(item.id));
        announcements.forEach((item) => deleteClassAnnouncement(item.id));
        assignments.forEach((item) => deleteOnlineAssignment(item.id));

        setNotice(`Kelas ${classItem.name} berhasil dihapus.`);
    };

    const handleMoveStudents = (sourceClassId: string) => {
        const sourceClass = classes.find((item) => item.id === sourceClassId);
        if (!sourceClass) return;

        const studentCount = studentCountByClass.get(sourceClassId) || 0;
        if (studentCount === 0) {
            setNotice(`Kelas ${sourceClass.name} tidak memiliki siswa yang perlu dipindahkan.`);
            return;
        }

        const targetClassId = moveTargets[sourceClassId];
        if (!targetClassId || targetClassId === sourceClassId) {
            setNotice('Pilih kelas tujuan pemindahan siswa terlebih dahulu.');
            return;
        }

        const targetClass = classes.find((item) => item.id === targetClassId);
        if (!targetClass) { setNotice('Kelas tujuan tidak ditemukan.'); return; }

        const confirmed = window.confirm(
            `Pindahkan ${studentCount} siswa dari kelas ${sourceClass.name} ke ${targetClass.name}?`,
        );
        if (!confirmed) return;

        const nextStudents = students.map((item) =>
            item.classId === sourceClassId ? { ...item, classId: targetClassId } : item,
        );

        saveStudents(nextStudents);
        setMoveTargets((prev) => ({ ...prev, [sourceClassId]: '' }));
        setNotice(
            `Berhasil memindahkan ${studentCount} siswa dari ${sourceClass.name} ke ${targetClass.name}.`,
        );
    };

    return (
        <div className="mx-auto max-w-5xl space-y-3 rounded-sm border border-gray-200 p-3">

            {/* STRIP HEADER */}
            <div className="border-b border-gray-200 pb-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                    Kelola Daftar Kelas
                </h3>
            </div>

            {/* FORM TAMBAH KELAS */}
            <div className="flex flex-wrap items-end gap-2 rounded-sm border border-gray-200 bg-gray-50/50 p-2.5">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                        Nama Kelas Baru
                    </label>
                    <input
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="Contoh: X-IPA-1"
                        className="w-48 rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-500"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                        Tingkat
                    </label>
                    <input
                        value={newClassGrade}
                        onChange={(e) => setNewClassGrade(e.target.value)}
                        placeholder="Contoh: X, XI, XII"
                        className="w-36 rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-500"
                    />
                </div>
                <button
                    onClick={handleAddClass}
                    className="inline-flex items-center gap-1.5 rounded-sm bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-700"
                >
                    <UserPlus className="h-3.5 w-3.5" />
                    Tambah Kelas
                </button>
            </div>

            {/* TABLE GRID */}
            <div className="overflow-x-auto rounded-sm border border-gray-200">
                <table className="w-full min-w-[680px] border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-left">
                            {['Kode Kelas', 'Nama Kelas', 'Tingkat', 'Guru PJ', 'Siswa', 'Aksi'].map((h) => (
                                <th
                                    key={h}
                                    className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-500"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {classes.map((classItem) => {
                            const edit = classEdits[classItem.id];
                            const teacherName =
                                teachers.find((item) => item.id === classItem.teacherId)?.name || '-';
                            const studentCount = studentCountByClass.get(classItem.id) || 0;
                            const canDelete = studentCount === 0;

                            return (
                                <tr key={classItem.id} className="transition-colors hover:bg-gray-50/60">

                                    {/* Kode */}
                                    <td className="px-2.5 py-1.5 text-[10px] font-mono text-gray-400">
                                        {classItem.id}
                                    </td>

                                    {/* Nama Kelas Input */}
                                    <td className="px-2.5 py-1.5">
                                        <input
                                            value={edit?.name || ''}
                                            onChange={(e) => setClassField(classItem.id, 'name', e.target.value)}
                                            className="w-full rounded-sm border border-gray-300 px-2 py-1 text-xs text-gray-800 outline-none transition-colors focus:border-gray-500"
                                        />
                                    </td>

                                    {/* Tingkat Input */}
                                    <td className="px-2.5 py-1.5">
                                        <input
                                            value={edit?.grade || ''}
                                            onChange={(e) => setClassField(classItem.id, 'grade', e.target.value)}
                                            className="w-20 rounded-sm border border-gray-300 px-2 py-1 text-xs text-gray-800 outline-none transition-colors focus:border-gray-500"
                                        />
                                    </td>

                                    {/* Guru PJ */}
                                    <td className="px-2.5 py-1.5 text-xs text-gray-700">
                                        {teacherName}
                                    </td>

                                    {/* Jumlah Siswa */}
                                    <td className="px-2.5 py-1.5">
                                        <span className={`text-xs font-bold tabular-nums ${studentCount > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                                            {studentCount}
                                        </span>
                                    </td>

                                    {/* Aksi */}
                                    <td className="px-2.5 py-1.5">
                                        {canDelete ? (
                                            <button
                                                onClick={() => handleDeleteClass(classItem.id)}
                                                title="Hapus kelas"
                                                className="inline-flex items-center gap-1 rounded-sm border border-red-200 px-2 py-1 text-[10px] font-bold text-red-700 transition-colors hover:bg-red-50"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                Hapus
                                            </button>
                                        ) : (
                                            <div className="flex flex-col gap-1 min-w-[200px]">
                                                <p className="text-[10px] font-medium text-amber-700">
                                                    {studentCount} siswa aktif — pindahkan dulu
                                                </p>
                                                <div className="flex gap-1">
                                                    <select
                                                        value={moveTargets[classItem.id] || ''}
                                                        onChange={(e) =>
                                                            setMoveTargets((prev) => ({
                                                                ...prev,
                                                                [classItem.id]: e.target.value,
                                                            }))
                                                        }
                                                        className="flex-1 rounded-sm border border-gray-300 px-1.5 py-1 text-[10px] text-gray-700 outline-none focus:border-gray-500"
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
                                                    <button
                                                        onClick={() => handleMoveStudents(classItem.id)}
                                                        disabled={classes.length <= 1}
                                                        className={`rounded-sm border px-2 py-1 text-[10px] font-bold transition-colors ${
                                                            classes.length <= 1
                                                                ? 'cursor-not-allowed border-gray-200 text-gray-400'
                                                                : 'border-blue-200 text-blue-700 hover:bg-blue-50'
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
                                <td
                                    colSpan={6}
                                    className="px-3 py-8 text-center text-[10px] uppercase tracking-widest text-gray-400"
                                >
                                    — Belum ada kelas yang terdaftar —
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* TOMBOL SIMPAN */}
            <div className="flex justify-end border-t border-gray-200 pt-2">
                <button
                    onClick={handleSaveClasses}
                    className="inline-flex items-center gap-1.5 rounded-sm bg-gray-900 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-gray-800"
                >
                    <Save className="h-3.5 w-3.5" />
                    Simpan Daftar Kelas
                </button>
            </div>
        </div>
    );
}
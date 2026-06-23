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
            [classId]: {
                ...prev[classId],
                [field]: value,
            },
        }));
    };

    const handleSaveClasses = () => {
        const classNames = new Set<string>();
        const nextClasses: ClassRoom[] = [];

        for (const item of classes) {
            const edit = classEdits[item.id];
            const name = (edit?.name || '').trim();
            const grade = (edit?.grade || '').trim();

            if (!name) {
                setNotice('Nama kelas tidak boleh kosong.');
                return;
            }
            if (!grade) {
                setNotice('Tingkat kelas tidak boleh kosong.');
                return;
            }

            const lowerName = name.toLowerCase();
            if (classNames.has(lowerName)) {
                setNotice('Ada nama kelas yang duplikat.');
                return;
            }
            classNames.add(lowerName);

            nextClasses.push({
                ...item,
                name,
                grade,
            });
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

        const newClass: ClassRoom = {
            id: `c_${Date.now()}`,
            name,
            grade,
            teacherId: '',
        };

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

        const confirmed = window.confirm(`Hapus kelas ${classItem.name}? Data roster, pengumuman, tugas, dan absensi kelas ini juga akan dihapus.`);
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
        if (!targetClass) {
            setNotice('Kelas tujuan tidak ditemukan.');
            return;
        }

        const confirmed = window.confirm(
            `Pindahkan ${studentCount} siswa dari kelas ${sourceClass.name} ke ${targetClass.name}?`,
        );
        if (!confirmed) return;

        const nextStudents = students.map((item) => (
            item.classId === sourceClassId ? { ...item, classId: targetClassId } : item
        ));

        saveStudents(nextStudents);
        setMoveTargets((prev) => ({ ...prev, [sourceClassId]: '' }));
        setNotice(`Berhasil memindahkan ${studentCount} siswa dari ${sourceClass.name} ke ${targetClass.name}.`);
    };

    return (
        <div className="min-h-[540px] space-y-3 rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800">Kelola Daftar Kelas</h3>
            <div className="grid md:grid-cols-2 gap-2">
                <input
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="Nama kelas baru (contoh: X-IPA-1)"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                    value={newClassGrade}
                    onChange={(e) => setNewClassGrade(e.target.value)}
                    placeholder="Tingkat (contoh: X, XI, XII)"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
            </div>
            <button onClick={handleAddClass} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm w-fit">
                <UserPlus className="w-4 h-4" /> Tambah Kelas
            </button>

            <div className="border border-gray-200 rounded-lg overflow-x-auto">
                <table className="w-full min-w-[620px]">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs text-gray-600">
                            <th className="px-3 py-2">Kode Kelas</th>
                            <th className="px-3 py-2">Nama Kelas</th>
                            <th className="px-3 py-2">Tingkat</th>
                            <th className="px-3 py-2">Guru Penanggung Jawab</th>
                            <th className="px-3 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((classItem) => {
                            const edit = classEdits[classItem.id];
                            const teacherName = teachers.find((item) => item.id === classItem.teacherId)?.name || '-';
                            const studentCount = studentCountByClass.get(classItem.id) || 0;
                            const canDelete = studentCount === 0;
                            return (
                                <tr key={classItem.id} className="border-b border-gray-100 last:border-0">
                                    <td className="px-3 py-2 text-sm text-gray-500">{classItem.id}</td>
                                    <td className="px-3 py-2">
                                        <input
                                            value={edit?.name || ''}
                                            onChange={(e) => setClassField(classItem.id, 'name', e.target.value)}
                                            className="px-2 py-1.5 border border-gray-300 rounded-md text-sm w-full"
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <input
                                            value={edit?.grade || ''}
                                            onChange={(e) => setClassField(classItem.id, 'grade', e.target.value)}
                                            className="px-2 py-1.5 border border-gray-300 rounded-md text-sm w-28"
                                        />
                                    </td>
                                    <td className="px-3 py-2 text-sm text-gray-700">{teacherName}</td>
                                    <td className="px-3 py-2">
                                        {canDelete ? (
                                            <button
                                                onClick={() => handleDeleteClass(classItem.id)}
                                                title="Hapus kelas"
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs border border-red-200 text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Hapus
                                            </button>
                                        ) : (
                                            <div className="flex flex-col gap-1.5 min-w-52">
                                                <p className="text-[11px] text-amber-700">Masih ada {studentCount} siswa</p>
                                                <div className="flex gap-1.5">
                                                    <select
                                                        value={moveTargets[classItem.id] || ''}
                                                        onChange={(e) => setMoveTargets((prev) => ({ ...prev, [classItem.id]: e.target.value }))}
                                                        className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-xs"
                                                    >
                                                        <option value="">Pilih kelas tujuan</option>
                                                        {classes
                                                            .filter((item) => item.id !== classItem.id)
                                                            .map((item) => (
                                                                <option key={item.id} value={item.id}>{classEdits[item.id]?.name || item.name}</option>
                                                            ))}
                                                    </select>
                                                    <button
                                                        onClick={() => handleMoveStudents(classItem.id)}
                                                        disabled={classes.length <= 1}
                                                        className={`px-2.5 py-1.5 rounded-md text-xs border ${classes.length <= 1
                                                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                                            : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                                                            }`}
                                                    >
                                                        Pindahkan Siswa
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <button onClick={handleSaveClasses} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm w-fit">
                <Save className="w-4 h-4" /> Simpan Daftar Kelas
            </button>
        </div>
    );
}

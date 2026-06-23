import { useState, useMemo, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import {
    getClasses, getTeachers, saveClasses, saveTeachers
} from '../../../data/store';
import { applyExclusiveClassAssignment } from './utils';

type TeacherEditMap = Record<string, {
    name: string;
    nip: string;
    password: string;
    subject: string;
    classIds: string[];
}>;

export default function TabAkunGuru({ setNotice }: { setNotice: (msg: string) => void }) {
    const storeVersion = useStoreVersion();
    const classes = useMemo(() => getClasses(), [storeVersion]);
    const teachers = useMemo(() => getTeachers(), [storeVersion]);

    const [searchTeacher, setSearchTeacher] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [teacherEdits, setTeacherEdits] = useState<TeacherEditMap>({});

    useEffect(() => {
        const nextTeacherEdits: TeacherEditMap = {};
        teachers.forEach((teacher) => {
            nextTeacherEdits[teacher.id] = {
                name: teacher.name,
                nip: teacher.nip,
                password: teacher.password,
                subject: teacher.subject,
                classIds: [...teacher.classIds],
            };
        });
        setTeacherEdits(nextTeacherEdits);
        setSelectedTeacherId((prev) =>
            prev && nextTeacherEdits[prev] ? prev : teachers[0]?.id || '',
        );
    }, [teachers]);

    const setTeacherField = (
        teacherId: string,
        field: keyof TeacherEditMap[string],
        value: string | string[],
    ) => {
        setTeacherEdits((prev) => ({
            ...prev,
            [teacherId]: { ...prev[teacherId], [field]: value },
        }));
    };

    const toggleTeacherClass = (teacherId: string, classId: string) => {
        const current = teacherEdits[teacherId]?.classIds || [];
        const next = current.includes(classId)
            ? current.filter((id) => id !== classId)
            : [...current, classId];
        setTeacherField(teacherId, 'classIds', next);
    };

    const handleSaveTeacher = (teacherId: string) => {
        const edit = teacherEdits[teacherId];
        if (!edit) return;

        const nipUsed = teachers.find(
            (item) => item.nip === edit.nip.trim() && item.id !== teacherId,
        );
        if (nipUsed) {
            setNotice('NIP sudah digunakan guru lain.');
            return;
        }

        const targetTeacher = teachers.find((item) => item.id === teacherId);
        if (!targetTeacher) return;

        const patchedTeachers = teachers.map((item) => {
            if (item.id !== teacherId) return item;
            return {
                ...item,
                name: edit.name.trim(),
                nip: edit.nip.trim(),
                password: edit.password,
                subject: edit.subject.trim(),
            };
        });

        const { nextTeachers, nextClasses } = applyExclusiveClassAssignment(
            patchedTeachers,
            classes,
            teacherId,
            edit.classIds,
        );

        saveTeachers(nextTeachers);
        saveClasses(nextClasses);
        setNotice(`Akun guru ${targetTeacher.name} berhasil diperbarui.`);
    };

    const filteredTeachers = useMemo(() => {
        const key = searchTeacher.trim().toLowerCase();
        if (!key) return teachers;
        return teachers.filter((item) => {
            const edit = teacherEdits[item.id];
            const classNames = (edit?.classIds || item.classIds)
                .map((classId) => classes.find((c) => c.id === classId)?.name || '')
                .join(' ')
                .toLowerCase();
            return (
                item.name.toLowerCase().includes(key) ||
                item.nip.toLowerCase().includes(key) ||
                item.subject.toLowerCase().includes(key) ||
                classNames.includes(key)
            );
        });
    }, [teachers, searchTeacher, teacherEdits, classes]);

    const selectedTeacher =
        teachers.find((item) => item.id === selectedTeacherId) ||
        filteredTeachers[0] ||
        null;
    const selectedTeacherEdit = selectedTeacher
        ? teacherEdits[selectedTeacher.id]
        : null;

    return (
        <div className="mx-auto max-w-5xl grid min-h-[420px] gap-3 rounded-sm border border-gray-200 p-3 lg:grid-cols-[220px_1fr]">

            {/* KOLOM KIRI — DAFTAR GURU */}
            <div className="space-y-2 border-r border-gray-100 pr-3">
                <input
                    value={searchTeacher}
                    onChange={(e) => setSearchTeacher(e.target.value)}
                    placeholder="Cari nama, NIP, mapel..."
                    className="w-full rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-500"
                />

                <div className="max-h-[380px] overflow-y-auto rounded-sm border border-gray-200">
                    {filteredTeachers.map((teacher) => {
                        const isActive = selectedTeacher?.id === teacher.id;
                        const selectedCount =
                            teacherEdits[teacher.id]?.classIds.length ||
                            teacher.classIds.length;
                        return (
                            <button
                                key={teacher.id}
                                onClick={() => setSelectedTeacherId(teacher.id)}
                                className={`w-full border-b border-gray-100 px-2.5 py-2 text-left last:border-0 transition-colors ${
                                    isActive
                                        ? 'bg-blue-50'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <p className="text-xs font-semibold text-gray-800 truncate">
                                    {teacher.name}
                                </p>
                                <p className="text-[10px] text-gray-500 truncate">
                                    {teacher.nip} · {teacher.subject}
                                </p>
                                <p className="text-[10px] font-medium text-blue-600">
                                    {selectedCount} kelas aktif
                                </p>
                            </button>
                        );
                    })}

                    {filteredTeachers.length === 0 && (
                        <p className="px-2.5 py-6 text-center text-[10px] uppercase tracking-wide text-gray-400">
                            Guru tidak ditemukan.
                        </p>
                    )}
                </div>
            </div>

            {/* KOLOM KANAN — FORM EDITOR */}
            <div className="min-w-0">
                {selectedTeacher && selectedTeacherEdit ? (
                    <div className="space-y-3">

                        {/* STRIP HEADER */}
                        <div className="border-b border-gray-200 pb-1.5">
                            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                                Ubah Data Guru —{' '}
                                <span className="text-blue-700">{selectedTeacher.name}</span>
                            </h3>
                        </div>

                        {/* FIELD GRID */}
                        <div className="grid gap-2 md:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                    Nama Guru
                                </label>
                                <input
                                    value={selectedTeacherEdit.name}
                                    onChange={(e) =>
                                        setTeacherField(selectedTeacher.id, 'name', e.target.value)
                                    }
                                    placeholder="Nama guru"
                                    className="w-full rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors focus:border-gray-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                    Mata Pelajaran
                                </label>
                                <input
                                    value={selectedTeacherEdit.subject}
                                    onChange={(e) =>
                                        setTeacherField(selectedTeacher.id, 'subject', e.target.value)
                                    }
                                    placeholder="Mata pelajaran"
                                    className="w-full rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors focus:border-gray-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                    NIP
                                </label>
                                <input
                                    value={selectedTeacherEdit.nip}
                                    onChange={(e) =>
                                        setTeacherField(selectedTeacher.id, 'nip', e.target.value)
                                    }
                                    placeholder="NIP"
                                    className="w-full rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors focus:border-gray-500"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                    Kata Sandi
                                </label>
                                <input
                                    value={selectedTeacherEdit.password}
                                    onChange={(e) =>
                                        setTeacherField(selectedTeacher.id, 'password', e.target.value)
                                    }
                                    placeholder="Kata sandi"
                                    className="w-full rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors focus:border-gray-500"
                                />
                            </div>
                        </div>

                        {/* KELAS AJAR — CHECKBOX GRID */}
                        <div className="space-y-1.5 rounded-sm border border-gray-200 bg-gray-50/50 p-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                Kelas Ajar{' '}
                                <span className="font-normal normal-case text-gray-400">
                                    — eksklusif, antar-guru tidak saling melihat data
                                </span>
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 md:grid-cols-3">
                                {classes.map((item) => (
                                    <label
                                        key={item.id}
                                        className="flex cursor-pointer items-center gap-1.5 text-[11px] text-gray-700 hover:text-gray-900"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedTeacherEdit.classIds.includes(item.id)}
                                            onChange={() =>
                                                toggleTeacherClass(selectedTeacher.id, item.id)
                                            }
                                            className="h-3 w-3 accent-blue-600"
                                        />
                                        {item.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* TOMBOL SIMPAN */}
                        <div className="flex justify-end border-t border-gray-200 pt-2">
                            <button
                                onClick={() => handleSaveTeacher(selectedTeacher.id)}
                                className="inline-flex items-center gap-1.5 rounded-sm bg-gray-900 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-gray-800"
                            >
                                <Save className="h-3.5 w-3.5" />
                                Simpan Perubahan Guru
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400">
                            — Pilih guru untuk mengedit akun —
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
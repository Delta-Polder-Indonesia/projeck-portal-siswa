import { useState, useMemo, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import {
    getClasses, getTeachers, saveClasses, saveTeachers
} from '../../../data/store';
import { applyExclusiveClassAssignment } from './utils';

type TeacherEditMap = Record<string, { name: string; nip: string; password: string; subject: string; classIds: string[] }>;

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
        setSelectedTeacherId((prev) => (prev && nextTeacherEdits[prev] ? prev : teachers[0]?.id || ''));
    }, [teachers]);

    const setTeacherField = (teacherId: string, field: keyof TeacherEditMap[string], value: string | string[]) => {
        setTeacherEdits((prev) => ({
            ...prev,
            [teacherId]: {
                ...prev[teacherId],
                [field]: value,
            },
        }));
    };

    const toggleTeacherClass = (teacherId: string, classId: string) => {
        const current = teacherEdits[teacherId]?.classIds || [];
        const next = current.includes(classId) ? current.filter((id) => id !== classId) : [...current, classId];
        setTeacherField(teacherId, 'classIds', next);
    };

    const handleSaveTeacher = (teacherId: string) => {
        const edit = teacherEdits[teacherId];
        if (!edit) return;

        const nipUsed = teachers.find((item) => item.nip === edit.nip.trim() && item.id !== teacherId);
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
                .map((classId) => classes.find((classItem) => classItem.id === classId)?.name || '')
                .join(' ')
                .toLowerCase();

            return (
                item.name.toLowerCase().includes(key)
                || item.nip.toLowerCase().includes(key)
                || item.subject.toLowerCase().includes(key)
                || classNames.includes(key)
            );
        });
    }, [teachers, searchTeacher, teacherEdits, classes]);

    const selectedTeacher = teachers.find((item) => item.id === selectedTeacherId) || filteredTeachers[0] || null;
    const selectedTeacherEdit = selectedTeacher ? teacherEdits[selectedTeacher.id] : null;

    return (
        <div className="grid min-h-[540px] gap-4 rounded-xl border border-gray-200 p-4 lg:grid-cols-[280px_1fr]">
            <div className="space-y-3">
                <input
                    value={searchTeacher}
                    onChange={(e) => setSearchTeacher(e.target.value)}
                    placeholder="Cari nama guru, NIP, mapel..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <div className="max-h-[360px] overflow-y-auto border border-gray-200 rounded-lg">
                    {filteredTeachers.map((teacher) => {
                        const isActive = selectedTeacher?.id === teacher.id;
                        const selectedCount = teacherEdits[teacher.id]?.classIds.length || teacher.classIds.length;
                        return (
                            <button
                                key={teacher.id}
                                onClick={() => setSelectedTeacherId(teacher.id)}
                                className={`w-full text-left px-3 py-2 border-b border-gray-100 last:border-0 ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                            >
                                <p className="text-sm font-medium text-gray-800">{teacher.name}</p>
                                <p className="text-xs text-gray-500">{teacher.nip} - {teacher.subject}</p>
                                <p className="text-[11px] text-blue-700">{selectedCount} kelas aktif</p>
                            </button>
                        );
                    })}
                    {filteredTeachers.length === 0 && (
                        <p className="px-3 py-4 text-sm text-gray-500">Guru tidak ditemukan.</p>
                    )}
                </div>
            </div>

            <div>
                {selectedTeacher && selectedTeacherEdit ? (
                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800">Ubah Data Guru: {selectedTeacher.name}</h3>
                        <div className="grid md:grid-cols-2 gap-2">
                            <input value={selectedTeacherEdit.name} onChange={(e) => setTeacherField(selectedTeacher.id, 'name', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Nama guru" />
                            <input value={selectedTeacherEdit.subject} onChange={(e) => setTeacherField(selectedTeacher.id, 'subject', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Mata pelajaran" />
                            <input value={selectedTeacherEdit.nip} onChange={(e) => setTeacherField(selectedTeacher.id, 'nip', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="NIP" />
                            <input value={selectedTeacherEdit.password} onChange={(e) => setTeacherField(selectedTeacher.id, 'password', e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Kata sandi" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-2">Kelas ajar guru (eksklusif agar antar-guru tidak saling melihat data)</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {classes.map((item) => (
                                    <label key={item.id} className="flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={selectedTeacherEdit.classIds.includes(item.id)}
                                            onChange={() => toggleTeacherClass(selectedTeacher.id, item.id)}
                                        />
                                        {item.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button onClick={() => handleSaveTeacher(selectedTeacher.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm">
                            <Save className="w-4 h-4" /> Simpan Perubahan Guru
                        </button>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">Pilih guru terlebih dahulu untuk mengedit akun.</p>
                )}
            </div>
        </div>
    );
}

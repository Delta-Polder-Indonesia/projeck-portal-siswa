import { useState, useMemo } from 'react';
import { UserPlus } from 'lucide-react';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import {
    getClasses, getTeachers, saveClasses, saveTeachers
} from '../../../data/store';
import { Teacher } from '../../../types';
import { applyExclusiveClassAssignment } from './utils';

export default function TabTambahGuru({ setNotice }: { setNotice: (msg: string) => void }) {
    const storeVersion = useStoreVersion();
    const classes = useMemo(() => getClasses(), [storeVersion]);
    const teachers = useMemo(() => getTeachers(), [storeVersion]);

    const [newTeacherName, setNewTeacherName] = useState('');
    const [newTeacherNip, setNewTeacherNip] = useState('');
    const [newTeacherPassword, setNewTeacherPassword] = useState('');
    const [newTeacherSubject, setNewTeacherSubject] = useState('');
    const [newTeacherClassIds, setNewTeacherClassIds] = useState<string[]>([]);

    const toggleNewTeacherClass = (classId: string) => {
        setNewTeacherClassIds((prev) => (prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]));
    };

    const handleAddTeacher = () => {
        if (!newTeacherName.trim() || !newTeacherNip.trim() || !newTeacherPassword.trim() || !newTeacherSubject.trim()) {
            setNotice('Lengkapi data guru baru terlebih dahulu.');
            return;
        }

        const nipUsed = teachers.some((item) => item.nip === newTeacherNip.trim());
        if (nipUsed) {
            setNotice('NIP sudah digunakan guru lain.');
            return;
        }

        const newTeacher: Teacher = {
            id: `t_${Date.now()}`,
            name: newTeacherName.trim(),
            nip: newTeacherNip.trim(),
            subject: newTeacherSubject.trim(),
            password: newTeacherPassword,
            classIds: [],
        };

        const withTeacher = [...teachers, newTeacher];
        const { nextTeachers, nextClasses } = applyExclusiveClassAssignment(
            withTeacher,
            classes,
            newTeacher.id,
            newTeacherClassIds,
        );

        saveTeachers(nextTeachers);
        saveClasses(nextClasses);
        setNewTeacherName('');
        setNewTeacherNip('');
        setNewTeacherPassword('');
        setNewTeacherSubject('');
        setNewTeacherClassIds([]);
        setNotice('Guru baru berhasil ditambahkan.');
    };

    return (
        <div className="min-h-screen space-y-4 rounded-xl border border-gray-200 p-6 bg-white">
            <div className="mx-auto grid w-full gap-6 lg:grid-cols-[1.1fr_1fr]">
                <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/60 p-6">
                    <h3 className="text-base font-semibold text-gray-800">Form Tambah Guru</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-600">Nama Guru</label>
                            <input
                                value={newTeacherName}
                                onChange={(e) => setNewTeacherName(e.target.value)}
                                placeholder="Contoh: Budi Santoso"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-600">NIP</label>
                            <input
                                value={newTeacherNip}
                                onChange={(e) => setNewTeacherNip(e.target.value)}
                                placeholder="Masukkan NIP"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-600">Kata Sandi</label>
                            <input
                                value={newTeacherPassword}
                                onChange={(e) => setNewTeacherPassword(e.target.value)}
                                placeholder="Minimal 8 karakter"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-600">Mata Pelajaran</label>
                            <input
                                value={newTeacherSubject}
                                onChange={(e) => setNewTeacherSubject(e.target.value)}
                                placeholder="Contoh: Bahasa Indonesia"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-6">
                    <p className="text-sm font-medium text-gray-700">Pilih Kelas yang Diajar</p>
                    <div className="max-h-[60vh] space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2">
                        {classes.map((item) => (
                            <label
                                key={item.id}
                                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <span>{item.name} ({item.grade})</span>
                                <input
                                    type="checkbox"
                                    checked={newTeacherClassIds.includes(item.id)}
                                    onChange={() => toggleNewTeacherClass(item.id)}
                                />
                            </label>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500">Dipilih: {newTeacherClassIds.length} kelas</p>
                </div>
            </div>

            <div className="mx-auto flex w-full justify-end">
                <button
                    onClick={handleAddTeacher}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                >
                    <UserPlus className="w-4 h-4" /> Tambah Guru
                </button>
            </div>
        </div>
    );
}

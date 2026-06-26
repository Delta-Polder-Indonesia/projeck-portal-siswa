import { useState, useMemo } from 'react';
import { UserPlus } from 'lucide-react';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import { Teacher, getClasses, getTeachers, saveClasses, saveTeachers } from '../../../data/store';
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
        setNewTeacherClassIds((prev) =>
            prev.includes(classId)
                ? prev.filter((id) => id !== classId)
                : [...prev, classId],
        );
    };

    const handleAddTeacher = () => {
        if (
            !newTeacherName.trim() ||
            !newTeacherNip.trim() ||
            !newTeacherPassword.trim() ||
            !newTeacherSubject.trim()
        ) {
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
        // PERUBAHAN: Menghapus mx-auto, max-w-5xl, border, rounded, p-3, dan bg-white agar melebar penuh secara flat
        <div className="w-full space-y-5">

            {/* TWO-COLUMN LAYOUT */}
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">

                {/* KOLOM KIRI — FORM DATA GURU (Menghapus border kaku dan latar kelabu nested-card) */}
                <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                            Form Data Guru Baru
                        </h3>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {/* Nama */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                Nama Guru
                            </label>
                            <input
                                value={newTeacherName}
                                onChange={(e) => setNewTeacherName(e.target.value)}
                                placeholder="Contoh: Budi Santoso"
                                className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500"
                            />
                        </div>

                        {/* NIP */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                NIP
                            </label>
                            <input
                                value={newTeacherNip}
                                onChange={(e) => setNewTeacherNip(e.target.value)}
                                placeholder="Masukkan NIP"
                                className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500"
                            />
                        </div>

                        {/* Kata Sandi */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                Kata Sandi
                            </label>
                            <input
                                value={newTeacherPassword}
                                onChange={(e) => setNewTeacherPassword(e.target.value)}
                                placeholder="Minimal 8 karakter"
                                className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500"
                            />
                        </div>

                        {/* Mata Pelajaran */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                Mata Pelajaran
                            </label>
                            <input
                                value={newTeacherSubject}
                                onChange={(e) => setNewTeacherSubject(e.target.value)}
                                placeholder="Contoh: Bahasa Indonesia"
                                className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN — PILIH KELAS (Menghapus pembungkus border sekunder) */}
                <div className="space-y-3">
                    <div className="border-b border-gray-100 pb-2">
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-800">
                            Kelas yang Diajar
                        </p>
                    </div>

                    <div className="max-h-[220px] overflow-y-auto rounded-md border border-gray-100 bg-white divide-y divide-gray-50">
                        {classes.map((item) => (
                            <label
                                key={item.id}
                                className="flex cursor-pointer items-center justify-between px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                <span>
                                    {item.name}{' '}
                                    <span className="text-[10px] text-gray-400 font-mono">({item.grade})</span>
                                </span>
                                <input
                                    type="checkbox"
                                    checked={newTeacherClassIds.includes(item.id)}
                                    onChange={() => toggleNewTeacherClass(item.id)}
                                    className="h-3.5 w-3.5 rounded accent-blue-600 cursor-pointer"
                                />
                            </label>
                        ))}

                        {classes.length === 0 && (
                            <p className="px-3 py-10 text-center text-[10px] uppercase tracking-wide text-gray-400 font-medium">
                                Belum ada kelas terdaftar.
                            </p>
                        )}
                    </div>

                    {/* COUNTER KELAS DIPILIH */}
                    <p className="text-[10px] font-medium text-gray-400">
                        Terpilih: <span className="font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-sm tabular-nums">{newTeacherClassIds.length}</span> kelas
                    </p>
                </div>
            </div>

            {/* TOMBOL AKSI (Garis pemisah tipis dan tombol simpan modern) */}
            <div className="flex justify-end border-t border-gray-100 pt-3">
                <button
                    onClick={handleAddTeacher}
                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700 shadow-sm"
                >
                    <UserPlus className="h-3.5 w-3.5" />
                    Tambah Guru
                </button>
            </div>
        </div>
    );
}
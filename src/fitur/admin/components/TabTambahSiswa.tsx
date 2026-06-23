import { useState, useMemo } from 'react';
import { UserPlus } from 'lucide-react';
import { getClasses, getStudents, addStudent } from '../../../data/store';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import { Student } from '../../../types';

export default function TabTambahSiswa({ setNotice }: { setNotice: (msg: string) => void }) {
    const storeVersion = useStoreVersion();
    const classes = useMemo(() => getClasses(), [storeVersion]);
    const students = useMemo(() => getStudents(), [storeVersion]);

    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentNis, setNewStudentNis] = useState('');
    const [newStudentPassword, setNewStudentPassword] = useState('');
    const [newStudentGender, setNewStudentGender] = useState<'L' | 'P'>('L');
    const [newStudentClassId, setNewStudentClassId] = useState('');

    const handleAddStudent = () => {
        if (
            !newStudentName.trim() ||
            !newStudentNis.trim() ||
            !newStudentPassword.trim() ||
            !newStudentClassId
        ) {
            setNotice('Lengkapi data siswa baru terlebih dahulu, termasuk pilihan kelas.');
            return;
        }

        const nisUsed = students.some((item) => item.nis === newStudentNis.trim());
        if (nisUsed) {
            setNotice('NIS sudah digunakan siswa lain.');
            return;
        }

        const newStudent: Student = {
            id: `s_${Date.now()}`,
            name: newStudentName.trim(),
            nis: newStudentNis.trim(),
            password: newStudentPassword,
            gender: newStudentGender,
            classId: newStudentClassId,
        };

        addStudent(newStudent);
        setNewStudentName('');
        setNewStudentNis('');
        setNewStudentPassword('');
        setNewStudentGender('L');
        setNewStudentClassId('');
        setNotice('Siswa baru berhasil ditambahkan.');
    };

    return (
        <div className="mx-auto max-w-5xl rounded-sm border border-gray-200 bg-white p-3">
            <div className="space-y-3 rounded-sm border border-gray-200 bg-gray-50/50 p-3">
                <div className="border-b border-gray-200 pb-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                        Form Penerimaan Siswa Baru (PPDB)
                    </h3>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-[10px] font-medium uppercase tracking-wide text-gray-600">
                            Nama Lengkap Siswa
                        </label>
                        <input
                            value={newStudentName}
                            onChange={(e) => setNewStudentName(e.target.value)}
                            placeholder="Contoh: Andi Pratama"
                            className="w-full rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-medium uppercase tracking-wide text-gray-600">
                            Nomor Induk Siswa (NIS)
                        </label>
                        <input
                            value={newStudentNis}
                            onChange={(e) => setNewStudentNis(e.target.value)}
                            placeholder="Contoh: 2024001"
                            className="w-full rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-medium uppercase tracking-wide text-gray-600">
                            Jenis Kelamin
                        </label>
                        <select
                            value={newStudentGender}
                            onChange={(e) => setNewStudentGender(e.target.value as 'L' | 'P')}
                            className="w-full rounded-sm border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors focus:border-gray-500"
                        >
                            <option value="L">Laki-Laki (L)</option>
                            <option value="P">Perempuan (P)</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-medium uppercase tracking-wide text-gray-600">
                            Kata Sandi Awal
                        </label>
                        <input
                            value={newStudentPassword}
                            onChange={(e) => setNewStudentPassword(e.target.value)}
                            placeholder="Minimal 6 karakter"
                            className="w-full rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-500"
                        />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] font-medium uppercase tracking-wide text-gray-600">
                            Pilih Kelas
                        </label>
                        <select
                            value={newStudentClassId}
                            onChange={(e) => setNewStudentClassId(e.target.value)}
                            className="w-full rounded-sm border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors focus:border-gray-500"
                        >
                            <option value="">-- Pilih Kelas --</option>
                            {classes.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} ({c.grade})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex w-full justify-end border-t border-gray-200 pt-2">
                    <button
                        onClick={handleAddStudent}
                        className="inline-flex items-center gap-1.5 rounded-sm bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                    >
                        <UserPlus className="h-3.5 w-3.5" />
                        Daftarkan Siswa Baru
                    </button>
                </div>
            </div>
        </div>
    );
}
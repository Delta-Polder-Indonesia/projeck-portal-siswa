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
        <div className="w-full border border-gray-200 bg-white p-4 rounded-xl">
            <div className="space-y-4 rounded-xl border border-gray-100 bg-white p-4">
                <div className="border-b border-gray-100 pb-2 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold uppercase tracking-tight text-gray-700">
                        Form Penerimaan Siswa Baru (PPDB)
                    </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Nama Lengkap Siswa
                        </label>
                        <input
                            value={newStudentName}
                            onChange={(e) => setNewStudentName(e.target.value)}
                            placeholder="Contoh: Andi Pratama"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none placeholder:text-gray-300 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Nomor Induk Siswa (NIS)
                        </label>
                        <input
                            value={newStudentNis}
                            onChange={(e) => setNewStudentNis(e.target.value)}
                            placeholder="Contoh: 2024001"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none placeholder:text-gray-300 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Jenis Kelamin
                        </label>
                        <select
                            value={newStudentGender}
                            onChange={(e) => setNewStudentGender(e.target.value as 'L' | 'P')}
                            className="w-full border border-gray-200 bg-white rounded-lg px-2.5 py-2 text-xs text-gray-800 outline-none focus:border-blue-500"
                        >
                            <option value="L">Laki-Laki (L)</option>
                            <option value="P">Perempuan (P)</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Kata Sandi Awal
                        </label>
                        <input
                            value={newStudentPassword}
                            onChange={(e) => setNewStudentPassword(e.target.value)}
                            placeholder="Minimal 6 karakter"
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 outline-none placeholder:text-gray-300 focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Pilih Kelas
                        </label>
                        <select
                            value={newStudentClassId}
                            onChange={(e) => setNewStudentClassId(e.target.value)}
                            className="w-full border border-gray-200 bg-white rounded-lg px-2.5 py-2 text-xs text-gray-800 outline-none focus:border-blue-500"
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

                <div className="flex w-full justify-end border-t border-gray-100 pt-3">
                    <button
                        onClick={handleAddStudent}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700 active:bg-emerald-800"
                    >
                        <UserPlus className="h-4 w-4" />
                        Daftarkan Siswa Baru
                    </button>
                </div>
            </div>
        </div>
    );
}
import { useState, useMemo, useEffect } from 'react';
import { getStudents, getClasses, saveStudents } from '../../../data/store';
import { useStoreVersion } from '../../../hooks/useStoreVersion';

type StudentEditMap = Record<string, { nis: string; password: string }>;

export default function TabAkunSiswa({ setNotice }: { setNotice: (msg: string) => void }) {
    const storeVersion = useStoreVersion();
    const students = useMemo(() => getStudents(), [storeVersion]);
    const classes = useMemo(() => getClasses(), [storeVersion]);
    const [searchStudent, setSearchStudent] = useState('');
    const [studentEdits, setStudentEdits] = useState<StudentEditMap>({});

    useEffect(() => {
        const nextStudentEdits: StudentEditMap = {};
        students.forEach((student) => {
            nextStudentEdits[student.id] = {
                nis: student.nis,
                password: student.password,
            };
        });
        setStudentEdits(nextStudentEdits);
    }, [students]);

    const handleSaveStudent = (studentId: string) => {
        const edit = studentEdits[studentId];
        if (!edit) return;

        const nisUsed = students.find((item) => item.nis === edit.nis.trim() && item.id !== studentId);
        if (nisUsed) {
            setNotice('NIS sudah digunakan siswa lain.');
            return;
        }

        const nextStudents = students.map((item) => {
            if (item.id !== studentId) return item;
            return {
                ...item,
                nis: edit.nis.trim(),
                password: edit.password,
            };
        });

        saveStudents(nextStudents);
        setNotice('Data akun siswa berhasil diperbarui.');
    };

    const filteredStudents = students.filter((item) => {
        if (!searchStudent.trim()) return true;
        const key = searchStudent.toLowerCase();
        const className = classes.find((cls) => cls.id === item.classId)?.name || '';
        return (
            item.name.toLowerCase().includes(key) ||
            item.nis.toLowerCase().includes(key) ||
            className.toLowerCase().includes(key)
        );
    });

    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Pengaturan Akun Siswa (NIS dan Kata Sandi)</h3>
            <input
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                placeholder="Cari nama siswa, NIS, atau kelas"
                className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <div className="border border-gray-200 rounded-xl overflow-x-auto">
                <table className="w-full min-w-[720px]">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs text-gray-600">
                            <th className="px-3 py-2">Nama</th>
                            <th className="px-3 py-2">Kelas</th>
                            <th className="px-3 py-2">NIS</th>
                            <th className="px-3 py-2">Kata Sandi</th>
                            <th className="px-3 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => {
                            const edit = studentEdits[student.id];
                            if (!edit) return null;
                            const className = classes.find((item) => item.id === student.classId)?.name || '-';
                            return (
                                <tr key={student.id} className="border-b border-gray-100 last:border-0">
                                    <td className="px-3 py-2 text-sm text-gray-700">{student.name}</td>
                                    <td className="px-3 py-2 text-sm text-gray-500">{className}</td>
                                    <td className="px-3 py-2">
                                        <input
                                            value={edit.nis}
                                            onChange={(e) =>
                                                setStudentEdits((prev) => ({
                                                    ...prev,
                                                    [student.id]: { ...prev[student.id], nis: e.target.value },
                                                }))
                                            }
                                            className="px-2 py-1.5 border border-gray-300 rounded-md text-sm w-36"
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <input
                                            value={edit.password}
                                            onChange={(e) =>
                                                setStudentEdits((prev) => ({
                                                    ...prev,
                                                    [student.id]: { ...prev[student.id], password: e.target.value },
                                                }))
                                            }
                                            className="px-2 py-1.5 border border-gray-300 rounded-md text-sm w-36"
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        <button
                                            onClick={() => handleSaveStudent(student.id)}
                                            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs"
                                        >
                                            Simpan
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredStudents.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-3 py-4 text-center text-sm text-gray-500">
                                    Siswa tidak ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

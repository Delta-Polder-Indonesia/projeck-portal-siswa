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

        const nisUsed = students.find(
            (item) => item.nis === edit.nis.trim() && item.id !== studentId,
        );
        if (nisUsed) {
            setNotice('NIS sudah digunakan siswa lain.');
            return;
        }

        const nextStudents = students.map((item) => {
            if (item.id !== studentId) return item;
            return { ...item, nis: edit.nis.trim(), password: edit.password };
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
        <div className="mx-auto max-w-5xl space-y-2">

            {/* STRIP HEADER + SEARCH */}
            <div className="flex flex-col gap-2 border-b border-gray-200 pb-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                    Pengaturan Akun Siswa — NIS & Kata Sandi
                </h3>
                <input
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    placeholder="Cari nama, NIS, atau kelas..."
                    className="w-full rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-500 sm:w-64"
                />
            </div>

            {/* TABLE GRID */}
            <div className="overflow-x-auto rounded-sm border border-gray-200">
                <table className="w-full min-w-[620px] border-collapse">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-left">
                            <th className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                Nama Siswa
                            </th>
                            <th className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                Kelas
                            </th>
                            <th className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                NIS
                            </th>
                            <th className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                Kata Sandi
                            </th>
                            <th className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredStudents.map((student) => {
                            const edit = studentEdits[student.id];
                            if (!edit) return null;
                            const className =
                                classes.find((item) => item.id === student.classId)?.name || '-';
                            return (
                                <tr
                                    key={student.id}
                                    className="transition-colors hover:bg-gray-50/70"
                                >
                                    {/* Nama */}
                                    <td className="px-2.5 py-1.5 text-xs font-medium text-gray-800">
                                        {student.name}
                                    </td>

                                    {/* Kelas */}
                                    <td className="px-2.5 py-1.5 text-xs text-gray-500">
                                        {className}
                                    </td>

                                    {/* NIS Input */}
                                    <td className="px-2.5 py-1.5">
                                        <input
                                            value={edit.nis}
                                            onChange={(e) =>
                                                setStudentEdits((prev) => ({
                                                    ...prev,
                                                    [student.id]: {
                                                        ...prev[student.id],
                                                        nis: e.target.value,
                                                    },
                                                }))
                                            }
                                            className="w-32 rounded-sm border border-gray-300 px-2 py-1 text-xs text-gray-800 outline-none transition-colors focus:border-gray-500"
                                        />
                                    </td>

                                    {/* Password Input */}
                                    <td className="px-2.5 py-1.5">
                                        <input
                                            value={edit.password}
                                            onChange={(e) =>
                                                setStudentEdits((prev) => ({
                                                    ...prev,
                                                    [student.id]: {
                                                        ...prev[student.id],
                                                        password: e.target.value,
                                                    },
                                                }))
                                            }
                                            className="w-32 rounded-sm border border-gray-300 px-2 py-1 text-xs text-gray-800 outline-none transition-colors focus:border-gray-500"
                                        />
                                    </td>

                                    {/* Aksi */}
                                    <td className="px-2.5 py-1.5">
                                        <button
                                            onClick={() => handleSaveStudent(student.id)}
                                            className="rounded-sm bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-blue-700"
                                        >
                                            Simpan
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}

                        {/* EMPTY STATE */}
                        {filteredStudents.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-3 py-8 text-center text-[10px] uppercase tracking-widest text-gray-400"
                                >
                                    — Siswa tidak ditemukan —
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
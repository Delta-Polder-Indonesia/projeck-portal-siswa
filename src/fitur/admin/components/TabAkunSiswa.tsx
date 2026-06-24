import { useState, useMemo, useEffect } from 'react';
import { History, Trash2 } from 'lucide-react';
import {
  addStudentClassMutation,
  getClasses,
  getStudentClassMutations,
  getStudents,
  saveStudents,
} from '../../../data/store';
import { useStoreVersion } from '../../../hooks/useStoreVersion';

type StudentEditMap = Record<
  string,
  {
    name: string;
    nis: string;
    password: string;
    classId: string;
    gender: 'L' | 'P';
  }
>;

export default function TabAkunSiswa({ setNotice }: { setNotice: (msg: string) => void }) {
  const storeVersion = useStoreVersion();
  const students = useMemo(() => getStudents(), [storeVersion]);
  const classes = useMemo(() => getClasses(), [storeVersion]);
  const [searchStudent, setSearchStudent] = useState('');
  const [studentEdits, setStudentEdits] = useState<StudentEditMap>({});
  const [historyStudentId, setHistoryStudentId] = useState('');
  const [newStudent, setNewStudent] = useState({
    name: '',
    nis: '',
    password: 'siswa123',
    classId: classes[0]?.id ?? '',
    gender: 'L' as 'L' | 'P',
  });

  useEffect(() => {
    const nextStudentEdits: StudentEditMap = {};
    students.forEach((student) => {
      nextStudentEdits[student.id] = {
        name: student.name,
        nis: student.nis,
        password: student.password,
        classId: student.classId,
        gender: student.gender,
      };
    });
    setStudentEdits(nextStudentEdits);
  }, [students]);

  useEffect(() => {
    if (!classes.find((item) => item.id === newStudent.classId)) {
      setNewStudent((prev) => ({ ...prev, classId: classes[0]?.id ?? '' }));
    }
  }, [classes, newStudent.classId]);

  const handleSaveStudent = (studentId: string) => {
    const edit = studentEdits[studentId];
    const currentStudent = students.find((item) => item.id === studentId);
    if (!edit) return;
    if (!currentStudent) return;

    if (!edit.name.trim()) {
      setNotice('Nama siswa tidak boleh kosong.');
      return;
    }

    const nisUsed = students.find((item) => item.nis === edit.nis.trim() && item.id !== studentId);
    if (nisUsed) {
      setNotice('NIS sudah digunakan siswa lain.');
      return;
    }

    const classExists = classes.some((item) => item.id === edit.classId);
    if (!classExists) {
      setNotice('Kelas siswa tidak valid.');
      return;
    }

    const nextStudents = students.map((item) => {
      if (item.id !== studentId) return item;
      return {
        ...item,
        name: edit.name.trim(),
        nis: edit.nis.trim(),
        password: edit.password,
        classId: edit.classId,
        gender: edit.gender,
      };
    });

    if (currentStudent.classId !== edit.classId) {
      addStudentClassMutation({
        studentId,
        studentName: edit.name.trim(),
        fromClassId: currentStudent.classId,
        toClassId: edit.classId,
        note: 'Dipindahkan melalui panel tata usaha',
      });
    }

    saveStudents(nextStudents);
    setNotice('Data siswa berhasil diperbarui.');
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find((item) => item.id === studentId);
    if (!student) return;
    const confirmed = window.confirm(`Hapus siswa ${student.name} dari portal?`);
    if (!confirmed) return;

    const nextStudents = students.filter((item) => item.id !== studentId);
    saveStudents(nextStudents);
    setNotice(`Siswa ${student.name} berhasil dihapus dari portal.`);
    if (historyStudentId === studentId) {
      setHistoryStudentId('');
    }
  };

  const handleAddStudent = () => {
    const name = newStudent.name.trim();
    const nis = newStudent.nis.trim();

    if (!name || !nis || !newStudent.classId) {
      setNotice('Lengkapi nama, NIS, dan kelas siswa baru.');
      return;
    }

    const nisUsed = students.some((item) => item.nis === nis);
    if (nisUsed) {
      setNotice('NIS siswa baru sudah digunakan.');
      return;
    }

    const nextStudents = [
      {
        id: `s-${Date.now()}`,
        name,
        nis,
        password: newStudent.password || 'siswa123',
        classId: newStudent.classId,
        gender: newStudent.gender,
      },
      ...students,
    ];

    saveStudents(nextStudents);
    setNewStudent({
      name: '',
      nis: '',
      password: 'siswa123',
      classId: classes[0]?.id ?? '',
      gender: 'L',
    });
    setNotice('Siswa baru berhasil ditambahkan ke kelas.');
  };

  const filteredStudents = students.filter((item) => {
    if (!searchStudent.trim()) return true;
    const key = searchStudent.toLowerCase();
    const className = classes.find((cls) => cls.id === item.classId)?.name || '';
    return item.name.toLowerCase().includes(key) || item.nis.toLowerCase().includes(key) || className.toLowerCase().includes(key);
  });

  const selectedHistoryStudent = students.find((item) => item.id === historyStudentId) || null;
  const classMutations = useMemo(
    () => (historyStudentId ? getStudentClassMutations(historyStudentId) : []),
    [historyStudentId, storeVersion],
  );

  const resolveClassName = (classId: string) => classes.find((item) => item.id === classId)?.name || '-';

  return (
    <div className="mx-auto max-w-5xl space-y-2">
      <div className="grid gap-2 rounded-sm border border-gray-200 bg-gray-50/50 p-2.5 md:grid-cols-6">
        <input
          value={newStudent.name}
          onChange={(event) => setNewStudent((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Nama siswa baru"
          className="rounded-sm border border-gray-300 px-2 py-1.5 text-xs md:col-span-2"
        />
        <input
          value={newStudent.nis}
          onChange={(event) => setNewStudent((prev) => ({ ...prev, nis: event.target.value }))}
          placeholder="NIS"
          className="rounded-sm border border-gray-300 px-2 py-1.5 text-xs"
        />
        <select
          value={newStudent.classId}
          onChange={(event) => setNewStudent((prev) => ({ ...prev, classId: event.target.value }))}
          className="rounded-sm border border-gray-300 px-2 py-1.5 text-xs"
        >
          {classes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          value={newStudent.gender}
          onChange={(event) =>
            setNewStudent((prev) => ({
              ...prev,
              gender: event.target.value === 'P' ? 'P' : 'L',
            }))
          }
          className="rounded-sm border border-gray-300 px-2 py-1.5 text-xs"
        >
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
        <button
          type="button"
          onClick={handleAddStudent}
          className="rounded-sm bg-gray-900 px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-white uppercase hover:bg-gray-800"
        >
          Tambah Siswa
        </button>
      </div>

      <div className="flex flex-col gap-2 border-b border-gray-200 pb-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xs font-bold tracking-wide text-gray-800 uppercase">
          Pengaturan Akun Siswa - Nama, Kelas, NIS & Kata Sandi
        </h3>
        <input
          value={searchStudent}
          onChange={(e) => setSearchStudent(e.target.value)}
          placeholder="Cari nama, NIS, atau kelas..."
          className="w-full rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-500 sm:w-64"
        />
      </div>

      <div className="overflow-x-auto rounded-sm border border-gray-200">
        <table className="w-full min-w-[620px] border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left">
              <th className="px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase">Nama Siswa</th>
              <th className="px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase">JK</th>
              <th className="px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase">Kelas</th>
              <th className="px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase">NIS</th>
              <th className="px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase">Kata Sandi</th>
              <th className="px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStudents.map((student) => {
              const edit = studentEdits[student.id];
              if (!edit) return null;
              const className = classes.find((item) => item.id === student.classId)?.name || '-';
              return (
                <tr key={student.id} className="transition-colors hover:bg-gray-50/70">
                  <td className="px-2.5 py-1.5">
                    <input
                      value={edit.name}
                      onChange={(e) =>
                        setStudentEdits((prev) => ({
                          ...prev,
                          [student.id]: {
                            ...prev[student.id],
                            name: e.target.value,
                          },
                        }))
                      }
                      className="w-44 rounded-sm border border-gray-300 px-2 py-1 text-xs text-gray-800 outline-none transition-colors focus:border-gray-500"
                    />
                  </td>
                  <td className="px-2.5 py-1.5">
                    <select
                      value={edit.gender}
                      onChange={(e) =>
                        setStudentEdits((prev) => ({
                          ...prev,
                          [student.id]: {
                            ...prev[student.id],
                            gender: e.target.value === 'P' ? 'P' : 'L',
                          },
                        }))
                      }
                      className="w-20 rounded-sm border border-gray-300 px-2 py-1 text-xs"
                    >
                      <option value="L">L</option>
                      <option value="P">P</option>
                    </select>
                  </td>
                  <td className="px-2.5 py-1.5">
                    <select
                      value={edit.classId}
                      onChange={(e) =>
                        setStudentEdits((prev) => ({
                          ...prev,
                          [student.id]: {
                            ...prev[student.id],
                            classId: e.target.value,
                          },
                        }))
                      }
                      className="w-32 rounded-sm border border-gray-300 px-2 py-1 text-xs"
                    >
                      {classes.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[10px] text-gray-400">Saat ini: {className}</p>
                  </td>
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
                  <td className="px-2.5 py-1.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSaveStudent(student.id)}
                        className="rounded-sm bg-blue-600 px-2 py-1 text-[10px] font-bold tracking-wide text-white uppercase transition-colors hover:bg-blue-700"
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => setHistoryStudentId(student.id)}
                        className="inline-flex items-center gap-1 rounded-sm border border-gray-300 px-2 py-1 text-[10px] font-bold text-gray-600 hover:bg-gray-50"
                        title="Lihat riwayat mutasi"
                      >
                        <History className="h-3 w-3" /> Riwayat
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="inline-flex items-center gap-1 rounded-sm border border-rose-200 px-2 py-1 text-[10px] font-bold text-rose-700 hover:bg-rose-50"
                        title="Hapus siswa"
                      >
                        <Trash2 className="h-3 w-3" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-[10px] tracking-widest text-gray-400 uppercase">
                  - Siswa tidak ditemukan -
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {selectedHistoryStudent ? (
        <div className="rounded-sm border border-gray-200 bg-gray-50/60 p-3">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-bold tracking-wide text-gray-800 uppercase">
              Riwayat Mutasi Kelas - {selectedHistoryStudent.name}
            </h4>
            <button
              type="button"
              onClick={() => setHistoryStudentId('')}
              className="text-[10px] font-semibold text-gray-500 hover:text-gray-700"
            >
              Tutup
            </button>
          </div>
          {classMutations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-[10px] font-bold tracking-wide text-gray-500 uppercase">
                    <th className="px-2 py-1.5">Waktu</th>
                    <th className="px-2 py-1.5">Dari</th>
                    <th className="px-2 py-1.5">Ke</th>
                    <th className="px-2 py-1.5">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {classMutations.map((item) => (
                    <tr key={item.id}>
                      <td className="px-2 py-1.5 text-gray-500">{new Date(item.movedAt).toLocaleString('id-ID')}</td>
                      <td className="px-2 py-1.5">{resolveClassName(item.fromClassId)}</td>
                      <td className="px-2 py-1.5">{resolveClassName(item.toClassId)}</td>
                      <td className="px-2 py-1.5 text-gray-600">{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-gray-500">Belum ada riwayat perpindahan kelas untuk siswa ini.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

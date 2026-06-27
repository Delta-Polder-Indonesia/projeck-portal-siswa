import { useState, useMemo, useEffect } from 'react';
import { History, Trash2, Users, Search, UserPlus } from 'lucide-react';
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

export default function TabAkunSiswa() {
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
    if (!edit || !currentStudent) return;

    if (!edit.name.trim()) {
      alert('⚠️ Nama siswa tidak boleh kosong.');
      return;
    }

    const nisUsed = students.find((item) => item.nis === edit.nis.trim() && item.id !== studentId);
    if (nisUsed) {
      alert('⚠️ NIS sudah digunakan siswa lain.');
      return;
    }

    const classExists = classes.some((item) => item.id === edit.classId);
    if (!classExists) {
      alert('⚠️ Kelas siswa tidak valid.');
      return;
    }

    const confirmed = window.confirm(`Apakah Anda yakin ingin menyimpan perubahan data untuk siswa ${edit.name.trim()}?`);
    if (!confirmed) return;

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
    alert('✅ Data siswa berhasil diperbarui.');
  };

  const handleDeleteStudent = (studentId: string) => {
    const student = students.find((item) => item.id === studentId);
    if (!student) return;
    
    const confirmed = window.confirm(`Hapus siswa ${student.name} dari portal sistem secara permanen?`);
    if (!confirmed) return;

    const nextStudents = students.filter((item) => item.id !== studentId);
    saveStudents(nextStudents);
    alert(`✅ Siswa ${student.name} berhasil dihapus.`);
    if (historyStudentId === studentId) {
      setHistoryStudentId('');
    }
  };

  const handleAddStudent = () => {
    const name = newStudent.name.trim();
    const nis = newStudent.nis.trim();

    if (!name || !nis || !newStudent.classId) {
      alert('⚠️ Lengkapi nama, NIS, dan kelas siswa baru sebelum mendaftar.');
      return;
    }

    const nisUsed = students.some((item) => item.nis === nis);
    if (nisUsed) {
      alert('⚠️ Gagal: NIS siswa baru sudah terdaftar di database.');
      return;
    }

    const confirmed = window.confirm(`Daftarkan siswa baru atas nama ${name}?`);
    if (!confirmed) return;

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
    alert('✅ Siswa baru berhasil ditambahkan.');
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
    <div className="w-full bg-white p-4 rounded-xl space-y-4">
      
      {/* HEADER UTAMA */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-black pb-4 gap-3">
        <div>
          <h1 className="text-base font-black tracking-tight uppercase">
            Sistem Administrasi Data Siswa
          </h1>
          <p className="text-[10px] text-neutral-500 uppercase font-medium mt-0.5 tracking-wide">
            Panel ringkas untuk melihat, mengedit akun, memproses mutasi, dan menghapus data siswa.
          </p>
        </div>
        <div className="sm:border-l border-black sm:pl-4 text-left sm:text-right shrink-0">
          <p className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
            Database Terdaftar
          </p>
          <p className="text-sm font-black text-black font-mono">
            {students.length} SISWA
          </p>
        </div>
      </header>

      {/* FORM TAMBAH SISWA BARU */}
      <section className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase">
          <UserPlus className="h-3.5 w-3.5 text-black" />
          <span>Registrasi Siswa Baru</span>
        </div>
        <div className="grid gap-2 border border-black bg-neutral-50 p-3 rounded-md md:grid-cols-6">
          <input
            value={newStudent.name}
            onChange={(event) => setNewStudent((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Nama siswa baru"
            className="rounded-md border border-black bg-white px-3 py-1.5 text-xs text-black font-bold outline-none placeholder:text-neutral-400 md:col-span-2"
          />
          <input
            value={newStudent.nis}
            onChange={(event) => setNewStudent((prev) => ({ ...prev, nis: event.target.value }))}
            placeholder="NIS Siswa"
            className="rounded-md border border-black bg-white px-3 py-1.5 font-mono text-xs text-black outline-none placeholder:text-neutral-400"
          />
          <select
            value={newStudent.classId}
            onChange={(event) => setNewStudent((prev) => ({ ...prev, classId: event.target.value }))}
            className="rounded-md border border-black bg-white px-2 py-1.5 text-xs text-black font-bold outline-none cursor-pointer"
          >
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                Kelas: {item.name}
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
            className="rounded-md border border-black bg-white px-2 py-1.5 text-xs text-black font-bold outline-none cursor-pointer"
          >
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
          <button
            type="button"
            onClick={handleAddStudent}
            className="rounded-md border border-black bg-white px-3 py-1.5 text-xs font-bold tracking-wider text-black uppercase hover:bg-black hover:text-white transition-colors"
          >
            <span>Tambah</span>
          </button>
        </div>
      </section>

      {/* FILTER & TABEL UTAMA */}
      <section className="space-y-3">
        <div className="flex flex-col gap-2 border-b border-black pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase">
            <Users className="h-3.5 w-3.5 text-black" />
            <span>Informasi Akun & Penempatan Kelas</span>
          </div>
          <div className="relative w-full sm:w-72">
            <input
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              placeholder="Cari nama, NIS, atau kelas..."
              className="w-full rounded-md border border-black px-3 py-1.5 pl-8 text-xs text-black outline-none placeholder:text-neutral-400"
            />
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-black" />
          </div>
        </div>

        {/* CUSTOM SCROLL CONTAINER & TABLE */}
        <div className="overflow-x-auto rounded-md border border-black scrollbar-thin">
          <table className="w-full min-w-[850px] border-collapse bg-white text-left">
            <thead>
              <tr className="border-b border-black bg-neutral-100 text-[10px] font-bold tracking-wide text-black uppercase">
                <th className="p-3 w-52">Nama Siswa</th>
                <th className="p-3 w-16 text-center">JK</th>
                <th className="p-3 w-52">Kelas Tujuan (Mutasi)</th>
                <th className="p-3 w-36">NIS (Username)</th>
                <th className="p-3 w-36">Kata Sandi</th>
                <th className="p-3 text-center">Aksi Administrasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/20">
              {filteredStudents.map((student) => {
                const edit = studentEdits[student.id];
                if (!edit) return null;
                const className = classes.find((item) => item.id === student.classId)?.name || '-';
                return (
                  <tr key={student.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-2.5">
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
                        className="w-full rounded border border-black px-2 py-1 text-xs font-bold text-black outline-none bg-white"
                      />
                    </td>
                    <td className="p-2.5 text-center">
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
                        className="w-14 rounded border border-black px-1 py-1 text-xs text-center font-bold outline-none cursor-pointer"
                      >
                        <option value="L">L</option>
                        <option value="P">P</option>
                      </select>
                    </td>
                    <td className="p-2.5 space-y-1">
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
                        className="w-full rounded border border-black px-2 py-1 text-xs font-bold outline-none cursor-pointer"
                      >
                        {classes.map((item) => (
                          <option key={item.id} value={item.id}>
                            Kelas {item.name}
                          </option>
                        ))}
                      </select>
                      <div className="inline-block rounded border border-black bg-neutral-100 px-2 py-0.5 text-[9px] font-bold text-black uppercase tracking-tight">
                        Aktif: {className}
                      </div>
                    </td>
                    <td className="p-2.5">
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
                        className="w-full rounded border border-black px-2 py-1 font-mono text-xs text-black outline-none bg-white"
                      />
                    </td>
                    <td className="p-2.5">
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
                        className="w-full rounded border border-black px-2 py-1 font-mono text-xs text-black outline-none bg-white"
                      />
                    </td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleSaveStudent(student.id)}
                          className="rounded border border-black bg-black px-2.5 py-1 text-[10px] font-bold tracking-wide text-white uppercase hover:bg-neutral-800 transition-colors"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setHistoryStudentId(student.id)}
                          className="rounded border border-black bg-white px-2 py-1 text-[10px] font-bold tracking-wide text-black uppercase hover:bg-neutral-100 transition-colors inline-flex items-center gap-1"
                        >
                          <History className="h-3 w-3" />
                          <span>Log</span>
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="rounded border border-black bg-white px-2 py-1 text-[10px] font-bold tracking-wide text-black uppercase hover:bg-neutral-100 transition-colors inline-flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3 text-neutral-600" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-xs text-neutral-400 font-bold uppercase tracking-wider">
                    — Tidak ada data registrasi siswa ditemukan —
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {/* LOG PANEL RIWAYAT MUTASI */}
      {selectedHistoryStudent ? (
        <section className="space-y-3 pt-2 border-t border-black/30">
          <div className="flex items-center justify-between border-b border-black pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-black uppercase">
              <History className="h-3.5 w-3.5" />
              <span>Log Mutasi Kelas: <span className="font-black">{selectedHistoryStudent.name.toUpperCase()}</span></span>
            </div>
            <button
              type="button"
              onClick={() => setHistoryStudentId('')}
              className="rounded-md border border-black bg-white px-3 py-1 text-[10px] font-bold tracking-wide text-black uppercase hover:bg-black hover:text-white transition-colors"
            >
              Tutup Log
            </button>
          </div>
          
          {classMutations.length > 0 ? (
            <div className="overflow-x-auto rounded-md border border-black">
              <table className="w-full min-w-[550px] border-collapse bg-white text-left text-xs">
                <thead>
                  <tr className="border-b border-black bg-neutral-100 text-[10px] font-bold tracking-wide text-black uppercase">
                    <th className="p-3 w-44">Waktu Mutasi</th>
                    <th className="p-3">Dari Kelas</th>
                    <th className="p-3">Ke Kelas</th>
                    <th className="p-3">Catatan Administrasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/20">
                  {classMutations.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-3 font-mono text-neutral-600">
                        {new Date(item.movedAt).toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 font-bold text-black">{resolveClassName(item.fromClassId)}</td>
                      <td className="p-3 font-black text-black">{resolveClassName(item.toClassId)}</td>
                      <td className="p-3 text-neutral-700 font-medium">{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-black bg-white p-6 text-center text-neutral-400 font-bold uppercase tracking-wider">
              Belum ada log mutasi penempatan kelas untuk siswa ini.
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
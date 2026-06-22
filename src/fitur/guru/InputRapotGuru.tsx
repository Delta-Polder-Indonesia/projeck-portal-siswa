import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getClasses,
  getStudentsByClass,
  getTeachers,
  getNilaiRapotByKelas,
  upsertNilaiRapot,
  deleteNilaiRapot,
} from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { Save, Trash2, Plus, BookOpenCheck, Search } from 'lucide-react';
import type { NilaiRapot } from '../../types';

function hitungPredikat(nilai: number): NilaiRapot['predikat'] {
  if (nilai >= 90) return 'A';
  if (nilai >= 80) return 'B';
  if (nilai >= 70) return 'C';
  if (nilai >= 60) return 'D';
  return 'E';
}

function hitungNilaiAkhir(tugas: number, uts: number, uas: number): number {
  return Math.round(tugas * 0.3 + uts * 0.3 + uas * 0.4);
}

const DAFTAR_MAPEL = [
  'Matematika',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'IPA',
  'IPS',
  'PKN',
  'Pendidikan Agama',
  'Seni Budaya',
  'PJOK',
  'Prakarya',
  'TIK',
];

function generateTahunAjaran(): string[] {
  const currentYear = new Date().getFullYear();
  const items: string[] = [];
  for (let i = -1; i <= 2; i += 1) {
    items.push(`${currentYear - i}/${currentYear - i + 1}`);
  }
  return items;
}

export default function InputRapotGuru() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [semester, setSemester] = useState<'ganjil' | 'genap'>('genap');
  const [tahunAjaran, setTahunAjaran] = useState(() => {
    const y = new Date().getFullYear();
    return `${y}/${y + 1}`;
  });
  const [searchStudent, setSearchStudent] = useState('');
  const [notice, setNotice] = useState('');

  // Form input per mapel
  const [formMapel, setFormMapel] = useState('');
  const [formTugas, setFormTugas] = useState(0);
  const [formUTS, setFormUTS] = useState(0);
  const [formUAS, setFormUAS] = useState(0);
  const [formCatatan, setFormCatatan] = useState('');

  const teacherClasses = useMemo(() => {
    const teacher = getTeachers().find(item => item.id === user?.id);
    return getClasses().filter(item => teacher?.classIds.includes(item.id));
  }, [user, storeVersion]);

  useEffect(() => {
    if (!selectedClassId && teacherClasses.length > 0) {
      setSelectedClassId(teacherClasses[0].id);
    }
  }, [teacherClasses, selectedClassId]);

  const students = useMemo(() => {
    if (!selectedClassId) return [];
    return getStudentsByClass(selectedClassId).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedClassId, storeVersion]);

  const filteredStudents = useMemo(() => {
    if (!searchStudent.trim()) return students;
    const key = searchStudent.toLowerCase();
    return students.filter(s => s.name.toLowerCase().includes(key) || s.nis.includes(searchStudent));
  }, [students, searchStudent]);

  const nilaiKelas = useMemo(() => {
    if (!selectedClassId) return [];
    return getNilaiRapotByKelas(selectedClassId, tahunAjaran, semester);
  }, [selectedClassId, tahunAjaran, semester, storeVersion]);

  const nilaiSiswa = useMemo(() => {
    return nilaiKelas.filter(item => item.studentId === selectedStudentId);
  }, [nilaiKelas, selectedStudentId]);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const resetForm = () => {
    setFormMapel('');
    setFormTugas(0);
    setFormUTS(0);
    setFormUAS(0);
    setFormCatatan('');
  };

  const handleSimpanNilai = () => {
    if (!user || !selectedStudentId || !selectedClassId || !formMapel.trim()) {
      setNotice('Pilih siswa dan mata pelajaran terlebih dahulu.');
      return;
    }

    const nilaiAkhir = hitungNilaiAkhir(formTugas, formUTS, formUAS);
    const predikat = hitungPredikat(nilaiAkhir);

    const item: NilaiRapot = {
      id: `rapot_${selectedStudentId}_${tahunAjaran}_${semester}_${formMapel.trim()}`,
      studentId: selectedStudentId,
      classId: selectedClassId,
      semester,
      tahunAjaran,
      mataPelajaran: formMapel.trim(),
      nilaiTugas: formTugas,
      nilaiUTS: formUTS,
      nilaiUAS: formUAS,
      nilaiAkhir,
      predikat,
      catatanGuru: formCatatan.trim() || undefined,
      inputBy: user.id,
      updatedAt: Date.now(),
    };

    upsertNilaiRapot(item);
    setNotice(`Nilai ${formMapel} untuk ${selectedStudent?.name} berhasil disimpan.`);
    resetForm();
  };

  const handleEditNilai = (item: NilaiRapot) => {
    setFormMapel(item.mataPelajaran);
    setFormTugas(item.nilaiTugas);
    setFormUTS(item.nilaiUTS);
    setFormUAS(item.nilaiUAS);
    setFormCatatan(item.catatanGuru || '');
    setNotice('');
  };

  const handleHapusNilai = (id: string) => {
    if (!window.confirm('Hapus nilai mata pelajaran ini?')) return;
    deleteNilaiRapot(id);
    setNotice('Nilai berhasil dihapus.');
  };

  const predikatColor = (p: string) => {
    switch (p) {
      case 'A': return 'bg-emerald-100 text-emerald-700';
      case 'B': return 'bg-blue-100 text-blue-700';
      case 'C': return 'bg-yellow-100 text-yellow-700';
      case 'D': return 'bg-orange-100 text-orange-700';
      default: return 'bg-red-100 text-red-700';
    }
  };

  const rataRata = nilaiSiswa.length > 0
    ? Math.round(nilaiSiswa.reduce((sum, item) => sum + item.nilaiAkhir, 0) / nilaiSiswa.length)
    : 0;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Input Rapot Siswa</h1>
        <p className="text-sm text-gray-500 mt-1">
          Input nilai rapot per mata pelajaran untuk setiap siswa di kelas Anda.
        </p>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 text-sm text-emerald-700">
          {notice}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Kelas</label>
          <select
            value={selectedClassId}
            onChange={e => { setSelectedClassId(e.target.value); setSelectedStudentId(''); }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            {teacherClasses.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tahun Ajaran</label>
          <select
            value={tahunAjaran}
            onChange={e => setTahunAjaran(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            {generateTahunAjaran().map(ta => (
              <option key={ta} value={ta}>{ta}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Semester</label>
          <select
            value={semester}
            onChange={e => setSemester(e.target.value as 'ganjil' | 'genap')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ganjil">Ganjil</option>
            <option value="genap">Genap</option>
          </select>
        </div>
      </div>

      <div className="grid xl:grid-cols-[300px_1fr] gap-6">
        {/* Daftar Siswa */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Pilih Siswa</h2>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchStudent}
              onChange={e => setSearchStudent(e.target.value)}
              placeholder="Cari nama/NIS..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-1 max-h-[560px] overflow-y-auto pr-1">
            {filteredStudents.map(s => {
              const nilaiCount = nilaiKelas.filter(item => item.studentId === s.id).length;
              return (
                <button
                  key={s.id}
                  onClick={() => { setSelectedStudentId(s.id); resetForm(); setNotice(''); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                    selectedStudentId === s.id
                      ? 'bg-blue-50 border border-blue-500'
                      : 'border border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {s.avatar ? (
                      <img src={s.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${s.gender === 'L' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.nis}</p>
                    </div>
                    {nilaiCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold">
                        {nilaiCount} mapel
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
            {filteredStudents.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Tidak ada siswa ditemukan.</p>
            )}
          </div>
        </div>

        {/* Panel Input Nilai */}
        <div className="space-y-5">
          {!selectedStudent ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
              <BookOpenCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Pilih siswa di sebelah kiri untuk mulai input nilai rapot.</p>
            </div>
          ) : (
            <>
              {/* Info Siswa */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
                <div className="flex items-center gap-4">
                  {selectedStudent.avatar ? (
                    <img src={selectedStudent.avatar} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-white/30" />
                  ) : (
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold border-2 border-white/30 ${selectedStudent.gender === 'L' ? 'bg-blue-700' : 'bg-pink-500'}`}>
                      {selectedStudent.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold">{selectedStudent.name}</h2>
                    <p className="text-blue-100 text-sm">NIS: {selectedStudent.nis} • {tahunAjaran} • Semester {semester === 'ganjil' ? 'Ganjil' : 'Genap'}</p>
                  </div>
                  <div className="ml-auto text-right hidden sm:block">
                    <p className="text-3xl font-bold">{rataRata}</p>
                    <p className="text-blue-200 text-xs">Rata-rata</p>
                  </div>
                </div>
              </div>

              {/* Form Input */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  {formMapel ? `Edit Nilai: ${formMapel}` : 'Tambah Nilai Mata Pelajaran'}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Mata Pelajaran</label>
                    <select
                      value={formMapel}
                      onChange={e => setFormMapel(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Mapel</option>
                      {DAFTAR_MAPEL.map(mapel => (
                        <option key={mapel} value={mapel}>{mapel}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nilai Tugas</label>
                    <input
                      type="number" min={0} max={100}
                      value={formTugas}
                      onChange={e => setFormTugas(Math.min(100, Math.max(0, Number(e.target.value))))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nilai UTS</label>
                    <input
                      type="number" min={0} max={100}
                      value={formUTS}
                      onChange={e => setFormUTS(Math.min(100, Math.max(0, Number(e.target.value))))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nilai UAS</label>
                    <input
                      type="number" min={0} max={100}
                      value={formUAS}
                      onChange={e => setFormUAS(Math.min(100, Math.max(0, Number(e.target.value))))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="text-center w-full">
                      <p className="text-xs text-gray-500 mb-1">Nilai Akhir</p>
                      <p className="text-2xl font-bold text-blue-600">{hitungNilaiAkhir(formTugas, formUTS, formUAS)}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${predikatColor(hitungPredikat(hitungNilaiAkhir(formTugas, formUTS, formUAS)))}`}>
                        {hitungPredikat(hitungNilaiAkhir(formTugas, formUTS, formUAS))}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-gray-500 mb-1">Catatan Guru (opsional)</label>
                  <input
                    value={formCatatan}
                    onChange={e => setFormCatatan(e.target.value)}
                    placeholder="Contoh: Perlu peningkatan di bab persamaan linear"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleSimpanNilai}
                    disabled={!formMapel}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" /> Simpan Nilai
                  </button>
                  {formMapel && (
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>

              {/* Tabel Nilai */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 border-b bg-gray-50 flex items-center gap-2">
                  <BookOpenCheck className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-700 text-sm">Daftar Nilai Rapot - {selectedStudent.name}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600 w-10">No</th>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">Mata Pelajaran</th>
                        <th className="text-center px-4 py-2 text-xs font-semibold text-gray-600 w-20">Tugas</th>
                        <th className="text-center px-4 py-2 text-xs font-semibold text-gray-600 w-20">UTS</th>
                        <th className="text-center px-4 py-2 text-xs font-semibold text-gray-600 w-20">UAS</th>
                        <th className="text-center px-4 py-2 text-xs font-semibold text-gray-600 w-20">Akhir</th>
                        <th className="text-center px-4 py-2 text-xs font-semibold text-gray-600 w-16">Predikat</th>
                        <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600">Catatan</th>
                        <th className="text-center px-4 py-2 text-xs font-semibold text-gray-600 w-24">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nilaiSiswa.map((item, idx) => (
                        <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-500">{idx + 1}</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-800">{item.mataPelajaran}</td>
                          <td className="px-4 py-2 text-sm text-center text-gray-700">{item.nilaiTugas}</td>
                          <td className="px-4 py-2 text-sm text-center text-gray-700">{item.nilaiUTS}</td>
                          <td className="px-4 py-2 text-sm text-center text-gray-700">{item.nilaiUAS}</td>
                          <td className="px-4 py-2 text-center">
                            <span className="text-sm font-bold text-gray-800">{item.nilaiAkhir}</span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${predikatColor(item.predikat)}`}>
                              {item.predikat}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-xs text-gray-500 max-w-[200px] truncate">{item.catatanGuru || '-'}</td>
                          <td className="px-4 py-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleEditNilai(item)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Edit nilai"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleHapusNilai(item.id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                title="Hapus nilai"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {nilaiSiswa.length === 0 && (
                        <tr>
                          <td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">
                            Belum ada nilai rapot untuk siswa ini di semester ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {nilaiSiswa.length > 0 && (
                  <div className="px-5 py-3 border-t bg-gray-50 flex items-center justify-between">
                    <p className="text-sm text-gray-600">Total: <strong>{nilaiSiswa.length}</strong> mata pelajaran</p>
                    <p className="text-sm text-gray-600">
                      Rata-rata Nilai Akhir: <strong className="text-blue-600">{rataRata}</strong> •
                      Predikat: <strong className={predikatColor(hitungPredikat(rataRata)) + ' px-2 py-0.5 rounded-full text-xs ml-1'}>{hitungPredikat(rataRata)}</strong>
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

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
import { Save, Trash2, Plus, BookOpenCheck, Search, Edit2 } from 'lucide-react';
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
    setNotice(`LOG_SUCCESS: Nilai ${formMapel} untuk ${selectedStudent?.name} berhasil disimpan.`);
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
    if (!window.confirm('Hapus log nilai mata pelajaran ini?')) return;
    deleteNilaiRapot(id);
    setNotice('LOG_DELETED: Nilai berhasil dihapus.');
  };

  // Transformasi indikator predikat berbasis garis kontras arsitektural mono
  const predikatClassName = (p: string) => {
    switch (p) {
      case 'A': return 'border-slate-900 bg-slate-900 text-white font-bold';
      case 'B': return 'border-slate-900 bg-white text-slate-900 font-bold';
      case 'C': return 'border-slate-400 bg-white text-slate-600 font-bold';
      case 'D': return 'border-slate-200 bg-white text-slate-400';
      default: return 'border-slate-200 bg-white text-slate-300 line-through';
    }
  };

  const rataRata = nilaiSiswa.length > 0
    ? Math.round(nilaiSiswa.reduce((sum, item) => sum + item.nilaiAkhir, 0) / nilaiSiswa.length)
    : 0;

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto p-2 antialiased text-slate-600 bg-white selection:bg-slate-200">
      
      {/* HEADER BAR */}
      <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs">
        <h1 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Input Log Nilai Rapot Siswa</h1>
        <p className="text-xs text-slate-400 mt-0.5">Pencatatan evaluasi akademis harian, ujian tengah semester, dan ujian akhir berkala per kompartemen kelas.</p>
      </div>

      {notice && (
        <div className="bg-white border border-slate-900 rounded px-3 py-2 text-xs font-mono font-bold text-slate-900 shadow-xs">
          {notice.toUpperCase()}
        </div>
      )}

      {/* FILTER CONTROL MATRIX */}
      <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs flex flex-wrap gap-4 items-end">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Kompartemen Kelas</label>
          <select
            value={selectedClassId}
            onChange={e => { setSelectedClassId(e.target.value); setSelectedStudentId(''); }}
            className="px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-900 rounded text-xs font-mono font-bold text-slate-800 outline-none cursor-pointer transition-colors"
          >
            {teacherClasses.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Tahun Ajaran</label>
          <select
            value={tahunAjaran}
            onChange={e => setTahunAjaran(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-900 rounded text-xs font-mono font-bold text-slate-800 outline-none cursor-pointer transition-colors"
          >
            {generateTahunAjaran().map(ta => (
              <option key={ta} value={ta}>{ta}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Periode Semester</label>
          <select
            value={semester}
            onChange={e => setSemester(e.target.value as 'ganjil' | 'genap')}
            className="px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-900 rounded text-xs font-mono font-bold text-slate-800 outline-none cursor-pointer transition-colors"
          >
            <option value="ganjil">GANJIL</option>
            <option value="genap">GENAP</option>
          </select>
        </div>
      </div>

      <div className="grid xl:grid-cols-[300px_1fr] gap-4 items-start">
        
        {/* SIDEBAR: DAFTAR SISWA */}
        <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs p-4">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-3">Registrasi Target Siswa</h2>
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={searchStudent}
              onChange={e => setSearchStudent(e.target.value)}
              placeholder="Cari nama atau NIS..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 focus:border-slate-900 rounded text-xs outline-none transition-colors"
            />
          </div>
          <div className="space-y-1 max-h-[560px] overflow-y-auto pr-1">
            {filteredStudents.map(s => {
              const nilaiCount = nilaiKelas.filter(item => item.studentId === s.id).length;
              const isSelected = selectedStudentId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => { setSelectedStudentId(s.id); resetForm(); setNotice(''); }}
                  className={`w-full text-left px-3 py-2 rounded border transition-all flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold uppercase truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>{s.name}</p>
                    <p className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>{s.nis}</p>
                  </div>
                  {nilaiCount > 0 && (
                    <span className={`ml-2 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm border ${
                      isSelected ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-500'
                    }`}>
                      {nilaiCount} MAPEL
                    </span>
                  )}
                </button>
              );
            })}
            {filteredStudents.length === 0 && (
              <p className="text-xs font-mono text-slate-400 text-center py-4 uppercase tracking-wider">QUERY_EMPTY</p>
            )}
          </div>
        </div>

        {/* MAIN INTERFACE PANEL */}
        <div className="space-y-4">
          {!selectedStudent ? (
            <div className="bg-white rounded-lg py-24 text-center border border-dashed border-slate-200">
              <BookOpenCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">AWAITING_STUDENT_SELECTION</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Pilih entitas siswa pada panel manifes kiri untuk memulai konfigurasi pengisian log nilai rapot.</p>
            </div>
          ) : (
            <>
              {/* CURRENT ACTIVE STUDENT INFO */}
              <div className="bg-white rounded-lg p-4 border border-slate-950 shadow-xs text-slate-900 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-[9px] font-mono font-bold tracking-wider text-slate-400 uppercase">ENTITAS_SISWA_AKTIF</div>
                  <h2 className="text-sm font-black uppercase tracking-tight">{selectedStudent.name}</h2>
                  <p className="text-[10px] font-mono text-slate-500">
                    CODE_NIS: {selectedStudent.nis} • {tahunAjaran} • SEMESTER_{semester.toUpperCase()}
                  </p>
                </div>
                <div className="text-right border-l border-slate-200 pl-4 font-mono">
                  <p className="text-2xl font-black tracking-tighter">{rataRata}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">CUMULATIVE_AVG</p>
                </div>
              </div>

              {/* FORM INPUT MATRIX */}
              <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-xs">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2 mb-4 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-slate-900" />
                  {formMapel ? `EDIT_LOG_ENTRY: ${formMapel.toUpperCase()}` : 'RECORD_NEW_MAPEL_LOG'}
                </h3>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Mata Pelajaran</label>
                    <select
                      value={formMapel}
                      onChange={e => setFormMapel(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-900 rounded text-xs font-bold text-slate-800 outline-none cursor-pointer transition-colors"
                    >
                      <option value="">SELECT_MAPEL...</option>
                      {DAFTAR_MAPEL.map(mapel => (
                        <option key={mapel} value={mapel}>{mapel.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Nilai Tugas (30%)</label>
                    <input
                      type="number" min={0} max={100}
                      value={formTugas}
                      onChange={e => setFormTugas(Math.min(100, Math.max(0, Number(e.target.value))))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-900 rounded text-xs font-mono font-bold text-slate-800 outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Nilai UTS (30%)</label>
                    <input
                      type="number" min={0} max={100}
                      value={formUTS}
                      onChange={e => setFormUTS(Math.min(100, Math.max(0, Number(e.target.value))))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-900 rounded text-xs font-mono font-bold text-slate-800 outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Nilai UAS (40%)</label>
                    <input
                      type="number" min={0} max={100}
                      value={formUAS}
                      onChange={e => setFormUAS(Math.min(100, Math.max(0, Number(e.target.value))))}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-900 rounded text-xs font-mono font-bold text-slate-800 outline-none transition-colors"
                    />
                  </div>
                  <div className="flex items-center justify-center bg-slate-50/50 border border-slate-100 rounded p-2 text-center">
                    <div className="font-mono">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">RESULT_FINAL</span>
                      <p className="text-xl font-black text-slate-900 tracking-tighter">{hitungNilaiAkhir(formTugas, formUTS, formUAS)}</p>
                      <span className={`inline-block mt-0.5 text-[9px] font-mono border px-1 rounded-sm ${predikatClassName(hitungPredikat(hitungNilaiAkhir(formTugas, formUTS, formUAS)))}`}>
                        {hitungPredikat(hitungNilaiAkhir(formTugas, formUTS, formUAS))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Catatan Korespondensi Akademik (Opsional)</label>
                  <input
                    value={formCatatan}
                    onChange={e => setFormCatatan(e.target.value)}
                    placeholder="Input catatan guru mengenai perkembangan akademis siswa..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 focus:border-slate-900 rounded text-xs outline-none transition-colors"
                  />
                </div>

                <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                  <button
                    onClick={handleSimpanNilai}
                    disabled={!formMapel}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-950 text-white rounded text-xs font-mono font-bold tracking-wide transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> COMMIT_RECORD
                  </button>
                  {formMapel && (
                    <button
                      onClick={resetForm}
                      className="px-3 py-1.5 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded text-xs font-mono font-bold transition-colors cursor-pointer"
                    >
                      ABORT
                    </button>
                  )}
                </div>
              </div>

              {/* LOG ENTRIES TABLE */}
              <div className="bg-white rounded-lg border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50/70 flex items-center gap-1.5">
                  <BookOpenCheck className="w-3.5 h-3.5 text-slate-500" />
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Arsip Transkrip Akademis Terpilih</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse table-fixed min-w-[750px]">
                    <thead>
                      <tr className="bg-slate-50/30 border-b border-slate-200 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="px-3 py-2 w-12 text-center">NO</th>
                        <th className="px-3 py-2 w-48">MATA_PELAJARAN</th>
                        <th className="px-3 py-2 w-20 text-center">TUGAS</th>
                        <th className="px-3 py-2 w-20 text-center">UTS</th>
                        <th className="px-3 py-2 w-20 text-center">UAS</th>
                        <th className="px-3 py-2 w-20 text-center text-slate-900 bg-slate-50/40">AKHIR</th>
                        <th className="px-3 py-2 w-24 text-center">PREDIKAT</th>
                        <th className="px-3 py-2">EVALUASI_CATATAN</th>
                        <th className="px-3 py-2 w-20 text-center">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                      {nilaiSiswa.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="px-3 py-2 font-mono text-slate-400 text-center">{idx + 1}</td>
                          <td className="px-3 py-2 font-bold text-slate-900 uppercase tracking-tight">{item.mataPelajaran}</td>
                          <td className="px-3 py-2 font-mono text-center text-slate-700">{item.nilaiTugas}</td>
                          <td className="px-3 py-2 font-mono text-center text-slate-700">{item.nilaiUTS}</td>
                          <td className="px-3 py-2 font-mono text-center text-slate-700">{item.nilaiUAS}</td>
                          <td className="px-3 py-2 font-mono font-black text-center text-slate-900 bg-slate-50/20">{item.nilaiAkhir}</td>
                          <td className="px-3 py-2 text-center align-middle">
                            <span className={`text-[10px] font-mono border w-5 h-5 inline-flex items-center justify-center rounded-sm ${predikatClassName(item.predikat)}`}>
                              {item.predikat}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-slate-400 font-mono text-[11px] truncate" title={item.catatanGuru}>
                            {item.catatanGuru || '-'}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleEditNilai(item)}
                                className="p-1 text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200 rounded transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleHapusNilai(item.id)}
                                className="p-1 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 rounded transition-colors cursor-pointer"
                                title="Delete record"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {nilaiSiswa.length === 0 && (
                        <tr>
                          <td colSpan={9} className="px-4 py-12 text-center font-mono text-slate-400 uppercase tracking-wider">
                            NO_ACADEMIC_RECORDS_REGISTERED
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {nilaiSiswa.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500">
                    <div>TOTAL_METRICS: <strong className="text-slate-800">{nilaiSiswa.length}</strong> SUBJECT_ENTRIES</div>
                    <div className="flex items-center gap-2">
                      CUMULATIVE_FINAL_INDEX: <strong className="text-slate-900 text-xs">{rataRata}</strong>
                      <span className="text-slate-300">|</span>
                      GRADE_INDEX: 
                      <span className={`text-[9px] font-mono border px-1 rounded-sm ${predikatClassName(hitungPredikat(rataRata))}`}>
                        {hitungPredikat(rataRata)}
                      </span>
                    </div>
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
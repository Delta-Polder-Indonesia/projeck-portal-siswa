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

const MASTER_MAPEL_DEFAULT: string[] = [
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
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [semester, setSemester] = useState<'ganjil' | 'genap'>('genap');
  const [tahunAjaran, setTahunAjaran] = useState<string>(() => {
    const y = new Date().getFullYear();
    return `${y}/${y + 1}`;
  });
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [notice, setNotice] = useState<string>('');

  const [daftarMapel, setDaftarMapel] = useState<string[]>(() => {
    const saved = localStorage.getItem('app_daftar_mapel');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MASTER_MAPEL_DEFAULT;
      }
    }
    return MASTER_MAPEL_DEFAULT;
  });

  const [formMapel, setFormMapel] = useState<string>('');
  const [manualMapel, setManualMapel] = useState<string>('');
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [formTugas, setFormTugas] = useState<number | ''>('');
  const [formUTS, setFormUTS] = useState<number | ''>('');
  const [formUAS, setFormUAS] = useState<number | ''>('');
  const [formCatatan, setFormCatatan] = useState<string>('');

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
    return students.filter(
      s => s.name.toLowerCase().includes(key) || s.nis.includes(searchStudent),
    );
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
    setManualMapel('');
    setIsManualMode(false);
    setFormTugas('');
    setFormUTS('');
    setFormUAS('');
    setFormCatatan('');
  };

  const nilaiTugasNum = formTugas === '' ? 0 : formTugas;
  const nilaiUTSNum   = formUTS   === '' ? 0 : formUTS;
  const nilaiUASNum   = formUAS   === '' ? 0 : formUAS;

  const mapelToSubmit = isManualMode ? manualMapel.trim() : formMapel.trim();

  const handleSimpanNilai = () => {
    if (!user || !selectedStudentId || !selectedClassId || !mapelToSubmit) {
      setNotice('Pilih siswa dan tentukan mata pelajaran terlebih dahulu.');
      return;
    }

    const nilaiAkhir = hitungNilaiAkhir(nilaiTugasNum, nilaiUTSNum, nilaiUASNum);
    const predikat   = hitungPredikat(nilaiAkhir);

    const isExist = daftarMapel.some(
      m => m.toLowerCase() === mapelToSubmit.toLowerCase(),
    );
    if (!isExist) {
      const updatedList = [...daftarMapel, mapelToSubmit];
      setDaftarMapel(updatedList);
      localStorage.setItem('app_daftar_mapel', JSON.stringify(updatedList));
    }

    const item: NilaiRapot = {
      id: `rapot_${selectedStudentId}_${tahunAjaran}_${semester}_${mapelToSubmit}`,
      studentId: selectedStudentId,
      classId: selectedClassId,
      semester,
      tahunAjaran,
      mataPelajaran: mapelToSubmit,
      nilaiTugas: nilaiTugasNum,
      nilaiUTS: nilaiUTSNum,
      nilaiUAS: nilaiUASNum,
      nilaiAkhir,
      predikat,
      catatanGuru: formCatatan.trim() || undefined,
      inputBy: user.id,
      updatedAt: Date.now(),
    };

    upsertNilaiRapot(item);
    setNotice(`LOG_SUCCESS: Nilai ${mapelToSubmit} untuk ${selectedStudent?.name} berhasil disimpan.`);
    resetForm();
  };

  const handleEditNilai = (item: NilaiRapot) => {
    if (daftarMapel.includes(item.mataPelajaran)) {
      setFormMapel(item.mataPelajaran);
      setIsManualMode(false);
    } else {
      setFormMapel('__MANUAL_INPUT__');
      setManualMapel(item.mataPelajaran);
      setIsManualMode(true);
    }
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

  const predikatClassName = (p: string) => {
    switch (p) {
      case 'A': return 'border-slate-900 bg-slate-900 text-white font-bold';
      case 'B': return 'border-slate-900 bg-white text-slate-900 font-bold';
      case 'C': return 'border-slate-400 bg-white text-slate-600 font-bold';
      case 'D': return 'border-slate-300 bg-white text-slate-400';
      default:  return 'border-slate-200 bg-white text-slate-300 line-through';
    }
  };

  const rataRata =
    nilaiSiswa.length > 0
      ? Math.round(
          nilaiSiswa.reduce((sum, item) => sum + item.nilaiAkhir, 0) / nilaiSiswa.length,
        )
      : 0;

  return (
    <div className="w-full bg-white p-4 text-xs text-slate-700 antialiased space-y-4">

      {/* ── HEADER — seragam dengan Code 1 ──────────────────────── */}
      <header className="flex items-center justify-between border-b border-slate-300 pb-3">
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-950 uppercase">
            Sistem Informasi Akademik
          </h1>
          <p className="text-[11px] text-slate-500">
            Panel input, manajemen, dan arsip transkrip nilai rapot resmi per kompartemen kelas binaan.
          </p>
        </div>

        {/* Control kanan header — kelas + periode */}
        <div className="flex items-center gap-4 border-l border-slate-300 pl-4">
          {/* Pilih Kelas */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Kompartemen Kelas
            </span>
            <select
              value={selectedClassId}
              onChange={e => { setSelectedClassId(e.target.value); setSelectedStudentId(''); }}
              className="mt-0.5 cursor-pointer border border-slate-900 bg-white px-2 py-1 text-xs font-bold text-slate-900 uppercase outline-none"
            >
              {teacherClasses.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name.toUpperCase()}
                </option>
              ))}
              {teacherClasses.length === 0 && (
                <option value="">NULL_CLASS</option>
              )}
            </select>
          </div>

          {/* Tahun Ajaran */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Tahun Ajaran
            </span>
            <select
              value={tahunAjaran}
              onChange={e => setTahunAjaran(e.target.value)}
              className="mt-0.5 cursor-pointer border border-slate-900 bg-white px-2 py-1 text-xs font-bold text-slate-900 uppercase outline-none"
            >
              {generateTahunAjaran().map(ta => (
                <option key={ta} value={ta}>{ta}</option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Semester
            </span>
            <select
              value={semester}
              onChange={e => setSemester(e.target.value as 'ganjil' | 'genap')}
              className="mt-0.5 cursor-pointer border border-slate-900 bg-white px-2 py-1 text-xs font-bold text-slate-900 uppercase outline-none"
            >
              <option value="ganjil">GANJIL</option>
              <option value="genap">GENAP</option>
            </select>
          </div>
        </div>
      </header>

      {/* ── NOTICE LOG BAR ──────────────────────────────────────── */}
      {notice && (
        <div className="border border-slate-900 p-2.5 bg-slate-50 text-[11px] font-bold text-slate-900 uppercase tracking-tight">
          {notice}
        </div>
      )}

      {/* ── TWO-COLUMN WORKSPACE ────────────────────────────────── */}
      <div className="grid xl:grid-cols-[300px_1fr] gap-4 items-start">

        {/* PANEL KIRI — DAFTAR SISWA */}
        <section className="border border-slate-300 p-3">

          {/* Section header — seragam Code 1 */}
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-3 text-[10px] font-bold tracking-wider text-slate-900 uppercase">
            <Search className="h-4 w-4 text-slate-950" />
            <span>Manifes Siswa Kelas</span>
          </div>

          {/* Search input */}
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={searchStudent}
              onChange={e => setSearchStudent(e.target.value)}
              placeholder="Cari nama atau NIS..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 focus:border-slate-900 text-xs outline-none"
            />
          </div>

          {/* List siswa */}
          <div className="space-y-1 max-h-[560px] overflow-y-auto pr-0.5 divide-y divide-slate-100">
            {filteredStudents.map(s => {
              const nilaiCount = nilaiKelas.filter(item => item.studentId === s.id).length;
              const isSelected = selectedStudentId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setSelectedStudentId(s.id); resetForm(); setNotice(''); }}
                  className={`w-full text-left px-3 py-2 border transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold uppercase truncate ${
                      isSelected ? 'text-white' : 'text-slate-800'
                    }`}>
                      {s.name}
                    </p>
                    <p className={`text-[10px] mt-0.5 ${
                      isSelected ? 'text-slate-300' : 'text-slate-400'
                    }`}>
                      {s.nis}
                    </p>
                  </div>
                  {nilaiCount > 0 && (
                    <span className={`ml-2 text-[9px] font-bold px-1.5 py-0.5 border ${
                      isSelected
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-white border-slate-300 text-slate-500'
                    }`}>
                      {nilaiCount} MAPEL
                    </span>
                  )}
                </button>
              );
            })}

            {filteredStudents.length === 0 && (
              <div className="border border-dashed border-slate-300 bg-slate-50/50 py-14 text-center">
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  QUERY_EMPTY
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Tidak ada siswa sesuai pencarian.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* PANEL KANAN — MAIN INTERFACE */}
        <div className="space-y-4">

          {/* Empty state — belum pilih siswa */}
          {!selectedStudent ? (
            <div className="border border-dashed border-slate-300 bg-slate-50/50 py-24 text-center">
              <BookOpenCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                AWAITING_STUDENT_SELECTION
              </p>
              <p className="mt-0.5 text-[10px] text-slate-400">
                Pilih entitas siswa pada panel manifes kiri untuk memulai konfigurasi pengisian log nilai rapot.
              </p>
            </div>
          ) : (
            <>
              {/* INFO BANNER SISWA AKTIF */}
              <div className="border border-slate-900 p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                    ENTITAS_SISWA_AKTIF
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-tight text-slate-900">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-[10px] text-slate-500">
                    NIS: {selectedStudent.nis} &bull; {tahunAjaran} &bull; SEMESTER_{semester.toUpperCase()}
                  </p>
                </div>
                <div className="text-right border-l border-slate-300 pl-4">
                  <p className="text-2xl font-black tracking-tighter text-slate-900">{rataRata}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    CUMULATIVE_AVG
                  </p>
                </div>
              </div>

              {/* FORM INPUT NILAI */}
              <section className="border border-slate-300 p-3">

                {/* Section header */}
                <div className="flex items-center gap-2 border-b border-slate-900 pb-2 mb-4 text-[10px] font-bold tracking-wider text-slate-900 uppercase">
                  <Plus className="h-4 w-4 text-slate-950" />
                  <span>
                    {mapelToSubmit
                      ? `Edit Log: ${mapelToSubmit.toUpperCase()}`
                      : 'Input Nilai Mata Pelajaran'}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">

                  {/* Mata Pelajaran */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600">
                      Mata Pelajaran
                    </label>
                    {!isManualMode ? (
                      <select
                        value={formMapel}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === '__MANUAL_INPUT__') {
                            setIsManualMode(true);
                            setFormMapel('__MANUAL_INPUT__');
                          } else {
                            setFormMapel(val);
                          }
                        }}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 focus:border-slate-900 text-xs font-bold text-slate-800 outline-none cursor-pointer"
                      >
                        <option value="">-- Pilih Mapel --</option>
                        {daftarMapel.map(mapel => (
                          <option key={mapel} value={mapel}>{mapel}</option>
                        ))}
                        <option value="__MANUAL_INPUT__">+ Tulis Mapel Manual...</option>
                      </select>
                    ) : (
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={manualMapel}
                          onChange={e => setManualMapel(e.target.value)}
                          placeholder="Ketik mapel khusus..."
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-900 focus:border-slate-900 text-xs font-bold text-slate-800 outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsManualMode(false);
                            setFormMapel('');
                            setManualMapel('');
                          }}
                          className="text-[9px] font-bold text-slate-500 hover:underline uppercase tracking-wide"
                        >
                          [ Kembali ke Pilihan ]
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Nilai Tugas */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600">
                      Nilai Tugas (30%)
                    </label>
                    <input
                      type="number" min={0} max={100}
                      value={formTugas}
                      onChange={e => {
                        const val = e.target.value;
                        setFormTugas(val === '' ? '' : Math.min(100, Math.max(0, Number(val))));
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 focus:border-slate-900 text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>

                  {/* Nilai UTS */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600">
                      Nilai UTS (30%)
                    </label>
                    <input
                      type="number" min={0} max={100}
                      value={formUTS}
                      onChange={e => {
                        const val = e.target.value;
                        setFormUTS(val === '' ? '' : Math.min(100, Math.max(0, Number(val))));
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 focus:border-slate-900 text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>

                  {/* Nilai UAS */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600">
                      Nilai UAS (40%)
                    </label>
                    <input
                      type="number" min={0} max={100}
                      value={formUAS}
                      onChange={e => {
                        const val = e.target.value;
                        setFormUAS(val === '' ? '' : Math.min(100, Math.max(0, Number(val))));
                      }}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 focus:border-slate-900 text-xs font-bold text-slate-800 outline-none"
                    />
                  </div>

                  {/* Kalkulasi Akhir */}
                  <div className="flex items-center justify-center bg-slate-50 border border-slate-300 p-2 text-center">
                    <div>
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        RESULT_FINAL
                      </span>
                      <p className="text-xl font-black text-slate-900 tracking-tighter">
                        {hitungNilaiAkhir(nilaiTugasNum, nilaiUTSNum, nilaiUASNum)}
                      </p>
                      <span className={`inline-block mt-0.5 text-[9px] font-bold border px-1 ${
                        predikatClassName(
                          hitungPredikat(hitungNilaiAkhir(nilaiTugasNum, nilaiUTSNum, nilaiUASNum))
                        )
                      }`}>
                        {hitungPredikat(hitungNilaiAkhir(nilaiTugasNum, nilaiUTSNum, nilaiUASNum))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Catatan */}
                <div className="mt-4 space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wide text-slate-600">
                    Catatan Korespondensi Akademik (Opsional)
                  </label>
                  <input
                    value={formCatatan}
                    onChange={e => setFormCatatan(e.target.value)}
                    placeholder="Input catatan guru mengenai perkembangan akademis siswa..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 focus:border-slate-900 text-xs outline-none"
                  />
                </div>

                {/* Tombol aksi */}
                <div className="mt-4 flex gap-2 border-t border-slate-200 pt-3">
                  <button
                    type="button"
                    onClick={handleSimpanNilai}
                    disabled={!mapelToSubmit}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-950 text-white text-[10px] font-bold uppercase tracking-wider transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    COMMIT_RECORD
                  </button>
                  {(formMapel || manualMapel) && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-3 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-900 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      ABORT
                    </button>
                  )}
                </div>
              </section>

              {/* TABEL ARSIP NILAI */}
              <section className="border border-slate-300 overflow-hidden">

                {/* Section header */}
                <div className="flex items-center gap-2 border-b border-slate-900 px-4 py-2.5 text-[10px] font-bold tracking-wider text-slate-900 uppercase bg-white">
                  <BookOpenCheck className="h-4 w-4 text-slate-950" />
                  <span>Arsip Transkrip Akademis ({nilaiSiswa.length} Mata Pelajaran)</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse table-fixed min-w-[750px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-300 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="px-3 py-2 w-12 text-center border-r border-slate-200">NO</th>
                        <th className="px-3 py-2 w-48 border-r border-slate-200">MATA_PELAJARAN</th>
                        <th className="px-3 py-2 w-20 text-center border-r border-slate-200">TUGAS</th>
                        <th className="px-3 py-2 w-20 text-center border-r border-slate-200">UTS</th>
                        <th className="px-3 py-2 w-20 text-center border-r border-slate-200">UAS</th>
                        <th className="px-3 py-2 w-20 text-center bg-slate-100/50 border-r border-slate-200 text-slate-900">AKHIR</th>
                        <th className="px-3 py-2 w-24 text-center border-r border-slate-200">PREDIKAT</th>
                        <th className="px-3 py-2 border-r border-slate-200">EVALUASI_CATATAN</th>
                        <th className="px-3 py-2 w-20 text-center">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs text-slate-600">
                      {nilaiSiswa.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-3 py-2 text-slate-400 text-center border-r border-slate-200">
                            {idx + 1}
                          </td>
                          <td className="px-3 py-2 font-bold text-slate-900 uppercase tracking-tight border-r border-slate-200">
                            {item.mataPelajaran}
                          </td>
                          <td className="px-3 py-2 text-center text-slate-700 border-r border-slate-200">
                            {item.nilaiTugas}
                          </td>
                          <td className="px-3 py-2 text-center text-slate-700 border-r border-slate-200">
                            {item.nilaiUTS}
                          </td>
                          <td className="px-3 py-2 text-center text-slate-700 border-r border-slate-200">
                            {item.nilaiUAS}
                          </td>
                          <td className="px-3 py-2 font-black text-center text-slate-900 bg-slate-50/40 border-r border-slate-200">
                            {item.nilaiAkhir}
                          </td>
                          <td className="px-3 py-2 text-center align-middle border-r border-slate-200">
                            <span className={`text-[9px] font-bold border w-5 h-5 inline-flex items-center justify-center ${
                              predikatClassName(item.predikat)
                            }`}>
                              {item.predikat}
                            </span>
                          </td>
                          <td
                            className="px-3 py-2 text-slate-500 text-[11px] truncate border-r border-slate-200"
                            title={item.catatanGuru}
                          >
                            {item.catatanGuru || '-'}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleEditNilai(item)}
                                className="p-1 text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-300 transition-colors cursor-pointer"
                                title="Edit record"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleHapusNilai(item.id)}
                                className="p-1 text-slate-500 hover:text-rose-600 border border-transparent hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Hapus record"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {nilaiSiswa.length === 0 && (
                        <tr>
                          <td colSpan={9} className="px-4 py-12 text-center text-slate-400 uppercase tracking-wider">
                            <p className="text-[10px] font-bold">NO_ACADEMIC_RECORDS_REGISTERED</p>
                            <p className="text-[10px] mt-0.5">Belum ada nilai yang diinput untuk siswa ini.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer tabel */}
                {nilaiSiswa.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                    <div>
                      TOTAL:{' '}
                      <strong className="text-slate-800">{nilaiSiswa.length}</strong> MATA PELAJARAN
                    </div>
                    <div className="flex items-center gap-2">
                      RATA-RATA AKHIR:{' '}
                      <strong className="text-slate-900 text-xs">{rataRata}</strong>
                      <span className="text-slate-300">|</span>
                      PREDIKAT:{' '}
                      <span className={`text-[9px] font-bold border px-1 ${
                        predikatClassName(hitungPredikat(rataRata))
                      }`}>
                        {hitungPredikat(rataRata)}
                      </span>
                    </div>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
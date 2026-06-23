import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTeachers, getClasses, getStudentsByClass, addStudent, updateStudent, deleteStudent } from '../../data/store';
import { Student } from '../../types';
import { Plus, Edit2, Trash2, X, Search, UserPlus } from 'lucide-react';

export default function StudentManagement() {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formNis, setFormNis] = useState('');
  const [formGender, setFormGender] = useState<'L' | 'P'>('L');
  const [formClass, setFormClass] = useState('');
  const [formPassword, setFormPassword] = useState('siswa123');

  const teacher = useMemo(() => getTeachers().find(t => t.id === user?.id), [user]);
  const classes = useMemo(() => getClasses().filter(c => teacher?.classIds.includes(c.id)), [teacher]);

  const students = useMemo(() => {
    if (!selectedClass) {
      const allStudents: Student[] = [];
      classes.forEach(c => {
        allStudents.push(...getStudentsByClass(c.id));
      });
      return allStudents.sort((a, b) => a.name.localeCompare(b.name));
    }
    return getStudentsByClass(selectedClass).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedClass, classes, refresh]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    const lower = searchTerm.toLowerCase();
    return students.filter(s => s.name.toLowerCase().includes(lower) || s.nis.includes(searchTerm));
  }, [students, searchTerm]);

  const openAddModal = () => {
    setEditingStudent(null);
    setFormName('');
    setFormNis('');
    setFormGender('L');
    setFormClass(selectedClass || classes[0]?.id || '');
    setFormPassword('siswa123');
    setShowModal(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormName(student.name);
    setFormNis(student.nis);
    setFormGender(student.gender);
    setFormClass(student.classId);
    setFormPassword(student.password);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formName || !formNis || !formClass) return;

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        name: formName,
        nis: formNis,
        gender: formGender,
        classId: formClass,
        password: formPassword,
      });
    } else {
      addStudent({
        id: `s_${Date.now()}`,
        name: formName,
        nis: formNis,
        gender: formGender,
        classId: formClass,
        password: formPassword,
      });
    }
    setShowModal(false);
    setRefresh(r => r + 1);
  };

  const handleDelete = (id: string) => {
    deleteStudent(id);
    setDeleteConfirm(null);
    setRefresh(r => r + 1);
  };

  const getClassName = (classId: string) => {
    return classes.find(c => c.id === classId)?.name || classId;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 antialiased">
      {/* HEADER */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Data Manajemen Siswa</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Kelola data profil, nomor induk, beserta akun akses siswa per kelas binaan Anda.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-xs tracking-wide transition-all duration-200 shadow-md shadow-blue-600/10 active:scale-[0.98] shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Tambah Siswa Baru
        </button>
      </div>

      {/* FILTERS BAR */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3 items-center">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Cari nama lengkap siswa atau nomor NIS..."
            className="w-full pl-10 pr-4 py-2 text-xs font-medium text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="w-full md:w-auto shrink-0 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap hidden sm:inline">Filter:</span>
          <select
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
            className="w-full md:w-48 px-3 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer"
          >
            <option value="">Semua Kelas Binaan</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </section>

      {/* STATS CHIPS */}
      <div className="flex flex-wrap gap-2.5">
        <div className="bg-slate-900 border border-slate-950 rounded-xl px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5 shadow-sm">
          <span className="text-white font-bold bg-white/20 px-1.5 py-0.5 rounded-md min-w-[20px] text-center">{filteredStudents.length}</span>
          <span className="text-slate-300">Total Siswa</span>
        </div>
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5">
          <span className="text-blue-700 font-extrabold bg-blue-100 px-1.5 py-0.5 rounded-md min-w-[20px] text-center">{filteredStudents.filter(s => s.gender === 'L').length}</span>
          <span className="text-blue-600/80">Laki-laki</span>
        </div>
        <div className="bg-pink-50/60 border border-pink-100 rounded-xl px-3.5 py-1.5 text-xs font-medium flex items-center gap-1.5">
          <span className="text-pink-700 font-extrabold bg-pink-100 px-1.5 py-0.5 rounded-md min-w-[20px] text-center">{filteredStudents.filter(s => s.gender === 'P').length}</span>
          <span className="text-pink-600/80">Perempuan</span>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400">
                <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider w-14 text-center">No</th>
                <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider">Nama Siswa</th>
                <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider">NIS</th>
                <th className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider w-32">Kelas</th>
                <th className="text-center px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider w-24">Gender</th>
                <th className="text-center px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider w-36">Aksi Panel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70">
              {filteredStudents.map((student, idx) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition duration-150">
                  <td className="px-5 py-3.5 text-xs text-slate-400 font-bold text-center">{idx + 1}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {student.avatar ? (
                        <img
                          src={student.avatar}
                          alt={`Foto ${student.name}`}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
                        />
                      ) : (
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-2xs shrink-0 ${student.gender === 'L' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-pink-500 to-rose-600'}`}>
                          {(student.name || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs font-bold text-slate-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 font-mono tracking-tight">{student.nis}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold rounded-md uppercase tracking-wide">
                      {getClassName(student.classId)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md ${student.gender === 'L' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-pink-50 text-pink-700 border border-pink-100'}`}>
                      {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button 
                        onClick={() => openEditModal(student)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Ubah Data"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      
                      {deleteConfirm === student.id ? (
                        <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
                          <button 
                            onClick={() => handleDelete(student.id)}
                            className="px-2 py-1 bg-rose-600 text-white text-[10px] font-bold rounded-md hover:bg-rose-700 transition shadow-sm"
                          >
                            Ya
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md hover:bg-slate-200 transition"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setDeleteConfirm(student.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center rounded-xl mx-auto mb-3">
                      <Search className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-700">Tidak ada siswa ditemukan</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Coba sesuaikan kata kunci atau filter kelas Anda kembali.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL INTERFACE */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                {editingStudent ? (
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><Edit2 className="w-4 h-4" /></div>
                ) : (
                  <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Plus className="w-4 h-4" /></div>
                )}
                {editingStudent ? 'Sunting Berkas Siswa' : 'Registrasi Siswa Baru'}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Isi Form */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={formName} 
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                  placeholder="Masukkan nama lengkap siswa..." 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nomor Induk Siswa (NIS)</label>
                <input 
                  type="text" 
                  value={formNis} 
                  onChange={e => setFormNis(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono tracking-wide" 
                  placeholder="Contoh: 202601001" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Jenis Kelamin</label>
                  <select 
                    value={formGender} 
                    onChange={e => setFormGender(e.target.value as 'L' | 'P')}
                    className="w-full px-3.5 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer bg-white"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Penempatan Kelas</label>
                  <select 
                    value={formClass} 
                    onChange={e => setFormClass(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-semibold text-slate-600 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer bg-white"
                  >
                    <option value="">Pilih Kelas</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Kata Sandi Akses</label>
                <input 
                  type="text" 
                  value={formPassword} 
                  onChange={e => setFormPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
                />
              </div>
            </div>

            {/* Footer Aksi Modal */}
            <div className="flex justify-end gap-2.5 p-5 border-t border-slate-100 bg-slate-50/70">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold text-xs transition"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-xs transition shadow-sm shadow-blue-600/10"
              >
                {editingStudent ? 'Simpan Perubahan' : 'Daftarkan Siswa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
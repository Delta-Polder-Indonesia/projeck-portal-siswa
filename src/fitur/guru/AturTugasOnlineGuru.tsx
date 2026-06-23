import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  addOnlineAssignment,
  deleteOnlineAssignment,
  getClasses,
  getOnlineAssignmentsByClass,
  getSubmissionsByAssignment,
  getTeachers,
} from '../../data/store';
import { Plus, Trash2, Calendar, ClipboardList, Inbox } from 'lucide-react';
import { useStoreVersion } from '../../hooks/useStoreVersion';

export default function AturTugasOnlineGuru() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Sinkronisasi data manifest kelas binaan guru
  const teacherClasses = useMemo(() => {
    const teacher = getTeachers().find(item => item.id === user?.id);
    return getClasses().filter(item => teacher?.classIds.includes(item.id));
  }, [user, storeVersion]);

  useEffect(() => {
    if (!selectedClassId && teacherClasses.length > 0) {
      setSelectedClassId(teacherClasses[0].id);
    }
  }, [teacherClasses, selectedClassId]);

  const classAssignments = useMemo(
    () => (selectedClassId ? getOnlineAssignmentsByClass(selectedClassId) : []),
    [selectedClassId, storeVersion],
  );

  const handleAddAssignment = () => {
    if (!selectedClassId || !assignmentTitle.trim() || !assignmentDescription.trim() || !assignmentDueDate || !user) return;
    addOnlineAssignment({
      id: `task_${Date.now()}`,
      classId: selectedClassId,
      title: assignmentTitle.trim(),
      description: assignmentDescription.trim(),
      dueDate: assignmentDueDate,
      createdBy: user.id,
      createdAt: Date.now(),
    });
    setAssignmentTitle('');
    setAssignmentDescription('');
  };

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto p-2 antialiased text-slate-600 bg-white selection:bg-slate-200">
      
      {/* HEADER CONTROL BAR */}
      <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Manajemen Penugasan & Tugas Online</h1>
          <p className="text-xs text-slate-400 mt-0.5">Pendistribusian berkas tugas digital, penetapan batas waktu pengumpulan, dan pemantauan respons evaluasi.</p>
        </div>

        {/* Dropdown - Line Style Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Kelas:</label>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-800 outline-none focus:border-slate-900 cursor-pointer transition-colors"
          >
            {teacherClasses.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name.toUpperCase()}</option>
            ))}
            {teacherClasses.length === 0 && <option value="">NULL_CLASS</option>}
          </select>
        </div>
      </div>

      {/* TWO-COLUMN COMMAND WORKSPACE */}
      <div className="grid lg:grid-cols-12 gap-4 items-start">
        
        {/* PANEL KIRI: FORMULIR INPUT EDITOR TUGAS */}
        <section className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs lg:col-span-5 space-y-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            <ClipboardList className="w-3 h-3 text-slate-500" />
            <span>Form_Publish_Assignment</span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Judul Penugasan</label>
            <input
              type="text"
              value={assignmentTitle}
              onChange={e => setAssignmentTitle(e.target.value)}
              placeholder="Ketik nama atau topik penugasan formal..."
              className="w-full px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded text-xs text-slate-800 outline-none placeholder:text-slate-300 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Instruksi / Deskripsi Parameter</label>
            <textarea
              value={assignmentDescription}
              onChange={e => setAssignmentDescription(e.target.value)}
              placeholder="Tulis instruksi langkah pengerjaan tugas atau butir soal di sini..."
              rows={6}
              className="w-full px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded text-xs font-mono text-slate-800 outline-none placeholder:text-slate-300 resize-none leading-relaxed transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Batas Akhir Batas Pengumpulan (Due Date)</label>
            <input
              type="date"
              value={assignmentDueDate}
              onChange={e => setAssignmentDueDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded text-xs font-mono font-bold text-slate-800 outline-none transition-colors"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleAddAssignment}
              disabled={!assignmentTitle.trim() || !assignmentDescription.trim() || !assignmentDueDate}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-950 border border-slate-900 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded text-xs font-bold font-mono transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> INJECT_ASSIGNMENT_DATA
            </button>
          </div>
        </section>

        {/* PANEL KANAN: MANIFEST DAFTAR TUGAS AKTIF */}
        <section className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs lg:col-span-7 flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            <Inbox className="w-3 h-3 text-slate-400" />
            <span>Feed Tugas Terdaftar Aktif ({classAssignments.length})</span>
          </div>

          <div className="space-y-3 max-h-[510px] overflow-y-auto pr-0.5">
            {classAssignments.map(item => {
              const submissionCount = getSubmissionsByAssignment(item.id).length;
              return (
                <div key={item.id} className="border border-slate-200 rounded p-3 bg-white hover:border-slate-300 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-900 tracking-tight">{item.title.toUpperCase()}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-0.5 text-slate-500 font-bold bg-slate-100 px-1 py-0.5 rounded-sm">
                          <Calendar className="w-2.5 h-2.5" /> DUE: {new Date(`${item.dueDate}T00:00:00`).toLocaleDateString('id-ID')}
                        </span>
                        <span>&bull;</span>
                        <span className="text-slate-700 font-bold">{submissionCount} RESPONS_MASUK</span>
                      </div>
                    </div>

                    {/* Button Delete - Line Style Minimalis */}
                    <button
                      type="button"
                      onClick={() => deleteOnlineAssignment(item.id)}
                      className="p-1.5 bg-white border border-slate-200 hover:border-slate-900 text-slate-400 hover:text-slate-900 rounded transition-colors cursor-pointer shrink-0"
                      title="Hapus berkas penugasan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-mono text-slate-700 mt-3 pt-2.5 border-t border-slate-100 whitespace-pre-line leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}

            {classAssignments.length === 0 && (
              <div className="py-20 text-center border border-dashed border-slate-200 rounded bg-slate-50/40">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">EMPTY_ASSIGNMENT_FEED</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Belum ada komparasi data atau tugas online yang ditugaskan di kelas ini.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
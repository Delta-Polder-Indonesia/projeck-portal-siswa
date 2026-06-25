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
    <div className="w-full bg-white p-4 text-xs text-slate-700 antialiased selection:bg-slate-200">
      
      {/* HEADER CONTROL BAR */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-300 pb-3 gap-4">
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-950 uppercase">
            Manajemen Penugasan & Tugas Online
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Pendistribusian berkas tugas digital, penetapan batas waktu pengumpulan, dan pemantauan respons evaluasi.
          </p>
        </div>

        {/* Dropdown Target Kelas */}
        <div className="flex items-center gap-2 border-l border-slate-300 pl-0 sm:pl-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Target Kelas
            </span>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="mt-0.5 cursor-pointer border border-slate-900 bg-white px-2 py-1 text-xs font-bold text-slate-900 uppercase outline-none"
            >
              {teacherClasses.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name.toUpperCase()}</option>
              ))}
              {teacherClasses.length === 0 && <option value="">NULL_CLASS</option>}
            </select>
          </div>
        </div>
      </header>

      {/* TWO-COLUMN COMMAND WORKSPACE */}
      <div className="grid items-start gap-4 pt-4 lg:grid-cols-12">
        
        {/* PANEL KIRI: FORMULIR INPUT EDITOR TUGAS */}
        <section className="space-y-3 border border-slate-300 p-3 lg:col-span-5">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2 text-xs font-bold tracking-wider text-slate-900 uppercase">
            <ClipboardList className="h-4 w-4 text-slate-950" />
            <span>Form Publish Assignment</span>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wide text-slate-600 uppercase">Judul Penugasan</label>
            <input
              type="text"
              value={assignmentTitle}
              onChange={e => setAssignmentTitle(e.target.value)}
              placeholder="Ketik nama atau topik penugasan formal..."
              className="w-full border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-300 focus:border-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wide text-slate-600 uppercase">Instruksi / Deskripsi Parameter</label>
            <textarea
              value={assignmentDescription}
              onChange={e => setAssignmentDescription(e.target.value)}
              placeholder="Tulis instruksi langkah pengerjaan tugas atau burir soal di sini..."
              rows={6}
              className="w-full border border-slate-300 bg-white px-2.5 py-2 text-xs font-mono text-slate-800 outline-none placeholder:text-slate-300 resize-none leading-relaxed focus:border-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wide text-slate-600 uppercase">Batas Akhir Pengumpulan (Due Date)</label>
            <input
              type="date"
              value={assignmentDueDate}
              onChange={e => setAssignmentDueDate(e.target.value)}
              className="w-full border border-slate-300 bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-slate-800 outline-none focus:border-slate-900"
            />
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleAddAssignment}
              disabled={!assignmentTitle.trim() || !assignmentDescription.trim() || !assignmentDueDate}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 border border-slate-900 bg-slate-900 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase transition-colors hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>INJECT_ASSIGNMENT_DATA</span>
            </button>
          </div>
        </section>

        {/* PANEL KANAN: MANIFEST DAFTAR TUGAS AKTIF */}
        <section className="flex flex-col border border-slate-300 p-3 lg:col-span-7">
          <div className="mb-3 flex items-center gap-2 border-b border-slate-900 pb-2 text-xs font-bold tracking-wider text-slate-900 uppercase">
            <Inbox className="h-4 w-4 text-slate-950" />
            <span>Feed Tugas Terdaftar Aktif ({classAssignments.length})</span>
          </div>

          <div className="max-h-[510px] space-y-3 overflow-y-auto pr-0.5">
            {classAssignments.map(item => {
              const submissionCount = getSubmissionsByAssignment(item.id).length;
              return (
                <div key={item.id} className="border border-slate-300 bg-white p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-1.5 truncate">
                      <p className="text-sm font-bold tracking-tight text-slate-900 truncate">
                        {item.title.toUpperCase()}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
                        <span className="border border-rose-200 bg-rose-50 px-1.5 py-0.5 font-mono font-bold text-rose-700 uppercase">
                          DUE: {new Date(`${item.dueDate}T00:00:00`).toLocaleDateString('id-ID')}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-slate-800 uppercase">
                          {submissionCount} RESPONS_MASUK
                        </span>
                      </div>
                    </div>

                    {/* Button Delete - Minimalis Stark */}
                    <button
                      type="button"
                      onClick={() => deleteOnlineAssignment(item.id)}
                      className="shrink-0 cursor-pointer border border-slate-300 bg-white p-1.5 text-slate-500 transition-colors hover:border-rose-600 hover:bg-rose-50 hover:text-rose-600"
                      title="Hapus berkas penugasan"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="mt-3 border-t border-slate-200 pt-2.5 font-mono text-xs leading-relaxed text-slate-700 whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              );
            })}

            {classAssignments.length === 0 && (
              <div className="border border-dashed border-slate-300 bg-slate-50/50 py-20 text-center">
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  EMPTY_ASSIGNMENT_FEED
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Belum ada entri parameter data atau tugas online yang ditugaskan di kelas ini.
                </p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
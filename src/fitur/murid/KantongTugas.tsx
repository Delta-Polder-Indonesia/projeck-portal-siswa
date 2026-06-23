import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getClasses,
  getOnlineAssignmentsByClass,
  getStudents,
  getSubmissionByAssignmentAndStudent,
  upsertAssignmentSubmission,
} from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { FileUp, Send, Loader2, CheckCircle2 } from 'lucide-react';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Gagal membaca berkas dokumen.'));
    reader.readAsDataURL(file);
  });
}

export default function TaskPouchPage() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [answerText, setAnswerText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const student = useMemo(() => getStudents().find(item => item.id === user?.id), [user, storeVersion]);
  
  const assignments = useMemo(() => {
    if (!student) return [];
    return getOnlineAssignmentsByClass(student.classId);
  }, [student, storeVersion]);

  const selectedTask = useMemo(
    () => assignments.find(item => item.id === selectedTaskId),
    [assignments, selectedTaskId],
  );

  const existingSubmission = useMemo(() => {
    if (!user || !selectedTask) return null;
    return getSubmissionByAssignmentAndStudent(selectedTask.id, user.id);
  }, [selectedTask, user, storeVersion]);

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setSaveMessage('');
    const task = assignments.find(item => item.id === taskId);
    if (!task || !user) {
      setAnswerText('');
      setSelectedFile(null);
      return;
    }

    const previous = getSubmissionByAssignmentAndStudent(task.id, user.id);
    setAnswerText(previous?.answerText || '');
    setSelectedFile(null);
  };

  const handleSubmitAnswer = async () => {
    if (!user || !selectedTask || !answerText.trim()) return;
    setIsSaving(true);
    setSaveMessage('');
    try {
      const attachmentDataUrl = selectedFile ? await readFileAsDataUrl(selectedFile) : existingSubmission?.attachmentDataUrl;
      const attachmentName = selectedFile ? selectedFile.name : existingSubmission?.attachmentName;

      upsertAssignmentSubmission({
        id: existingSubmission?.id || `sub_${Date.now()}`,
        assignmentId: selectedTask.id,
        studentId: user.id,
        answerText: answerText.trim(),
        attachmentName,
        attachmentDataUrl,
        submittedAt: Date.now(),
      });
      setSaveMessage('Berhasil: Jawaban tugas Anda telah tersimpan.');
      setSelectedFile(null);
    } catch (error) {
      setSaveMessage('Error: Gagal memproses berkas lampiran. Silakan coba kembali.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 py-4 antialiased text-slate-600 bg-white selection:bg-slate-100">
      
      {/* HEADER HALAMAN */}
      <header className="mb-4 pb-2 border-b border-slate-100">
        <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">Tugas Kuliah / Sekolah</h1>
        <p className="text-[11px] text-slate-400 mt-1 leading-tight">Pilih daftar penugasan aktif di sebelah kiri untuk melihat detail dan mengumpulkan jawaban.</p>
      </header>

      {/* ASYMMETRIC WORKSPACE GRID (5 Kolom : 7 Kolom dengan Gap Rapat) */}
      <div className="grid lg:grid-cols-12 gap-3 items-start">
        
        {/* NAVIGATOR TUGAS (Kiri) */}
        <nav className="lg:col-span-5 flex flex-col">
          <div className="mb-2 border-b border-slate-100 pb-1">
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Daftar Tugas</h2>
          </div>

          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {assignments.map(task => {
              const submitted = user ? getSubmissionByAssignmentAndStudent(task.id, user.id) : null;
              const isSelected = selectedTaskId === task.id;
              
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => handleSelectTask(task.id)}
                  className={`w-full text-left rounded-sm p-2 transition-colors block relative group ${
                    isSelected 
                      ? 'bg-slate-50' 
                      : 'hover:bg-slate-50/50'
                  }`}
                >
                  {/* Penanda baris aktif tipis */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-900" />
                  )}

                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-xs font-semibold leading-tight ${isSelected ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                      {task.title}
                    </p>
                    {submitted && (
                      <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-0.5 shrink-0 leading-none">
                        <CheckCircle2 className="w-3 h-3" /> Selesai
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1 flex flex-col gap-0.5 text-[10px] text-slate-400 leading-none">
                    <p>Batas: {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    {submitted && (
                      <p className="text-slate-400/80">
                        Dikumpul: {new Date(submitted.submittedAt).toLocaleDateString('id-ID')} · {new Date(submitted.submittedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}

            {assignments.length === 0 && (
              <p className="text-[11px] text-slate-400 italic py-2">Tidak ada entri penugasan aktif untuk kelas Anda.</p>
            )}
          </div>
        </nav>

        {/* WORKSPACE PENGISIAN JAWABAN (Kanan) */}
        <main className="lg:col-span-7 border border-slate-100 p-3 bg-slate-50/20 rounded-sm">
          {!selectedTask ? (
            <div className="py-16 text-center border border-dashed border-slate-200 rounded-sm bg-white">
              <p className="text-[11px] text-slate-400">Pilih salah satu tugas di panel kiri untuk mulai mengerjakan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              
              {/* Detail Petunjuk Tugas */}
              <div className="pb-2 border-b border-slate-100 bg-white p-2 border rounded-sm">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-50 pb-1">
                  <h2 className="text-xs font-bold text-slate-900 leading-tight">{selectedTask.title}</h2>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    Tenggat: {new Date(`${selectedTask.dueDate}T00:00:00`).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500 leading-tight whitespace-pre-line font-normal">
                  {selectedTask.description}
                </p>
              </div>

              {/* Form Input Teks */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jawaban Teks</label>
                <textarea
                  value={answerText}
                  onChange={event => setAnswerText(event.target.value)}
                  rows={8}
                  placeholder="Tuliskan lembar jawaban atau deskripsi tugas Anda di sini..."
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-sm text-xs outline-none focus:border-slate-400 focus:bg-white bg-white transition-colors font-sans resize-none leading-tight placeholder:text-slate-300 shadow-inner"
                />
              </div>

              {/* Lampiran File */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lampiran Dokumen</label>
                <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-sm">
                  <label className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-medium text-slate-700 cursor-pointer hover:bg-slate-100 active:bg-slate-200 transition-colors shrink-0">
                    <FileUp className="w-3 h-3 text-slate-400" />
                    <span>Pilih Berkas</span>
                    <input
                      type="file"
                      onChange={event => setSelectedFile(event.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400 truncate max-w-[240px] font-mono">
                    {selectedFile?.name || existingSubmission?.attachmentName || 'Belum ada file terpilih'}
                  </span>
                </div>
              </div>

              {/* Batas Aksi Bawah */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={isSaving || !answerText.trim()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white rounded-sm text-[11px] font-medium hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  {isSaving ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                  <span>{isSaving ? 'Menyimpan...' : 'Kirim Jawaban'}</span>
                </button>

                {saveMessage && (
                  <p className={`text-[11px] font-medium leading-none text-right ${saveMessage.startsWith('Berhasil') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {saveMessage}
                  </p>
                )}
              </div>
              
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
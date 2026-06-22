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
  const classRoom = useMemo(() => {
    if (!student) return undefined;
    return getClasses().find(item => item.id === student.classId);
  }, [student, storeVersion]);

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
      setSaveMessage('Berhasil: Dokumen jawaban tugas telah diarsip ke sistem.');
      setSelectedFile(null);
    } catch (error) {
      setSaveMessage('Error: Gagal memproses berkas lampiran. Silakan coba kembali.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto p-1 antialiased text-slate-600">
      
      {/* Page Header */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-xs">
        <h1 className="text-base font-semibold text-slate-800 tracking-tight">Modul Kantong Tugas Online</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Daftar Kolektif Kelas: <span className="font-medium text-slate-600">{classRoom?.name || '-'}</span> &bull; Repositori penyerahan lembar kerja siswa.
        </p>
      </div>

      {/* Main Workspace Layout Split */}
      <div className="grid lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Assignment Navigator List */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-xs lg:col-span-5 flex flex-col">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Daftar Penugasan</h2>
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {assignments.map(task => {
              const submitted = user ? getSubmissionByAssignmentAndStudent(task.id, user.id) : null;
              const isSelected = selectedTaskId === task.id;
              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => handleSelectTask(task.id)}
                  className={`w-full text-left border rounded-lg p-3 transition-all relative block ${
                    isSelected 
                      ? 'border-slate-800 bg-slate-50 shadow-xs' 
                      : 'border-slate-200/70 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <p className={`text-xs font-semibold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>{task.title}</p>
                    {submitted && (
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-medium px-1.5 py-0.5 rounded-sm flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Selesai
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-0.5 text-[11px] text-slate-400">
                    <p>Batas: {new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    {submitted && (
                      <p className="text-slate-400">
                        Dikirim: {new Date(submitted.submittedAt).toLocaleDateString('id-ID')} &bull; {new Date(submitted.submittedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
            {assignments.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">Tidak ada entri penugasan aktif untuk kelas Anda.</p>
            )}
          </div>
        </div>

        {/* Right Column: Execution Form Panel */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-xs lg:col-span-7">
          {!selectedTask ? (
            <div className="py-12 text-center">
              <p className="text-xs text-slate-400">Silakan pilih salah satu komponen tugas pada panel navigator untuk mulai melakukan pengisian jawaban.</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Task Details Info */}
              <div className="border-b border-slate-100 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-slate-800">{selectedTask.title}</h2>
                  <span className="text-[11px] bg-slate-100 px-2 py-0.5 text-slate-600 rounded font-mono">
                    Limit: {new Date(`${selectedTask.dueDate}T00:00:00`).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500 bg-slate-50/60 p-3 rounded-lg border border-slate-100 whitespace-pre-line leading-relaxed">
                  {selectedTask.description}
                </div>
              </div>

              {/* Text Area Form */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">Lembar Jawaban Teks</label>
                <textarea
                  value={answerText}
                  onChange={event => setAnswerText(event.target.value)}
                  rows={9}
                  placeholder="Ketik deskripsi atau narasi lembar jawaban tugas Anda di sini..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-400 focus:bg-slate-50/20 transition-all font-mono resize-none leading-relaxed"
                />
              </div>

              {/* Document File Attachment Control */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">File Lampiran Dokumen</label>
                <div className="flex items-center gap-2.5 bg-slate-50 p-2 border border-slate-100 rounded-lg">
                  <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors shadow-xs">
                    <FileUp className="w-3.5 h-3.5 text-slate-500" /> Jelajahi Berkas
                    <input
                      type="file"
                      onChange={event => setSelectedFile(event.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-400 truncate max-w-[280px]">
                    {selectedFile?.name || existingSubmission?.attachmentName || 'Tidak ada lampiran tersemat'}
                  </span>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex items-center justify-between gap-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={isSaving || !answerText.trim()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  {isSaving ? 'Menyimpan Record...' : 'Submit ke Sistem'}
                </button>

                {saveMessage && (
                  <p className={`text-xs font-medium ${saveMessage.startsWith('Berhasil') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {saveMessage}
                  </p>
                )}
              </div>
              
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
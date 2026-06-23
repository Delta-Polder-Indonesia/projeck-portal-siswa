import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addSuratIzin, getClasses, getStudents, getSuratIzinByStudent } from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { Send, Upload, Loader2, FileText, Calendar } from 'lucide-react';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Gagal memproses unggahan file.'));
    reader.readAsDataURL(file);
  });
}

export default function KirimSuratMurid() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [type, setType] = useState<'izin' | 'sakit' | 'dispensasi' | 'lainnya'>('izin');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [letterDate, setLetterDate] = useState(new Date().toISOString().split('T')[0]);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const student = useMemo(() => getStudents().find(item => item.id === user?.id), [user, storeVersion]);

  const className = useMemo(() => {
    if (!student) return '-';
    return getClasses().find(item => item.id === student.classId)?.name || '-';
  }, [student, storeVersion]);

  const riwayatSurat = useMemo(() => {
    if (!user) return [];
    return getSuratIzinByStudent(user.id).sort((a, b) => b.createdAt - a.createdAt);
  }, [user, storeVersion]);

  const handleSubmit = async () => {
    if (!user || !student || !subject.trim() || !message.trim()) {
      setFeedback('Error: Judul perihal dan isi surat wajib diisi.');
      return;
    }

    if (attachment && attachment.size > 2 * 1024 * 1024) {
      setFeedback('Error: Ukuran file lampiran tidak boleh melebihi 2MB.');
      return;
    }

    setIsSaving(true);
    setFeedback('');
    try {
      const attachmentDataUrl = attachment ? await readFileAsDataUrl(attachment) : undefined;
      addSuratIzin({
        id: `ltr_${Date.now()}`,
        studentId: student.id,
        classId: student.classId,
        type,
        status: 'menunggu',
        subject: subject.trim(),
        message: message.trim(),
        letterDate,
        attachmentName: attachment?.name,
        attachmentDataUrl,
        createdAt: Date.now(),
      });
      setFeedback('Berhasil: Surat permohonan izin Anda telah dikirim.');
      setSubject('');
      setMessage('');
      setAttachment(null);
    } catch {
      setFeedback('Error: Terjadi kesalahan. Silakan coba kirim kembali.');
    } finally {
      setIsSaving(false);
    }
  };

  const typeLabel: Record<string, string> = {
    izin: 'Izin',
    sakit: 'Sakit',
    dispensasi: 'Dispensasi',
    lainnya: 'Keperluan Lain',
  };

  const statusLabel = {
    menunggu: 'Menunggu Persetujuan',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
  } as const;

  const statusStyle = {
    menunggu: 'text-amber-600 bg-amber-50/50 border-amber-200/40',
    disetujui: 'text-emerald-600 bg-emerald-50/50 border-emerald-200/40',
    ditolak: 'text-rose-600 bg-rose-50/50 border-rose-200/40',
  } as const;

  return (
    <div className="max-w-5xl mx-auto px-3 py-4 antialiased text-slate-600 bg-white selection:bg-slate-100">
      
      {/* HEADER HALAMAN */}
      <header className="mb-4 pb-2 border-b border-slate-100">
        <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">Perizinan & Absensi</h1>
        <p className="text-[11px] text-slate-400 mt-1 leading-tight">Ajukan surat izin berhalangan hadir atau pantau status persetujuan dari wali kelas.</p>
      </header>

      {/* SEJAJAR WORKSPACE GRID (6 Kolom : 6 Kolom dengan Gap Rapat) */}
      <div className="grid lg:grid-cols-12 gap-4 items-start">
        
        {/* FORM PENGAJUAN (Kiri) */}
        <section className="lg:col-span-6 space-y-3 bg-slate-50/30 p-3 border border-slate-100 rounded-sm">
          <div className="border-b border-slate-100 pb-1">
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Formulir Pengajuan</h2>
          </div>
          
          {/* Informasi Identitas Ringkas & Padat */}
          <div className="grid grid-cols-3 gap-2 border-b border-slate-200/60 pb-2 text-[11px]">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-medium">Nama</span>
              <span className="font-semibold text-slate-800 block truncate leading-tight">{student?.name || '-'}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-medium">NIS</span>
              <span className="font-mono text-slate-700 block leading-tight">{student?.nis || '-'}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-medium">Kelas</span>
              <span className="font-medium text-slate-700 block leading-tight">{className}</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanggal Izin</label>
              <input
                type="date"
                value={letterDate}
                onChange={event => setLetterDate(event.target.value)}
                className="w-full px-2 py-1 border border-slate-200 rounded-sm text-xs outline-none focus:border-slate-400 focus:bg-white bg-white transition-colors text-slate-700 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori Izin</label>
              <select
                value={type}
                onChange={event => setType(event.target.value as 'izin' | 'sakit' | 'dispensasi' | 'lainnya')}
                className="w-full px-2 py-1 border border-slate-200 rounded-sm text-xs outline-none focus:border-slate-400 focus:bg-white bg-white transition-colors text-slate-700 appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em' }}
              >
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
                <option value="dispensasi">Dispensasi</option>
                <option value="lainnya">Urusan Keluarga / Lainnya</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Perihal / Alasan Utama</label>
            <input
              type="text"
              value={subject}
              onChange={event => setSubject(event.target.value)}
              placeholder="Contoh: Surat keterangan sakit dari dokter klinik"
              className="w-full px-2 py-1 border border-slate-200 rounded-sm text-xs outline-none focus:border-slate-400 focus:bg-white bg-white transition-colors text-slate-700 placeholder:text-slate-300"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Isi Surat / Penjelasan Detail</label>
            <textarea
              rows={4}
              value={message}
              onChange={event => setMessage(event.target.value)}
              placeholder="Tuliskan alasan ketidakhadiran Anda secara ringkas dan jelas di sini..."
              className="w-full px-2 py-1.5 border border-slate-200 rounded-sm text-xs outline-none focus:border-slate-400 focus:bg-white bg-white transition-colors text-slate-700 resize-none leading-tight placeholder:text-slate-300 shadow-inner"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unggah Bukti Pendukung (PDF/Foto max 2MB)</label>
            <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-sm">
              <label className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors shrink-0">
                <Upload className="w-3 h-3 text-slate-400" />
                <span>Pilih Dokumen</span>
                <input type="file" className="hidden" onChange={event => setAttachment(event.target.files?.[0] || null)} />
              </label>
              <span className="text-[11px] text-slate-400 truncate max-w-[200px] font-mono">
                {attachment?.name || 'Belum ada file terpilih'}
              </span>
            </div>
          </div>

          {/* Tombol Aksi Bawah */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white rounded-sm text-[11px] font-medium hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              <span>{isSaving ? 'Mengirim...' : 'Kirim Surat'}</span>
            </button>

            {feedback && (
              <p className={`text-[11px] font-medium leading-none text-right ${feedback.startsWith('Berhasil') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {feedback}
              </p>
            )}
          </div>
        </section>

        {/* LOG RIWAYAT SURAT (Kanan) */}
        <section className="lg:col-span-6 flex flex-col space-y-3">
          <div className="border-b border-slate-100 pb-1">
            <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Riwayat Pengajuan</h2>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {riwayatSurat.map((item) => (
              <div key={item.id} className="p-2 border border-slate-100 bg-slate-50/20 rounded-sm relative group">
                
                <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-1">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">{item.subject}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 leading-none">
                      <span className="font-bold text-slate-500 bg-slate-100 px-1 py-0.2 rounded-sm text-[9px] uppercase tracking-wide">{typeLabel[item.type]}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 font-mono">
                        <Calendar className="w-2.5 h-2.5 text-slate-300" />
                        <span>Izin: {new Date(`${item.letterDate}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Minimalis Padat */}
                  <span className={`px-1.5 py-0.5 rounded-sm border text-[10px] font-bold shrink-0 leading-none ${statusStyle[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mt-1.5 leading-tight whitespace-pre-line font-normal">
                  {item.message}
                </p>
                
                <div className="mt-2 pt-1 border-t border-slate-100/60 flex items-center justify-between text-[10px] text-slate-400 font-mono leading-none">
                  <span className="flex items-center gap-0.5 max-w-[60%]">
                    <FileText className="w-2.5 h-2.5 text-slate-300 shrink-0" />
                    <span className="truncate">{item.attachmentName || 'Tanpa lampiran'}</span>
                  </span>
                  <span className="shrink-0">Dibuat: {new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            ))}
            
            {riwayatSurat.length === 0 && (
              <p className="text-[11px] text-slate-400 italic py-2">Belum ada riwayat pengajuan surat izin.</p>
            )}
          </div>
        </section>
        
      </div>
    </div>
  );
}
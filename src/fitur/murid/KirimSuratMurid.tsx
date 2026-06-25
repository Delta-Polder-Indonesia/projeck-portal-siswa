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
    menunggu: 'text-amber-700 bg-amber-50 border-amber-200',
    disetujui: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    ditolak: 'text-rose-700 bg-rose-50 border-rose-200',
  } as const;

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto p-2 antialiased text-slate-600 bg-white selection:bg-slate-200">

      {/* HEADER HALAMAN */}
      <header className="pb-3 border-b border-slate-100">
        <h1 className="text-sm font-bold text-slate-900 uppercase tracking-wide leading-none">Perizinan & Absensi</h1>
        <p className="text-[11px] text-slate-400 mt-1 leading-none">Ajukan surat izin berhalangan hadir atau pantau status persetujuan dari wali kelas.</p>
      </header>

      {/* SEJAJAR WORKSPACE GRID */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">

        {/* FORM PENGAJUAN (Kiri) - PERUBAHAN: Dipersempit/dipadatkan menjadi lg:col-span-5 */}
        <section className="lg:col-span-5 space-y-4">
          <div className="border-b border-slate-100 pb-1.5">
            <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">Formulir Pengajuan</h2>
          </div>

          {/* Informasi Identitas */}
          <div className="grid grid-cols-3 gap-3 border border-slate-100 rounded-md p-3 bg-slate-50/50">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Nama Siswa</span>
              <span className="font-semibold text-slate-800 block truncate text-xs">{student?.name || '-'}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">NIS</span>
              <span className="font-mono font-medium text-slate-800 block text-xs">{student?.nis || '-'}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Kelas</span>
              <span className="font-semibold text-slate-800 block text-xs font-mono">{className}</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Tanggal Izin</label>
              <input
                type="date"
                value={letterDate}
                onChange={event => setLetterDate(event.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500 bg-white transition-colors text-slate-800 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Kategori Izin</label>
              <select
                value={type}
                onChange={event => setType(event.target.value as 'izin' | 'sakit' | 'dispensasi' | 'lainnya')}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500 bg-white transition-colors text-slate-800 font-medium appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
              >
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
                <option value="dispensasi">Dispensasi</option>
                <option value="lainnya">Urusan Keluarga / Lainnya</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Perihal / Alasan Utama</label>
            <input
              type="text"
              value={subject}
              onChange={event => setSubject(event.target.value)}
              placeholder="Contoh: Surat keterangan sakit dari dokter klinik"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500 bg-white transition-colors text-slate-800 placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Isi Surat / Penjelasan Detail</label>
            <textarea
              rows={5}
              value={message}
              onChange={event => setMessage(event.target.value)}
              placeholder="Tuliskan alasan ketidakhadiran Anda secara ringkas dan jelas di sini..."
              className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs outline-none focus:border-blue-500 bg-white transition-colors text-slate-800 resize-none placeholder:text-slate-400 font-medium leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Unggah Bukti Pendukung (PDF/Foto max 2MB)</label>
            <div className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 rounded-md">
              <label className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-md text-[11px] font-medium text-slate-600 cursor-pointer hover:bg-slate-200/70 transition-colors shrink-0 select-none">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Pilih Dokumen</span>
                <input type="file" className="hidden" onChange={event => setAttachment(event.target.files?.[0] || null)} />
              </label>
              <span className="text-[11px] text-slate-400 truncate max-w-[240px] font-mono">
                {attachment?.name || 'Belum ada file terpilih'}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>{isSaving ? 'Mengirim Surat...' : 'Kirim Surat'}</span>
            </button>

            {feedback && (
              <p className={`text-[11px] font-bold font-mono ${feedback.startsWith('Berhasil') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {feedback}
              </p>
            )}
          </div>
        </section>

        {/* LOG RIWAYAT SURAT (Kanan) - PERUBAHAN: Diperlebar menjadi lg:col-span-7 */}
        <section className="lg:col-span-7 flex flex-col space-y-3">
          <div className="border-b border-slate-100 pb-1.5">
            <h2 className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">Riwayat Pengajuan</h2>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
            {riwayatSurat.map((item) => (
              <div key={item.id} className="p-3 border border-slate-100 bg-white rounded-md transition-shadow hover:shadow-sm relative">

                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0 space-y-1">
                    <h3 className="text-xs font-bold text-slate-800 leading-tight truncate">{item.subject}</h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-400">
                      <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">
                        {typeLabel[item.type]}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Izin: {new Date(`${item.letterDate}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-md border text-[9px] font-bold shrink-0 tracking-wide ${statusStyle[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-2.5 border-t border-slate-50 pt-2 leading-relaxed whitespace-pre-line">
                  {item.message}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1 max-w-[60%]">
                    <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{item.attachmentName || 'Tanpa lampiran'}</span>
                  </span>
                  <span className="shrink-0">Dibuat: {new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            ))}

            {riwayatSurat.length === 0 && (
              <div className="text-center py-10 bg-slate-50/40 rounded-md border border-dashed border-slate-200">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">— Belum ada riwayat pengajuan —</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
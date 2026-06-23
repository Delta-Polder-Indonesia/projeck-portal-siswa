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
    <div className="w-full h-full p-6 md:p-8 lg:p-10 antialiased text-slate-700 bg-white">

      {/* HEADER HALAMAN */}
      <header className="mb-8 pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Perizinan & Absensi</h1>
        <p className="text-sm text-slate-500 mt-2">Ajukan surat izin berhalangan hadir atau pantau status persetujuan dari wali kelas.</p>
      </header>

      {/* SEJAJAR WORKSPACE GRID */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">

        {/* FORM PENGAJUAN (Kiri) */}
        <section className="lg:col-span-7 space-y-6">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Formulir Pengajuan</h2>
          </div>

          {/* Informasi Identitas */}
          <div className="grid grid-cols-3 gap-4 border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div>
              <span className="block text-xs text-slate-500 uppercase font-semibold mb-1">Nama Siswa</span>
              <span className="font-semibold text-slate-900 block truncate text-sm">{student?.name || '-'}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 uppercase font-semibold mb-1">NIS</span>
              <span className="font-mono font-medium text-slate-900 block text-sm">{student?.nis || '-'}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 uppercase font-semibold mb-1">Kelas</span>
              <span className="font-semibold text-slate-900 block text-sm">{className}</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Tanggal Izin</label>
              <input
                type="date"
                value={letterDate}
                onChange={event => setLetterDate(event.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white transition-all text-slate-800 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Kategori Izin</label>
              <select
                value={type}
                onChange={event => setType(event.target.value as 'izin' | 'sakit' | 'dispensasi' | 'lainnya')}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white transition-all text-slate-800 font-medium appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
              >
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
                <option value="dispensasi">Dispensasi</option>
                <option value="lainnya">Urusan Keluarga / Lainnya</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Perihal / Alasan Utama</label>
            <input
              type="text"
              value={subject}
              onChange={event => setSubject(event.target.value)}
              placeholder="Contoh: Surat keterangan sakit dari dokter klinik"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white transition-all text-slate-800 placeholder:text-slate-400 font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Isi Surat / Penjelasan Detail</label>
            <textarea
              rows={5}
              value={message}
              onChange={event => setMessage(event.target.value)}
              placeholder="Tuliskan alasan ketidakhadiran Anda secara ringkas dan jelas di sini..."
              className="w-full px-3 py-2.5 border border-slate-300 rounded-md text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 bg-white transition-all text-slate-800 resize-y placeholder:text-slate-400 font-medium leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Unggah Bukti Pendukung (PDF/Foto max 2MB)</label>
            <div className="flex items-center gap-3 bg-white border border-slate-200 p-2 rounded-md">
              <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-300 rounded text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors shrink-0">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Pilih Dokumen</span>
                <input type="file" className="hidden" onChange={event => setAttachment(event.target.files?.[0] || null)} />
              </label>
              <span className="text-sm text-slate-500 truncate max-w-[250px] font-mono">
                {attachment?.name || 'Belum ada file terpilih'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-md text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>{isSaving ? 'Mengirim Surat...' : 'Kirim Surat'}</span>
            </button>

            {feedback && (
              <p className={`text-sm font-semibold ${feedback.startsWith('Berhasil') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {feedback}
              </p>
            )}
          </div>
        </section>

        {/* LOG RIWAYAT SURAT (Kanan) */}
        <section className="lg:col-span-5 flex flex-col space-y-4">
          <div className="mb-2 border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Riwayat Pengajuan</h2>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {riwayatSurat.map((item) => (
              <div key={item.id} className="p-4 border border-slate-200 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow relative group">

                <div className="flex justify-between items-start gap-4 mb-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">{item.subject}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] uppercase tracking-wide border border-slate-200">
                        {typeLabel[item.type]}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Izin: {new Date(`${item.letterDate}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-1 rounded border text-xs font-bold leading-none ${statusStyle[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mt-3 leading-relaxed whitespace-pre-line">
                  {item.message}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5 max-w-[60%]">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.attachmentName || 'Tanpa lampiran'}</span>
                  </span>
                  <span className="shrink-0">Dibuat: {new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            ))}

            {riwayatSurat.length === 0 && (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <p className="text-sm text-slate-500 font-medium">Belum ada riwayat pengajuan surat izin.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
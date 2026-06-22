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
      setFeedback('Error: Formulir perihal dan deskripsi surat wajib dilengkapi.');
      return;
    }

    if (attachment && attachment.size > 2 * 1024 * 1024) {
      setFeedback('Error: Batas kapasitas ukuran dokumen lampiran maksimal 2MB.');
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
      setFeedback('Berhasil: Dokumen permohonan izin telah terkirim ke wali kelas.');
      setSubject('');
      setMessage('');
      setAttachment(null);
    } catch {
      setFeedback('Error: Terjadi kegagalan sistem. Sila lakukan pengiriman ulang.');
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
    menunggu: 'Menunggu Verifikasi',
    disetujui: 'Disetujui',
    ditolak: 'Ditolak',
  } as const;

  const statusStyle = {
    menunggu: 'bg-amber-50 text-amber-800 border-amber-200/60',
    disetujui: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
    ditolak: 'bg-rose-50 text-rose-800 border-rose-200/60',
  } as const;

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto p-1 antialiased text-slate-600">
      
      {/* Header Panel */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-xs">
        <h1 className="text-base font-semibold text-slate-800 tracking-tight">Pusat Pengajuan Diskonpensasi & Izin Digital</h1>
        <p className="text-xs text-slate-400 mt-0.5">Media pelaporan status absensi, kondisi kesehatan, dan korespondensi izin siswa ke dewan pengajar.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Form Application */}
        <section className="bg-white rounded-xl border border-slate-200/60 shadow-xs p-4 lg:col-span-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Formulir Pengajuan</h2>
          
          {/* Metadata Display Readonly */}
          <div className="grid sm:grid-cols-3 gap-3 bg-slate-50/60 p-3 rounded-lg border border-slate-100">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Nama Lengkap</label>
              <p className="text-xs font-medium text-slate-700 truncate">{student?.name || '-'}</p>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Nomor Induk (NIS)</label>
              <p className="text-xs font-mono font-medium text-slate-700">{student?.nis || '-'}</p>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-0.5">Kelas</label>
              <p className="text-xs font-medium text-slate-700">{className}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">Tanggal Berhalangan</label>
              <div className="relative">
                <input
                  type="date"
                  value={letterDate}
                  onChange={event => setLetterDate(event.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-400 transition-all text-slate-700 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-700">Klasifikasi Keterangan</label>
              <select
                value={type}
                onChange={event => setType(event.target.value as 'izin' | 'sakit' | 'dispensasi' | 'lainnya')}
                className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-400 transition-all text-slate-700 bg-white appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
              >
                <option value="izin">Izin Khas</option>
                <option value="sakit">Kondisi Sakit (Medis)</option>
                <option value="dispensasi">Dispensasi Tugas Sekolah</option>
                <option value="lainnya">Lain-lain / Urusan Keluarga</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Perihal / Subjek</label>
            <input
              type="text"
              value={subject}
              onChange={event => setSubject(event.target.value)}
              placeholder="Contoh: Permohonan izin rawat inap rumah sakit"
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-400 transition-all text-slate-700 placeholder:text-slate-300"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">Detail Justifikasi / Isi Surat</label>
            <textarea
              rows={6}
              value={message}
              onChange={event => setMessage(event.target.value)}
              placeholder="Sebutkan rincian alasan berhalangan secara formal, objektif dan jelas."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-400 transition-all text-slate-700 resize-none leading-relaxed placeholder:text-slate-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">Unggah Berkas Pendukung (Format PDF / Image max 2MB)</label>
            <div className="flex items-center gap-3 bg-slate-50 p-2 border border-slate-100 rounded-lg">
              <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors shadow-xs">
                <Upload className="w-3.5 h-3.5 text-slate-400" /> Pilih Dokumen
                <input type="file" className="hidden" onChange={event => setAttachment(event.target.files?.[0] || null)} />
              </label>
              <span className="text-xs text-slate-400 truncate max-w-[240px]">
                {attachment?.name || 'Belum bersampul berkas fisik'}
              </span>
            </div>
          </div>

          {/* Action Footer Button */}
          <div className="pt-2 flex items-center justify-between gap-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              {isSaving ? 'Memproses Berkas...' : 'Kirim Pengajuan'}
            </button>

            {feedback && (
              <p className={`text-xs font-medium ${feedback.startsWith('Berhasil') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {feedback}
              </p>
            )}
          </div>
        </section>

        {/* Right Column: Historical Ledger Logs */}
        <section className="bg-white rounded-xl border border-slate-200/60 shadow-xs p-4 lg:col-span-6 flex flex-col">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Log Riwayat Surat Absensi</h2>
          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {riwayatSurat.map((item) => (
              <div key={item.id} className="border border-slate-100 rounded-lg p-3 bg-white hover:border-slate-200 transition-colors">
                
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-700">{item.subject}</h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-medium text-slate-500">{typeLabel[item.type]}</span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-300" /> Target: {new Date(`${item.letterDate}T00:00:00`).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  
                  {/* Small Micro pill border status badge */}
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-medium shrink-0 ${statusStyle[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-2 bg-slate-50/50 p-2 rounded border border-slate-100/70 whitespace-pre-line leading-relaxed">
                  {item.message}
                </p>
                
                <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-300" /> Lampiran: <span className="max-w-[150px] truncate">{item.attachmentName || '-'}</span>
                  </span>
                  <span>Dikirim: {new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                </div>
              </div>
            ))}
            
            {riwayatSurat.length === 0 && (
              <div className="py-12 text-center text-xs text-slate-400">
                Belum terdapat rekaman arsip surat keluar dari akun Anda.
              </div>
            )}
          </div>
        </section>
        
      </div>
    </div>
  );
}
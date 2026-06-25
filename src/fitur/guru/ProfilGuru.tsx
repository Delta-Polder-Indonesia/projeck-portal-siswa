import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTeachers, updateTeacher } from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { Camera, Save, Loader2, X, CheckCircle, AlertCircle, User, AtSign, Phone, BookOpen, Fingerprint } from 'lucide-react';
import ModalPotongFoto from '../bersama/ModalPotongFoto';
import { bacaFileSebagaiDataUrl } from '../../utils/gambar';

interface TeacherProfileFormData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  subject: string;
  address: string;
}

export default function TeacherProfilePage() {
  const { user, refreshUser } = useAuth();
  const storeVersion = useStoreVersion();
  
  const teacher = useMemo(() => 
    getTeachers().find(t => t.id === user?.id), 
    [user, storeVersion]
  );

  const [formData, setFormData] = useState<TeacherProfileFormData>({
    name: '', email: '', phone: '', whatsapp: '', subject: '', address: ''
  });
  
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);
  const [bukaPotongFoto, setBukaPotongFoto] = useState(false);
  const [sumberFotoPotong, setSumberFotoPotong] = useState('');

  const resetForm = useCallback(() => {
    if (!teacher) return;
    setFormData({
      name: teacher.name || '',
      email: teacher.email || '',
      phone: teacher.phone || '',
      whatsapp: teacher.whatsapp || '',
      subject: teacher.subject || '',
      address: teacher.address || '',
    });
    setAvatarPreview(teacher.avatar || '');
    setIsDirty(false);
  }, [teacher]);

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const handleUploadAvatar = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'File harus berupa gambar', type: 'error' });
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ text: 'Ukuran file maksimal 5MB', type: 'error' });
      event.target.value = '';
      return;
    }
    try {
      setIsUploadingAvatar(true);
      const dataUrl = await bacaFileSebagaiDataUrl(file);
      setSumberFotoPotong(dataUrl);
      setBukaPotongFoto(true);
    } catch {
      setMessage({ text: 'Upload foto gagal', type: 'error' });
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
    }
  }, []);

  const handleSaveProfile = useCallback(async () => {
    if (!teacher) return;
    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 500));
      updateTeacher({
        ...teacher,
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        whatsapp: formData.whatsapp.trim() || undefined,
        subject: formData.subject.trim() || undefined,
        address: formData.address.trim() || undefined,
        avatar: avatarPreview || undefined,
      });
      refreshUser();
      setIsDirty(false);
      setMessage({ text: 'Profil berhasil diperbarui', type: 'success' });
    } catch {
      setMessage({ text: 'Gagal menyimpan profil', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  }, [teacher, formData, avatarPreview, refreshUser]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6 text-slate-800">
      {/* Floating Alert */}
      {message && (
        <div className={`rounded-2xl p-4 flex items-center justify-between shadow-sm border transition-all ${
          message.type === 'success' ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800' : 'bg-rose-50/80 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-3">
            {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
          <button onClick={() => setMessage(null)} className="hover:opacity-70 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Banner dengan Background Image sesuai Vite Base URL */}
      <section className="bg-gradient-to-r from-blue-600 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div 
          className="h-32 md:h-44 relative"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL}images/Dashboard/logo-profile.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 25%',
            backgroundRepeat: 'no-repeat',
          }}
        >
        </div>
        
        <div className="px-6 md:px-8 pb-6 -mt-12 md:-mt-14 relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            {/* Avatar Upload */}
            <div className="relative group shadow-xl rounded-full border-4 border-white bg-white overflow-hidden w-28 h-28 md:w-32 md:h-32 shrink-0">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold">
                  {(teacher?.name || '?').charAt(0).toUpperCase()}
                </div>
              )}
              <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                <Camera className="w-7 h-7 text-white" />
                <input type="file" accept="image/*" onChange={handleUploadAvatar} className="hidden" disabled={isUploadingAvatar} />
              </label>
            </div>
            <div className="sm:mb-2 text-center sm:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-black">{teacher?.name || 'Nama Guru'}</h2>
              <p className="text-sm text-black font-medium mt-0.5">
                Guru {teacher?.subject || '-'} • NIP {teacher?.nip || '-'}
              </p>
            </div>
          </div>

          {/* Tombol Tambahan: Ganti Foto Profil */}
          <label className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm border transition-all duration-200 cursor-pointer ${
            isUploadingAvatar 
              ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' 
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
          }`}>
            {isUploadingAvatar ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Memproses...</>
            ) : (
              <><Camera className="w-4 h-4 text-slate-500" />Ganti Foto Profil</>
            )}
            <input type="file" accept="image/*" onChange={handleUploadAvatar} className="hidden" disabled={isUploadingAvatar} />
          </label>
        </div>
      </section>

      {/* Grid: Detail Kiri + Form Kanan */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Kiri: Detail Data */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Profil</h3>
          </div>
          <div className="space-y-3.5 text-sm">
            {[
              { label: 'Nama Lengkap', value: teacher?.name, icon: <User className="w-4 h-4 text-slate-400" /> },
              { label: 'NIP', value: teacher?.nip || 'Belum diisi', isItalic: !teacher?.nip, icon: <Fingerprint className="w-4 h-4 text-slate-400" /> },
              { label: 'Email', value: teacher?.email || 'Belum diisi', isItalic: !teacher?.email, icon: <AtSign className="w-4 h-4 text-slate-400" /> },
              { label: 'No. Telepon', value: teacher?.phone || 'Belum diisi', isItalic: !teacher?.phone, icon: <Phone className="w-4 h-4 text-slate-400" /> },
              { label: 'WhatsApp', value: teacher?.whatsapp || 'Belum diisi', isItalic: !teacher?.whatsapp, icon: <Phone className="w-4 h-4 text-slate-400" /> },
              { label: 'Mata Pelajaran', value: teacher?.subject || 'Belum diisi', isItalic: !teacher?.subject, icon: <BookOpen className="w-4 h-4 text-slate-400" /> },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50/60 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">{item.icon}</div>
                <div>
                  <span className="block text-xs font-medium text-slate-400">{item.label}</span>
                  <span className={`text-slate-700 font-semibold mt-0.5 block ${item.isItalic ? 'text-slate-300 italic font-normal' : ''}`}>
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kanan: Form Edit */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Pengaturan Profil</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  setIsDirty(true);
                }}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 focus:bg-white transition-all"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => { setFormData(prev => ({ ...prev, email: e.target.value })); setIsDirty(true); }}
                  placeholder="nama@domain.com"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Nomor Telepon</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => { setFormData(prev => ({ ...prev, phone: e.target.value })); setIsDirty(true); }}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">WhatsApp</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={e => { setFormData(prev => ({ ...prev, whatsapp: e.target.value })); setIsDirty(true); }}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Mata Pelajaran</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={e => { setFormData(prev => ({ ...prev, subject: e.target.value })); setIsDirty(true); }}
                  placeholder="Matematika, Bahasa Indonesia, dll"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Alamat Lengkap</label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={e => { setFormData(prev => ({ ...prev, address: e.target.value })); setIsDirty(true); }}
                placeholder="Tuliskan alamat domisili..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            {isDirty && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
              >
                Batalkan
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving || !isDirty}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                isSaving || !isDirty
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600'
              }`}
            >
              {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Menyimpan...</> : <><Save className="w-4 h-4" />Simpan Perubahan</>}
            </button>
          </div>
        </div>
      </div>

      <ModalPotongFoto
        open={bukaPotongFoto}
        sumberGambar={sumberFotoPotong}
        judul="Sesuaikan Foto Profil Anda"
        warnaAksen="biru"
        onBatal={() => { setBukaPotongFoto(false); setSumberFotoPotong(''); }}
        onSimpan={(avatar) => {
          setAvatarPreview(avatar);
          if (teacher) {
            updateTeacher({ ...teacher, avatar });
            refreshUser();
          }
          setBukaPotongFoto(false);
          setSumberFotoPotong('');
          setMessage({ text: 'Foto profil berhasil diperbarui', type: 'success' });
        }}
      />
    </div>
  );
}
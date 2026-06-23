import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getClasses, getStudents, updateStudent } from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { Camera, Save, Loader2, X, CheckCircle, AlertCircle, User, AtSign, Phone, MapPin } from 'lucide-react';
import ModalPotongFoto from '../bersama/ModalPotongFoto';
import { bacaFileSebagaiDataUrl } from '../../utils/gambar';

// Types
interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  parentName: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  parentName?: string;
}

type MessageType = 'success' | 'error';

interface MessageState {
  text: string;
  type: MessageType;
}

// Constants
const DEFAULT_AVATAR = '/default-avatar.png';
const MESSAGE_DURATION = 3000;

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const storeVersion = useStoreVersion();
  
  // Data Fetching
  const student = useMemo(() => 
    getStudents().find(item => item.id === user?.id), 
    [user, storeVersion]
  );
  
  const className = useMemo(() => {
    if (!student) return '-';
    return getClasses().find(item => item.id === student.classId)?.name || '-';
  }, [student, storeVersion]);

  // Form State
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    parentName: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);
  
  // Avatar State
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [sumberFotoPotong, setSumberFotoPotong] = useState('');
  const [bukaPotongFoto, setBukaPotongFoto] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (!student) return;
    
    setFormData({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      address: student.address || '',
      parentName: student.parentName || '',
    });
    setAvatarPreview(student.avatar || '');
    setIsDirty(false);
  }, [student]);

  // Auto-dismiss message
  useEffect(() => {
    if (!message) return;
    
    const timer = setTimeout(() => setMessage(null), MESSAGE_DURATION);
    return () => clearTimeout(timer);
  }, [message]);

  // Warn before unload if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Validation
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nama minimal 3 karakter';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (formData.phone) {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 13) {
        newErrors.phone = 'Nomor WhatsApp harus 10-13 digit';
      }
    }
    
    if (formData.address && formData.address.length > 500) {
      newErrors.address = 'Alamat maksimal 500 karakter';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handlers
  const handleInputChange = useCallback((field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleUploadAvatar = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'File harus berupa gambar (JPG, PNG, atau GIF)', type: 'error' });
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
    } catch (error) {
      setMessage({ text: 'Upload foto gagal. Silakan coba file lain.', type: 'error' });
    } finally {
      setIsUploadingAvatar(false);
      event.target.value = '';
    }
  }, []);

  const handleSimpanFotoPotong = useCallback((avatar: string) => {
    if (!student) return;
    
    setAvatarPreview(avatar);
    setIsDirty(true);
    
    updateStudent({
      ...student,
      ...formData,
      name: formData.name.trim() || student.name,
      avatar,
    });
    
    refreshUser();
    setBukaPotongFoto(false);
    setSumberFotoPotong('');
    setMessage({ text: 'Foto profil berhasil diperbarui', type: 'success' });
  }, [student, formData, refreshUser]);

  const handleSaveProfile = useCallback(async () => {
    if (!student) return;
    
    if (!validateForm()) {
      setMessage({ text: 'Mohon periksa kembali data yang dimasukkan', type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateStudent({
        ...student,
        name: formData.name.trim() || student.name,
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        parentName: formData.parentName.trim() || undefined,
        avatar: avatarPreview || undefined,
      });
      
      refreshUser();
      setIsDirty(false);
      setMessage({ text: 'Profil berhasil diperbarui', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Gagal menyimpan profil. Silakan coba lagi.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  }, [student, formData, avatarPreview, validateForm, refreshUser]);

  const handleBatalPotong = useCallback(() => {
    setBukaPotongFoto(false);
    setSumberFotoPotong('');
  }, []);

  if (!student) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-2xl border border-dashed border-gray-200 m-4">
        <div className="text-center p-6 max-w-sm">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <p className="text-gray-700 font-medium mb-1">Profil Tidak Ditemukan</p>
          <p className="text-sm text-gray-500">Data siswa gagal dimuat atau sesi Anda telah berakhir.</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6 text-slate-800">
 
      {/* Floating Alert Notification */}
      {message && (
        <div className={`rounded-2xl p-4 flex items-center justify-between shadow-sm border transition-all duration-300 ${
          message.type === 'success' ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800' : 'bg-rose-50/80 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-3">
            {message.type === 'success' ? (
              <div className="p-1 bg-emerald-500 text-white rounded-full"><CheckCircle className="w-4 h-4" /></div>
            ) : (
              <div className="p-1 bg-rose-500 text-white rounded-full"><AlertCircle className="w-4 h-4" /></div>
            )}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Profile Banner Card */}
      <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-32 md:h-44 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative opacity-95">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
        </div>
        
        <div className="px-6 md:px-8 pb-6 -mt-12 md:-mt-14 relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="relative group shadow-xl rounded-full border-4 border-white bg-white overflow-hidden w-28 h-28 md:w-32 md:h-32">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  onError={(e) => { e.currentTarget.src = DEFAULT_AVATAR; }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-3xl font-bold">
                  {getInitials(student.name)}
                </div>
              )}
              <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-200">
                <Camera className="w-7 h-7 text-white" />
                <input type="file" accept="image/*" onChange={handleUploadAvatar} className="hidden" disabled={isUploadingAvatar} />
              </label>
            </div>
            
            <div className="sm:mb-2">
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">{student.name}</h2>
              <p className="text-sm text-slate-400 font-medium mt-0.5">Kelas {className} &bull; NIS {student.nis}</p>
            </div>
          </div>

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

      {/* Main Grid Content */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Detail Overview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-1.5 h-5 bg-emerald-500 rounded-full" />
            <h3 className="font-bold text-slate-800">Detail Data Saat Ini</h3>
          </div>
          
          <div className="space-y-3.5 text-sm">
            {[
              { label: 'Nama Lengkap', value: student.name, icon: <User className="w-4 h-4 text-slate-400" /> },
              { label: 'Nomor Induk Siswa (NIS)', value: student.nis, icon: <span className="text-xs font-bold text-slate-400">ID</span> },
              { label: 'Kelas Aktif', value: className, icon: <span className="text-xs font-bold text-slate-400">RM</span> },
              { label: 'Jenis Kelamin', value: student.gender === 'L' ? 'Laki-laki' : 'Perempuan', icon: <span className="text-xs font-bold text-slate-400">JK</span> },
              { label: 'Alamat Surel (Email)', value: student.email || 'Belum diisi', isItalic: !student.email, icon: <AtSign className="w-4 h-4 text-slate-400" /> },
              { label: 'No. WhatsApp', value: student.phone || 'Belum diisi', isItalic: !student.phone, icon: <Phone className="w-4 h-4 text-slate-400" /> },
              { label: 'Orang Tua / Wali', value: student.parentName || 'Belum diisi', isItalic: !student.parentName, icon: <User className="w-4 h-4 text-slate-400" /> },
              { label: 'Alamat Rumah', value: student.address || 'Belum diisi', isItalic: !student.address, icon: <MapPin className="w-4 h-4 text-slate-400" /> },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50/60 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
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

        {/* Right Side: Interactive Form */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-7 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-1.5 h-5 bg-teal-500 rounded-full" />
            <h3 className="font-bold text-slate-800">Modifikasi Pengaturan Profil</h3>
          </div>
          
          <div className="space-y-4">
            {/* Input Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-all ${
                  errors.name 
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 bg-rose-50/10' 
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white bg-slate-50/50'
                }`}
                placeholder="Masukkan nama lengkap Anda"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                </p>
              )}
            </div>

            {/* Twin Row Grid (Email & WhatsApp) */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="nama@domain.com"
                  className={`w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none transition-all ${
                    errors.email 
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                      : 'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-slate-50/50 focus:bg-white'
                  }`}
                />
                {errors.email && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Nomor WhatsApp</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className={`w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none transition-all ${
                    errors.phone 
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                      : 'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-slate-50/50 focus:bg-white'
                  }`}
                />
                {errors.phone && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.phone}</p>}
              </div>
            </div>

            {/* Input Parent Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Nama Orang Tua / Wali</label>
              <input
                type="text"
                value={formData.parentName}
                onChange={e => handleInputChange('parentName', e.target.value)}
                placeholder="Nama ayah, ibu, atau wali"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>

            {/* Input Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Alamat Lengkap</label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={e => handleInputChange('address', e.target.value)}
                placeholder="Tuliskan alamat rumah domisili saat ini..."
                maxLength={500}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none resize-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 bg-slate-50/50 focus:bg-white transition-all"
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-rose-600 font-medium">{errors.address || ''}</span>
                <span className="text-xs font-medium text-slate-400">{formData.address.length}/500</span>
              </div>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            {isDirty && (
              <button
                type="button"
                onClick={() => {
                  if (student) {
                    setFormData({
                      name: student.name || '',
                      email: student.email || '',
                      phone: student.phone || '',
                      address: student.address || '',
                      parentName: student.parentName || '',
                    });
                    setAvatarPreview(student.avatar || '');
                    setErrors({});
                    setIsDirty(false);
                  }
                }}
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
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 hover:shadow-md'
              }`}
            >
              {isSaving ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Menyimpan...</>
              ) : (
                <><Save className="w-4 h-4" />Simpan Perubahan</>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Crop Avatar Modal Component */}
      <ModalPotongFoto
        open={bukaPotongFoto}
        sumberGambar={sumberFotoPotong}
        judul="Sesuaikan Foto Profil Anda"
        warnaAksen="hijau"
        onBatal={handleBatalPotong}
        onSimpan={handleSimpanFotoPotong}
      />
    </div>
  );
}
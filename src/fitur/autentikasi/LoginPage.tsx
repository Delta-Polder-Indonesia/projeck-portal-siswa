import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  GraduationCap, BookOpen, Eye, EyeOff, LogIn, ArrowLeft,
  School, User, AlertCircle, Info, MapPin, Phone
} from 'lucide-react';
import PanelAdminModal from '../admin/PanelAdminModal';
import TutorialModal from './TutorialModal';
import ExpectationModal from './ExpectationModal';

const BG_IMAGE = `${import.meta.env.BASE_URL}images/login-bg.jpg`;
const LOGO_SMP = `${import.meta.env.BASE_URL}images/smp.png`;
const IS_VIDEO_BG = BG_IMAGE.match(/\.(mp4|webm|ogg)$/i);

const ADMIN_LOGIN = {
  teacher: { username: 'adm_guru', password: 'admin123' },
  student: { username: 'adm_siswa', password: 'admin123' },
} as const;

export default function LoginPage() {
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [openAdminPanel, setOpenAdminPanel] = useState(false);
  const [adminScope, setAdminScope] = useState<'teacher' | 'student'>('teacher');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showExpectation, setShowExpectation] = useState(false);
  const [mainLogoError, setMainLogoError] = useState(false);
  const [bgError, setBgError] = useState(false);

  const handleSelectRole = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setError('');
    setId('');
    setPassword('');
    setShowPassword(false);
  };

  const handleBack = () => {
    setRole(null);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!role) return;

    if (
      (role === 'teacher' && id.trim() === ADMIN_LOGIN.teacher.username && password === ADMIN_LOGIN.teacher.password) ||
      (role === 'student' && id.trim() === ADMIN_LOGIN.student.username && password === ADMIN_LOGIN.student.password)
    ) {
      setAdminScope(role);
      setOpenAdminPanel(true);
      return;
    }

    if (!login(id.trim(), password, role)) {
      setError('ID atau password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Section (Sesuai original) */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500" 
           style={{ backgroundImage: `url(${BG_IMAGE})` }} />
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 flex w-full max-w-6xl items-center gap-16 px-8 py-12 max-[900px]:flex-col max-[900px]:gap-8 max-[900px]:px-6">
        
        {/* LEFT SIDE - Branding (Original) */}
        <div className="flex-1 flex flex-col justify-center max-[900px]:items-center">
            {/* Logo & Teks Tetap Sesuai Kode Anda */}
            <div className="flex items-center gap-6 mb-6 max-[900px]:flex-col max-[900px]:text-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <img src={LOGO_SMP} alt="Logo" className="w-full h-full object-contain p-2.5" />
                </div>
                <div className="space-y-1">
                    <p className="text-white/90 font-medium">Selamat Datang Di Portal Resmi:</p>
                    <h3 className="text-white font-black text-2xl uppercase">SMP Negeri 1 Majenang</h3>
                </div>
            </div>
            {/* Info Buttons (Sesuai original) */}
            <div className="flex gap-4">
                <button onClick={() => setShowExpectation(true)} className="px-5 py-3 rounded-xl text-white text-sm bg-white/5 border border-white/10 backdrop-blur-md">Apa yang Diharapkan?</button>
                <button onClick={() => setShowTutorial(true)} className="px-5 py-3 rounded-xl text-white text-sm bg-white/5 border border-white/10 backdrop-blur-md">Cara Login</button>
            </div>
        </div>

        {/* RIGHT SIDE - Login Card */}
        <div className="flex-shrink-0 w-full max-w-[420px]">
          <div className="rounded-3xl p-10 max-[600px]:p-6"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>

            {/* Jika sudah pilih role, munculkan tombol Back di dalam card */}
            {role !== null && (
                <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Pilihan Peran</span>
                </button>
            )}

            {role === null ? (
              <div className="text-center space-y-8">
                <h2 className="text-2xl font-bold text-white">Pilih Peran</h2>
                <div className="flex flex-col gap-4">
                  <button onClick={() => handleSelectRole('teacher')} className="flex items-center justify-center gap-3 p-4 rounded-xl text-white font-semibold border border-white/20 bg-white/5 hover:bg-white/15">
                    <BookOpen className="w-6 h-6 text-blue-400" /> Masuk sebagai Guru
                  </button>
                  <button onClick={() => handleSelectRole('student')} className="flex items-center justify-center gap-3 p-4 rounded-xl text-white font-semibold border border-white/20 bg-white/5 hover:bg-white/15">
                    <GraduationCap className="w-6 h-6 text-emerald-400" /> Masuk sebagai Siswa
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-bold text-white">Login {role === 'teacher' ? 'Guru' : 'Siswa'}</h2>
                <input 
                  type="text" 
                  value={id} 
                  onChange={e => setId(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl text-white text-[16px] border border-white/20 bg-white/10 outline-none"
                  placeholder="ID / Username" required 
                />
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-4 rounded-xl text-white text-[16px] border border-white/20 bg-white/10 outline-none"
                    placeholder="Kata Sandi" required 
                  />
                </div>
                <button type="submit" className="w-full py-4 rounded-xl bg-cyan-500 text-slate-900 font-bold hover:bg-cyan-400">Masuk</button>
              </form>
            )}
          </div>
        </div>
      </div>

      <TutorialModal open={showTutorial} onClose={() => setShowTutorial(false)} />
      <ExpectationModal open={showExpectation} onClose={() => setShowExpectation(false)} />
      <PanelAdminModal open={openAdminPanel} onClose={() => setOpenAdminPanel(false)} scope={adminScope} preAuthorized />
    </div>
  );
}
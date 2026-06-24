import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  GraduationCap, BookOpen, Eye, EyeOff, LogIn, ArrowLeft,
  School, User, AlertCircle, Info, MapPin, Phone, ArrowRight, HelpCircle
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
    <div className="relative min-h-[100dvh] flex flex-col justify-between overflow-x-hidden bg-slate-950 font-sans antialiased p-4 sm:p-8 md:p-12 selection:bg-cyan-500 selection:text-slate-900 z-10">
      
      {/* Background Layer Fix */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-all duration-1000 z-0" 
        style={{ backgroundImage: `url(${BG_IMAGE})` }} 
      />
      <div className="fixed inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-900/40 z-0" />
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-0" />

      {/* BRANDING: Pojok Atas */}
      <header className="relative z-20 w-full flex items-center gap-4 mb-8 max-[900px]:justify-center max-[900px]:mb-4">
        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl flex items-center justify-center p-1.5 shrink-0">
          <img src={LOGO_SMP} alt="Logo" className="w-full h-full object-contain" />
        </div>
        <div className="space-y-0.5 max-[900px]:text-center">
          <p className="text-cyan-400 text-[10px] uppercase tracking-[0.2em] font-extrabold leading-none">Sistem Informasi Akademik</p>
          <h3 className="text-white font-black text-lg uppercase tracking-tight leading-none drop-shadow-md">SMP Negeri 1 Majenang</h3>
        </div>
      </header>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="relative z-10 my-auto flex w-full max-w-6xl items-center justify-between gap-12 lg:gap-20 mx-auto max-[900px]:flex-col max-[900px]:gap-12 max-[900px]:justify-center">
        
        {/* LEFT SIDE - Informasi PPDB */}
        <div className="flex-1 max-w-xl text-left max-[900px]:text-center max-[900px]:px-4 space-y-6">
          <div className="inline-flex items-center gap-2.5 text-cyan-400 max-[900px]:justify-center">
            <School className="w-5 h-5 stroke-[2.5]" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400 drop-shadow-md">
              Penerimaan Siswa Baru (PPDB)
            </span>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-white font-black text-3xl sm:text-4xl lg:text-5xl leading-[1.15] tracking-tight drop-shadow-xl">
              Pendaftaran Tahun Ajaran Baru <br className="hidden lg:inline"/>Telah Resmi Dibuka!
            </h1>
            <p className="text-slate-200/90 text-sm md:text-base leading-relaxed font-normal max-w-lg drop-shadow-md">
              Bergabunglah bersama kompartemen pendidikan terbaik di SMP Negeri 1 Majenang. Proses seleksi dilakukan secara transparan, akuntabel, dan sistematis daring.
            </p>
          </div>
          
          {/* SEJAJAR: Status Badge & Tombol Baca Selengkapnya */}
          <div className="flex flex-wrap items-center gap-5 pt-2 max-[900px]:justify-center">
            <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-500/30 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              STATUS: GELOMBANG I AKTIF
            </div>

            <button 
              type="button"
              onClick={() => setShowExpectation(true)} 
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-cyan-400 transition-colors group cursor-pointer py-2"
            >
              <span>Baca Selengkapnya</span>
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* RIGHT SIDE - Login Card (100% Struktur Asli Anda tanpa edit selain pemindahan tombol) */}
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

                {/* Sisa tombol bantuan di dalam kontainer login */}
                <div className="pt-4 border-t border-white/10">
                  <button 
                    type="button"
                    onClick={() => setShowTutorial(true)} 
                    className="w-full flex items-center justify-center gap-2 text-xs text-slate-300 hover:text-cyan-400 font-medium transition-colors py-1.5 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Cara Login / Butuh Bantuan?</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Login {role === 'teacher' ? 'Guru' : 'Siswa'}</h2>
                  <button
                    type="button"
                    onClick={() => setShowTutorial(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1 rounded-lg border border-cyan-500/20 transition-all cursor-pointer"
                  >
                    Cara Login
                  </button>
                </div>
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
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <button type="submit" className="w-full py-4 rounded-xl bg-cyan-500 text-slate-900 font-bold hover:bg-cyan-400">Masuk</button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 w-full text-center pt-4 text-[11px] text-slate-500 font-medium">
        &copy; {new Date().getFullYear()} SMP Negeri 1 Majenang. All Rights Reserved.
      </footer>

      {/* Modals */}
      <TutorialModal open={showTutorial} onClose={() => setShowTutorial(false)} />
      <ExpectationModal open={showExpectation} onClose={() => setShowExpectation(false)} />
      <PanelAdminModal open={openAdminPanel} onClose={() => setOpenAdminPanel(false)} scope={adminScope} preAuthorized />
    </div>
  );
}
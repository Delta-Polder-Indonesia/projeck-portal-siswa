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

// ───────────────────────────────────────────────
// VITE ASSET IMPORTS — Pastikan file ada di src/assets/
// atau gunakan path public/ jika file di public/images/
// ───────────────────────────────────────────────

// OPSI A: Import dari src/assets/ (Vite akan bundle & hash)
// import bgImage from '../../assets/images/login-bg.jpg';
// import logoSmp from '../../assets/images/logo-smpn1-majenang.png';

// OPSI B: Path absolut ke public/ (Vite serve langsung dari public/)
// File HARUS ada di: project-root/public/images/login-bg.jpg
// File HARUS ada di: project-root/public/images/logo-smpn1-majenang.png
const BG_IMAGE = '/images/login-bg.jpg';
const LOGO_SMP = '/images/smp.png';

const IS_VIDEO_BG = BG_IMAGE.match(/\.(mp4|webm|ogg)$/i);

// ───────────────────────────────────────────────
// ADMIN LOGIN CONFIG
// ───────────────────────────────────────────────
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
    setId('');
    setPassword('');
    setShowPassword(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!role) return;

    if (
      role === 'teacher' &&
      id.trim() === ADMIN_LOGIN.teacher.username &&
      password === ADMIN_LOGIN.teacher.password
    ) {
      setAdminScope('teacher');
      setOpenAdminPanel(true);
      setId('');
      setPassword('');
      return;
    }

    if (
      role === 'student' &&
      id.trim() === ADMIN_LOGIN.student.username &&
      password === ADMIN_LOGIN.student.password
    ) {
      setAdminScope('student');
      setOpenAdminPanel(true);
      setId('');
      setPassword('');
      return;
    }

    const success = login(id.trim(), password, role);
    if (!success) {
      setError('ID atau password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* ═══════════════════════════════════════════
          BACKGROUND IMAGE / VIDEO
          ═══════════════════════════════════════════ */}
      {IS_VIDEO_BG ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => {
            console.error("[BG] Video gagal dimuat:", BG_IMAGE);
            setBgError(true);
          }}
        >
          <source src={BG_IMAGE} type={`video/${BG_IMAGE.split('.').pop()}`} />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
          style={{
            backgroundImage: bgError
              ? 'none'
              : `url(${BG_IMAGE})`,
            backgroundColor: bgError ? '#0f172a' : undefined,
          }}
          onError={() => {
            console.error("[BG] Gambar gagal dimuat:", BG_IMAGE);
            setBgError(true);
          }}
        />
      )}

      {/* Fallback background jika bg image gagal */}
      {bgError && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
      )}

      {/* Overlay Gelap */}
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

      {/* Animated blur shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        <div className="absolute rounded-full" style={{ width: '400px', height: '400px', background: '#4F46E5', filter: 'blur(80px)', opacity: 0.25, top: '-100px', left: '-100px' }} />
        <div className="absolute rounded-full" style={{ width: '350px', height: '350px', background: '#06B6D4', filter: 'blur(80px)', opacity: 0.2, bottom: '-80px', right: '10%' }} />
      </div>

      {/* Back Button */}
      {role !== null && (
        <div className="absolute left-6 top-6 z-20 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2.5 rounded-xl text-white transition-all border border-white/20 hover:bg-white/20 hover:border-white/40 cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
            title="Kembali ke pilihan peran"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-white drop-shadow-md">
            Masuk sebagai {role === 'teacher' ? 'Guru' : 'Siswa'}
          </h2>
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 flex w-full max-w-6xl items-center gap-16 px-8 py-12 max-[900px]:flex-col max-[900px]:gap-8 max-[900px]:px-6 max-[900px]:py-8">

        {/* LEFT SIDE - Branding & Logo */}
        <div className="flex-1 flex flex-col justify-center max-[900px]:items-center min-w-[360px] max-[900px]:min-w-full">

          {/* BLOCK UTAMA: LOGO & TEXT SALAM */}
          <div className="flex items-center gap-6 mb-6 max-[900px]:flex-col max-[900px]:text-center max-[900px]:gap-4">

            {/* LOGO SMP 1 MAJENANG */}
            <div className="flex-shrink-0 group">
              <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:border-white/40">
                {mainLogoError ? (
                  <div className="text-white text-xl font-extrabold tracking-wider opacity-90 select-none">
                    SMP 1
                  </div>
                ) : (
                  <img
                    src={LOGO_SMP}
                    alt="Logo SMP 1 Majenang"
                    className="w-full h-full object-contain p-2.5 transition-transform duration-500 group-hover:scale-105"
                    onError={() => {
                      console.error("[LOGO] Gagal memuat logo di path:", LOGO_SMP);
                      console.error("[LOGO] Pastikan file ada di: public/images/logo-smpn1-majenang.png");
                      setMainLogoError(true);
                    }}
                  />
                )}
              </div>
            </div>

            {/* TEXT SALAM PEMBUKA */}
            <div className="flex-1 space-y-1">
              <p className="text-white/90 font-medium text-base tracking-wide drop-shadow-sm">
                Selamat Datang Di Portal Resmi Siswa:
              </p>
              <h3 className="text-white font-black text-2xl tracking-wider drop-shadow-md uppercase leading-tight">
                SMP Negeri 1 Majenang
              </h3>
              <p className="text-cyan-400 font-bold text-xs tracking-widest uppercase">
                Kab. Cilacap, Jawa Tengah
              </p>
            </div>

          </div>

          {/* PENJELASAN AKREDITAS SEKOLAH */}
          <div className="mb-8 max-w-md p-4 max-[900px]:mx-auto">
            <div className="flex items-center gap-2.5 mb-1.5 max-[900px]:justify-center">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-bold tracking-wider uppercase text-emerald-400">
                Status Akreditasi Sekolah
              </p>
            </div>
            <p className="text-white/80 text-xs leading-relaxed max-[900px]:text-center">
              SMP Negeri 1 Majenang telah resmi terakreditasi <strong className="text-emerald-400 font-extrabold">Grade A (Unggul)</strong> oleh BAN-PDM dengan nilai optimal. Menjamin pemenuhan standar mutu pendidikan nasional yang konsisten, sarana prasarana modern, serta lingkungan belajar yang kompetitif.
            </p>
          </div>

          {/* Info Buttons */}
          <div className="flex gap-4 max-[900px]:justify-center max-[600px]:flex-col max-[600px]:w-full">
            <button
              onClick={() => setShowExpectation(true)}
              className="px-5 py-3 rounded-xl text-white text-sm font-semibold transition-all border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/15 hover:border-white/30 active:scale-98 cursor-pointer"
            >
              Apa yang Diharapkan?
            </button>
            <button
              onClick={() => setShowTutorial(true)}
              className="px-5 py-3 rounded-xl text-white text-sm font-semibold transition-all border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/15 hover:border-white/30 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              Cara Login
            </button>
          </div>

          {/* INFORMASI ALAMAT SEKOLAH */}
          <div className="mt-6 max-w-md max-[900px]:w-full max-[900px]:mx-auto">
            <div className="flex items-center gap-4 max-[600px]:flex-col max-[600px]:text-center">
              <div className="self-stretch w-px bg-gradient-to-b from-white/5 via-white/20 to-white/5 max-[600px]:hidden" />
              <div className="flex-1 space-y-1">
                <p className="text-white font-extrabold text-[10px] tracking-wider uppercase">
                  SMP NEGERI 1 MAJENANG
                </p>
                <div className="space-y-1 pt-1 border-t border-white/5">
                  <div className="flex items-start gap-2 max-[600px]:justify-center">
                    <MapPin className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <p className="text-white/60 text-[9px] leading-relaxed">
                      Jl. Raya Majenang No. 1, Kecamatan Majenang,<br />
                      <span className="text-white/40">
                        Kabupaten Cilacap, Jawa Tengah 53257
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 max-[600px]:justify-center">
                    <Phone className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    <p className="text-white/60 text-[9px] font-medium">
                      (0280) 621 234
                    </p>
                  </div>
                  <div className="flex items-center gap-2 max-[600px]:justify-center">
                    <School className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    <a
                      href="https://www.smpn1majenang.sch.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 text-[9px] font-medium hover:text-cyan-300"
                    >
                      www.smpn1majenang.sch.id
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE - Login Card */}
        <div className="flex-shrink-0 max-[900px]:w-full" style={{ width: '420px' }}>
          <div className="rounded-3xl p-10 max-[600px]:p-6"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}>

            {/* Role Selection */}
            {role === null && (
              <div className="text-center space-y-8 max-[600px]:space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Pilih Peran</h2>
                  <p className="text-white/60 text-sm">Silakan pilih peran Anda untuk melanjutkan</p>
                </div>
                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => handleSelectRole('teacher')}
                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white font-semibold transition-all border border-white/20 hover:bg-white/15 hover:border-white/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    <BookOpen className="w-6 h-6 text-blue-400" />
                    <span>Masuk sebagai Guru</span>
                  </button>
                  <button
                    onClick={() => handleSelectRole('student')}
                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white font-semibold transition-all border border-white/20 hover:bg-white/15 hover:border-white/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    <GraduationCap className="w-6 h-6 text-emerald-400" />
                    <span>Masuk sebagai Siswa</span>
                  </button>
                </div>
              </div>
            )}

            {/* Login Form */}
            {role !== null && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-white mb-8 max-[600px]:mb-6">Masuk ke Portal</h2>

                {error && (
                  <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-xl text-sm text-red-200 border border-red-400/40"
                    style={{ background: 'rgba(239,68,68,0.2)' }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      {role === 'teacher' ? 'NIP / Username' : 'NIS / Username'}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={id}
                        onChange={e => setId(e.target.value)}
                        placeholder={role === 'teacher' ? 'Masukkan NIP' : 'Masukkan NIS'}
                        className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all border border-white/20 focus:border-white/50 focus:bg-white/15 focus:ring-2 focus:ring-white/10"
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                        required
                        autoFocus
                      />
                      <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">Kata Sandi</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Masukkan kata sandi..."
                        className="w-full px-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all border border-white/20 focus:border-white/50 focus:bg-white/15 focus:ring-2 focus:ring-white/10 pr-12"
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded accent-cyan-400" />
                      <span className="text-sm text-white/60">Ingat saya</span>
                    </label>
                    <a href="#" className="text-sm text-white/60 hover:text-cyan-400 transition-colors">Lupa password?</a>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #67E8F9, #22D3EE)',
                      color: '#1E1B4B',
                      boxShadow: '0 4px 15px rgba(34,211,238,0.3)'
                    }}
                  >
                    <LogIn className="w-5 h-5" />
                    Masuk
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TutorialModal open={showTutorial} onClose={() => setShowTutorial(false)} />
      <ExpectationModal open={showExpectation} onClose={() => setShowExpectation(false)} />
      <PanelAdminModal open={openAdminPanel} onClose={() => setOpenAdminPanel(false)} scope={adminScope} preAuthorized />
    </div>
  );
}
import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  GraduationCap, BookOpen, Eye, EyeOff, ArrowLeft,
  User, HelpCircle, BookMarked
} from 'lucide-react';
import AdminMasterPanel from '../admin/PanelAdminModal';
import TutorialModal from './TutorialModal';
import ExpectationModal from '../halaman/ExpectationModal';
import PPDBForm from '../penerimaan-siswa-baru/PPDBForm';
import LandingPage from '../penerimaan-siswa-baru/LandingPage';
import CekKelulusanPage from '../penerimaan-siswa-baru/CekKelulusanPage';

const PerpustakaanApp = lazy(() => import('../../fitur/perpustakaan/PerpustakaanApp'));

const LOGO_SMP = `${import.meta.env.BASE_URL}images/logo/logo-sekolah.svg`;

const ADMIN_LOGIN = {
  master: { username: 'admin', password: 'admin' },
} as const;

const BACKGROUND_IMAGES = [
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.jpg`,
    caption: 'Fasilitas Pembelajaran Modern'
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-2.jpg`,
    caption: 'Kegiatan Ekstrakurikuler'
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-3.jpg`,
    caption: 'Prestasi Siswa Berprestasi'
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-4.jpg`,
    caption: 'Lingkungan Belajar Nyaman'
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-5.jpg`,
    caption: 'Alumni Siswa Tahun Ajaran 2024/2025'
  },
];

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
  const [showPPDB, setShowPPDB] = useState(false);
  const [ppdbView, setPpdbView] = useState<'landing' | 'form' | 'cek-kelulusan'>('landing');
  const [showPerpustakaan, setShowPerpustakaan] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

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

    if (id.trim() === ADMIN_LOGIN.master.username && password === ADMIN_LOGIN.master.password) {
      setAdminScope(role);
      setOpenAdminPanel(true);
      return;
    }

    if (!login(id.trim(), password, role)) {
      setError('ID atau password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-950 font-sans antialiased selection:bg-cyan-500 selection:text-slate-900 overflow-hidden">

      {/* STICKY HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#2E86C1] backdrop-blur-xl border-b border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 w-full">

            {/* Sisi Kiri: Identitas Sekolah */}
            <div className="flex items-center gap-3 justify-start pl-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/20 bg-white/10 flex items-center justify-center p-1 shrink-0">
                <img src={LOGO_SMP} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col items-start justify-center text-left">
                <p className="text-cyan-400 text-[10px] uppercase tracking-[0.2em] font-extrabold leading-none block w-full m-0 p-0">
                  Sistem Informasi Academic
                </p>
                <h3 className="text-white font-black text-base uppercase tracking-tight leading-none mt-1 block w-full p-0">
                  SMP Negeri 1 Majenang
                </h3>
              </div>
            </div>

            {/* Sisi Kanan: Menu Navigasi */}
            <nav className="flex items-center gap-4 bg-transparent p-0 border-none rounded-none">
              <button
                type="button"
                onClick={() => setShowExpectation(true)}
                className="flex items-center gap-2 p-1 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-slate-300 hover:text-white bg-transparent border-none"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Halaman Kami</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPPDB(true)}
                className="flex items-center gap-2 p-1 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-slate-300 hover:text-white bg-transparent border-none"
              >
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>Pendaftaran</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPerpustakaan(true)}
                className="flex items-center gap-2 p-1 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-slate-300 hover:text-white bg-transparent border-none"
                title="Sistem Informasi Perpustakaan"
              >
                <BookMarked className="w-3.5 h-3.5 text-cyan-400" />
                <span>Perpustakaan</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN WORKSPACE - Terbagi Menjadi 7:3 Berdampingan */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 h-screen w-full pt-16 box-border">
        
        {/* SISI KIRI (7/10 bagian) - Background Slideshow & Info */}
        <div className="relative lg:col-span-7 w-full h-full overflow-hidden flex flex-col justify-end p-8 md:p-16 text-left">
          {/* Slideshow Layer */}
          <div className="absolute inset-0 z-0">
            {BACKGROUND_IMAGES.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={image.src}
                  alt={image.caption}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
            {/* Overlay gradien gelap miring */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/70" />
            <div className="absolute inset-0 bg-slate-950/30" />
          </div>

          {/* Informasi Latar Belakang */}
          <div className="relative z-10 max-w-[600px] mt-auto">
            <span className="text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase mb-2 block animate-pulse">
              Sekilas Info
            </span>
            <h1 className="text-white text-2xl md:text-4xl font-black tracking-tight leading-tight mb-2 drop-shadow-xl transition-all duration-500">
              {BACKGROUND_IMAGES[currentSlide].caption}
            </h1>
            <p className="text-slate-200/90 text-sm font-medium drop-shadow-md">
              Selamat datang di Portal Utama Akademik SMP Negeri 1 Majenang.
            </p>
          </div>
        </div>

        {/* SISI KANAN (3/10 bagian) - Ruang Login (Tanpa Card/Container) */}
        <div className="lg:col-span-3 w-full h-full bg-slate-950 flex items-center justify-center p-6 md:p-10 border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto">
          <div className="w-full max-w-[340px] py-4">

            {role !== null && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-all text-sm cursor-pointer border-none bg-transparent p-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            )}

            {error && (
              <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-xs font-medium">
                {error}
              </div>
            )}

            {role === null ? (
              <div className="space-y-6">
                <div className="text-left">
                  <h2 className="text-2xl font-black text-white tracking-tight">Selamat Datang</h2>
                  <p className="text-slate-400 text-xs mt-1">Silakan pilih peran Anda untuk melanjutkan masuk ke sistem.</p>
                </div>

                <div className="flex flex-col gap-3">
                  <button onClick={() => handleSelectRole('teacher')} className="flex items-center justify-between gap-3 p-4 rounded-xl text-white text-sm font-semibold border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 cursor-pointer transition-all group">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-blue-400" /> 
                      <span>Masuk sebagai Guru</span>
                    </div>
                  </button>
                  <button onClick={() => handleSelectRole('student')} className="flex items-center justify-between gap-3 p-4 rounded-xl text-white text-sm font-semibold border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 cursor-pointer transition-all group">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-emerald-400" /> 
                      <span>Masuk sebagai Siswa</span>
                    </div>
                  </button>
                </div>

                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowTutorial(true)}
                    className="flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 font-medium transition-colors py-1 cursor-pointer border-none bg-transparent"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Butuh Bantuan?</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-left">
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Portal {role === 'teacher' ? 'Guru' : 'Siswa'}
                  </h2>
                  <p className="text-slate-400 text-xs mt-1">Masukkan kredensial akun resmi Anda di bawah ini.</p>
                </div>

                <div className="space-y-3.5">
                  <input
                    type="text"
                    id="login-id"
                    name="username"
                    autoComplete="username"
                    value={id}
                    onChange={e => setId(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl text-white text-sm border border-white/10 bg-white/5 outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all"
                    placeholder={role === 'teacher' ? "NIP / Username" : "NISN / Username"} required
                  />
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password"
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl text-white text-sm border border-white/10 bg-white/5 outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all"
                      placeholder="Kata Sandi" required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="w-full py-3.5 rounded-xl bg-cyan-500 text-slate-900 text-sm font-bold hover:bg-cyan-400 cursor-pointer transition-colors shadow-lg shadow-cyan-500/10">
                  Masuk Sekarang
                </button>

                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowTutorial(true)}
                    className="flex items-center gap-2 text-xs text-slate-500 hover:text-cyan-400 font-medium transition-colors py-1 cursor-pointer border-none bg-transparent"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Butuh Bantuan?</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TutorialModal open={showTutorial} onClose={() => setShowTutorial(false)} />
      <ExpectationModal open={showExpectation} onClose={() => setShowExpectation(false)} />

      {/* PPDB Form Modal */}
      {showPPDB && (
        <div className="fixed inset-0 z-[150] bg-white overflow-y-auto">
          {ppdbView === 'landing' ? (
            <LandingPage
              onOpenForm={() => setPpdbView('form')}
              onOpenCekKelulusan={() => setPpdbView('cek-kelulusan')}
              onClose={() => setShowPPDB(false)}
            />
          ) : ppdbView === 'form' ? (
            <PPDBForm
              isModal={false}
              onBack={() => setPpdbView('landing')}
              onClose={() => {
                setShowPPDB(false);
                setPpdbView('landing');
              }}
            />
          ) : (
            <CekKelulusanPage
              onBack={() => setPpdbView('landing')}
            />
          )}
        </div>
      )}

      {/* PERPUSTAKAAN - Loading Container */}
      {showPerpustakaan && (
        <Suspense fallback={
          <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center min-h-screen w-full">
            <div className="flex flex-col items-center justify-center p-6 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl">
              <div className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full mb-4" />
              <p className="text-amber-400 text-sm font-bold tracking-wider uppercase animate-pulse">Memuat Perpustakaan...</p>
            </div>
          </div>
        }>
          <div className="fixed inset-0 z-[200]">
            <PerpustakaanApp onClose={() => setShowPerpustakaan(false)} />
          </div>
        </Suspense>
      )}

      {/* Admin Panel */}
      {openAdminPanel && (
        <AdminMasterPanel
          open={openAdminPanel}
          onClose={() => setOpenAdminPanel(false)}
          scope={adminScope}
        />
      )}
    </div>
  );
}
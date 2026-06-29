import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  GraduationCap, BookOpen, Eye, EyeOff, ArrowLeft,
  User, HelpCircle, BookMarked, ChevronLeft, ChevronRight
} from 'lucide-react';
import AdminMasterPanel from '../admin/PanelAdminModal';
import TutorialModal from './TutorialModal';
import ExpectationModal from '../halaman/ExpectationModal';
import PPDBForm from '../penerimaan-siswa-baru/PPDBForm';
import LandingPage from '../penerimaan-siswa-baru/LandingPage';

const PerpustakaanApp = lazy(() => import('../../fitur/perpustakaan/PerpustakaanApp'));

const BG_IMAGE = `${import.meta.env.BASE_URL}images/login-bg.jpg`;
const LOGO_SMP = `${import.meta.env.BASE_URL}images/smp.png`;

const ADMIN_LOGIN = {
  master: { username: 'admin', password: 'admin' },
} as const;

// ============================================
// GANTI ATAU TAMBAH FOTO DI SINI BUNG (BISA 10 - 20 FOTO)
// ============================================
const CAROUSEL_IMAGES = [
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.jpg`,
    caption: 'Fasilitas Pembelajaran Modern ( DEMO )'
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-2.jpg`,
    caption: 'Kegiatan Ekstrakurikuler ( DEMO )'
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-3.jpg`,
    caption: 'Prestasi Siswa Berprestasi ( DEMO )'
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-4.jpg`,
    caption: 'Lingkungan Belajar Nyaman ( DEMO )'
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-5.jpeg`,
    caption: 'Alumni Siswa Tahun Ajaran 2024/2025 ( DEMO )'
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
  const [ppdbView, setPpdbView] = useState<'landing' | 'form'>('landing');
  const [showPerpustakaan, setShowPerpustakaan] = useState(false);

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume autoplay setelah 5 detik jika user klik manual
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Auto-slide setiap 5 detik
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

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
    <div className="relative min-h-[100dvh] flex flex-col bg-slate-950 font-sans antialiased selection:bg-cyan-500 selection:text-slate-900 overflow-hidden">

      {/* Background Layer */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-all duration-1000 z-0"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />
      <div className="fixed inset-0 bg-black/0 z-0" />
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-0" />

      {/* STICKY HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
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
                <span>Halaman</span>
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

      {/* Spacer untuk header fixed */}
      <div className="h-16" />

      {/* MAIN CONTENT WORKSPACE */}
      <main className="relative z-10 flex-1 flex w-full max-w-7xl items-center justify-end gap-12 lg:gap-20 mx-auto px-4 sm:px-6 lg:px-8 py-8 max-[900px]:justify-center">

        {/* LEFT SIDE - Image Carousel */}
        <div className="hidden lg:flex flex-1 max-w-[700px] h-[420px] relative rounded-3xl overflow-hidden group">
          
          {/* Images dengan fade transition */}
          {CAROUSEL_IMAGES.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={image.src}
                alt={image.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          ))}

          {/* Caption */}
          <div className="absolute bottom-4 left-0 right-0 z-20 px-8 pb-6">
            <div className="transform transition-all duration-500 translate-y-0">
              <h3 className="text-white text-2xl font-bold mb-1 drop-shadow-lg">
                {CAROUSEL_IMAGES[currentSlide].caption}
              </h3>
              <p className="text-white/70 text-sm">
                SMP Negeri 1 Majenang
              </p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => {
              prevSlide();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 5000);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              nextSlide();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 5000);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/60 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indikator Dot Dinamis - Maksimal Terkunci 5 Titik Saja */}
          <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
            {CAROUSEL_IMAGES.map((_, index) => {
              const totalDots = CAROUSEL_IMAGES.length;
              
              // Jika foto <= 5, tampilkan semua titik normal
              if (totalDots <= 5) {
                return (
                  <button
                    key={index}
                    type="button"
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-white/70 hover:bg-white"
              }`}
            />
                );
              }

              // Hitung rentang jendela (window) 5 titik aktif di sekitar slide saat ini
              let start = currentSlide - 2;
              let end = currentSlide + 2;

              if (start < 0) {
                end = end - start;
                start = 0;
              }
              if (end >= totalDots) {
                start = start - (end - totalDots + 1);
                end = totalDots - 1;
              }

              start = Math.max(0, start);

              // Sembunyikan titik yang berada di luar rentang jendela 5 titik
              if (index < start || index > end) return null;

              // Efek visual mengecil untuk titik paling ujung (indikasi masih ada slide selanjutnya)
              const isEdge = (index === start && start > 0) || (index === end && end < totalDots - 1);

              return (
                <button
                  key={index}
                  type="button"
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-white/70 hover:bg-white"
              }`}
            />
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE - Login Card */}
        <div className="flex-shrink-0 w-full max-w-[420px]">
          <div className="rounded-3xl p-10 max-[600px]:p-6"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.15)'
            }}
          >

            {role !== null && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-all text-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali</span>
              </button>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-xs font-medium">
                {error}
              </div>
            )}

            {role === null ? (
              <div className="text-center space-y-5">
                <h2 className="text-2xl font-bold text-white">Pilih Peran</h2>
                <div className="flex flex-col gap-4">
                  <button onClick={() => handleSelectRole('teacher')} className="flex items-center justify-center gap-3 p-4 rounded-xl text-white font-semibold border border-white/20 bg-white/5 hover:bg-white/15 cursor-pointer transition-all">
                    <BookOpen className="w-6 h-6 text-blue-400" /> Masuk sebagai Guru
                  </button>
                  <button onClick={() => handleSelectRole('student')} className="flex items-center justify-center gap-3 p-4 rounded-xl text-white font-semibold border border-white/20 bg-white/5 hover:bg-white/15 cursor-pointer transition-all">
                    <GraduationCap className="w-6 h-6 text-emerald-400" /> Masuk sebagai Siswa
                  </button>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowTutorial(true)}
                    className="flex items-center gap-2 text-xs text-slate-300 hover:text-cyan-400 font-medium transition-colors py-1 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Butuh Bantuan?</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Login {role === 'teacher' ? 'Guru' : 'Siswa'}</h2>
                </div>
                <input
                  type="text"
                  id="login-id"
                  name="username"
                  autoComplete="username"
                  value={id}
                  onChange={e => setId(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl text-white text-[16px] border border-white/20 bg-white/10 outline-none focus:border-cyan-500/50 transition-all"
                  placeholder={role === 'teacher' ? "NIP / Username Guru" : "NISN / Username Siswa"} required
                />
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-4 rounded-xl text-white text-[16px] border border-white/20 bg-white/10 outline-none focus:border-cyan-500/50 transition-all"
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
                <button type="submit" className="w-full py-4 rounded-xl bg-cyan-500 text-slate-900 font-bold hover:bg-cyan-400 cursor-pointer transition-colors shadow-lg shadow-cyan-500/10">Masuk</button>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowTutorial(true)}
                    className="flex items-center gap-2 text-xs text-slate-300 hover:text-cyan-400 font-medium transition-colors py-1 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Butuh Bantuan?</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <TutorialModal open={showTutorial} onClose={() => setShowTutorial(false)} />
      <ExpectationModal open={showExpectation} onClose={() => setShowExpectation(false)} />

      {/* PPDB Form Modal */}
      {showPPDB && (
        <div className="fixed inset-0 z-[150] bg-white overflow-y-auto">
          {ppdbView === 'landing' ? (
            <LandingPage
              onOpenForm={() => setPpdbView('form')}
              onClose={() => setShowPPDB(false)}
            />
          ) : (
            <PPDBForm
              isModal={false}
              onBack={() => setPpdbView('landing')}
              onClose={() => {
                setShowPPDB(false);
                setPpdbView('landing');
              }}
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
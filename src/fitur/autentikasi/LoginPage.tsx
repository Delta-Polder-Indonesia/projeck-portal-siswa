import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  GraduationCap, BookOpen, Eye, EyeOff,
  User, HelpCircle, BookMarked, ChevronDown
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
  // Mengatur role default awal ke 'student' (Murid)
  const [role, setRole] = useState<UserRole>('student');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [openAdminPanel, setOpenAdminPanel] = useState(false);
  const [adminScope, setAdminScope] = useState<'teacher' | 'student'>('student');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!role) return;

    if (id.trim() === ADMIN_LOGIN.master.username && password === ADMIN_LOGIN.master.password) {
      setAdminScope(role === 'teacher' ? 'teacher' : 'student');
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
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-slate-900/70 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 w-full">

            {/* Sisi Kiri: Identitas Sekolah */}
            <div className="flex items-center gap-3 justify-start pl-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xl border border-white/10 bg-white/5 flex items-center justify-center p-1 shrink-0">
                <img src={LOGO_SMP} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col items-start justify-center text-left">
                <p className="text-cyan-400 text-[9px] uppercase tracking-[0.25em] font-extrabold leading-none block w-full m-0 p-0">
                  Sistem Informasi Academic
                </p>
                <h3 className="text-white font-black text-sm uppercase tracking-tight leading-none mt-1.5 block w-full p-0">
                  SMP Negeri 1 Majenang
                </h3>
              </div>
            </div>

            {/* Sisi Kanan: Menu Navigasi */}
            <nav className="flex items-center gap-2 sm:gap-4 bg-transparent p-0 border-none rounded-none">
              <button
                type="button"
                onClick={() => setShowExpectation(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-slate-300 hover:text-white hover:bg-white/5 border-none"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Halaman Kami</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPPDB(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-slate-300 hover:text-white hover:bg-white/5 border-none"
              >
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Pendaftaran</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPerpustakaan(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-slate-300 hover:text-white hover:bg-white/5 border-none"
                title="Sistem Informasi Perpustakaan"
              >
                <BookMarked className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Perpustakaan</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN WORKSPACE - Terbagi Menjadi 7:3 Berdampingan */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 h-screen w-full pt-16 box-border">
        
        {/* SISI KIRI (7/10 bagian) - Background Slideshow & Info */}
        <div className="relative lg:col-span-7 w-full h-full overflow-hidden flex flex-col justify-end p-8 md:p-16 text-left border-b lg:border-b-0 border-white/5">
          {/* Slideshow Layer */}
          <div className="absolute inset-0 z-0">
            {BACKGROUND_IMAGES.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                } transform transition-transform duration-[5000ms]`}
              >
                <img
                  src={image.src}
                  alt={image.caption}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
            {/* Overlay gradien gelap berlapis mewah */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-900/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 via-transparent to-slate-950/80 hidden lg:block" />
          </div>

          {/* Informasi Latar Belakang */}
          <div className="relative z-10 max-w-[600px] mt-auto">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-3 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span className="text-cyan-400 text-[10px] font-bold tracking-[0.2em] uppercase">
                Sekilas Info
              </span>
            </div>
            <h1 className="text-white text-2xl md:text-4xl font-black tracking-tight leading-tight mb-3 drop-shadow-2xl transition-all duration-500">
              {BACKGROUND_IMAGES[currentSlide].caption}
            </h1>
            <p className="text-slate-300 text-sm font-medium leading-relaxed drop-shadow-md max-w-md">
              Selamat datang di Portal Utama Akademik SMP Negeri 1 Majenang. Akses informasi, manajemen data, dan fasilitas pembelajaran digital terpadu.
            </p>
          </div>
        </div>

        {/* SISI KANAN (3/10 bagian) - Ruang Login Langsung */}
        <div className="relative lg:col-span-3 w-full h-full bg-slate-950 flex items-center justify-center p-6 md:p-10 lg:border-l border-white/5 overflow-y-auto">
          
          {/* BACKGROUND GRAFIS UNTUK PANEL LOGIN */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
            <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[80px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full bg-blue-600/10 blur-[100px]" />
            {/* Garis Grid Tipis Estetik */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px]" />
          </div>

          <div className="relative z-10 w-full max-w-[340px] py-6 flex flex-col h-full justify-center">

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium flex items-start gap-2 animate-shake">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Login Terpadu */}
<form onSubmit={handleSubmit} className="space-y-5">
  <div className="text-left mb-2">
    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
      Portal <span className={
        role === 'teacher' ? 'text-blue-400' :
        role === 'student' ? 'text-emerald-400' :
        role === 'parent' ? 'text-purple-400' :
        role === 'guest' ? 'text-amber-400' :
        'text-cyan-400'
      }>
        {role === 'teacher' ? 'Guru' :
         role === 'student' ? 'Siswa' :
         role === 'parent' ? 'Orang Tua' :
         role === 'guest' ? 'Tamu' :
         'Pengguna'}
      </span>
    </h2>
    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
      Aplikasi Sistem Informasi Akademik untuk Siswa, Guru, dan Orang Tua di lingkungan SMP Negeri 1 Majenang
    </p>
  </div>

              <div className="space-y-4">
                {/* 1. Input Username */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="login-id" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                    Identitas Pengguna
                  </label>
                  <input
                    type="text"
                    id="login-id"
                    name="username"
                    autoComplete="username"
                    value={id}
                    onChange={e => setId(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl text-white text-sm border border-white/5 bg-white/[0.03] outline-none focus:border-cyan-500/40 focus:bg-white/[0.07] focus:shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all placeholder:text-slate-600"
                    placeholder="Masukkan username anda" 
                    required
                  />
                </div>

                {/* 2. Input Password */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="login-password" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password"
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl text-white text-sm border border-white/5 bg-white/[0.03] outline-none focus:border-cyan-500/40 focus:bg-white/[0.07] focus:shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all placeholder:text-slate-600"
                      placeholder="Masukkan password anda" 
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 3. Dropdown Seleksi Peran Sederhana */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="login-role" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                    Login Sebagai
                  </label>
                  <div className="relative">
                    <select
                      id="login-role"
                      value={role}
                      onChange={e => setRole(e.target.value as UserRole)}
                      className="w-full px-4 py-3.5 rounded-xl text-white text-sm border border-white/5 bg-slate-900 outline-none focus:border-cyan-500/40 focus:bg-white/[0.07] transition-all cursor-pointer appearance-none pr-10"
                    >
                      <option value="teacher" className="bg-slate-950 text-white">Guru</option>
                      <option value="student" className="bg-slate-950 text-white">Murid</option>
                      <option value="parent" className="bg-slate-950 text-white">Orang Tua</option>
                      <option value="guest" className="bg-slate-950 text-white">Tamu</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tombol Submit */}
              <button type="submit" className="w-full py-3.5 rounded-xl bg-cyan-500 text-slate-950 text-sm font-bold hover:bg-cyan-400 active:scale-[0.98] cursor-pointer transition-all shadow-xl shadow-cyan-500/10 tracking-wide mt-4">
                Masuk
              </button>

              {/* Tautan Bantuan */}
<div className="pt-4 border-t border-white/5 flex flex-col items-center gap-2">
  <p className="text-xs text-slate-500">
    Memiliki kendala login?{' '}
    <button
      type="button"
      onClick={() => setShowTutorial(true)}
      className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer border-none bg-transparent"
    >
      hubungi admin
    </button>
  </p>
</div>
            </form>
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
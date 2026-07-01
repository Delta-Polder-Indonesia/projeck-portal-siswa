import { useState, useEffect, lazy, Suspense } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  GraduationCap, Eye, EyeOff,
  User, BookMarked, ChevronDown
} from 'lucide-react';
import AdminMasterPanel from '../admin/PanelAdminModal';
import TutorialModal from './TutorialModal';
import ExpectationModal from '../halaman/ExpectationModal';
import PPDBForm from '../penerimaan-siswa-baru/PPDBForm';
import LandingPage from '../penerimaan-siswa-baru/LandingPage';
import CekKelulusanPage from '../penerimaan-siswa-baru/CekKelulusanPage';

const PerpustakaanApp = lazy(() => import('../../fitur/perpustakaan/PerpustakaanApp'));

const LOGO_SMP = `${import.meta.env.BASE_URL}images/logo/logo-sekolah.svg`;

const SLIDESHOW_INTERVAL_MS = 5000;

const Z_INDEX = {
  header: 50,
  ppdbModal: 150,
  perpustakaanModal: 200,
} as const;

const BACKGROUND_IMAGES = [
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-1.jpg`,
    caption: 'Fasilitas Pembelajaran Modern',
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-2.jpg`,
    caption: 'Kegiatan Ekstrakurikuler',
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-3.jpg`,
    caption: 'Prestasi Siswa Berprestasi',
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-4.jpg`,
    caption: 'Lingkungan Belajar Nyaman',
  },
  {
    src: `${import.meta.env.BASE_URL}images/Dashboard/sekolah-5.jpg`,
    caption: 'Alumni Siswa Tahun Ajaran 2024/2025',
  },
] as const;

const ROLE_CONFIG = {
  teacher: {
    label: 'Pegawai',
    color: 'text-blue-400',
    submitColor: 'bg-blue-500 shadow-blue-500/10',
    idLabel: 'Nomor Induk Pegawai (NIP)',
    idPlaceholder: 'Masukkan NIP Anda',
    passwordLabel: 'Kata Sandi',
    passwordPlaceholder: 'Masukkan password Anda',
  },
  student: {
    label: 'Siswa',
    color: 'text-emerald-400',
    submitColor: 'bg-emerald-500 shadow-emerald-500/10',
    idLabel: 'Nomor Induk Siswa Nasional (NISN)',
    idPlaceholder: 'Masukkan NISN Anda',
    passwordLabel: 'Kata Sandi',
    passwordPlaceholder: 'Masukkan password Anda',
  },
  parent: {
    label: 'Orang Tua',
    color: 'text-purple-400',
    submitColor: 'bg-purple-500 shadow-purple-500/10',
    idLabel: 'Nomor Induk Kependudukan (NIK)',
    idPlaceholder: 'Masukkan NIK Anda',
    passwordLabel: 'Kata Sandi',
    passwordPlaceholder: 'Masukkan password Anda',
  },
  guest: {
    label: 'Tamu',
    color: 'text-amber-400',
    submitColor: 'bg-amber-500 shadow-amber-500/10',
    idLabel: 'Nomor Tamu / Email',
    idPlaceholder: 'Masukkan nomor tamu atau email',
    passwordLabel: 'Kode Akses',
    passwordPlaceholder: 'Masukkan kode akses Anda',
  },
} as const;

interface SlideshowProps {
  images: typeof BACKGROUND_IMAGES;
  currentSlide: number;
}

const BackgroundSlideshow: React.FC<SlideshowProps> = ({ images, currentSlide }) => (
  <div className="absolute inset-0 z-0">
    {images.map((image, index) => {
      const isActive = index === currentSlide;
      const isAdjacent =
        index === (currentSlide + 1) % images.length ||
        index === (currentSlide - 1 + images.length) % images.length;

      if (!isActive && !isAdjacent) return null;

      return (
        <div
          key={image.src}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.src}
            alt={image.caption}
            className="w-full h-full object-cover object-center"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      );
    })}
  </div>
);

interface HeaderProps {
  onClickHalamanKami: () => void;
  onClickPendaftaran: () => void;
  onClickPerpustakaan: () => void;
}

const SiteHeader: React.FC<HeaderProps> = ({
  onClickHalamanKami,
  onClickPendaftaran,
  onClickPerpustakaan,
}) => (
  <header
    style={{ zIndex: Z_INDEX.header }}
    className="fixed top-0 left-0 right-0 w-full bg-slate-900/70 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20"
  >
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16 w-full">

        {/* Identitas Sekolah */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xl border border-white/10 bg-white/5 flex items-center justify-center p-1 shrink-0">
            <img src={LOGO_SMP} alt="Logo SMP Negeri 1 Majenang" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col items-start justify-center text-left">
            <p className="text-cyan-400 text-[9px] uppercase tracking-[0.25em] font-extrabold leading-none">
              Sistem Informasi Academic
            </p>
            <h3 className="text-white font-black text-sm uppercase tracking-tight leading-none mt-1.5">
              SMP Negeri 1 Majenang
            </h3>
          </div>
        </div>

        {/* Navigasi */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={onClickHalamanKami}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all text-slate-300 hover:text-white hover:bg-white/5"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            <span className="hidden sm:inline">Halaman Kami</span>
          </button>

          <button
            type="button"
            onClick={onClickPendaftaran}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all text-slate-300 hover:text-white hover:bg-white/5"
          >
            <GraduationCap className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            <span className="hidden sm:inline">Pendaftaran</span>
          </button>

          <button
            type="button"
            onClick={onClickPerpustakaan}
            title="Sistem Informasi Perpustakaan"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all text-slate-300 hover:text-white hover:bg-white/5"
          >
            <BookMarked className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            <span className="hidden sm:inline">Perpustakaan</span>
          </button>
        </nav>
      </div>
    </div>
  </header>
);

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => (
  <div
    role="alert"
    aria-live="assertive"
    className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium flex items-start gap-2 animate-[shake_0.5s_ease-in-out]"
  >
    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" aria-hidden="true" />
    <span>{message}</span>
  </div>
);

interface LoginFormProps {
  role: UserRole;
  id: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  error: string;
  onRoleChange: (role: UserRole) => void;
  onIdChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onHelpClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  role,
  id,
  password,
  showPassword,
  isLoading,
  error,
  onRoleChange,
  onIdChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  onHelpClick,
}) => {
  const config = ROLE_CONFIG[role] ?? ROLE_CONFIG.student;

  return (
    <div className="relative lg:col-span-3 w-full h-full bg-slate-900 border-l border-white/5 flex flex-col justify-between p-8 md:p-10 overflow-y-auto">

      {/* Spacer atas */}
      <div className="hidden lg:block h-6" aria-hidden="true" />

      {/* Konten Utama */}
      <div className="w-full max-w-[340px] mx-auto flex flex-col justify-center flex-1 py-6">

        {error && <ErrorAlert message={error} />}

        <form onSubmit={onSubmit} className="space-y-5" noValidate>

          {/* Judul */}
          <div className="text-left mb-2">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Portal{' '}
              <span className={config.color}>
                {config.label}
              </span>
            </h2>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
              Aplikasi Sistem Informasi Akademik di lingkungan SMP Negeri 1 Majenang
            </p>
          </div>

          <div className="space-y-4">

            {/* Input ID */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="login-id"
                className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1"
              >
                {config.idLabel}
              </label>
              <input
                type="text"
                id="login-id"
                name="username"
                autoComplete="username"
                value={id}
                onChange={e => onIdChange(e.target.value)}
                placeholder={config.idPlaceholder}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl text-white text-sm border border-white/10 bg-black/40 outline-none focus:border-cyan-500/60 focus:bg-black/60 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Input Password */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="login-password"
                className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1"
              >
                {config.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={e => onPasswordChange(e.target.value)}
                  placeholder={config.passwordPlaceholder}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm border border-white/10 bg-black/40 outline-none focus:border-cyan-500/60 focus:bg-black/60 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={onTogglePassword}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors bg-transparent border-none"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                    : <Eye className="w-4 h-4" aria-hidden="true" />
                  }
                </button>
              </div>
            </div>

            {/* Dropdown Role */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="login-role"
                className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1"
              >
                Login Sebagai
              </label>
              <div className="relative">
                <select
                  id="login-role"
                  name="role"
                  autoComplete="off"
                  value={role}
                  onChange={e => onRoleChange(e.target.value as UserRole)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm border border-white/10 bg-slate-950/80 outline-none focus:border-cyan-500/60 transition-all cursor-pointer appearance-none pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="teacher" className="bg-slate-950 text-white">Pegawai</option>
                  <option value="student" className="bg-slate-950 text-white">Siswa</option>
                  <option value="parent" className="bg-slate-950 text-white">Orang Tua</option>
                  <option value="guest" className="bg-slate-950 text-white">Tamu</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-slate-950 text-sm font-bold transition-all shadow-xl tracking-wide mt-4 ${config.submitColor} ${
              isLoading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:opacity-90 active:scale-[0.98] cursor-pointer'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
                Memproses...
              </span>
            ) : (
              'Masuk'
            )}
          </button>
        </form>
      </div>

      {/* Footer Bantuan */}
      <div className="pt-4 border-t border-white/5 flex flex-col items-center gap-2 w-full max-w-[340px] mx-auto pb-2">
        <p className="text-xs text-slate-400">
          Memiliki kendala login?{' '}
          <button
            type="button"
            onClick={onHelpClick}
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors bg-transparent border-none cursor-pointer"
          >
            hubungi admin
          </button>
        </p>
      </div>
    </div>
  );
};

type PpdbView = 'landing' | 'form' | 'cek-kelulusan';

interface PpdbModalProps {
  view: PpdbView;
  onViewChange: (view: PpdbView) => void;
  onClose: () => void;
}

const PpdbModal: React.FC<PpdbModalProps> = ({ view, onViewChange, onClose }) => (
  <div
    role="dialog"
    aria-modal="true"
    aria-label="Pendaftaran Peserta Didik Baru"
    style={{ zIndex: Z_INDEX.ppdbModal }}
    className="fixed inset-0 bg-white overflow-y-auto"
  >
    {view === 'landing' && (
      <LandingPage
        onOpenForm={() => onViewChange('form')}
        onOpenCekKelulusan={() => onViewChange('cek-kelulusan')}
        onClose={onClose}
      />
    )}
    {view === 'form' && (
      <PPDBForm
        isModal={false}
        onBack={() => onViewChange('landing')}
        onClose={() => {
          onClose();
          onViewChange('landing');
        }}
      />
    )}
    {view === 'cek-kelulusan' && (
      <CekKelulusanPage
        onBack={() => onViewChange('landing')}
      />
    )}
  </div>
);

interface PerpustakaanModalProps {
  onClose: () => void;
}

const PerpustakaanModal: React.FC<PerpustakaanModalProps> = ({ onClose }) => (
  <Suspense
    fallback={
      <div
        style={{ zIndex: Z_INDEX.perpustakaanModal }}
        className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center"
      >
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl">
          <div
            className="animate-spin w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full mb-4"
            aria-hidden="true"
          />
          <p className="text-amber-400 text-sm font-bold tracking-wider uppercase animate-pulse">
            Memuat Perpustakaan...
          </p>
        </div>
      </div>
    }
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sistem Informasi Perpustakaan"
      style={{ zIndex: Z_INDEX.perpustakaanModal }}
      className="fixed inset-0"
    >
      <PerpustakaanApp onClose={onClose} />
    </div>
  </Suspense>
);

export default function LoginPage() {
  const { login } = useAuth();

  const [role, setRole] = useState<UserRole>('student');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [openAdminPanel, setOpenAdminPanel] = useState(false);
  const [adminScope, setAdminScope] = useState<'teacher' | 'student'>('student');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showExpectation, setShowExpectation] = useState(false);
  const [showPPDB, setShowPPDB] = useState(false);
  const [ppdbView, setPpdbView] = useState<PpdbView>('landing');
  const [showPerpustakaan, setShowPerpustakaan] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % BACKGROUND_IMAGES.length);
    }, SLIDESHOW_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setId('');
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || isLoading) return;

    setError('');
    setIsLoading(true);

    try {
      const trimmedId = id.trim();

      const ADMIN_USER = import.meta.env.VITE_ADMIN_USERNAME ?? 'admin';
      const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD ?? 'admin';

      if (trimmedId === ADMIN_USER && password === ADMIN_PASS) {
        setAdminScope(role === 'teacher' ? 'teacher' : 'student');
        setOpenAdminPanel(true);
        return;
      }

      const success = await Promise.resolve(login(trimmedId, password, role));
      if (!success) {
        setError('ID atau password salah. Silakan coba lagi.');
      }
    } catch {
      setError('Terjadi kesalahan. Silakan coba beberapa saat lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-slate-950 font-sans antialiased selection:bg-cyan-500 selection:text-slate-900 overflow-hidden">

      {/* Header */}
      <SiteHeader
        onClickHalamanKami={() => setShowExpectation(true)}
        onClickPendaftaran={() => setShowPPDB(true)}
        onClickPerpustakaan={() => setShowPerpustakaan(true)}
      />

      {/* Layout Utama */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 h-screen w-full pt-16 box-border">

        {/* Panel Kiri - Slideshow */}
        <div className="relative lg:col-span-7 w-full h-full overflow-hidden flex flex-col justify-end p-8 md:p-16 text-left border-b lg:border-b-0 border-white/5">
          <BackgroundSlideshow
            images={BACKGROUND_IMAGES}
            currentSlide={currentSlide}
          />

          {/* Caption Slide */}
          <div className="relative z-10 max-w-[600px] mt-auto">
            <h1 className="text-white text-2xl md:text-4xl font-black tracking-tight leading-tight mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-all duration-500">
              {BACKGROUND_IMAGES[currentSlide].caption}
            </h1>
            <p className="text-white text-sm font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] max-w-md">
              Selamat datang di Portal Utama Akademik SMP Negeri 1 Majenang.
              Akses informasi, manajemen data, dan fasilitas pembelajaran digital terpadu.
            </p>
          </div>
        </div>

        {/* Panel Kanan - Form Login */}
        <LoginForm
          role={role}
          id={id}
          password={password}
          showPassword={showPassword}
          isLoading={isLoading}
          error={error}
          onRoleChange={handleRoleChange}
          onIdChange={setId}
          onPasswordChange={setPassword}
          onTogglePassword={() => setShowPassword(prev => !prev)}
          onSubmit={handleSubmit}
          onHelpClick={() => setShowTutorial(true)}
        />
      </div>

      {/* ===== MODALS ===== */}

      {/* Tutorial */}
      <TutorialModal
        open={showTutorial}
        onClose={() => setShowTutorial(false)}
      />

      {/* Halaman Kami */}
      <ExpectationModal
        open={showExpectation}
        onClose={() => setShowExpectation(false)}
      />

      {/* PPDB */}
      {showPPDB && (
        <PpdbModal
          view={ppdbView}
          onViewChange={setPpdbView}
          onClose={() => {
            setShowPPDB(false);
            setPpdbView('landing');
          }}
        />
      )}

      {/* Perpustakaan */}
      {showPerpustakaan && (
        <PerpustakaanModal
          onClose={() => setShowPerpustakaan(false)}
        />
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
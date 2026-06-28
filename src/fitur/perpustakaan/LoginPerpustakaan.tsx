// src/fitur/perpustakaan/LoginPerpustakaan.tsx
import { useState } from 'react';
import { BookOpen, Eye, EyeOff, X, Library, AlertTriangle, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStudents } from '../../data/store';
import BantuanPerpustakaan from './BantuanPerpustakaan';

interface LoginPerpustakaanProps {
  onLoginSuccess: (studentData: {
    nisn: string;
    nama: string;
    kelas: string;
  }) => void;
  onBackToPortal: () => void;
}

export default function LoginPerpustakaan({ onLoginSuccess, onBackToPortal }: LoginPerpustakaanProps) {
  const { login } = useAuth();
  const [nisn, setNisn] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBantuan, setShowBantuan] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const trimmedNisn = nisn.trim();

    // Ambil data siswa dari store pusat agar sinkron
    const allStudents = getStudents();
    const student = allStudents.find(s => s.nis === trimmedNisn);

    if (!student) {
      setError('NISN tidak terdaftar di sistem sekolah.');
      setIsLoading(false);
      return;
    }

    // Validasi password portal
    if (password !== student.password) {
      setError('Kata sandi salah. Gunakan password yang sama dengan portal.');
      setIsLoading(false);
      return;
    }

    // Jika berhasil, kirim data ke parent
    onLoginSuccess({
      nisn: trimmedNisn,
      nama: student.name,
      kelas: 'Siswa',
    });

    setIsLoading(false);
  };

  // Jika halaman bantuan aktif, tampilkan komponen BantuanPerpustakaan
  if (showBantuan) {
    return (
      <BantuanPerpustakaan
        onClose={() => setShowBantuan(false)}
        onBackToLogin={() => setShowBantuan(false)}
      />
    );
  }

  return (
    <div className="relative min-h-[100dvh] w-screen flex flex-col items-center justify-between bg-slate-950 font-sans antialiased overflow-x-hidden p-4">

      {/* Background Gambar Alam / Estetik Bersih */}
      <div
  className="fixed inset-0 bg-cover bg-center z-0 scale-105"
  style={{
    backgroundImage: `url(${import.meta.env.BASE_URL}public/images/Dashboard/perpustakaan.jpg)`
  }}
/>
      {/* Overlay Gelap Halus untuk kontras */}
      <div className="fixed inset-0 bg-black/10 z-0" />

      {/* Spacer Atas */}
      <div className="h-4 w-full relative z-10" />

      {/* KOTAK LOGIN UTAMA (Gaya Pop-up Glassmorphism Mirip Gambar) */}
      <div className="relative z-10 w-full max-w-sm rounded-[2rem] p-8 sm:p-10 flex flex-col justify-center transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Tombol Back Bergaya Tombol Close Silang di Pojok Kanan Atas */}
        <button
          onClick={onBackToPortal}
          type="button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer border border-white/10"
          title="Kembali ke Portal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Judul Login Simpel */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Login
          </h1>
          <p className="text-[11px] text-white/60 tracking-wider uppercase mt-1">
            Perpustakaan SMPN 1 Majenang
          </p>
        </div>

        {/* Form Input Tipis Tanpa Banyak Teks */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Input NISN */}
          <div className="relative">
            <input
              type="text"
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              placeholder="NISN / Username Siswa"
              className="w-full px-4 py-3 rounded-xl text-white text-xs border border-white/20 bg-black/10 outline-none focus:border-white/50 focus:bg-black/20 transition-all placeholder:text-white/40"
              required
            />
          </div>

          {/* Input Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata Sandi Portal"
              className="w-full px-4 py-3 rounded-xl text-white text-xs border border-white/20 bg-black/10 outline-none focus:border-white/50 focus:bg-black/20 transition-all placeholder:text-white/40"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Alert Error Ringkas */}
          {error && (
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-[10px] font-medium leading-tight">{error}</p>
            </div>
          )}

          {/* Tombol Login Hitam Solid Tegas */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 rounded-xl bg-slate-950 hover:bg-black text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
          >
            {isLoading ? 'Memverifikasi...' : 'Login'}
          </button>

          {/* Link Butuh Bantuan — TERHUBUNG KE HALAMAN BANTUAN */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              className="flex items-center gap-1.5 text-[10px] text-white/50 hover:text-white transition-colors cursor-pointer group"
              onClick={() => setShowBantuan(true)}
            >
              <HelpCircle className="w-3 h-3 text-white/30 group-hover:text-white/60" />
              <span>Butuh bantuan ?</span>
            </button>
          </div>
        </form>

        {/* Petunjuk Kecil di Bagian Bawah Card */}
        <p className="text-center text-[9px] text-white/30 mt-6">
          Akun sama dengan Portal Akademik
        </p>
      </div>

      {/* FOOTER BAWAH HALUS */}
      <footer className="relative z-10 text-center text-[10px] text-white/40 py-4">
        © 2025 SMP Negeri 1 Majenang • Digital Library Hub
      </footer>

    </div>
  );
}
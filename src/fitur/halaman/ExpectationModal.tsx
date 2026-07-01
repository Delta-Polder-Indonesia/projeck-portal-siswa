import { useRef, useState } from 'react';
import { navItems } from './data';
import type { ExpectationModalProps, NavItem } from './types';
import BerandaPage from './pages/BerandaPage';
import BeritaPage from './pages/BeritaPage';
import GaleriPage from './pages/GaleriPage';
import GuruPegawaiPage from './pages/GuruPegawaiPage';
import GtkSiswaPage from './pages/GtkSiswaPage';
import KegiatanSekolahPage from './pages/KegiatanSekolahPage';
import KontakPage from './pages/KontakPage';
import ProfilPage from './pages/ProfilPage';
import ProgramSekolahPage from './pages/ProgramSekolahPage';
import ProgramKeahlianPage from './pages/ProgramKeahlianPage';
import SaranaPrasaranaPage from './pages/SaranaPrasaranaPage';

export default function ExpectationModal({ open, onClose, onOpenRegistration }: ExpectationModalProps) {
  const [activeMenu, setActiveMenu] = useState<NavItem>('Beranda');
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleNavigate = (menu: NavItem) => {
    setActiveMenu(menu);
    contentRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  };

  const renderPage = () => {
    const props = { onNavigate: handleNavigate };

    switch (activeMenu) {
      case 'Beranda':
        return (
          <BerandaPage
            {...props}
            onRegister={() => {
              onClose();
              onOpenRegistration?.();
            }}
          />
        );
      case 'Profil':           return <ProfilPage {...props} />;
      case 'Program Sekolah':  return <ProgramSekolahPage {...props} />;
      case 'Program Keahlian': return <ProgramKeahlianPage {...props} />;
      case 'GTK & Siswa':      return <GtkSiswaPage {...props} />;
      case 'Sarana Prasarana': return <SaranaPrasaranaPage {...props} />;
      case 'Kegiatan Sekolah': return <KegiatanSekolahPage {...props} />;
      case 'Berita':           return <BeritaPage {...props} />;
      case 'Galeri':           return <GaleriPage {...props} />;
      case 'Guru & Pegawai':   return <GuruPegawaiPage {...props} />;
      case 'Kontak':           return <KontakPage {...props} />;
      default:
        return (
          <BerandaPage
            {...props}
            onRegister={() => {
              onClose();
              onOpenRegistration?.();
            }}
          />
        );
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="school-modal-title"
      className="fixed inset-0 z-[100] overflow-hidden bg-slate-900/60 backdrop-blur-sm"
    >
      <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0b1f46] shadow-2xl animate-modal-in">

        {/* ════════════════════════════════════════
            HEADER — STICKY
        ════════════════════════════════════════ */}
        <div className="flex-shrink-0 bg-white shadow-sm">

          {/* Logo + Tombol Tutup */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full shadow-md shadow-blue-900/10">
                <img
                  src={`${import.meta.env.BASE_URL}images/logo/gambar-2.svg`}
                  alt="Logo SMP Negeri 1 Majenang"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h1
                  id="school-modal-title"
                  className="text-xl font-bold leading-tight tracking-tight text-blue-900 md:text-2xl"
                >
                  SMP Negeri 1 Majenang
                </h1>
                <p className="hidden text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-600 sm:block">
                  SMP Unggulan Yang Menghasilkan SDM Bermutu Dan Berdaya Saing Tinggi
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-slate-700 transition hover:text-slate-900 cursor-pointer"
            >
              Tutup
            </button>
          </div>

          {/* Navbar Menu */}
          <nav className="flex overflow-x-auto whitespace-nowrap bg-[#183b7e] px-2 header-scrollbar-hidden">
            {navItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleNavigate(item)}
                className="relative cursor-pointer px-4 py-2 text-xs font-semibold"
              >
                {activeMenu === item && (
                  <span className="absolute inset-0 bg-amber-400 transition-all duration-300 ease-out" />
                )}
                <span className={`relative z-10 ${activeMenu === item ? 'text-slate-900' : 'text-white'}`}>
                  {item}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* ════════════════════════════════════════
            CONTENT — SCROLL AREA
        ════════════════════════════════════════ */}
        <div
          ref={contentRef}
          className="flex min-h-0 flex-grow flex-col overflow-y-auto overscroll-contain bg-[#0b1f46]"
        >
          {/* Halaman Aktif */}
          <div className="flex-grow bg-white">
  <div key={activeMenu} className="animate-content-in">
    {renderPage()}
  </div>
</div>

          {/* ════════════════════════════════════════
              FOOTER
          ════════════════════════════════════════ */}
          <footer className="mt-auto">
            <div className="grid grid-cols-1 gap-6 border-t border-blue-900/30 bg-gradient-to-r from-[#12366a] to-[#0f234d] px-6 py-8 text-xs text-gray-300 sm:grid-cols-2 md:grid-cols-4">

              {/* Kolom 1 — Sosial Media */}
              <div>
                <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold uppercase text-white">
                  Social Media Kami
                </h4>
                <p className="mb-3 text-[11px] text-gray-300">
                  Ayo follow dan ikuti informasi seputar kegiatan SMP Negeri 1 Majenang di media sosial kami.
                </p>
                <ul className="space-y-2 text-[11px] text-amber-300">
                  {[
                    { label: 'Twitter',   icon: 'twitter.png',   href: '#' },
                    { label: 'Facebook',  icon: 'facebook.png',  href: '#' },
                    { label: 'Instagram', icon: 'Instagram.png', href: '#' },
                  ].map(({ label, icon, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 hover:underline"
                      >
                        <img
                          src={`${import.meta.env.BASE_URL}images/SosialMedia/${icon}`}
                          alt={label}
                          className="h-4 w-4 object-contain"
                        />
                        <span>{label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kolom 2 — Tentang Sekolah */}
              <div>
                <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold uppercase text-white">
                  Tentang SMP Negeri 1 Majenang
                </h4>
                <p className="text-justify text-[11px] leading-relaxed text-gray-300">
                  SMP Negeri 1 Majenang merupakan salah satu lembaga pendidikan menengah pertama negeri
                  yang berlokasi di Kecamatan Majenang, Kabupaten Cilacap, Jawa Tengah yang berkomitmen
                  menghasilkan lulusan berdaya saing tinggi.
                </p>
              </div>

              {/* Kolom 3 — Link Tautan */}
              <div>
                <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold uppercase text-white">
                  Link Tautan Kami
                </h4>
                <ul className="space-y-1 text-[11px] text-amber-300">
                  {[
                    'Kementerian Pendidikan dan Kebudayaan',
                    'PPDB SMP Negeri 1 Majenang',
                    'e-Perpus SMP Negeri 1 Majenang',
                    'e-Lab SMP Negeri 1 Majenang',
                  ].map((label) => (
                    <li key={label}>
                      <button
                        type="button"
                        className="cursor-pointer text-left hover:underline"
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kolom 4 — Informasi Terkini */}
              <div>
                <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold uppercase text-white">
                  Informasi Terkini
                </h4>
                <ul className="space-y-2 text-[11px] text-gray-300">
                  {[
                    'PELAKSANAAN ASESMEN NASIONAL BERBASIS KOMPUTER (ANBK) TAHUN AJARAN 2026/2027',
                    'DIES NATALIS SMP NEGERI 1 MAJENANG KE 49 & AMBISI SEKOLAH DIGITAL',
                  ].map((title) => (
                    <li key={title}>
                      <button
                        type="button"
                        onClick={() => handleNavigate('Berita')}
                        className="line-clamp-2 cursor-pointer text-left hover:underline"
                      >
                        {title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Copyright Bar */}
            <div className="space-y-1 bg-[#0b1f46] px-4 py-4 text-center text-[11px] text-gray-300">
              <div className="mb-1 flex flex-wrap justify-center gap-3 text-xs text-white">
                {(
                  [
                    { label: 'Beranda',          menu: 'Beranda' },
                    { label: 'Program Keahlian', menu: 'Program Keahlian' },
                    { label: 'Guru & Pegawai',   menu: 'Guru & Pegawai' },
                    { label: 'Kontak Kami',      menu: 'Kontak' },
                  ] as { label: string; menu: NavItem }[]
                ).map(({ label, menu }, idx, arr) => (
                  <span key={label} className="inline-flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleNavigate(menu)}
                      className="cursor-pointer hover:underline"
                    >
                      {label}
                    </button>
                    {idx < arr.length - 1 && (
                      <span className="text-white/40">|</span>
                    )}
                  </span>
                ))}
              </div>
              <p>All Rights Reserved TIM ICT 2017 - 2026, SMP Negeri 1 Majenang</p>
              <p className="text-[10px] text-blue-200/60">Proudly powered by React & Tailwind CSS</p>
            </div>
          </footer>
        </div>
      </div>

      <style>{`
        .header-scrollbar-hidden::-webkit-scrollbar { display: none; }
        .header-scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.98); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes content-in {
          from { opacity: 0.4; transform: translateY(6px); }
          to   { opacity: 1;   transform: translateY(0); }
        }

        .animate-modal-in   { animation: modal-in   0.25s ease-out; }
        .animate-content-in { animation: content-in 0.18s ease-out; }
      `}</style>
    </div>
  );
}
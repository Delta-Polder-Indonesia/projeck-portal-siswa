import { useState } from 'react';
import { navItems } from './data';
import type { ExpectationModalProps, NavItem } from './types';
import BerandaPage from './pages/BerandaPage';
import BeritaPage from './pages/BeritaPage';
import GaleriPage from './pages/GaleriPage';
import GtkSiswaPage from './pages/GtkSiswaPage';
import KegiatanSekolahPage from './pages/KegiatanSekolahPage';
import KontakPage from './pages/KontakPage';
import ProfilPage from './pages/ProfilPage';
import ProgramSekolahPage from './pages/ProgramSekolahPage';
import SaranaPrasaranaPage from './pages/SaranaPrasaranaPage';

export default function ExpectationModal({ open, onClose, onOpenRegistration }: ExpectationModalProps) {
  const [activeMenu, setActiveMenu] = useState<NavItem>('Beranda');

  // ⬇️ FUNGSI NAVIGASI UTAMA
  const handleNavigate = (menu: NavItem) => {
    setActiveMenu(menu);
    // Auto-scroll ke atas
    const contentArea = document.querySelector('.content-scroll-area');
    if (contentArea) contentArea.scrollTop = 0;
  };

  const renderMenuPage = () => {
    const pageProps = { onNavigate: handleNavigate };

    if (activeMenu === 'Beranda') {
      return (
        <BerandaPage
          {...pageProps}
          onRegister={() => {
            onClose();
            onOpenRegistration?.();
          }}
        />
      );
    }
    if (activeMenu === 'Profil') return <ProfilPage {...pageProps} />;
    if (activeMenu === 'Program Sekolah') return <ProgramSekolahPage {...pageProps} />;
    if (activeMenu === 'GTK & Siswa') return <GtkSiswaPage {...pageProps} />;
    if (activeMenu === 'Sarana Prasarana') return <SaranaPrasaranaPage {...pageProps} />;
    if (activeMenu === 'Kegiatan Sekolah') return <KegiatanSekolahPage {...pageProps} />;
    if (activeMenu === 'Berita') return <BeritaPage {...pageProps} />;
    if (activeMenu === 'Galeri') return <GaleriPage {...pageProps} />;
    return <KontakPage {...pageProps} />;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-slate-900/60 p-0 backdrop-blur-sm">
      <div className="flex h-screen w-full max-w-none flex-col overflow-hidden rounded-none bg-[#0b1f46] shadow-2xl animate-modal-in">
        <>
          {/* --- AREA TETAP / STICKY --- */}
          <div className="flex-shrink-0 shadow-sm bg-white">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-[11px] sm:justify-start">
              <div className="flex items-center gap-2"></div>
            </div>

            <div className="relative flex flex-col items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-2.5 md:flex-row">
              <div className="flex flex-col items-center gap-3 text-center sm:flex-row md:text-left">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full shadow-md shadow-blue-900/10">
                  <img
                    src={`${import.meta.env.BASE_URL}images/logo/gambar-2.svg`}
                    alt="Logo Sekolah"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-blue-900">SMP Negeri 1 Majenang</h1>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-600 hidden sm:block">
                    SMP Unggulan Yang Menghasilkan SDM Bermutu Dan Berdaya Saing Tinggi
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-sm font-medium text-slate-700 transition hover:text-slate-900 cursor-pointer"
              >
                Tutup
              </button>
            </div>

            <div className="flex overflow-x-auto whitespace-nowrap bg-[#183b7e] text-xs font-semibold text-white px-2 header-scrollbar-hidden">
              {navItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleNavigate(item)}
                  className="relative cursor-pointer px-4 py-2"
                >
                  {activeMenu === item && (
                    <span className="absolute inset-0 bg-amber-400 transition-all duration-300 ease-out" />
                  )}
                  <span className={`relative z-10 ${activeMenu === item ? 'text-slate-900' : 'text-white'}`}>
                    {item}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* --- AREA DINAMIS CONTENT --- */}
          <div className="content-scroll-area flex-grow overflow-y-auto min-h-0 flex flex-col bg-[#0b1f46] overscroll-contain">
            <div key={activeMenu} className="flex-grow bg-white animate-content-in">
              {renderMenuPage()}
            </div>

            {/* Footer */}
            <div className="grid grid-cols-1 gap-6 border-t border-blue-900/30 bg-gradient-to-r from-[#12366a] to-[#0f234d] px-6 py-8 text-xs text-gray-300 sm:grid-cols-2 md:grid-cols-4 mt-auto">
              <div>
                <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold uppercase text-white">Social Media Kami</h4>
                <p className="text-[11px] text-gray-300 mb-3">
                  Ayo follow dan ikuti informasi seputar kegiatan di SMP Negeri 1 Majenang di media sosial kami.
                </p>
                
                {/* TEMPLAT LINK SOSIAL MEDIA */}
                <ul className="space-y-2 text-[11px] text-amber-300">
                  <li>
                    {/* Ganti href="#" dengan url twitter sekolah contoh: href="https://twitter.com/username" */}
                    <a 
                      href="#" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex inline-flex items-center gap-2 hover:underline"
                    >
                      <img 
                        src={`${import.meta.env.BASE_URL}images/SosialMedia/twitter.png`} 
                        alt="Twitter" 
                        className="h-4 w-4 object-contain"
                      />
                      <span>Twitter</span>
                    </a>
                  </li>
                  <li>
                    {/* Ganti href="#" dengan url facebook sekolah */}
                    <a 
                      href="#" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex inline-flex items-center gap-2 hover:underline"
                    >
                      <img 
                        src={`${import.meta.env.BASE_URL}images/SosialMedia/facebook.png`} 
                        alt="Facebook" 
                        className="h-4 w-4 object-contain"
                      />
                      <span>Facebook</span>
                    </a>
                  </li>
                  <li>
                    {/* Ganti href="#" dengan url instagram sekolah */}
                    <a 
                      href="#" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex inline-flex items-center gap-2 hover:underline"
                    >
                      <img 
                        src={`${import.meta.env.BASE_URL}images/SosialMedia/Instagram.png`} 
                        alt="Instagram" 
                        className="h-4 w-4 object-contain"
                      />
                      <span>Instagram</span>
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold uppercase text-white">Tentang SMP Negeri 1 Majenang</h4>
                <p className="text-justify text-[11px] leading-relaxed text-gray-300">
                  SMP Negeri 1 Majenang merupakan salah satu lembaga pendidikan dasar tingkat menengah pertama negeri yang berlokasi di Kecamatan Majenang, Kabupaten Cilacap, Jawa Tengah yang berkomitmen menghasilkan lulusan berdaya saing tinggi.
                </p>
              </div>
              
              <div>
                <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold uppercase text-white">Link Tautan Kami</h4>
                <ul className="space-y-1 text-[11px] text-amber-300">
                  <li className="cursor-pointer hover:underline">Kementerian Pendidikan dan Kebudayaan</li>
                  <li className="cursor-pointer hover:underline">PPDB SMP Negeri 1 Majenang</li>
                  <li className="cursor-pointer hover:underline">e-Perpus SMP Negeri 1 Majenang</li>
                  <li className="cursor-pointer hover:underline">e-Lab SMP Negeri 1 Majenang</li>
                </ul>
              </div>
              
              <div>
                <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold uppercase text-white">Informasi Terkini</h4>
                <ul className="space-y-2 text-[11px] text-gray-300">
                  <li 
                    className="line-clamp-2 cursor-pointer hover:underline"
                    onClick={() => handleNavigate('Berita')}
                  >
                    PELAKSANAAN ASESMEN NASIONAL BERBASIS KOMPUTER (ANBK) TAHUN AJARAN 2026/2027
                  </li>
                  <li 
                    className="line-clamp-2 cursor-pointer hover:underline"
                    onClick={() => handleNavigate('Berita')}
                  >
                    DIES NATALIS SMP NEGERI 1 MAJENANG KE 49 & AMBISI SEKOLAH DIGITAL
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-1 bg-[#0b1f46] px-4 py-4 text-center text-[11px] text-gray-300">
              <div className="mb-1 flex justify-center gap-4 text-xs text-white">
                <span className="cursor-pointer hover:underline" onClick={() => handleNavigate('Beranda')}>Beranda</span>
                <span>|</span>
                <span className="cursor-pointer hover:underline" onClick={() => handleNavigate('Program Sekolah')}>Program Sekolah</span>
                <span>|</span>
                <span className="cursor-pointer hover:underline" onClick={() => handleNavigate('Kontak')}>Kontak Kami</span>
              </div>
              <p>All Rights Reserved TIM ICT 2017 - 2026, SMP Negeri 1 Majenang</p>
              <p className="text-[10px] text-blue-200/60">Proudly powered by React & Tailwind CSS</p>
            </div>
          </div>
        </>
      </div>

      <style>{`
        .header-scrollbar-hidden::-webkit-scrollbar { display: none; }
        .header-scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes content-in {
          from { opacity: 0.4; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.25s ease-out; }
        .animate-content-in { animation: content-in 0.18s ease-out; }
      `}</style>
    </div>
  );
}
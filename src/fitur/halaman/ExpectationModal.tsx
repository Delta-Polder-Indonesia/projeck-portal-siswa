import { useState } from 'react';
import { Mail, MapPin, Phone, Sparkles, X } from 'lucide-react';
import { navItems } from './data';
import type { ExpectationModalProps, NavItem } from './types';
import BerandaPage from './pages/BerandaPage';
import BeritaPage from './pages/BeritaPage';
import GaleriPage from './pages/GaleriPage';
import GtkSiswaPage from './pages/GtkSiswaPage';
import KegiatanSekolahPage from './pages/KegiatanSekolahPage';
import KontakPage from './pages/KontakPage';
import ProfilPage from './pages/ProfilPage';
import ProgramKeahlianPage from './pages/ProgramKeahlianPage';
import ProgramSekolahPage from './pages/ProgramSekolahPage';
import SaranaPrasaranaPage from './pages/SaranaPrasaranaPage';

export default function ExpectationModal({ open, onClose, onOpenRegistration }: ExpectationModalProps) {
  const [activeMenu, setActiveMenu] = useState<NavItem>('Beranda');

  const renderMenuPage = () => {
    if (activeMenu === 'Beranda') {
      return (
        <BerandaPage
          onRegister={() => {
            onClose();
            onOpenRegistration?.();
          }}
        />
      );
    }
    if (activeMenu === 'Profil') return <ProfilPage />;
    if (activeMenu === 'Program Sekolah') return <ProgramSekolahPage />;
    if (activeMenu === 'Program Keahlian') return <ProgramKeahlianPage />;
    if (activeMenu === 'GTK & Siswa') return <GtkSiswaPage />;
    if (activeMenu === 'Sarana Prasarana') return <SaranaPrasaranaPage />;
    if (activeMenu === 'Kegiatan Sekolah') return <KegiatanSekolahPage />;
    if (activeMenu === 'Berita') return <BeritaPage />;
    if (activeMenu === 'Galeri') return <GaleriPage />;
    return <KontakPage />;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-slate-900/60 p-0 backdrop-blur-sm">
      <div className="flex h-screen w-full max-w-none flex-col overflow-hidden rounded-none bg-white shadow-2xl animate-modal-in">
          <>
            {/* --- AREA TETAP / STICKY (Sudah Dikompakkan Secara Vertikal) --- */}
            <div className="flex-shrink-0 shadow-sm">
              {/* Top Bar (Dibuat py-1 agar lebih tipis) */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-[11px] sm:justify-start">
                <div className="flex items-center gap-2">
                </div>
              </div>

              {/* Header (Padding dipangkas dari py-5 ke py-2.5, layout dibuat lebih rapat) */}
              <div className="relative flex flex-col items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-2.5 md:flex-row">
                <div className="flex flex-col items-center gap-3 text-center sm:flex-row md:text-left">
                  {/* Ukuran logo disesuaikan sedikit menjadi h-12 w-12 */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full shadow-md shadow-blue-900/10">
  <img
    src={`${import.meta.env.BASE_URL}images/logo/gambar-1.jpg`}
    alt="Logo Sekolah"
    className="h-full w-full object-cover"
  />
</div>
                  <div>
                    {/* Ukuran judul diturunkan agar menghemat ruang tinggi layar */}
                    <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-blue-900">SMP Negeri 1 Majenang</h1>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-600 hidden sm:block">
                      SMP Unggulan Yang Menghasilkan SDM Bermutu Dan Berdaya Saing Tinggi
                    </p>
                  </div>
                </div>
                {/* Input Search dibuat lebih slim dengan py-1 */}
                  <button
                    onClick={onClose}
                    className="p-2.5 rounded-xl border-2 border-gray-300 text-gray-900 bg-white font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-gray-50"
                  >
                    <X className="h-2.5 w-2.5" /> Tutup
                  </button>
                </div>

              {/* Navigation Bar (Tinggi menu disesuaikan dari py-3 ke py-2) */}
              <div className="flex overflow-x-auto whitespace-nowrap bg-[#183b7e] text-xs font-semibold text-white px-2 header-scrollbar-hidden">
                {navItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setActiveMenu(item)}
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

            {/* --- AREA DINAMIS CONTEN (Area ini sekarang mendapat porsi layar jauh lebih luas) --- */}
            <div className="flex-grow overflow-y-auto min-h-0 flex flex-col">
              <div key={activeMenu} className="flex-grow animate-content-in">
                {renderMenuPage()}
              </div>

              {/* Footer */}
              <div className="grid grid-cols-1 gap-6 border-t border-blue-900/30 bg-gradient-to-r from-[#12366a] to-[#0f234d] px-6 py-8 text-xs text-gray-300 sm:grid-cols-2 md:grid-cols-4 mt-auto">
                <div>
                  <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold uppercase text-white">Social Media Kami</h4>
                  <p className="text-[11px] text-gray-300">
                    Ayo follow dan ikuti informasi seputar kegiatan di SMP Negeri 1 Majenang di media sosial kami.
                  </p>
                </div>
                <div>
                  <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold uppercase text-white">Tentang SMP Negeri 1 Majenang</h4>
                  <p className="text-justify text-[11px] leading-relaxed text-gray-300">
                    SMP Negeri 1 Majenang merupakan salah satu lembaga pendidikan menengah kejuruan di Kota Cimahi, Jawa
                    Barat yang menyelenggarakan program pendidikan kejuruan.
                  </p>
                </div>
                <div>
                  <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold uppercase text-white">Link Tautan Kami</h4>
                  <ul className="space-y-1 text-[11px] text-amber-300">
                    <li className="cursor-pointer hover:underline">DJPSMK - Kementerian Pendidikan dan Kebudayaan</li>
                    <li className="cursor-pointer hover:underline">PPDB SMP Negeri 1 Majenang</li>
                    <li className="cursor-pointer hover:underline">e-Perpus SMP Negeri 1 Majenang</li>
                    <li className="cursor-pointer hover:underline">e-Lab SMP Negeri 1 Majenang</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold uppercase text-white">Informasi Terkini</h4>
                  <ul className="space-y-2 text-[11px] text-gray-300">
                    <li className="line-clamp-2 cursor-pointer hover:underline">
                      ACHIEVEMENT MOTIVATION TRAINING SESSION 2, CITARIK, SUKABUMI 19-20 APRIL 2019
                    </li>
                    <li className="line-clamp-2 cursor-pointer hover:underline">
                      DIES NATALIS SMP Negeri 1 Majenang KE 42 & PEMBUKAAN PFM ANGKATAN 29
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="space-y-1 bg-[#0b1f46] px-4 py-4 text-center text-[11px] text-gray-300">
                <div className="mb-1 flex justify-center gap-4 text-xs text-white">
                  <span className="cursor-pointer hover:underline" onClick={() => setActiveMenu('Beranda')}>Beranda</span>
                  <span>|</span>
                  <span className="cursor-pointer hover:underline" onClick={() => setActiveMenu('Program Sekolah')}>Program Sekolah</span>
                  <span>|</span>
                  <span className="cursor-pointer hover:underline" onClick={() => setActiveMenu('Program Keahlian')}>Program Keahlian</span>
                  <span>|</span>
                  <span className="cursor-pointer hover:underline" onClick={() => setActiveMenu('Kontak')}>Kontak Kami</span>
                </div>
                <p>All Rights Reserved TIM ICT 2017 - 2026, SMP Negeri 1 Majenang</p>
                <p className="text-[10px] text-blue-200/60">Proudly powered by WordPress | Education Hub by WEN Themes</p>
              </div>
            </div>
          </>
      </div>

      <style>{`
        /* Menyembunyikan scrollbar horizontal di menu navigasi atas agar lebih clean */
        .header-scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .header-scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes content-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-modal-in {
          animation: modal-in 0.25s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.25s ease-out;
        }
        .animate-content-in {
          animation: content-in 0.22s ease-out;
        }
      `}</style>
    </div>
  );
}

import { useState } from "react";
import { Mail, MapPin, Phone, Sparkles, X } from "lucide-react";
import { navItems } from "./data";
import type { ExpectationModalProps, NavItem } from "./types";
import PPDBForm from "./PPDBForm";
import BerandaPage from "./pages/BerandaPage";
import BeritaPage from "./pages/BeritaPage";
import GaleriPage from "./pages/GaleriPage";
import GtkSiswaPage from "./pages/GtkSiswaPage";
import KegiatanSekolahPage from "./pages/KegiatanSekolahPage";
import KontakPage from "./pages/KontakPage";
import ProfilPage from "./pages/ProfilPage";
import ProgramKeahlianPage from "./pages/ProgramKeahlianPage";
import ProgramSekolahPage from "./pages/ProgramSekolahPage";
import SaranaPrasaranaPage from "./pages/SaranaPrasaranaPage";

export default function ExpectationModal({ open, onClose }: ExpectationModalProps) {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<NavItem>("Beranda");

  const renderMenuPage = () => {
    if (activeMenu === "Beranda") return <BerandaPage onRegister={() => setIsRegistering(true)} />;
    if (activeMenu === "Profil") return <ProfilPage />;
    if (activeMenu === "Program Sekolah") return <ProgramSekolahPage />;
    if (activeMenu === "Program Keahlian") return <ProgramKeahlianPage />;
    if (activeMenu === "GTK & Siswa") return <GtkSiswaPage />;
    if (activeMenu === "Sarana Prasarana") return <SaranaPrasaranaPage />;
    if (activeMenu === "Kegiatan Sekolah") return <KegiatanSekolahPage />;
    if (activeMenu === "Berita") return <BeritaPage />;
    if (activeMenu === "Galeri") return <GaleriPage />;
    return <KontakPage />;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-slate-900/60 p-0 backdrop-blur-sm">
      <div className="flex h-screen w-full max-w-none flex-col overflow-hidden rounded-none bg-white shadow-2xl animate-modal-in">
        {isRegistering ? (
          <div className="flex-grow overflow-y-auto bg-gradient-to-b from-slate-50 to-white p-6 animate-fade-in">
            <PPDBForm onBack={() => setIsRegistering(false)} />
          </div>
        ) : (
          <>
            {/* --- AREA TETAP / STICKY (Sudah Dikompakkan Secara Vertikal) --- */}
            <div className="flex-shrink-0 shadow-sm">
              {/* Top Bar (Dibuat py-1 agar lebih tipis) */}
              <div className="flex flex-col items-center justify-between gap-1 border-b border-blue-950 bg-[#12366a] px-6 py-1 text-xs text-white sm:flex-row">
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 text-[11px] sm:justify-start">
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3 w-3" /> 022 - 6629683
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3" /> smkn1cimahi@gmail.com
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> JL. Mahar Martanegara No. 48 Utama, Cimahi Selatan
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-1 rounded bg-amber-400 px-1.5 py-0.5 text-[10px] font-semibold text-slate-900">
                    <Sparkles className="h-2.5 w-2.5" /> Link Tautan Kami
                  </button>
                  <button
                    onClick={onClose}
                    className="flex cursor-pointer items-center gap-1 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white transition-colors hover:bg-red-700"
                  >
                    <X className="h-2.5 w-2.5" /> Tutup
                  </button>
                </div>
              </div>

              {/* Header (Padding dipangkas dari py-5 ke py-2.5, layout dibuat lebih rapat) */}
              <div className="relative flex flex-col items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-2.5 md:flex-row">
                <div className="flex flex-col items-center gap-3 text-center sm:flex-row md:text-left">
                  {/* Ukuran logo disesuaikan sedikit menjadi h-12 w-12 */}
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-900 to-blue-700 p-1 font-bold text-white shadow-md shadow-blue-900/10">
                    <span className="text-center text-[10px] leading-none">
                      SMKN 1<br />CMH
                    </span>
                  </div>
                  <div>
                    {/* Ukuran judul diturunkan agar menghemat ruang tinggi layar */}
                    <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-blue-900">SMK Negeri 1 Cimahi</h1>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-600 hidden sm:block">
                      SMK Unggulan Yang Menghasilkan SDM Bermutu Dan Berdaya Saing Tinggi
                    </p>
                  </div>
                </div>
                {/* Input Search dibuat lebih slim dengan py-1 */}
                <div className="flex w-full items-center overflow-hidden rounded-md border border-slate-300 md:w-auto">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-3 py-1 text-xs focus:outline-none md:w-48"
                  />
                  <button className="bg-blue-900 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-blue-800">
                    Search
                  </button>
                </div>
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
                    <span className={`relative z-10 ${activeMenu === item ? "text-slate-900" : "text-white"}`}>
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
                    Ayo follow dan ikuti informasi seputar kegiatan di SMK Negeri 1 Cimahi di media sosial kami.
                  </p>
                </div>
                <div>
                  <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold uppercase text-white">Tentang SMKN 1 Cimahi</h4>
                  <p className="text-justify text-[11px] leading-relaxed text-gray-300">
                    SMK Negeri 1 Cimahi merupakan salah satu lembaga pendidikan menengah kejuruan di Kota Cimahi, Jawa
                    Barat yang menyelenggarakan program pendidikan kejuruan.
                  </p>
                </div>
                <div>
                  <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold uppercase text-white">Link Tautan Kami</h4>
                  <ul className="space-y-1 text-[11px] text-amber-300">
                    <li className="cursor-pointer hover:underline">DJPSMK - Kementerian Pendidikan dan Kebudayaan</li>
                    <li className="cursor-pointer hover:underline">PPDB SMKN 1 Cimahi</li>
                    <li className="cursor-pointer hover:underline">e-Perpus SMKN 1 Cimahi</li>
                    <li className="cursor-pointer hover:underline">e-Lab SMKN 1 Cimahi</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 border-b border-blue-800 pb-1 font-bold uppercase text-white">Informasi Terkini</h4>
                  <ul className="space-y-2 text-[11px] text-gray-300">
                    <li className="line-clamp-2 cursor-pointer hover:underline">
                      ACHIEVEMENT MOTIVATION TRAINING SESSION 2, CITARIK, SUKABUMI 19-20 APRIL 2019
                    </li>
                    <li className="line-clamp-2 cursor-pointer hover:underline">
                      DIES NATALIS SMKN 1 CIMAHI KE 42 & PEMBUKAAN PFM ANGKATAN 29
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="space-y-1 bg-[#0b1f46] px-4 py-4 text-center text-[11px] text-gray-300">
                <div className="mb-1 flex justify-center gap-4 text-xs text-white">
                  <span className="cursor-pointer hover:underline" onClick={() => setActiveMenu("Beranda")}>Beranda</span>
                  <span>|</span>
                  <span className="cursor-pointer hover:underline" onClick={() => setActiveMenu("Program Sekolah")}>Program Sekolah</span>
                  <span>|</span>
                  <span className="cursor-pointer hover:underline" onClick={() => setActiveMenu("Program Keahlian")}>Program Keahlian</span>
                  <span>|</span>
                  <span className="cursor-pointer hover:underline" onClick={() => setActiveMenu("Kontak Kami")}>Kontak Kami</span>
                </div>
                <p>All Rights Reserved TIM ICT 2017 - 2026, SMKN 1 CIMAHI</p>
                <p className="text-[10px] text-blue-200/60">Proudly powered by WordPress | Education Hub by WEN Themes</p>
              </div>
            </div>
          </>
        )}
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
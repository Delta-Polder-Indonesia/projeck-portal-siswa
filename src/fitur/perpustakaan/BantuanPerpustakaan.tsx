// src/fitur/perpustakaan/BantuanPerpustakaan.tsx
import { useState } from 'react';
import {
  X, HelpCircle, BookOpen, KeyRound, UserCheck, Mail,
  ChevronDown, ChevronUp, ArrowLeft, AlertCircle,
  Library, Clock, ShieldCheck, MessageCircle, Info,
  GraduationCap, User, Shield
} from 'lucide-react';

interface BantuanPerpustakaanProps {
  onClose: () => void;
  onBackToLogin?: () => void;
}

type FaqItem = {
  question: string;
  answer: string;
};

const faqList: FaqItem[] = [
  {
    question: 'Bagaimana cara login ke Perpustakaan?',
    answer: 'Gunakan NISN dan password yang sama dengan Portal Akademik. Jika belum memiliki akun portal, silakan daftar melalui menu PPDB terlebih dahulu.'
  },
  {
    question: 'Saya lupa password, apa yang harus dilakukan?',
    answer: 'Password Perpustakaan terhubung dengan Portal Akademik. Silakan reset password melalui halaman login portal utama atau hubungi petugas TU (Tata Usaha) di sekolah.'
  },
  {
    question: 'Berapa lama masa peminjaman buku?',
    answer: 'Masa peminjaman standar adalah 7 hari kerja. Perpanjangan dapat diajukan maksimal 2 kali jika buku tidak dipesan oleh anggota lain.'
  },
  {
    question: 'Apakah guru juga bisa mengakses sistem ini?',
    answer: 'Ya. Guru dapat login menggunakan NIP dan password portal yang sama. Guru memiliki hak akses yang berbeda dari siswa.'
  },
  {
    question: 'Bagaimana jika buku yang ingin dipinjam stoknya habis?',
    answer: 'Anda dapat memesan buku tersebut. Sistem akan memberi notifikasi ketika buku tersedia kembali.'
  }
];

export default function BantuanPerpustakaan({ onClose, onBackToLogin }: BantuanPerpustakaanProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'faq' | 'kontak' | 'panduan' | 'akun'>('faq');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="fixed inset-0 z-[300] flex flex-col bg-white font-serif text-gray-900 w-full max-w-none overflow-hidden">

      {/* Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-8 sm:px-6">
        <div className="relative w-full max-w-none">

          {/* Banner / Judul Utama */}
          <div className="relative text-center pb-5 mb-6 border-b-4 border-double border-gray-900 pt-14 md:pt-10">
            <div className="absolute top-14 md:top-10 right-0 z-10">
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl border-2 border-gray-900 text-gray-900 bg-white font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-gray-100"
                title="Tutup Halaman"
              >
                <X className="w-3.5 h-3.5" /> Tutup
              </button>
            </div>

            <p className="text-xs uppercase tracking-widest font-sans font-bold text-gray-600 mb-1">
              Pusat Bantuan • Perpustakaan Digital
            </p>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none mb-2 pr-24 pl-24">
              BANTUAN PERPUSTAKAAN
            </h1>
            <p className="text-sm italic text-gray-600 max-w-2xl mx-auto">
              Panduan Lengkap, FAQ, dan Informasi Kontak Layanan Perpustakaan SMP N 1 Majenang
            </p>
          </div>

          {/* Intro Artikel */}
          <div className="mb-6 pb-6 border-b border-gray-900">
            <p className="text-justify text-sm leading-relaxed text-gray-900 first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:line-height-none">
              Sistem perpustakaan digital ini dirancang untuk memudahkan seluruh warga sekolah dalam mengelola peminjaman, pengembalian, dan pencarian koleksi buku secara daring. Demi kelancaran penggunaan, diharapkan seluruh pengguna membaca panduan dan informasi berikut dengan saksama.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-2 mb-6 pb-4 border-b border-gray-900">
            {[
              { id: 'faq' as const, label: 'FAQ', icon: HelpCircle },
              { id: 'panduan' as const, label: 'Panduan', icon: BookOpen },
              { id: 'kontak' as const, label: 'Kontak', icon: MessageCircle },
              { id: 'akun' as const, label: 'Akun Uji Coba', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-sans border-2 ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-900 border-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* === TAB: FAQ === */}
          {activeTab === 'faq' && (
            <div className="space-y-6 pb-6 border-b border-gray-900">
              <h3 className="text-base font-black uppercase tracking-tight border-b border-gray-900 pb-1 mb-4 font-serif">
                I. Pertanyaan yang Sering Diajukan
              </h3>

              {faqList.map((faq, index) => (
                <div key={index} className="text-justify">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left cursor-pointer group"
                  >
                    <h4 className="font-bold text-sm uppercase font-sans text-gray-900 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-gray-900" />
                        {faq.question}
                      </span>
                      {openFaqIndex === index ? (
                        <ChevronUp className="w-4 h-4 text-gray-900" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-900" />
                      )}
                    </h4>
                  </button>
                  {openFaqIndex === index && (
                    <p className="text-sm leading-relaxed text-gray-900 pl-6 border-l-2 border-gray-900 mt-2">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* === TAB: PANDUAN === */}
          {activeTab === 'panduan' && (
            <div className="space-y-6 pb-6 border-b border-gray-900">
              <h3 className="text-base font-black uppercase tracking-tight border-b border-gray-900 pb-1 mb-4 font-serif">
                II. Panduan Penggunaan Sistem
              </h3>

              {[
                {
                  icon: UserCheck,
                  title: 'Login ke Sistem',
                  desc: 'Masukkan NISN (siswa) atau NIP (guru) beserta password yang sama dengan Portal Akademik. Pastikan akun Anda sudah terdaftar di sistem sekolah.'
                },
                {
                  icon: BookOpen,
                  title: 'Cari & Pilih Buku',
                  desc: 'Gunakan fitur pencarian atau jelajahi kategori yang tersedia. Klik buku untuk melihat detail lengkap, sinopsis, dan status ketersediaan stok.'
                },
                {
                  icon: Clock,
                  title: 'Ajukan Peminjaman',
                  desc: 'Klik tombol Pinjam, pilih tanggal peminjaman dan tanggal pengembalian. Tunggu konfirmasi persetujuan dari petugas perpustakaan.'
                },
                {
                  icon: ShieldCheck,
                  title: 'Kembalikan Buku',
                  desc: 'Bawa buku fisik ke perpustakaan atau konfirmasi pengembalian melalui sistem. Denda keterlambatan akan dihitung secara otomatis oleh sistem.'
                }
              ].map((step, i) => (
                <div key={i} className="text-justify">
                  <h4 className="font-bold text-sm uppercase font-sans text-gray-900 mb-1 flex items-center gap-2">
                    <step.icon className="w-4 h-4 text-gray-900" />
                    Langkah {i + 1}: {step.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-900 pl-6 border-l-2 border-gray-900">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* === TAB: KONTAK === */}
          {activeTab === 'kontak' && (
            <div className="space-y-6 pb-6 border-b border-gray-900">
              <h3 className="text-base font-black uppercase tracking-tight border-b border-gray-900 pb-1 mb-4 font-serif">
                III. Informasi Kontak Layanan
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse border-t-2 border-b-2 border-gray-900 font-sans">
                  <thead>
                    <tr className="border-b border-gray-900 uppercase text-xs font-bold text-gray-900 bg-gray-100">
                      <th className="py-2 pr-4">Jabatan</th>
                      <th className="py-2 pr-4">Nama</th>
                      <th className="py-2 pr-4">Kontak / Lokasi</th>
                      <th className="py-2 text-right">Jam Operasional</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900">
                    <tr>
                      <td className="py-2.5 font-bold text-gray-900 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-gray-900" /> Petugas Perpustakaan
                      </td>
                      <td className="py-2.5 text-gray-900">Ibu Sari Wulandari, S.Pd.</td>
                      <td className="py-2.5 font-mono text-xs text-gray-900">perpustakaan@smpn1majenang.sch.id</td>
                      <td className="py-2.5 text-right text-xs text-gray-900">Senin – Jumat, 07.00 – 15.00 WIB</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-gray-900 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-900" /> Email Resmi
                      </td>
                      <td className="py-2.5 text-gray-900">Sekretariat Perpustakaan</td>
                      <td className="py-2.5 font-mono text-xs text-gray-900">perpustakaan@smpn1majenang.sch.id</td>
                      <td className="py-2.5 text-right text-xs text-gray-900">Respons 1×24 jam</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold text-gray-900 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-gray-900" /> Tata Usaha (TU)
                      </td>
                      <td className="py-2.5 text-gray-900">Reset Password & Akun</td>
                      <td className="py-2.5 text-xs text-gray-900">Ext. 101 – Ruang TU Lantai 1</td>
                      <td className="py-2.5 text-right text-xs text-gray-900">Senin – Jumat, 07.00 – 14.00 WIB</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-2 border-gray-900 p-4">
                <h4 className="font-bold text-sm uppercase text-center tracking-wide mb-3 text-gray-900 font-sans">
                  ! PERHATIAN PELAPORAN KENDALA !
                </h4>
                <p className="text-xs text-justify text-gray-900 leading-relaxed">
                  Untuk masalah teknis sistem, silakan laporkan ke petugas perpustakaan dengan menyertakan tangkapan layar (screenshot) jika memungkinkan. Laporan dengan bukti visual akan diproses lebih cepat.
                </p>
              </div>
            </div>
          )}

          {/* === TAB: AKUN UJI COBA === */}
          {activeTab === 'akun' && (
            <div className="space-y-6 pb-6 border-b border-gray-900">
              <h3 className="text-base font-black uppercase tracking-tight border-b border-gray-900 pb-1 mb-4 font-serif">
                IV. Lampiran Akun Uji Coba (Demo)
              </h3>
              <p className="text-xs text-gray-900 italic mb-4">
                *Tabel di bawah ini memuat data akun percontohan guna keperluan pengujian sistem oleh pihak internal:
              </p>

              {/* A. GURU */}
              <div className="mb-5">
                <h4 className="text-sm font-bold uppercase font-sans text-gray-900 mb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-900" /> A. Tenaga Pendidik (Guru)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse border-t-2 border-b-2 border-gray-900 font-sans">
                    <thead>
                      <tr className="border-b border-gray-900 uppercase text-xs font-bold text-gray-900 bg-gray-100">
                        <th className="py-2 pr-4">Nama</th>
                        <th className="py-2 pr-4">NIP (Username)</th>
                        <th className="py-2 text-right">Password</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900">
                      <tr>
                        <td className="py-2.5 font-bold text-gray-900">Bapak Andi Pratama</td>
                        <td className="py-2.5 font-mono text-xs text-gray-900">198501012010011001</td>
                        <td className="py-2.5 font-mono text-xs text-right text-gray-900">guru123</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-gray-900">Ibu Rina Kartika</td>
                        <td className="py-2.5 font-mono text-xs text-gray-900">198701022012012002</td>
                        <td className="py-2.5 font-mono text-xs text-right text-gray-900">guru123</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-gray-900">Bapak Dedi Saputra</td>
                        <td className="py-2.5 font-mono text-xs text-gray-900">198901032014013003</td>
                        <td className="py-2.5 font-mono text-xs text-right text-gray-900">guru123</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* B. SISWA */}
              <div className="mb-5">
                <h4 className="text-sm font-bold uppercase font-sans text-gray-900 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-900" /> B. Siswa Aktif
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse border-t-2 border-b-2 border-gray-900 font-sans">
                    <thead>
                      <tr className="border-b border-gray-900 uppercase text-xs font-bold text-gray-900 bg-gray-100">
                        <th className="py-2 pr-4">Nama</th>
                        <th className="py-2 pr-4">NIS (Username)</th>
                        <th className="py-2 text-right">Password</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900">
                      <tr>
                        <td className="py-2.5 font-bold text-gray-900">Siti Rahma</td>
                        <td className="py-2.5 font-mono text-xs text-gray-900">2024001</td>
                        <td className="py-2.5 font-mono text-xs text-right text-gray-900">siswa123</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-gray-900">Budi Santoso</td>
                        <td className="py-2.5 font-mono text-xs text-gray-900">2024002</td>
                        <td className="py-2.5 font-mono text-xs text-right text-gray-900">siswa123</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-gray-900">Nabila Putri</td>
                        <td className="py-2.5 font-mono text-xs text-gray-900">2024003</td>
                        <td className="py-2.5 font-mono text-xs text-right text-gray-900">siswa123</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Seksi Maklumat Keamanan */}
          <div className="pt-6 pb-8 border-b-2 border-gray-950">
            <div className="border-2 border-gray-900 p-4">
              <h4 className="font-bold text-sm uppercase text-center tracking-wide mb-3 text-gray-900 font-sans">
                ! MAKLUMAT PENTING PERLINDUNGAN DATA !
              </h4>
              <ul className="space-y-2 text-xs text-justify text-gray-900">
                <li className="list-disc list-inside">
                  <span className="font-bold">Kerahasiaan Sandi:</span> Dilarang keras membagikan ataupun memperlihatkan kombinasi kata sandi Anda kepada pihak lain demi menghindari penyalahgunaan wewenang akses perpustakaan.
                </li>
                <li className="list-disc list-inside">
                  <span className="font-bold">Terminasi Sesi:</span> Pastikan Anda selalu menekan opsi <span className="italic">Log Out</span> (Keluar Sistem) secara sempurna setelah selesai mengoperasikan portal perpustakaan, terutama jika menggunakan perangkat komputer umum.
                </li>
                <li className="list-disc list-inside">
                  <span className="font-bold">Pemulihan Akun:</span> Apabila terjadi kendala hilangnya akses atau lupa kata sandi, segeralah melapor ke ruang Tata Usaha untuk dilakukan penyetelan ulang oleh petugas operator.
                </li>
                <li className="list-disc list-inside">
                  <span className="font-bold">Tanggung Jawab Peminjaman:</span> Setiap peminjam wajib menjaga keutuhan dan kebersihan buku. Kerusakan atau kehilangan buku akan dikenakan sanksi sesuai peraturan yang berlaku.
                </li>
              </ul>
            </div>
          </div>

          

          {/* Catatan Kaki */}
          <p className="text-center text-[11px] text-gray-900 font-sans italic pt-4">
            Layanan Bantuan Terintegrasi • Perpustakaan Digital SMP Negeri 1 Majenang
          </p>

        </div>
      </div>
    </div>
  );
}
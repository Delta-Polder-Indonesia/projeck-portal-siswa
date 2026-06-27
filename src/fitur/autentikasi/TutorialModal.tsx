// TutorialModal.tsx
import { BookOpen, GraduationCap, User, Shield, X } from 'lucide-react';

interface TutorialModalProps {
    open: boolean;
    onClose: () => void;
}

export default function TutorialModal({ open, onClose }: TutorialModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white font-serif text-gray-900 w-full max-w-none overflow-hidden">
            {/* Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-4 pt-2 pb-8 sm:px-6">
                <div className="relative w-full max-w-none">

                    {/* Banner / Judul Utama */}
                    <div className="relative text-center pb-5 mb-6 border-b-4 border-double border-gray-900 pt-14 md:pt-10">
                        <div className="absolute top-14 md:top-10 right-0 z-10">
                            <button
                                onClick={onClose}
                                className="p-2.5 rounded-xl border-2 border-gray-300 text-gray-900 bg-white font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-gray-50"
                                title="Tutup Halaman"
                            >
                                <X className="w-3.5 h-3.5" /> Tutup
                            </button>
                        </div>

                        <p className="text-xs uppercase tracking-widest font-sans font-bold text-gray-900 mb-1">
                            Petunjuk Resmi • Jurnal Academic
                        </p>
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none mb-2 pr-24 pl-24 text-gray-900">
                            PANDUAN AKSES PORTAL
                        </h1>
                        <p className="text-sm italic text-gray-900 max-w-2xl mx-auto">
                            Tata Cara dan Langkah-Langkah Memasuki Sistem Informasi SMP N 1 Majenang
                        </p>
                    </div>

                    {/* Intro Artikel */}
                    <div className="mb-6 pb-6 border-b border-gray-400">
                        <p className="text-justify text-sm leading-relaxed text-gray-900 first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:line-height-none">
                            Portal informasi ini dirancang khusus untuk memfasilitasi seluruh warga sekolah dalam mengakses informasi akademik, rekapitulasi nilai, jadwal pelajaran berkala, serta kelengkapan administrasi. Demi kelancaran bersama, diharapkan seluruh pengguna mengikuti instruksi otentikasi di bawah ini dengan saksama.
                        </p>
                    </div>

                    {/* Seksi Utama: Langkah-Langkah Masuk */}
                    <div className="space-y-6 pb-6 border-b border-gray-400">
                        <h3 className="text-base font-black uppercase tracking-tight border-b border-gray-900 pb-1 mb-4 font-serif text-gray-900">
                            I. Prosedur Otentikasi Pengguna
                        </h3>

                        {/* Langkah 1 */}
                        <div className="text-justify">
                            <h4 className="font-bold text-sm uppercase font-sans text-gray-900 mb-1">
                                Langkah 1: Penentuan Peran Pengguna
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-900 pl-4 border-l-2 border-gray-900">
                                Pada halaman muka sistem, Anda diwajibkan untuk memilih salah satu dari dua kategori peran yang tersedia, yaitu <span className="font-bold">Guru</span> atau <span className="font-bold">Siswa</span>. Klik tombol pembagi yang sesuai dengan status keanggotaan aktif Anda di lingkungan sekolah.
                                <span className="italic block text-xs text-gray-900 mt-1">*Catatan: Kekeliruan dalam memilih peran akan menyebabkan kegagalan sistem pengenalan identitas.</span>
                            </p>
                        </div>

                        {/* Langkah 2 */}
                        <div className="text-justify">
                            <h4 className="font-bold text-sm uppercase font-sans text-gray-900 mb-1">
                                Langkah 2: Pengisian Kredensial Resmi
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-900 mb-2 pl-4 border-l-2 border-gray-900">
                                Setelah peran ditentukan, isilah kolom kosong yang tersedia dengan nomor identitas resmi. Bagi tenaga pendidik (<span className="font-bold">Guru</span>), gunakan Nomor Induk Pegawai (NIP). Bagi <span className="font-bold">Siswa</span>, gunakan Nomor Induk Siswa (NIS) atau Kode Unik yang terdaftar.
                            </p>
                        </div>

                        {/* Langkah Tambahan: Integrasi Perpustakaan */}
                        <div className="text-justify bg-white p-2 border border-gray-300 rounded">
                            <h4 className="font-bold text-sm uppercase font-sans text-gray-900 mb-1 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" /> Integrasi Akun Perpustakaan
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-900 pl-4 border-l-2 border-gray-900">
                                Akun perpustakaan kini telah <span className="font-bold">terintegrasi</span> dengan portal utama. Anda tidak perlu mendaftar ulang. Gunakan <span className="font-bold">Password yang sama</span> dengan portal utama untuk mengakses layanan perpustakaan digital.
                            </p>
                        </div>

                        {/* Langkah 3 */}
                        <div className="text-justify">
                            <h4 className="font-bold text-sm uppercase font-sans text-gray-900 mb-1">
                                Langkah 3: Pernyataan Masuk & Bantuan
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-900 pl-4 border-l-2 border-gray-900">
                                Tekan tombol <span className="font-bold uppercase font-sans text-xs border border-gray-900 px-1">Masuk</span> untuk validasi. Jika Anda mengalami kendala login atau lupa password, silakan hubungi petugas Tata Usaha untuk reset kata sandi.
                            </p>
                        </div>
                    </div>

                    {/* Seksi Akun Uji Coba */}
                    <div className="pt-6 pb-6 border-b border-gray-400">
                        <h3 className="text-base font-black uppercase tracking-tight border-b border-gray-900 pb-1 mb-4 font-serif text-gray-900">
                            II. Lampiran Akun Uji Coba (Demo)
                        </h3>
                        <p className="text-xs text-gray-900 italic mb-4">
                            *Tabel di bawah ini memuat data akun percontohan guna keperluan pengujian sistem oleh pihak internal:
                        </p>

                        {/* A. ADMIN MASTER */}
                        <div className="mb-5">
                            <h4 className="text-sm font-bold uppercase font-sans text-gray-900 mb-2 flex items-center gap-2">
                                <Shield className="w-4 h-4" /> A. Administrator Master
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse border-t-2 border-b-2 border-gray-900 font-sans table-fixed">
                                    <thead>
                                        <tr className="border-b border-gray-900 uppercase text-xs font-bold text-gray-900 bg-gray-50">
                                            <th className="py-2 pr-4 w-2/5">Peran</th>
                                            <th className="py-2 pr-4 w-2/5">Username</th>
                                            <th className="py-2 text-right w-1/5">Password</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="py-2.5 font-bold text-gray-900">Admin Master</td>
                                            <td className="py-2.5 font-mono text-xs text-gray-900">admin_master</td>
                                            <td className="py-2.5 font-mono text-xs text-right text-gray-900">admin_master_123</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-900 mt-1 italic">
                                *Cara login: Pilih peran Guru atau Siswa, lalu masukkan username & password di atas.
                            </p>
                        </div>

                        {/* B. GURU */}
                        <div className="mb-5">
                            <h4 className="text-sm font-bold uppercase font-sans text-gray-900 mb-2 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" /> B. Tenaga Pendidik (Guru)
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse border-t-2 border-b-2 border-gray-900 font-sans table-fixed">
                                    <thead>
                                        <tr className="border-b border-gray-900 uppercase text-xs font-bold text-gray-900 bg-gray-50">
                                            <th className="py-2 pr-4 w-2/5">Nama</th>
                                            <th className="py-2 pr-4 w-2/5">NIP (Username)</th>
                                            <th className="py-2 text-right w-1/5">Password</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-300">
                                        <tr>
                                            <td className="py-2.5 font-bold text-gray-900 truncate">Bapak Andi Pratama</td>
                                            <td className="py-2.5 font-mono text-xs text-gray-900">198501012010011001</td>
                                            <td className="py-2.5 font-mono text-xs text-right text-gray-900">guru123</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2.5 font-bold text-gray-900 truncate">Ibu Rina Kartika</td>
                                            <td className="py-2.5 font-mono text-xs text-gray-900">198701022012012002</td>
                                            <td className="py-2.5 font-mono text-xs text-right text-gray-900">guru123</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2.5 font-bold text-gray-900 truncate">Bapak Dedi Saputra</td>
                                            <td className="py-2.5 font-mono text-xs text-gray-900">198901032014013003</td>
                                            <td className="py-2.5 font-mono text-xs text-right text-gray-900">guru123</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* C. SISWA */}
                        <div className="mb-5">
                            <h4 className="text-sm font-bold uppercase font-sans text-gray-900 mb-2 flex items-center gap-2">
                                <User className="w-4 h-4" /> C. Siswa Aktif
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse border-t-2 border-b-2 border-gray-900 font-sans table-fixed">
                                    <thead>
                                        <tr className="border-b border-gray-900 uppercase text-xs font-bold text-gray-900 bg-gray-50">
                                            <th className="py-2 pr-4 w-2/5">Nama</th>
                                            <th className="py-2 pr-4 w-2/5">NIS (Username)</th>
                                            <th className="py-2 text-right w-1/5">Password</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-300">
                                        <tr>
                                            <td className="py-2.5 font-bold text-gray-900 truncate">Siti Rahma</td>
                                            <td className="py-2.5 font-mono text-xs text-gray-900">2024001</td>
                                            <td className="py-2.5 font-mono text-xs text-right text-gray-900">siswa123</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2.5 font-bold text-gray-900 truncate">Budi Santoso</td>
                                            <td className="py-2.5 font-mono text-xs text-gray-900">2024002</td>
                                            <td className="py-2.5 font-mono text-xs text-right text-gray-900">siswa123</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2.5 font-bold text-gray-900 truncate">Nabila Putri</td>
                                            <td className="py-2.5 font-mono text-xs text-gray-900">2024003</td>
                                            <td className="py-2.5 font-mono text-xs text-right text-gray-900">siswa123</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Seksi Maklumat Keamanan */}
                    <div className="pt-6 pb-8 border-b-2 border-gray-950">
                        <div className="border border-gray-950 p-4">
                            <h4 className="font-bold text-sm uppercase text-center tracking-wide mb-3 text-gray-900 font-sans">
                                ! MAKLUMAT PENTING PERLINDUNGAN DATA !
                            </h4>
                            <ul className="space-y-2 text-xs text-justify text-gray-900">
                                <li className="list-disc list-inside">
                                    <span className="font-bold">Kerahasiaan Sandi:</span> Dilarang keras membagikan ataupun memperlihatkan kombinasi kata sandi Anda kepada pihak lain demi menghindari penyalahgunaan wewenang berkas.
                                </li>
                                <li className="list-disc list-inside">
                                    <span className="font-bold">Terminasi Sesi:</span> Pastikan Anda selalu menekan opsi <span className="italic">Log Out</span> (Keluar Sistem) secara sempurna setelah selesai mengoperasikan portal, terutama jika menggunakan perangkat komputer umum.
                                </li>
                                <li className="list-disc list-inside">
                                    <span className="font-bold">Pemulihan Akun:</span> Apabila terjadi kendala hilangnya akses atau lupa kata sandi, segeralah melapor ke ruang Tata Usaha untuk dilakukan penyetelan ulang oleh petugas operator.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Catatan Kaki */}
                    <p className="text-center text-[11px] text-gray-900 font-sans italic pt-4">
                        Layanan Bantuan Terintegrasi • Sekretariat SMP Negeri 1 Majenang
                    </p>

                </div>
            </div>
        </div>
    );
}
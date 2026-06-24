// TutorialModal.tsx
import { BookOpen, GraduationCap, User, AlertCircle, X, Info } from 'lucide-react';

interface TutorialModalProps {
    open: boolean;
    onClose: () => void;
}

export default function TutorialModal({ open, onClose }: TutorialModalProps) {
    if (!open) return null;

    return (
        /* Menggunakan w-full, max-w-none, dan menyamakan padding horizontal (px-4 sm:px-6) agar pas mentok kanan-kiri */
        <div className="fixed inset-0 z-[100] flex flex-col bg-white font-serif text-gray-900 w-full max-w-none overflow-hidden">
            {/* Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-4 pt-2 pb-8 sm:px-6">
                {/* Memastikan pembungkus dalam bertindak sebagai container penuh tanpa batasan lebar tengah */}
                <div className="relative w-full max-w-none">
                    
                    {/* Banner / Judul Utama Gaya Koran - Menyatu di Paling Atas */}
                    {/* Ditambahkan kelas 'relative' dan disesuaikan padding agar tombol pas di samping */}
                    <div className="relative text-center pb-5 mb-6 border-b-4 border-double border-gray-900 pt-14 md:pt-10"> 
                        
                        {/* TOMBOL TUTUP (SEJAJAR DENGAN JUDUL UTAMA) */}
                        <div className="absolute top-14 md:top-10 right-0 z-10">
                            <button 
                                onClick={onClose}
                                className="p-2.5 rounded-xl border-2 border-gray-300 text-gray-500 bg-white font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-gray-50"
                                title="Tutup Halaman"
                            >
                                <X className="w-3.5 h-3.5" /> Tutup
                            </button>
                        </div>

                        <p className="text-xs uppercase tracking-widest font-sans font-bold text-gray-600 mb-1">
                            Petunjuk Resmi • Jurnal Academic
                        </p>
                        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none mb-2 pr-24 pl-24">
                            PANDUAN AKSES PORTAL
                        </h1>
                        <p className="text-sm italic text-gray-600 max-w-2xl mx-auto">
                            Tata Cara dan Langkah-Langkah Memasuki Sistem Informasi SMP N 1 Majenang
                        </p>
                    </div>

                    {/* Intro Artikel */}
                    <div className="mb-6 pb-6 border-b border-gray-400">
                        <p className="text-justify text-sm leading-relaxed text-gray-800 first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:line-height-none">
                            Portal informasi ini dirancang khusus untuk memfasilitasi seluruh warga sekolah dalam mengakses informasi akademik, rekapitulasi nilai, jadwal pelajaran berkala, serta kelengkapan administrasi. Demi kelancaran bersama, diharapkan seluruh pengguna mengikuti instruksi otentikasi di bawah ini dengan saksama.
                        </p>
                    </div>

                    {/* Seksi Utama: Langkah-Langkah Masuk */}
                    <div className="space-y-6 pb-6 border-b border-gray-400">
                        <h3 className="text-base font-black uppercase tracking-tight border-b border-gray-900 pb-1 mb-4 font-serif">
                            I. Prosedur Otentikasi Pengguna
                        </h3>

                        {/* Langkah 1 */}
                        <div className="text-justify">
                            <h4 className="font-bold text-sm uppercase font-sans text-gray-900 mb-1">
                                Langkah 1: Penentuan Peran Pengguna
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-700 pl-4 border-l-2 border-gray-900">
                                Pada halaman muka sistem, Anda diwajibkan untuk memilih salah satu dari dua kategori peran yang tersedia, yaitu <span className="font-bold">Guru</span> atau <span className="font-bold">Siswa</span>. Klik tombol pembagi yang sesuai dengan status keanggotaan aktif Anda di lingkungan sekolah. 
                                <span className="italic block text-xs text-gray-600 mt-1">*Catatan: Kekeliruan dalam memilih peran akan menyebabkan kegagalan sistem pengenalan identitas.</span>
                            </p>
                        </div>

                        {/* Langkah 2 */}
                        <div className="text-justify">
                            <h4 className="font-bold text-sm uppercase font-sans text-gray-900 mb-1">
                                Langkah 2: Pengisian Kredensial Resmi
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-700 mb-2 pl-4 border-l-2 border-gray-900">
                                Setelah peran ditentukan, isilah kolom kosong yang tersedia dengan nomor identitas resmi. Bagi tenaga pendidik (<span className="font-bold">Guru</span>), gunakan Nomor Induk Pegawai (NIP) masing-masing. Sedangkan bagi seluruh <span className="font-bold">Siswa</span>, diwajibkan menggunakan Nomor Induk Siswa (NIS) yang terdaftar pada lembar administrasi pusat.
                            </p>
                        </div>

                        {/* Langkah 3 */}
                        <div className="text-justify">
                            <h4 className="font-bold text-sm uppercase font-sans text-gray-900 mb-1">
                                Langkah 3: Pernyataan Masuk Sistem
                            </h4>
                            <p className="text-sm leading-relaxed text-gray-700 pl-4 border-l-2 border-gray-900">
                                Pastikan kembali seluruh digit angka dan kombinasi kata sandi terisi dengan benar tanpa spasi tambahan. Tekan tombol <span className="font-bold uppercase font-sans text-xs border border-gray-900 px-1">Masuk</span> untuk mengirimkan perintah validasi data ke server pusat. Jika sesuai, Anda akan langsung dialihkan menuju bilah instrumen utama.
                            </p>
                        </div>
                    </div>

                    {/* Seksi Akun Uji Coba */}
                    <div className="pt-6 pb-6 border-b border-gray-400">
                        <h3 className="text-base font-black uppercase tracking-tight border-b border-gray-900 pb-1 mb-4 font-serif">
                            II. Lampiran Akun Uji Coba (Demo)
                        </h3>
                        <p className="text-xs text-gray-600 italic mb-4">
                            *Tabel di bawah ini memuat data akun percontohan guna keperluan pengujian sistem oleh pihak internal:
                        </p>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse border-t-2 border-b-2 border-gray-950 font-sans">
                                <thead>
                                    <tr className="border-b border-gray-900 uppercase text-xs font-bold text-gray-700">
                                        <th className="py-2 pr-4">Klasifikasi Peran</th>
                                        <th className="py-2 pr-4">Nama Pengguna (Username)</th>
                                        <th className="py-2 text-right">Kata Sandi (Password)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-300">
                                    <tr>
                                        <td className="py-2.5 font-bold text-gray-900">A. Tenaga Pendidik (Guru)</td>
                                        <td className="py-2.5 font-mono text-xs">198501012010011001</td>
                                        <td className="py-2.5 font-mono text-xs text-right">guru123</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 font-bold text-gray-900">B. Siswa Aktif</td>
                                        <td className="py-2.5 font-mono text-xs">2024001</td>
                                        <td className="py-2.5 font-mono text-xs text-right">siswa123</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 font-bold text-gray-900">C. Administrator Guru</td>
                                        <td className="py-2.5 font-mono text-xs">adm_guru</td>
                                        <td className="py-2.5 font-mono text-xs text-right">admin123</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2.5 font-bold text-gray-900">D. Administrator Siswa</td>
                                        <td className="py-2.5 font-mono text-xs">adm_siswa</td>
                                        <td className="py-2.5 font-mono text-xs text-right">admin123</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Seksi Maklumat Keamanan */}
                    <div className="pt-6 pb-8 border-b-2 border-gray-950">
                        <div className="border border-gray-950 p-4">
                            <h4 className="font-bold text-sm uppercase text-center tracking-wide mb-3 text-gray-900 font-sans">
                                ! MAKLUMAT PENTING PERLINDUNGAN DATA !
                            </h4>
                            <ul className="space-y-2 text-xs text-justify text-gray-800">
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

                    {/* Catatan Kaki Kecil */}
                    <p className="text-center text-[11px] text-gray-500 font-sans italic pt-4">
                        Layanan Bantuan Terintegrasi • Sekretariat SMP Negeri 1 Majenang
                    </p>

                </div>
            </div>
        </div>
    );
}
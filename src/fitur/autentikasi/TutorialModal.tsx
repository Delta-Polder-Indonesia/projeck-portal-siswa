import { BookOpen, GraduationCap, User, AlertCircle, X, Info } from 'lucide-react';

interface TutorialModalProps {
    open: boolean;
    onClose: () => void;
}

export default function TutorialModal({ open, onClose }: TutorialModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col" style={{ backgroundColor: '#f8fafc' }}>
            {/* Header - Dipersempit agar lebih hemat tempat */}
            <div className="flex items-center justify-between px-8 py-3 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1e3a5f' }}>
                        <Info className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">Panduan Penggunaan Portal</h2>
                        <p className="text-gray-500 text-xs">SMP Negeri 1 Majenang</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-8 max-[600px]:px-5 max-[600px]:py-5">
                <div className="max-w-4xl mx-auto">
                    {/* Intro */}
                    <div className="mb-6">
                        <p className="text-gray-600 leading-relaxed text-sm">
                            Portal ini digunakan untuk accessing informasi akademik, nilai, jadwal pelajaran,
                            dan administrasi sekolah. Berikut adalah langkah-langkah untuk masuk ke dalam sistem.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-5 mb-8">
                        {/* Step 1 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: '#1e3a5f' }}>
                                    1
                                </div>
                                <div className="w-px h-full mx-auto mt-2" style={{ backgroundColor: '#e2e8f0', minHeight: '30px' }} />
                            </div>
                            <div className="pb-4">
                                <h3 className="text-base font-bold text-gray-900 mb-1">Pilih Peran</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-2">
                                    Pada halaman utama, Anda akan melihat dua pilihan: <strong className="text-gray-800">Guru</strong> dan <strong className="text-gray-800">Siswa</strong>.
                                    Klik sesuai dengan status Anda di sekolah.
                                </p>
                                <div className="p-2.5 rounded-lg text-xs" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>
                                    <strong>Catatan:</strong> Setiap peran memiliki akses fitur yang berbeda. Pastikan Anda memilih dengan benar.
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: '#1e3a5f' }}>
                                    2
                                </div>
                                <div className="w-px h-full mx-auto mt-2" style={{ backgroundColor: '#e2e8f0', minHeight: '30px' }} />
                            </div>
                            <div className="pb-4">
                                <h3 className="text-base font-bold text-gray-900 mb-1">Masukkan Data Login</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                    Setelah memilih peran, isi kolom <strong className="text-gray-800">NIP/NIS</strong> dan <strong className="text-gray-800">Kata Sandi</strong>
                                    dengan data yang telah diberikan oleh pihak sekolah.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-2.5 rounded-lg border" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
                                        <p className="text-xs font-semibold text-gray-700 mb-0.5">Untuk Guru</p>
                                        <p className="text-xs text-gray-500">Gunakan NIP sebagai username</p>
                                    </div>
                                    <div className="p-2.5 rounded-lg border" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
                                        <p className="text-xs font-semibold text-gray-700 mb-0.5">Untuk Siswa</p>
                                        <p className="text-xs text-gray-500">Gunakan NIS sebagai username</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: '#1e3a5f' }}>
                                    3
                                </div>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">Klik Tombol Masuk</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Setelah data terisi, tekan tombol <strong className="text-gray-800">Masuk</strong>.
                                    Jika data benar, Anda akan diarahkan ke halaman dashboard sesuai peran yang dipilih.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Demo Accounts */}
                    <div className="mb-8">
                        <h3 className="text-base font-bold text-gray-900 mb-3">Akun untuk Uji Coba</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                    <span className="font-semibold text-gray-900 text-sm">Akun Guru</span>
                                </div>
                                <table className="w-full text-xs">
                                    <tbody>
                                        <tr>
                                            <td className="text-gray-500 py-0.5">NIP / Username</td>
                                            <td className="text-gray-900 font-mono py-0.5 text-right">198501012010011001</td>
                                        </tr>
                                        <tr>
                                            <td className="text-gray-500 py-0.5">Password</td>
                                            <td className="text-gray-900 font-mono py-0.5 text-right">guru123</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                                    <span className="font-semibold text-gray-900 text-sm">Akun Siswa</span>
                                </div>
                                <table className="w-full text-xs">
                                    <tbody>
                                        <tr>
                                            <td className="text-gray-500 py-0.5">NIS / Username</td>
                                            <td className="text-gray-900 font-mono py-0.5 text-right">2024001</td>
                                        </tr>
                                        <tr>
                                            <td className="text-gray-500 py-0.5">Password</td>
                                            <td className="text-gray-900 font-mono py-0.5 text-right">siswa123</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 text-purple-600" />
                                    <span className="font-semibold text-gray-900 text-sm">Admin Guru</span>
                                </div>
                                <table className="w-full text-xs">
                                    <tbody>
                                        <tr>
                                            <td className="text-gray-500 py-0.5">Username</td>
                                            <td className="text-gray-900 font-mono py-0.5 text-right">adm_guru</td>
                                        </tr>
                                        <tr>
                                            <td className="text-gray-500 py-0.5">Password</td>
                                            <td className="text-gray-900 font-mono py-0.5 text-right">admin123</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 text-pink-600" />
                                    <span className="font-semibold text-gray-900 text-sm">Admin Siswa</span>
                                </div>
                                <table className="w-full text-xs">
                                    <tbody>
                                        <tr>
                                            <td className="text-gray-500 py-0.5">Username</td>
                                            <td className="text-gray-900 font-mono py-0.5 text-right">adm_siswa</td>
                                        </tr>
                                        <tr>
                                            <td className="text-gray-500 py-0.5">Password</td>
                                            <td className="text-gray-900 font-mono py-0.5 text-right">admin123</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="p-4 rounded-lg border mb-6" style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
                        <h4 className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Beberapa Hal yang Perlu Diperhatikan
                        </h4>
                        <ul className="space-y-1.5 text-xs text-amber-900/80">
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                                <span>Jangan membagikan kata sandi Anda kepada orang lain.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                                <span>Selalu logout setelah selesai menggunakan portal di perangkat umum.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                                <span>Jika lupa kata sandi, hubungi admin sekolah untuk reset password.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Note Bantuan Terintegrasi */}
                    <p className="text-center text-xs text-gray-400 pb-2">
                        Butuh bantuan tambahan? Hubungi admin sekolah.
                    </p>
                </div>
            </div>

            {/* Bagian Footer Bawah yang Kosong Telah Dihapus Sepenuhnya */}
        </div>
    );
}
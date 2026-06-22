import { X, Shield, CheckCircle } from 'lucide-react';

interface ExpectationModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ExpectationModal({ open, onClose }: ExpectationModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col" style={{ backgroundColor: '#f8fafc' }}>
            {/* Header - Dipersempit agar lebih hemat tempat */}
            <div className="flex items-center justify-between px-8 py-3 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-600">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">Apa yang Diharapkan?</h2>
                        <p className="text-gray-500 text-xs">Profil Sekolah & Ekspektasi</p>
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
                <div className="max-w-4xl mx-auto space-y-6">

                    {/* Main Description */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Profil Sekolah</h3>
                        <p className="text-gray-600 leading-relaxed">
                            SMP Negeri 1 Majenang berkomitmen untuk memberikan pendidikan berkualitas tinggi dan membentuk karakter siswa yang unggul. Melalui Portal Siswa ini, kami berharap dapat mewujudkan visi digitalisasi pendidikan. Di portal ini, Anda dapat mengharapkan:
                        </p>
                        <ul className="mt-4 space-y-3">
                            <li className="flex items-start gap-3 text-gray-600">
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span><strong>Akses Informasi Cepat & Tepat:</strong> Dapatkan update terbaru tentang kegiatan sekolah, pengumuman, dan materi akademik secara real-time.</span>
                            </li >
                            <li className="flex items-start gap-3 text-gray-600">
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span><strong>Transparansi Akademik:</strong> Siswa dan orang tua dapat memantau perkembangan belajar, kehadiran, dan nilai secara transparan.</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600">
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span><strong>Layanan Administrasi Mandiri:</strong> Memudahkan akses ke berbagai layanan administratif sekolah tanpa harus datang langsung ke tata usaha.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Reserved sections for Principal and Teachers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 text-emerald-800">Pesan Kepala Sekolah</h3>
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <p className="text-emerald-700 text-sm leading-relaxed italic border-l-4 border-emerald-400 pl-3">
                                    "Bagian ini nantinya akan diisi dengan sambutan atau pesan khusus dari Kepala Sekolah SMP Negeri 1 Majenang terkait visi, misi, dan dukungan terhadap portal ini."
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 text-blue-800">Harapan dari Dewan Guru</h3>
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-blue-700 text-sm leading-relaxed italic border-l-4 border-blue-400 pl-3">
                                    "Bagian ini nantinya akan diisi dengan pesan atau harapan dari perwakilan dewan guru untuk para siswa agar menggunakan portal ini secara bijak untuk meningkatkan prestasi."
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            {/* Bagian Footer Bawah yang Kosong Telah Dihapus Sepenuhnya */}
        </div>
    );
}
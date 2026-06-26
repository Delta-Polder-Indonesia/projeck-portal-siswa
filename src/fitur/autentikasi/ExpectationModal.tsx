// ExpectationModal.tsx
import { useState } from 'react';
import { X, MapPin, Phone, Mail, Globe, BookOpen } from 'lucide-react';
import PPDBForm from './PPDBForm'; 

interface ExpectationModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ExpectationModal({ open, onClose }: ExpectationModalProps) {
    const [isRegistering, setIsRegistering] = useState(false);

    if (!open) return null;

    // Mendapatkan tanggal hari ini untuk melengkapi estetika koran sekolah
    const formattedDate = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="fixed inset-0 z-[100] bg-white font-serif text-gray-900 overflow-y-auto">
             <div className="relative w-full px-8 py-8 max-[600px]:px-4">
                
                {isRegistering ? (
                    /* TAMPILAN KEDUA: FORMULIR PENDAFTARAN */
                    <PPDBForm onBack={() => setIsRegistering(false)} />
                ) : (
                    /* TAMPILAN UTAMA: DOKUMEN PROFIL KORAN */
                    <>
                        {/* Banner / Header Utama Koran */}
                        

                            <div className="flex justify-between items-center gap-4">
                                <div className="flex-grow text-center md:text-left">
                                    <h1 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tight leading-none mb-2 text-center">
                                        Profil & Visi Sekolah
                                    </h1>
                                    <p className="text-sm italic text-gray-600 font-serif text-center">
                                        Mengenal lebih dekat lingkungan, komitmen pendidikan, dan program pembelajaran kami.
                                    </p>
                                </div>
                                
                                <div className="flex-shrink-0">
                                    <button 
                                        onClick={onClose}
                                        className="p-2.5 rounded-xl border-2 border-gray-300 text-gray-500 bg-white font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-gray-50"
                                    >
                                        <X className="w-4 h-4" /> Tutup
                                    </button>
                                </div>
                            </div>
							
							<hr className="border-t-4 border-double border-gray-900 my-6" />

                        {/* Baris Pertama: Identitas Utama & Informasi Kontak */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-gray-400">
                            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 items-center sm:items-start border-b md:border-b-0 md:border-r border-gray-300 pb-6 md:pb-0 md:pr-6 text-center sm:text-left">
                                <div className="w-20 h-20 bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-900 overflow-hidden">
                                    <img
                                        src={`${import.meta.env.BASE_URL}images/smp.png`}
                                        alt="Logo SMP N 1 Majenang"
                                        className="w-full h-full object-cover grayscale"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.parentElement!.innerHTML = '<span class="text-xl font-bold font-sans text-gray-700">SMPN1</span>';
                                        }}
                                    />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold font-serif leading-tight text-gray-900">SMP Negeri 1 Majenang</h2>
                                    <p className="text-sm italic font-serif text-gray-700 mt-2">
                                        "Unggul dalam Prestasi, Berkarakter, dan Berwawasan Lingkungan"
                                    </p>
                                </div>
                            </div>

                            <div className="text-xs space-y-2 font-sans text-gray-700 justify-center flex flex-col">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                                    <span>Jl. Pendidikan No. 1, Majenang, Cilacap</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                                    <span>(0280) 123456</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                                    <span>smpn1majenang@sch.id</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                                    <span>www.smpn1majenang.sch.id</span>
                                </div>
                            </div>
                        </div>

                        {/* Baris Kedua: Data Statistik Terkini */}
                        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-400 text-center font-sans bg-gray-50/50">
                            {[
                                { label: 'TOTAL SISWA', value: '850+ Siswa' },
                                { label: 'TENAGA PENDIDIK', value: '45 Guru & Staf' },
                                { label: 'ROMBONGAN BELAJAR', value: '24 Kelas' },
                                { label: 'STATUS AKREDITASI', value: 'Terakreditasi A' },
                            ].map((stat, idx) => (
                                <div key={idx} className={`py-4 ${idx !== 3 ? 'border-r border-gray-300' : ''}`}>
                                    <p className="text-[10px] tracking-wider text-gray-500 font-bold uppercase">{stat.label}</p>
                                    <p className="text-lg font-black text-gray-900 mt-0.5">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Baris Ketiga: Visi Misi & Sambutan Kepala Sekolah */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 pb-6 border-b border-gray-400">
                            <div className="md:col-span-7 md:border-r border-gray-300 md:pr-6 space-y-4">
                                <h3 className="text-base font-bold uppercase font-serif tracking-tight border-b-2 border-gray-950 pb-1 mb-3">
                                    Bagian I: Visi & Misi Sekolah
                                </h3>
                                <div className="mb-4">
                                    <h4 className="font-bold text-xs uppercase font-sans text-gray-800 mb-1 tracking-wide">Visi Utama:</h4>
                                    <p className="text-base leading-relaxed text-justify pl-4 border-l-2 border-gray-900 italic text-gray-800">
                                        "Terwujudnya generasi yang beriman, bertaqwa, berilmu, berbudi luhur, serta unggul dalam prestasi dan berwawasan lingkungan."
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-xs uppercase font-sans text-gray-800 mb-2 tracking-wide">Misi Operasional:</h4>
                                    <ul className="space-y-1.5 text-sm text-justify font-serif text-gray-800">
                                        {[
                                            'Menyelenggarakan proses pendidikan bermutu secara efektif berbasis teknologi informasi.',
                                            'Menumbuhkan semangat berkompetisi yang sehat dan jujur bagi seluruh warga sekolah.',
                                            'Membentuk kepribadian siswa yang disiplin, mandiri, santun, dan bertanggung jawab.',
                                            'Memfasilitasi pengembangan potensi bakat siswa baik di bidang akademik maupun non-akademik.',
                                            'Mewujudkan lingkungan sekolah yang bersih, rindang, asri, dan sehat untuk mendukung pembelajaran.',
                                        ].map((misi, idx) => (
                                            <li key={idx} className="list-decimal list-inside pl-1 leading-relaxed">
                                                <span>{misi}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="md:col-span-5 space-y-4">
                                <h3 className="text-base font-bold uppercase font-serif tracking-tight border-b-2 border-gray-950 pb-1 mb-3">
                                    Bagian II: Pengantar Kepala Sekolah
                                </h3>
                                <div className="flex gap-4 items-start bg-gray-50 p-3 border border-gray-300">
                                    <div className="w-20 h-24 bg-gray-200 border border-gray-400 flex-shrink-0 overflow-hidden grayscale">
                                        <img
                                            src={`${import.meta.env.BASE_URL}images/pegawai/kepala-sekolah.jpg`}
                                            alt="Foto Kepala Sekolah"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.parentElement!.innerHTML = '<div class="text-[10px] text-center text-gray-400 pt-8 font-sans">Foto Kepala Sekolah</div>';
                                            }}
                                        />
                                    </div>
                                    <div className="text-xs font-sans">
                                        <p className="font-bold text-sm text-gray-900 font-serif">Drs. H. Mulyono, M.Pd.</p>
                                        <p className="text-gray-600 italic mb-1">Kepala Sekolah</p>
                                        <p className="text-gray-700"><span className="font-semibold">Masa Bakti:</span> 2020 - Sekarang</p>
                                        <p className="text-gray-700"><span className="font-semibold">Lulusan:</span> Universitas Negeri Yogyakarta</p>
                                    </div>
                                </div>
                                <p className="text-xs font-serif leading-relaxed text-justify text-gray-800 italic pt-1 border-t border-gray-200">
                                    "Selamat datang di portal informasi resmi kami. Media komunikasi digital ini dirancang khusus untuk memudahkan seluruh wali murid, siswa, dan masyarakat luas dalam mengakses info kegiatan belajar, program pendidikan, serta administrasi sekolah secara terbuka."
                                </p>
                            </div>
                        </div>

                        {/* Baris Keempat: Struktur Guru & Fasilitas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 pb-6 border-b border-gray-400">
                            <div className="md:border-r border-gray-300 md:pr-6">
                                <h3 className="text-base font-bold uppercase font-serif tracking-tight border-b-2 border-gray-950 pb-1 mb-3">
                                    Bagian III: Struktur Pengelola Sekolah
                                </h3>
                                <p className="text-xs text-gray-700 mb-3 text-justify font-serif">
                                    Penyelenggaraan pendidikan di sekolah kami didukung penuh oleh jajaran pengajar berpengalaman dan staf administrasi yang berdedikasi tinggi.
                                </p>
                                <div className="space-y-2 font-sans text-xs text-gray-800">
                                    {[
                                        { nama: 'Drs. Ahmad Subarjo', jabatan: 'Wakasek Kesiswaan', mapel: 'Pendidikan Agama' },
                                        { nama: 'Dra. Sri Wahyuni', jabatan: 'Wakasek Kurikulum', mapel: 'Matematika' },
                                        { nama: 'Budi Santoso, S.Pd.', jabatan: 'Kepala Tata Usaha', mapel: 'Administrasi Sekolah' },
                                    ].map((guru, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-1.5 border-b border-gray-200">
                                            <div>
                                                <p className="font-bold text-gray-900">{guru.nama}</p>
                                                <p className="text-[11px] text-gray-500">{guru.mapel}</p>
                                            </div>
                                            <span className="text-[10px] font-mono uppercase bg-gray-100 px-2 py-0.5 border border-gray-300 text-gray-700">
                                                {guru.jabatan}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-base font-bold uppercase font-serif tracking-tight border-b-2 border-gray-950 pb-1 mb-3">
                                    Bagian IV: Daftar Fasilitas Sekolah
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs font-sans text-gray-800">
                                    {[
                                        'Perpustakaan (5.000+ Koleksi Buku)',
                                        'Laboratorium Komputer Terintegrasi',
                                        'Ruang Kelas dengan Proyektor Media',
                                        'Laboratorium Praktikum Sains (IPA)',
                                        'Lapangan Olahraga Serbaguna',
                                        'Ruang Layanan Kesehatan / UKS',
                                    ].map((fasilitas, idx) => (
                                        <div key={idx} className="flex items-center gap-2 py-1 border-b border-gray-100">
                                            <span className="text-gray-950 font-bold">•</span>
                                            <span className="text-gray-700 leading-tight">{fasilitas}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Baris Kelima: Layanan Portal & Jam Kerja */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 pb-6 border-b border-gray-400">
                            <div className="md:col-span-2 space-y-2">
                                <h3 className="text-base font-bold uppercase font-serif border-b-2 border-gray-950 pb-1 mb-2">
                                    Bagian V: Layanan Sistem Informasi Sekolah
                                </h3>
                                <div className="space-y-2 text-xs text-justify text-gray-800 font-serif">
                                    <p><span className="font-bold">Informasi Akademik Berkala:</span> Wali murid dan siswa dapat memantau jadwal pelajaran, pengumuman kegiatan tengah semester, kalender pendidikan, serta info darurat sekolah secara berkala.</p>
                                    <p><span className="font-bold">Pemantauan Perkembangan Siswa:</span> Sistem ini memfasilitasi keterbukaan rekaman presensi kehadiran dan evaluasi belajar harian untuk mendukung kemajuan studi anak.</p>
                                </div>
                            </div>

                            <div className="border border-gray-900 p-4 bg-gray-50 h-fit font-sans">
                                <h4 className="text-[10px] font-bold uppercase tracking-wider text-center border-b border-gray-900 pb-1 mb-2 text-gray-700">
                                    Jam Operasional Kantor & Pelayanan
                                </h4>
                                <div className="text-xs space-y-1 text-gray-800">
                                    <div className="flex justify-between">
                                        <span>Senin - Kamis:</span>
                                        <span className="font-bold">07.00 - 14.00 WIB</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Jumat:</span>
                                        <span className="font-bold">07.00 - 11.00 WIB</span>
                                    </div>
                                    <div className="flex justify-between border-t border-gray-300 pt-1 mt-1 text-gray-500">
                                        <span>Sabtu - Minggu:</span>
                                        <span>Tutup / Libur</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEKSI VI: PANDUAN PPDB (Menghilangkan Warna Cyan Khas AI Template) */}
                        <div className="pt-6 pb-6 mt-4 border border-gray-900 bg-gray-50 p-6">
                            <h3 className="text-base font-bold uppercase font-serif tracking-tight border-b-2 border-gray-950 pb-2 mb-4 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-gray-950" /> Bagian VI: Panduan Pendaftaran Siswa Baru (PPDB)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-gray-800 font-sans">
                                <div className="space-y-2 border-b md:border-b-0 md:border-r border-gray-300 pb-4 md:pb-0 md:pr-6">
                                    <h4 className="font-bold text-gray-900 uppercase tracking-wide">
                                        Jalur Mandiri Online
                                    </h4>
                                    <p className="leading-relaxed text-gray-700 text-justify font-serif">
                                        Pengisian berkas elektronik dilakukan secara mandiri lewat komputer atau ponsel. Pastikan pendaftar menyiapkan salinan digital dokumen penting seperti KK, Akta Kelahiran, serta pasfoto resmi sebelum memulai.
                                    </p>
                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsRegistering(true)}
                                            className="inline-block px-4 py-2 border border-gray-900 bg-white font-bold uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-colors duration-200 cursor-pointer"
                                        >
                                            Buka Formulir Pendaftaran Online &rarr;
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-bold text-gray-900 uppercase tracking-wide">
                                        Pelayanan Manual / Tatap Muka
                                    </h4>
                                    <p className="leading-relaxed text-gray-700 text-justify font-serif">
                                        Bagi wali murid yang menemui kendala teknis pada sistem jaringan, panitia menyediakan loket pelayanan langsung untuk penyerahan berkas fisik di lokasi sekolah.
                                    </p>
                                    <div className="p-3 bg-white border border-gray-300 space-y-1">
                                        <p><span className="font-semibold">Lokasi:</span> Ruang Sekretariat PPDB, Aula SMPN 1 Majenang</p>
                                        <p><span className="font-semibold">Waktu Operasional:</span> Setiap hari kerja, Pukul 08.00 s.d 12.00 WIB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-[10px] text-gray-500 font-sans italic pt-6">
                            Dokumentasi Resmi Publikasi Pendidikan • Tata Usaha SMP Negeri 1 Majenang
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
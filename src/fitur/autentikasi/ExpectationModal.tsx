// ExpectationModal.tsx
import { useState } from 'react';
import { X, MapPin, Phone, Mail, Globe, HelpCircle } from 'lucide-react';
import PPDBForm from './PPDBForm'; 

interface ExpectationModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ExpectationModal({ open, onClose }: ExpectationModalProps) {
    const [isRegistering, setIsRegistering] = useState(false);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white font-serif text-gray-900 overflow-y-auto px-8 py-8 max-[600px]:px-4">
            <div className="max-w-6xl mx-auto relative">
                
                {isRegistering ? (
                    /* TAMPILAN KEDUA: FORMULIR PENDAFTARAN */
                    <PPDBForm onBack={() => setIsRegistering(false)} />
                ) : (
                    /* TAMPILAN UTAMA: DOKUMEN PROFIL KORAN */
                    <>
                        {/* TOMBOL TUTUP POJOK KANAN ATAS - HANYA DI TAMPILAN KORAN */}
                        <div className="absolute top-0 right-0 z-10">
                            <button 
                                onClick={onClose}
                                className="p-2.5 rounded-xl border-2 border-gray-300 text-gray-500 bg-white font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-gray-50"
                                title="Tutup"
                            >
                                <X className="w-4 h-4" /> Tutup
                            </button>
                        </div>

                        {/* Banner/Judul Utama Koran */}
                        <div className="text-center pb-6 mb-6 border-b-4 border-double border-gray-900 pt-14 md:pt-4">
                            <p className="text-xs uppercase tracking-widest font-sans font-bold text-gray-600 mb-1">
                                Warta Resmi • SMP Negeri 1 Majenang
                            </p>
                            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-serif leading-none mb-2">
                                PROFIL & VISI SEKOLAH
                            </h1>
                            <p className="text-sm italic text-gray-600 font-serif">
                                Mengenal Lebih Dekat Lingkungan dan Komitmen Pendidikan Kami
                            </p>
                        </div>

                        {/* Baris Pertama: Identitas Utama & Informasi Kontak */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-gray-400">
                            <div className="md:col-span-2 flex gap-4 items-start border-b md:border-b-0 md:border-r border-gray-300 pb-6 md:pb-0 md:pr-6">
                                <div className="w-20 h-20 bg-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-900 overflow-hidden">
                                    <img
                                        src={`${import.meta.env.BASE_URL}images/smp.png`}
                                        alt="Logo SMP N 1 Majenang"
                                        className="w-full h-full object-cover grayscale"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.parentElement!.innerHTML = '<span class="text-xl font-bold font-sans">SMP</span>';
                                        }}
                                    />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold font-serif leading-tight">SMP Negeri 1 Majenang</h2>
                                    <p className="text-sm italic font-serif text-gray-700 mt-2">
                                        "Unggul dalam Prestasi, Berkarakter, dan Berwawasan Lingkungan"
                                    </p>
                                </div>
                            </div>

                            <div className="text-sm space-y-1.5 font-sans text-gray-700 justify-center flex flex-col">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>Jl. Pendidikan No. 1, Majenang, Cilacap</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>(0280) 123456</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>smpn1majenang@sch.id</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>www.smpn1majenang.sch.id</span>
                                </div>
                            </div>
                        </div>

                        {/* Baris Kedua: Data Statistik */}
                        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-400 text-center font-sans">
                            {[
                                { label: 'JUMLAH SISWA', value: '850+' },
                                { label: 'JUMLAH GURU', value: '45 TPA' },
                                { label: 'ROMBONGAN BELAJAR', value: '24 Rombel' },
                                { label: 'AKREDITASI UTAMA', value: 'Grade A' },
                            ].map((stat, idx) => (
                                <div key={idx} className={`py-4 ${idx !== 3 ? 'border-r border-gray-300' : ''}`}>
                                    <p className="text-xs tracking-wider text-gray-500 font-bold">{stat.label}</p>
                                    <p className="text-xl font-black text-gray-900 mt-0.5">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Baris Ketiga: Visi Misi & Sambutan Kepala Sekolah */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 pb-6 border-b border-gray-400">
                            <div className="md:col-span-7 md:border-r border-gray-300 md:pr-6 space-y-4">
                                <h3 className="text-lg font-black uppercase font-serif tracking-tight border-b border-gray-900 pb-1 mb-3">
                                    I. Haluan Sekolah: Visi & Misi
                                </h3>
                                <div className="mb-4">
                                    <h4 className="font-bold text-sm uppercase font-sans tracking-wide text-gray-800 mb-1">Visi Utama:</h4>
                                    <p className="text-base italic leading-relaxed text-justify pl-4 border-l-2 border-gray-800">
                                        "Terwujudnya generasi yang beriman, bertaqwa, berilmu, berbudi luhur, serta unggul dalam prestasi dan berwawasan lingkungan."
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm uppercase font-sans tracking-wide text-gray-800 mb-2">Misi Operasional:</h4>
                                    <ul className="space-y-2 text-sm text-justify">
                                        {[
                                            'Menyelenggarakan pendidikan yang berkualitas and berbasis teknologi informasi.',
                                            'Menumbuhkan semangat keunggulan dan kompetitif bagi seluruh warga sekolah.',
                                            'Membangun karakter siswa yang disiplin, mandiri, dan bertanggung jawab.',
                                            'Mengembangkan potensi siswa di bidang akademik and non-akademik.',
                                            'Menciptakan lingkungan sekolah yang kondusif, hijau, dan berwawasan lingkungan.',
                                        ].map((misi, idx) => (
                                            <li key={idx} className="list-decimal list-inside pl-1 leading-relaxed text-gray-800">
                                                <span>{misi}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="md:col-span-5 space-y-4">
                                <h3 className="text-lg font-black uppercase font-serif tracking-tight border-b border-gray-900 pb-1 mb-3">
                                    II. Catatan Kepala Sekolah
                                </h3>
                                <div className="flex flex-col sm:flex-row gap-4 items-start">
                                    <div className="w-24 h-32 bg-gray-100 border border-gray-400 flex-shrink-0 overflow-hidden grayscale">
                                        <img
                                            src={`${import.meta.env.BASE_URL}images/kepala-sekolah.jpg`}
                                            alt="Kepala Sekolah"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.parentElement!.innerHTML = '<div class="text-[10px] p-2 text-center text-gray-400 pt-8 font-sans">Foto Pimpinan</div>';
                                            }}
                                        />
                                    </div>
                                    <div className="text-xs font-sans">
                                        <p className="font-bold text-sm text-gray-900 font-serif">Drs. H. Nama Kepala Sekolah, M.Pd.</p>
                                        <p className="text-gray-600 italic mb-2">Kepala Sekolah Ke-12</p>
                                        <p className="text-gray-700"><span className="font-bold">Masa Bakti:</span> Menjabat sejak 2020</p>
                                        <p className="text-gray-700"><span className="font-bold">Alumni:</span> Universitas Negeri Yogyakarta</p>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed text-justify text-gray-800 italic bg-gray-50 p-3 border-t border-b border-gray-300">
                                    "Puji syukur kita panjatkan kehadirat Allah SWT. SMP Negeri 1 Majenang hadir dengan Portal Siswa ini sebagai wujud komitmen kami dalam mengikuti perkembangan teknologi dan memudahkan seluruh stakeholders dalam accessing informasi pendidikan."
                                </p>
                            </div>
                        </div>

                        {/* Baris Keempat: Pengajar & Fasilitas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 pb-6 border-b border-gray-400">
                            <div className="md:border-r border-gray-300 md:pr-6">
                                <h3 className="text-lg font-black uppercase font-serif tracking-tight border-b border-gray-900 pb-1 mb-3">
                                    III. Staf Pimpinan & Tata Usaha
                                </h3>
                                <p className="text-sm text-gray-700 mb-4 text-justify">
                                    Didukung oleh tenaga pendidik profesional lulusan perguruan tinggi terkemuka yang siap berdedikasi tinggi demi memajukan mutu studi siswa.
                                </p>
                                <div className="space-y-2 font-sans text-sm">
                                    {[
                                        { nama: 'Drs. Nama Wakasek Kesiswaan', jabatan: 'Wakasek Kesiswaan', mapel: 'Pendidikan Agama' },
                                        { nama: 'Dra. Nama Wakasek Kurikulum', jabatan: 'Wakasek Kurikulum', mapel: 'Matematika' },
                                        { nama: 'Nama Kepala TU, S.Pd.', jabatan: 'Kepala Tata Usaha', mapel: 'Sistem Administrasi' },
                                    ].map((guru, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-1.5 border-b border-dashed border-gray-300">
                                            <div>
                                                <p className="font-bold text-gray-900">{guru.nama}</p>
                                                <p className="text-xs text-gray-500">{guru.mapel}</p>
                                            </div>
                                            <span className="text-xs font-mono uppercase bg-gray-100 px-2 py-0.5 border border-gray-300 text-gray-700">
                                                {guru.jabatan}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-black uppercase font-serif tracking-tight border-b border-gray-900 pb-1 mb-3">
                                    IV. Inventaris Prasarana Sekolah
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm font-sans">
                                    {[
                                        'Perpustakaan modern (5.000+ koleksi buku)',
                                        'Laboratorium Komputer (30 unit PC)',
                                        'Ruang kelas ber-AC & Proyektor multimedia',
                                        'Laboratorium Sains Terintegrasi',
                                        'Lapangan olahraga multifungsi',
                                        'Ruang medis UKS & Konseling',
                                    ].map((fasilitas, idx) => (
                                        <div key={idx} className="flex items-start gap-2 py-1 border-b border-gray-100">
                                            <span className="text-gray-900 font-bold">•</span>
                                            <span className="text-gray-700 leading-tight">{fasilitas}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Baris Kelima: Maklumat Portal & Jam Operasional */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 pb-6 border-b border-gray-400">
                            <div className="md:col-span-2">
                                <h3 className="text-base font-black uppercase font-serif border-b border-gray-900 pb-1 mb-3">
                                    V. Maklumat Fungsi Portal Informasi
                                </h3>
                                <div className="space-y-3 text-sm text-justify text-gray-800">
                                    <p><span className="font-bold font-serif">Akses Informasi Cepat:</span> Dapatkan update terbaru mengenai agenda kegiatan berkala sekolah, pengumuman darurat, serta rangkuman materi akademik secara waktu nyata.</p>
                                    <p><span className="font-bold font-serif">Transparansi Nilai:</span> Siswa maupun wali murid dapat memantau grafik perkembangan belajar, absensi presensi, beserta rekap nilai harian secara terbuka.</p>
                                </div>
                            </div>

                            <div className="border border-gray-900 p-4 bg-gray-50 h-fit font-sans">
                                <h4 className="text-xs font-black uppercase tracking-wider text-center border-b border-gray-900 pb-1 mb-2">
                                    JAM OPERASIONAL SISTEM
                                </h4>
                                <div className="text-xs space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Senin - Jumat:</span>
                                        <span className="font-bold">06.00 - 22.00 WIB</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Sabtu - Minggu:</span>
                                        <span className="font-bold">08.00 - 17.00 WIB</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEKSI VI: PANDUAN PPDB */}
                        <div className="pt-6 pb-8 border-b-2 border-gray-900 bg-gray-50/70 p-5 rounded-lg mt-2">
                            <h3 className="text-lg font-black uppercase font-serif tracking-tight border-b-2 border-gray-900 pb-1 mb-4 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-gray-950" /> VI. Panduan Pendaftaran Calon Siswa Baru & Pindahan
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-800 font-sans">
                                <div className="space-y-3 border-b md:border-b-0 md:border-r border-gray-300 pb-6 md:pb-0 md:pr-6">
                                    <h4 className="font-black text-xs uppercase tracking-wider text-cyan-700 bg-cyan-100/60 px-2 py-1 rounded inline-block">
                                        Metode A • Pendaftaran Mandiri Online
                                    </h4>
                                    <p className="leading-relaxed text-xs text-justify">
                                        Pendaftaran elektronik dapat diakses kapan saja secara mandiri. Calon pendaftar wajib menyiapkan berkas digital pasfoto, KK, Akta Kelahiran, atau Rapor/Surat Mutasi (khusus siswa pindahan).
                                    </p>
                                    <div className="bg-white border border-cyan-300 rounded-xl p-3 shadow-sm text-center">
                                        <p className="text-xs text-gray-600 font-medium mb-1">Sudah siap dengan berkas digital Anda?</p>
                                        <button
                                            type="button"
                                            onClick={() => setIsRegistering(true)}
                                            className="text-xs font-black text-cyan-600 hover:text-cyan-800 underline uppercase tracking-wider transition-all cursor-pointer"
                                        >
                                            👉 Klik Di Sini Untuk Mengisi Formulir 👈
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-black text-xs uppercase tracking-wider text-gray-700 bg-gray-200 px-2 py-1 rounded inline-block">
                                        Metode B • Pendaftaran Manual (Offline / Tatap Muka)
                                    </h4>
                                    <p className="leading-relaxed text-xs text-justify">
                                        Bagi wali murid yang mengalami kendala teknis perangkat, panitia melayani penyerahan berkas fisik secara langsung di sekolah. 
                                    </p>
                                    <div className="text-[11px] bg-white border border-gray-300 rounded-xl p-3 space-y-1.5 text-gray-700">
                                        <p><span className="font-bold">Waktu:</span> Senin s.d. Jumat | Jam 08.00 - 12.00 WIB.</p>
                                        <p><span className="font-bold">Lokasi:</span> Aula Gedung Sekretariat PPDB SMPN 1 Majenang.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-[11px] text-gray-500 font-sans italic pt-6 pb-6">
                            Arsip Dokumentasi Pendidikan • Kesekretarietan SMP Negeri 1 Majenang
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
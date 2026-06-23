import { X, Shield, CheckCircle, MapPin, Phone, Mail, Globe, Users, Award, BookOpen, GraduationCap, Calendar, Clock } from 'lucide-react';

interface ExpectationModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ExpectationModal({ open, onClose }: ExpectationModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col" style={{ backgroundColor: '#f8fafc' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-3 border-b" style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-600">
                        <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">Profil & Visi Sekolah</h2>
                        <p className="text-gray-500 text-xs">Mengenal Lebih Dekat SMP Negeri 1 Majenang</p>
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
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Hero Section - Identitas Sekolah */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-emerald-200">
                                <img
                                    src={`${import.meta.env.BASE_URL}images/smp.png`}
                                    alt="Logo SMP N 1 Majenang"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.parentElement!.innerHTML = '<span class="text-3xl font-bold text-emerald-600">SMP</span>';
                                    }}
                                />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">SMP Negeri 1 Majenang</h1>
                                <p className="text-emerald-600 font-medium mb-4">Unggul dalam Prestasi, Berkarakter, dan Berwawasan Lingkungan</p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                        <span>Jl. Pendidikan No. 1, Majenang, Cilacap</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-emerald-500" />
                                        <span>(0280) 123456</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-emerald-500" />
                                        <span>smpn1majenang@sch.id</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-emerald-500" />
                                        <span>www.smpn1majenang.sch.id</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistik Sekolah */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: Users, label: 'Jumlah Siswa', value: '850+', color: 'blue' },
                            { icon: GraduationCap, label: 'Jumlah Guru', value: '45', color: 'emerald' },
                            { icon: BookOpen, label: 'Rombel', value: '24', color: 'amber' },
                            { icon: Award, label: 'Akreditasi', value: 'A', color: 'rose' },
                        ].map((stat, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center mx-auto mb-2`}>
                                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                                </div>
                                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-xs text-gray-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Visi & Misi */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-emerald-600" />
                            Visi & Misi
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                <h4 className="font-semibold text-emerald-800 mb-2">Visi</h4>
                                <p className="text-emerald-700 text-sm leading-relaxed">
                                    "Terwujudnya generasi yang beriman, bertaqwa, berilmu, berbudi luhur, serta unggul dalam prestasi dan berwawasan lingkungan."
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Misi</h4>
                                <ul className="space-y-2">
                                    {[
                                        'Menyelenggarakan pendidikan yang berkualitas dan berbasis teknologi informasi',
                                        'Menumbuhkan semangat keunggulan dan kompetitif bagi seluruh warga sekolah',
                                        'Membangun karakter siswa yang disiplin, mandiri, dan bertanggung jawab',
                                        'Mengembangkan potensi siswa di bidang akademik dan non-akademik',
                                        'Menciptakan lingkungan sekolah yang kondusif, hijau, dan berwawasan lingkungan',
                                    ].map((misi, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            <span>{misi}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Profil Kepala Sekolah */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5 text-emerald-600" />
                            Sambutan Kepala Sekolah
                        </h3>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-shrink-0 mx-auto md:mx-0">
                                <div className="w-40 h-52 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={`${import.meta.env.BASE_URL}images/kepala-sekolah.jpg`}
                                        alt="Kepala Sekolah SMP N 1 Majenang"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.parentElement!.classList.add('flex-col', 'gap-2');
                                            target.parentElement!.innerHTML = `
                                                <Users class="w-12 h-12 text-gray-400" />
                                                <span class="text-xs text-gray-400 text-center px-2">Foto Kepala Sekolah<br/>akan ditampilkan di sini</span>
                                            `;
                                        }}
                                    />
                                </div>
                                <div className="mt-3 text-center">
                                    <p className="font-semibold text-gray-900">Drs. H. Nama Kepala Sekolah, M.Pd.</p>
                                    <p className="text-xs text-emerald-600">Kepala SMP Negeri 1 Majenang</p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                    <p className="text-emerald-800 text-sm leading-relaxed italic border-l-4 border-emerald-400 pl-4">
                                        "Puji syukur kita panjatkan kehadirat Allah SWT atas limpahan rahmat dan karunia-Nya. SMP Negeri 1 Majenang hadir dengan Portal Siswa ini sebagai wujud komitmen kami dalam mengikuti perkembangan teknologi dan memudahkan seluruh stakeholders sekolah dalam mengakses informasi pendidikan. Kami berharap portal ini dapat menjadi jembatan komunikasi yang efektif antara sekolah, siswa, dan orang tua. Mari bersama-sama kita wujudkan pendidikan yang berkualitas dan merata untuk generasi penerus bangsa yang gemilang."
                                    </p>
                                </div>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 text-emerald-500" />
                                        <span>Menjabat sejak 2020</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <GraduationCap className="w-4 h-4 text-emerald-500" />
                                        <span>Lulusan Universitas Negeri Yogyakarta</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dewan Guru */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                            Dewan Guru & Tenaga Kependidikan
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                            SMP Negeri 1 Majenang didukung oleh tenaga pendidik yang profesional, berkompeten, dan berdedikasi tinggi. Dewan guru kami terdiri dari lulusan perguruan tinggi terkemuka dengan berbagai keahlian bidang studi.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            {[
                                { nama: 'Drs. Nama Wakasek Kesiswaan', jabatan: 'Wakasek Kesiswaan', mapel: 'Pendidikan Agama' },
                                { nama: 'Dra. Nama Wakasek Kurikulum', jabatan: 'Wakasek Kurikulum', mapel: 'Matematika' },
                                { nama: 'Nama Kepala TU, S.Pd.', jabatan: 'Kepala Tata Usaha', mapel: 'Administrasi' },
                            ].map((guru, idx) => (
                                <div key={idx} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center mx-auto mb-2">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <p className="font-semibold text-gray-900 text-sm text-center">{guru.nama}</p>
                                    <p className="text-xs text-blue-600 text-center">{guru.jabatan}</p>
                                    <p className="text-xs text-gray-500 text-center mt-1">{guru.mapel}</p>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-blue-700 text-sm leading-relaxed italic border-l-4 border-blue-400 pl-3">
                                "Kami, dewan guru SMP Negeri 1 Majenang, berkomitmen untuk memberikan pelayanan pendidikan terbaik. Melalui Portal Siswa ini, kami berharap dapat mempererat komunikasi dengan siswa dan orang tua. Gunakanlah fasilitas ini dengan bijak untuk meningkatkan prestasi belajar dan memperluas wawasan. Mari bersama-sama menciptakan ekosistem pendidikan yang kondusif dan inspiratif."
                            </p>
                        </div>
                    </div>

                    {/* Fasilitas Sekolah */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-amber-600" />
                            Sarana & Prasarana
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { icon: BookOpen, text: 'Perpustakaan modern dengan koleksi 5.000+ buku' },
                                { icon: Globe, text: 'Laboratorium Komputer dengan 30 unit PC' },
                                { icon: Users, text: 'Ruang kelas ber-AC dilengkapi proyektor' },
                                { icon: Award, text: 'Laboratorium Sains (Fisika, Kimia, Biologi)' },
                                { icon: Clock, text: 'Lapangan olahraga multifungsi' },
                                { icon: Shield, text: 'Ruang UKS dan konseling siswa' },
                            ].map((fasilitas, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                    <fasilitas.icon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-700">{fasilitas.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ekspektasi Portal */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                            Apa yang Diharapkan dari Portal Ini?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                {
                                    title: 'Akses Informasi Cepat',
                                    desc: 'Dapatkan update terbaru tentang kegiatan sekolah, pengumuman, dan materi akademik secara real-time.',
                                    color: 'emerald'
                                },
                                {
                                    title: 'Transparansi Akademik',
                                    desc: 'Siswa dan orang tua dapat memantau perkembangan belajar, kehadiran, dan nilai secara transparan.',
                                    color: 'blue'
                                },
                                {
                                    title: 'Layanan Mandiri',
                                    desc: 'Memudahkan akses ke berbagai layanan administratif sekolah tanpa harus datang langsung ke tata usaha.',
                                    color: 'amber'
                                },
                            ].map((item, idx) => (
                                <div key={idx} className={`p-4 bg-${item.color}-50 rounded-xl border border-${item.color}-100`}>
                                    <h4 className={`font-semibold text-${item.color}-800 mb-2 text-sm`}>{item.title}</h4>
                                    <p className={`text-${item.color}-700 text-xs leading-relaxed`}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Jam Operasional */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-rose-600" />
                            Jam Operasional Portal
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Senin - Jumat</span>
                                <span className="text-sm font-semibold text-gray-900">06.00 - 22.00 WIB</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Sabtu - Minggu</span>
                                <span className="text-sm font-semibold text-gray-900">08.00 - 17.00 WIB</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 text-center">
                            Portal dapat diakses kapan saja, namun layanan admin dan verifikasi data hanya pada jam operasional di atas.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
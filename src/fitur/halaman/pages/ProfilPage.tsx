import { useState } from 'react';
import type { PageProps } from '../types';

export default function ProfilPage() {
  // State untuk mengontrol status tombol baca selengkapnya
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="px-6 py-8 font-serif text-gray-900">
      
      {/* Banner / Header Utama Koran */}
      <div className="mb-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tight leading-none mb-2 text-center">
            Profil & Visi Sekolah
          </h1>
          <p className="text-sm italic text-gray-600 font-serif text-center">
            Mengenal lebih dekat lingkungan, komitmen pendidikan, dan program pembelajaran kami.
          </p>
        </div>
        <hr className="border-t-4 border-double border-gray-900 my-6" />
      </div>

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
                if (target.parentElement) {
                  target.parentElement.innerHTML = '<span class="text-xl font-bold font-sans text-gray-700">SMPN1</span>';
                }
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
            <span className="text-gray-600 flex-shrink-0">📍</span>
            <span>Jl. Pendidikan No. 1, Majenang, Cilacap</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 flex-shrink-0">📞</span>
            <span>(0280) 123456</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 flex-shrink-0">✉️</span>
            <span>smpn1majenang@sch.id</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 flex-shrink-0">🌐</span>
            <span>www.smpn1majenang.sch.id</span>
          </div>
        </div>
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

        <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold uppercase font-serif tracking-tight border-b-2 border-gray-950 pb-1 mb-3">
              Bagian II: Pengantar Kepala Sekolah
            </h3>
            <div className="flex gap-4 items-start bg-gray-50 p-3 border border-gray-300 mb-3">
              <div className="w-20 h-24 bg-gray-200 border border-gray-400 flex-shrink-0 overflow-hidden grayscale">
                <img
                  src={`${import.meta.env.BASE_URL}images/pegawai/profile-photo.jpg`}
                  alt="Foto Kepala Sekolah"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = '<div class="text-[10px] text-center text-gray-400 pt-8 font-sans">Foto Kepala Sekolah</div>';
                    }
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

            {/* Container Teks Terpotong dengan Efek Animasi */}
            <div className="relative">
              <div 
                className={`text-xs font-serif leading-relaxed text-justify text-gray-800 transition-all duration-500 ease-in-out overflow-hidden ${
                  isExpanded ? 'max-h-[2000px]' : 'max-h-40'
                }`}
              >
                <p className="italic pt-1 border-t border-gray-200 whitespace-pre-line">
                  "Portal informasi resmi ini hadir sebagai sebuah ruang digital yang secara fundamental mengubah cara sekolah berdialog dengan lingkungannya. Dalam konteks pendidikan kontemporer, di mana komunikasi tidak lagi terbatas pada ruang fisik dan waktu pertemuan konvensional, keberadaan platform semacam ini bukan sekadar tambahan teknis, melainkan representasi dari komitmen institusi pendidikan terhadap prinsip keterbukaan dan inklusi. Portal ini dirancang dengan mempertimbangkan bahwa wali murid, siswa, dan masyarakat luas memerlukan akses yang terstruktur, dapat diandalkan, dan berkelanjutan terhadap informasi yang berkaitan langsung dengan proses pembelajaran dan tata kelola sekolah.
                  {"\n\n"}
                  Secara fungsional, media komunikasi digital ini menyatukan beragam alur informasi yang sebelumnya mungkin tersebar dan tidak terintegrasi. Kegiatan belajar yang sedang berlangsung, program pendidikan yang sedang atau akan dijalankan, serta aspek administrasi sekolah kini dapat diakses dalam satu kesatuan antarmuka. Integrasi semacam ini memiliki implikasi yang lebih dalam daripada sekadar efisiensi teknis; ia mencerminkan pemahaman bahwa transparansi dalam pendidikan bukan hanya hak, melainkan juga prasyarat bagi terbangunnya kepercayaan dan partisipasi aktif dari seluruh pemangku kepentingan. Ketika wali murid dapat memantau perkembangan akademik dan kegiatan anaknya secara langsung, dan ketika masyarakat dapat mengamati program-program yang dijalankan oleh sekolah, maka terbentuklah sebuah ekosistem di mana akuntabilitas institusi pendidikan tidak lagi bersifat abstrak, melainkan dapat diverifikasi secara konkret.
                  {"\n\n"}
                  Lebih jauh lagi, sifat terbuka dari portal ini menandakan sebuah pergeseran paradigmatik dalam hubungan sekolah dengan publik. Tradisionalnya, informasi sekolah seringkali bersifat reaktif—disampaikan hanya ketika diperlukan atau diminta. Namun, dengan adanya portal yang secara proaktif mempublikasikan data dan informasi, sekolah menempatkan dirinya dalam posisi yang lebih demokratis, di mana akses terhadap pengetahuan tentang operasional pendidikan tidak lagi diprivilegikan kepada kelompok tertentu. Hal ini secara tidak langsung juga mengedukasi publik tentang kompleksitas pengelolaan pendidikan, mulai dari perencanaan kurikulum, pelaksanaan kegiatan, hingga aspek administrasi yang seringkali tidak terlihat namun menjadi tulang punggung kelancaran operasional sekolah.
                  {"\n\n"}
                  Dalam perspektif yang lebih luas, kehadiran portal semacam ini juga dapat dipahami sebagai respons terhadap tuntutan masyarakat informasi yang semakin menuntut kejelasan dan keterlibatan. Di era di mana data dan informasi menjadi sumber daya yang bernilai tinggi, kemampuan sebuah institusi pendidikan untuk mengelola dan menyebarkan informasinya dengan baik menjadi indikator penting dari kualitas tata kelolanya. Portal ini, dengan demikian, bukan hanya alat komunikasi, melainkan juga cerminan dari visi sekolah dalam membangun hubungan yang lebih transparan, responsif, dan bermakna dengan semua pihak yang memiliki kepentingan dalam dunia pendidikan.
                  {"\n\n"}
                  Melalui pendekatan semacam ini, sekolah tidak lagi berdiri sebagai institusi yang terpisah dari komunitasnya, melainkan menjadi bagian integral dari jaringan sosial yang saling terhubung melalui aliran informasi yang jelas, terbuka, dan saling menguntungkan."
                </p>
              </div>

              {/* Efek Gradasi Pudar di bagian bawah teks saat terpotong */}
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>
          </div>

          {/* Tombol Interaktif */}
          <div className="pt-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-sans font-bold uppercase tracking-wider text-gray-900 hover:text-gray-600 transition-colors duration-200 border-b border-gray-900 pb-0.5"
            >
              {isExpanded ? 'Sembunyikan ↑' : 'Baca Selengkapnya →'}
            </button>
          </div>
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
      
      <p className="text-center text-[10px] text-gray-500 font-sans italic pt-6">
        Dokumentasi Resmi Publikasi Pendidikan • Tata Usaha SMP Negeri 1 Majenang
      </p>
    </section>
  );
}
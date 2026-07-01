import { useState } from 'react';

export default function ProfilPage() {
  const [isExpanded, setIsExpanded] = useState(false);

  // ─── Data ───────────────────────────────────────────────────────────────────

  const misiList = [
    'Mengimplementasikan iman dan taqwa dalam kehidupan sehari-hari.',
    'Mengoptimalkan pembiasaan sikap dan perilaku yang terpadu.',
    'Mengembangkan pembelajaran yang aktif, kreatif, efektif, dan menyenangkan dengan berbasis ICT.',
    'Meraih prestasi melalui pengembangan bakat, minat dan kreativitas siswa dalam kegiatan infra dan ekstrakurikuler.',
    'Meningkatkan kemampuan tenaga pendidik dan kependidikan yang profesional, inovatif, religious, dan menguasai IPTEK.',
    'Mewujudkan lingkungan sekolah yang bersih, rindang, asri, dan sehat untuk mendukung pembelajaran.',
    'Mengoptimalkan potensi sumber daya manusia, lingkungan, dan sarana sekolah.',
    'Mengembangkan jaringan kerja yang potensial, kontribusi, dan berdaya guna baik dengan masyarakat, instansi pemerintah maupun swasta.',
    'Menyelenggarakan program pendidikan yang berakar pada nilai-nilai agama dan budaya masyarakat dengan tetap mengikuti perkembangan dunia luar.',
    'Menyelenggarakan program kegiatan yang mengarah kepada terwujudnya sekolah berbudaya lingkungan.',
  ];

  const fasilitasList = [
    'Perpustakaan (5.000+ Koleksi Buku)',
    'Laboratorium Komputer Terintegrasi',
    'Ruang Kelas dengan Proyektor Media',
    'Laboratorium Praktikum Sains (IPA)',
    'Lapangan Olahraga Serbaguna',
    'Ruang Layanan Kesehatan / UKS',
  ];

  const strukturOrg = {
    wakaKiri: [
      { jabatan: 'WAKA SARPRAS',    nama: 'Samiran, S.Pd.I',            foto: 'waka-sarpras1' },
      { jabatan: 'WAKA SARPRAS',    nama: 'Drs. Cahyo Sumargo',          foto: 'waka-sarpras2' },
      { jabatan: 'PENJAS SNP',      nama: 'Drs. Sinar Agus',             foto: 'penjas'        },
    ],
    wakaKanan: [
      { jabatan: 'WAKA KESISWAAN',  nama: "Moh. In'am Fathur Riza, S.Pd.I", foto: 'waka-kesiswaan' },
      { jabatan: 'WAKA HUMAS',      nama: 'Sunhaji, S.Pd',               foto: 'waka-humas'    },
      { jabatan: 'KEPALA PERPUS',   nama: 'Siti Qotidjah N.K., S.Pd',    foto: 'kepala-perpus' },
    ],
  };

  // ─── Sub-komponen kecil ──────────────────────────────────────────────────────

  /** Kartu Waka / Staff dengan foto */
  const StaffCard = ({ jabatan, nama, foto }: { jabatan: string; nama: string; foto: string }) => (
    <div className="flex flex-col items-center">
      <div className="w-0.5 h-5 bg-slate-400" />
      <div className="flex items-center gap-2 bg-white border-2 border-slate-800 px-3 py-2 rounded-lg shadow-md w-full max-w-[280px]">
        <div className="w-12 h-14 bg-gray-200 rounded overflow-hidden flex-shrink-0 border border-gray-300">
          <img
            src={`${import.meta.env.BASE_URL}images/pegawai/${foto}.jpg`}
            alt={jabatan}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
        <div className="text-left">
          <p className="font-bold text-xs text-slate-900">{jabatan}</p>
          <p className="text-[10px] text-gray-600">{nama}</p>
        </div>
      </div>
    </div>
  );

  /** Garis vertikal penghubung antar level */
  const VLine = ({ height = 'h-8', mt = '' }: { height?: string; mt?: string }) => (
    <div className={`w-0.5 ${height} bg-slate-400 ${mt}`} />
  );

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <section className="px-6 py-8 font-serif text-gray-900">

      {/* ══════════════════════════════════════════════════════
          HEADER / BANNER KORAN
      ══════════════════════════════════════════════════════ */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-5xl font-serif font-black uppercase tracking-tight leading-none mb-2 text-center">
          Profil &amp; Visi Sekolah
        </h1>
        <p className="text-sm italic text-gray-600 font-serif text-center">
          Mengenal lebih dekat lingkungan, komitmen pendidikan, dan program pembelajaran kami.
        </p>
        <hr className="border-t-4 border-double border-gray-900 my-6" />
      </div>

      {/* ══════════════════════════════════════════════════════
          BAGIAN 0 — Identitas Utama & Kontak
      ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-gray-400">

        {/* Logo + Nama Sekolah */}
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 items-center sm:items-start
                        border-b md:border-b-0 md:border-r border-gray-300
                        pb-6 md:pb-0 md:pr-6 text-center sm:text-left">
          <div className="w-20 h-20 bg-gray-100 flex items-center justify-center flex-shrink-0
                          border border-gray-900 overflow-hidden">
            <img
              src={`${import.meta.env.BASE_URL}images/logo/logo-sekolah.svg`}
              alt="Logo SMP N 1 Majenang"
              className="w-full h-full object-cover grayscale"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.style.display = 'none';
                if (t.parentElement)
                  t.parentElement.innerHTML = '<span class="text-xl font-bold font-sans text-gray-700">SMPN1</span>';
              }}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-serif leading-tight text-gray-900">
              SMP Negeri 1 Majenang
            </h2>
            <p className="text-sm italic font-serif text-gray-700 mt-2">
              "Unggul dalam Prestasi, Berkarakter, dan Berwawasan Lingkungan"
            </p>
          </div>
        </div>

        {/* Kontak */}
        <div className="text-xs space-y-2 font-sans text-gray-700 flex flex-col justify-center">
          {[
            { icon: '📍', text: 'Jl. Pendidikan No. 1, Majenang, Cilacap' },
            { icon: '📞', text: '(0280) 123456' },
            { icon: '✉️', text: 'smpn1majenang@sch.id' },
            { icon: '🌐', text: 'www.smpn1majenang.sch.id' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <span className="flex-shrink-0">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BAGIAN I — Visi & Misi  |  BAGIAN II — Sambutan Kepsek
      ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6 pb-6 border-b border-gray-400">

        {/* ── Visi & Misi ─────────────────────────────────── */}
        <div className="md:col-span-7 md:border-r border-gray-300 md:pr-6 space-y-4">
          <h3 className="text-base font-bold uppercase font-serif tracking-tight border-b-2 border-gray-950 pb-1">
            Bagian I: Visi &amp; Misi Sekolah
          </h3>

          {/* Visi */}
          <div>
            <h4 className="font-bold text-xs uppercase font-sans text-gray-800 mb-1 tracking-wide">
              Visi Utama:
            </h4>
            <p className="text-base leading-relaxed text-justify pl-4 border-l-2 border-gray-900 italic text-gray-800">
              "Terwujudnya generasi yang beriman, bertaqwa, berilmu, berbudi luhur,
              serta unggul dalam prestasi dan berwawasan lingkungan."
            </p>
          </div>

          {/* Misi */}
          <div>
            <h4 className="font-bold text-xs uppercase font-sans text-gray-800 mb-2 tracking-wide">
              Misi Operasional:
            </h4>
            <ul className="space-y-1.5 text-sm text-justify font-serif text-gray-800">
              {misiList.map((misi, idx) => (
                <li key={idx} className="list-decimal list-inside pl-1 leading-relaxed">
                  {misi}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Sambutan Kepala Sekolah ──────────────────────── */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold uppercase font-serif tracking-tight border-b-2 border-gray-950 pb-1 mb-3">
              Bagian II: Sambutan Kepala Sekolah
            </h3>

            {/* Kartu Kepala Sekolah */}
            <div className="flex gap-4 items-start bg-gray-50 p-3 border border-gray-300 mb-3">
              <div className="w-20 h-24 bg-gray-200 border border-gray-400 flex-shrink-0 overflow-hidden grayscale">
                <img
                  src={`${import.meta.env.BASE_URL}images/pegawai/kepsek.jpg`}
                  alt="Foto Kepala Sekolah"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.style.display = 'none';
                    if (t.parentElement)
                      t.parentElement.innerHTML =
                        '<div class="text-[10px] text-center text-gray-400 pt-8 font-sans">Foto Kepala Sekolah</div>';
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

            {/* Teks Sambutan dengan expand/collapse */}
            <div className="relative">
              <div
                className={`text-xs font-serif leading-relaxed text-justify text-gray-800
                            transition-all duration-500 ease-in-out overflow-hidden
                            ${isExpanded ? 'max-h-[2000px]' : 'max-h-40'}`}
              >
                <p className="italic pt-1 border-t border-gray-200 whitespace-pre-line">
                  {"\"Assalamu'alaikum warahmatullahi wabarakatuh,\n\n"}
                  {"Puji syukur ke hadirat Allah SWT atas segala rahmat dan karunia-Nya, sehingga SMP Negeri 1 Majenang terus berkembang dalam memberikan layanan pendidikan terbaik kepada peserta didik. Website ini kami hadirkan sebagai sarana informasi, komunikasi, dan promosi yang dapat diakses oleh seluruh warga sekolah maupun masyarakat umum.\n\n"}
                  {"Kami berharap website ini dapat memberikan informasi yang akurat dan relevan mengenai kegiatan, program, prestasi, dan berbagai layanan yang ada di SMPN 1 Majenang. Hal ini merupakan bentuk komitmen kami dalam mewujudkan transparansi dan akuntabilitas publik, serta mendukung keterbukaan informasi pendidikan.\n\n"}
                  {"Besar harapan kami, semua pihak dapat bersinergi dan berkontribusi aktif demi kemajuan sekolah ini. Semoga keberadaan website ini semakin meningkatkan kualitas komunikasi dan memberikan manfaat yang luas bagi seluruh pengguna.\n\n"}
                  {"Wassalamu'alaikum warahmatullahi wabarakatuh.\n\n"}
                  {"Kepala Sekolah\n\n"}
                  {'Drs. H. Mulyono, M.Pd."'}
                </p>
              </div>

              {/* Gradasi pudar saat terpotong */}
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>
          </div>

          {/* Tombol Baca Selengkapnya */}
          {!isExpanded && (
            <div className="pt-2">
              <button
                onClick={() => setIsExpanded(true)}
                className="text-xs font-sans font-bold uppercase tracking-wider text-gray-900
                           hover:text-gray-600 transition-colors duration-200
                           border-b border-gray-900 pb-0.5"
              >
                Baca Selengkapnya →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BAGIAN III — Struktur Organisasi Sekolah
      ══════════════════════════════════════════════════════ */}
      <div className="pt-6 pb-6 border-b border-gray-400">
        <h3 className="text-base font-bold uppercase font-serif tracking-tight border-b-2 border-gray-950 pb-1 mb-8">
          Bagian III: Struktur Organisasi Sekolah
        </h3>

        <div className="flex flex-col items-center font-sans">

          {/* ── Level 1: Kepala Sekolah ── */}
          <div className="flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-lg border-2 border-slate-700">
            <div className="w-14 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0 border border-white/20">
              <img
                src={`${import.meta.env.BASE_URL}images/pegawai/kepsek.jpg`}
                alt="Kepala Sekolah"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.style.display = 'none';
                  if (t.parentElement)
                    t.parentElement.innerHTML = '<div class="text-[10px] text-center text-gray-500 pt-5">Foto</div>';
                }}
              />
            </div>
            <div>
              <p className="font-bold text-sm">Drs. H. Mulyono, M.Pd.</p>
              <p className="text-xs text-cyan-400 font-semibold">Kepala Sekolah</p>
            </div>
          </div>

          <VLine />

          {/* ── Level 2: Komite Sekolah ←→ KTU ── */}
          <div className="relative w-full max-w-2xl">
            {/* Garis horizontal */}
            <div className="absolute top-0 left-[20%] right-[20%] h-0.5 bg-slate-400" />

            <div className="flex justify-between pt-0">
              {/* Komite Sekolah */}
              <div className="flex flex-col items-center w-1/2">
                <div className="w-0.5 h-6 bg-slate-400" />
                <div className="bg-blue-900 text-white px-5 py-2 rounded-full text-xs font-bold
                                border border-blue-700 shadow-md text-center">
                  KOMITE SEKOLAH
                </div>
              </div>

              {/* KTU */}
              <div className="flex flex-col items-center w-1/2">
                <div className="w-0.5 h-6 bg-slate-400" />
                <div className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2
                                rounded-lg border border-slate-600 shadow-md">
                  <div className="w-10 h-12 bg-gray-300 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={`${import.meta.env.BASE_URL}images/pegawai/ktu.jpg`}
                      alt="KTU"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-xs">Didik Subiyantoro</p>
                    <p className="text-[10px] text-cyan-400">KTU</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <VLine />

          {/* ── Level 3: Waka & Staff (3 × 2) ── */}
          <div className="relative w-full max-w-4xl">
            {/* Garis horizontal penghubung dua kolom */}
            <div className="absolute top-0 left-[25%] right-[25%] h-0.5 bg-slate-400" />

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-0">
              {strukturOrg.wakaKiri.map((item, idx) => (
                <StaffCard key={`kiri-${idx}`} {...item} />
              ))}
              {/* Pasangkan kanan di baris yang sama dengan kiri menggunakan order */}
              {strukturOrg.wakaKanan.map((item, idx) => (
                <StaffCard key={`kanan-${idx}`} {...item} />
              ))}
            </div>
          </div>

          <VLine mt="mt-4" />

          {/* ── Level 4: Laboran & Pustakawan ── */}
          <div className="relative w-full max-w-2xl">
            <div className="absolute top-0 left-[20%] right-[20%] h-0.5 bg-slate-400" />
            <div className="flex justify-between pt-0 px-6">
              {['LABORAN', 'PUSTAKAWAN'].map((label) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-slate-400" />
                  <div className="bg-slate-700 text-white px-6 py-2 rounded-full text-xs font-bold
                                  border border-slate-500 shadow-md">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <VLine mt="mt-4" />

          {/* ── Level 5: Guru BK / Wali Kelas ── */}
          <div className="bg-blue-900 text-white px-8 py-2.5 rounded-full text-sm font-bold
                          border-2 border-blue-700 shadow-lg">
            GURU BK / WALI KELAS
          </div>

          <VLine />

          {/* ── Level 6: Siswa ── */}
          <div className="bg-emerald-700 text-white px-10 py-3 rounded-full text-sm font-bold
                          border-2 border-emerald-500 shadow-lg">
            SISWA
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BAGIAN IV — Fasilitas  |  BAGIAN V — Layanan SIS
      ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 pb-6 border-b border-gray-400">

        {/* Fasilitas */}
        <div className="md:border-r border-gray-300 md:pr-6">
          <h3 className="text-base font-bold uppercase font-serif tracking-tight border-b-2 border-gray-950 pb-1 mb-3">
            Bagian IV: Daftar Fasilitas Sekolah
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs font-sans text-gray-800">
            {fasilitasList.map((f) => (
              <div key={f} className="flex items-center gap-2 py-1 border-b border-gray-100">
                <span className="text-gray-950 font-bold">•</span>
                <span className="text-gray-700 leading-tight">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Layanan SIS */}
        <div>
          <h3 className="text-base font-bold uppercase font-serif tracking-tight border-b-2 border-gray-950 pb-1 mb-3">
            Bagian V: Layanan Sistem Informasi Sekolah
          </h3>
          <div className="space-y-2 text-xs text-justify text-gray-800 font-serif">
            <p>
              <span className="font-bold">Informasi Akademik Berkala:</span>{' '}
              Wali murid dan siswa dapat memantau jadwal pelajaran, pengumuman kegiatan tengah semester,
              kalender pendidikan, serta info darurat sekolah secara berkala.
            </p>
            <p>
              <span className="font-bold">Pemantauan Perkembangan Siswa:</span>{' '}
              Sistem ini memfasilitasi keterbukaan rekaman presensi kehadiran dan evaluasi belajar harian
              untuk mendukung kemajuan studi anak.
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          BAGIAN VI — Jam Operasional
      ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 pb-6 border-b border-gray-400">

        {/* Deskripsi Layanan */}
        <div className="md:col-span-2 space-y-2">
          <h3 className="text-base font-bold uppercase font-serif border-b-2 border-gray-950 pb-1 mb-2">
            Bagian VI: Jam Operasional &amp; Layanan Kantor
          </h3>
          <div className="space-y-2 text-xs text-justify text-gray-800 font-serif">
            <p>
              <span className="font-bold">Pelayanan Terpadu:</span>{' '}
              Kantor tata usaha melayani keperluan administrasi siswa, legalisasi dokumen, serta konsultasi
              wali murid pada jam operasional yang telah ditetapkan.
            </p>
            <p>
              <span className="font-bold">Layanan Daring:</span>{' '}
              Pengiriman berkas dan konsultasi ringan dapat dilakukan melalui surel atau WhatsApp resmi
              sekolah di luar jam kantor.
            </p>
          </div>
        </div>

        {/* Tabel Jam Operasional */}
        <div className="border border-gray-900 p-4 bg-gray-50 h-fit font-sans">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-center
                         border-b border-gray-900 pb-1 mb-2 text-gray-700">
            Jam Operasional Kantor &amp; Pelayanan
          </h4>
          <div className="text-xs space-y-1 text-gray-800">
            <div className="flex justify-between">
              <span>Senin – Kamis</span>
              <span className="font-bold">07.00 – 14.00 WIB</span>
            </div>
            <div className="flex justify-between">
              <span>Jumat</span>
              <span className="font-bold">07.00 – 11.00 WIB</span>
            </div>
            <div className="flex justify-between border-t border-red-300 pt-1 mt-1 text-red-500">
              <span>Sabtu – Minggu</span>
              <span>Tutup / Libur</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-[10px] text-gray-500 font-sans italic pt-6">
        Dokumentasi Resmi Publikasi Pendidikan • Tata Usaha SMP Negeri 1 Majenang
      </p>

    </section>
  );
}
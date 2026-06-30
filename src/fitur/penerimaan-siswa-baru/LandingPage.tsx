import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export type LandingPageProps = {
  onOpenForm: () => void;
  onOpenCekKelulusan: () => void;
  onClose: () => void;
};

export default function LandingPage({ onOpenForm, onOpenCekKelulusan, onClose }: LandingPageProps) {
  const [openDocKey, setOpenDocKey] = useState('Bukti pendaftaran + nomor registrasi');
  const [openPayKey, setOpenPayKey] = useState('Pendaftaran Online');

  const verificationDocs = [
    {
      title: 'Bukti pendaftaran + nomor registrasi',
      status: 'Wajib',
      summary: 'Dokumen identitas utama peserta pada sistem.',
      detail:
        'Dicetak dari portal PPDB setelah submit berhasil. Pastikan nomor registrasi terbaca jelas karena akan digunakan petugas untuk membuka data peserta di sistem.',
    },
    {
      title: 'Kartu Keluarga (KK)',
      status: 'Wajib',
      summary: 'Dasar verifikasi hubungan keluarga dan domisili.',
      detail:
        'Bawa dokumen asli dan 1 lembar fotokopi. Data kepala keluarga, alamat, dan anggota keluarga harus sesuai dengan data yang diinput saat pendaftaran.',
    },
    {
      title: 'Akta Kelahiran',
      status: 'Wajib',
      summary: 'Dasar verifikasi nama resmi dan tanggal lahir.',
      detail:
        'Bawa dokumen asli dan 1 lembar fotokopi. Penulisan nama lengkap, tempat lahir, dan tanggal lahir akan dibandingkan dengan formulir pendaftaran.',
    },
    {
      title: 'SKL/Ijazah (jenjang non-SD)',
      status: 'Wajib Bersyarat',
      summary: 'Wajib untuk pendaftar SMP/SMA/SMK.',
      detail:
        'Siapkan SKL atau ijazah sesuai ketentuan jenjang tujuan. Jika dokumen belum terbit, ikuti kebijakan sekolah terkait surat keterangan sementara.',
    },
    {
      title: 'Piagam prestasi',
      status: 'Wajib Jalur Prestasi',
      summary: 'Digunakan untuk validasi jalur prestasi.',
      detail:
        'Dokumen harus legal, jelas asal penyelenggara, tingkat kompetisi, serta rentang waktu prestasi sesuai aturan panitia PPDB setempat.',
    },
    {
      title: 'Kartu KIP/PKH',
      status: 'Wajib Jalur Afirmasi',
      summary: 'Validasi komponen sosial ekonomi.',
      detail:
        'Bawa kartu asli dan fotokopi. Nomor kartu dan identitas penerima akan diverifikasi untuk memastikan kesesuaian jalur afirmasi.',
    },
    {
      title: 'Surat pindah tugas orang tua',
      status: 'Wajib Jalur Pindahan',
      summary: 'Validasi perpindahan domisili karena tugas resmi.',
      detail:
        'Surat harus berasal dari instansi resmi, memuat identitas orang tua/wali, lokasi penugasan baru, dan masa tugas yang masih berlaku.',
    },
  ];

  const paymentItems = [
    {
      title: 'Pendaftaran Online',
      summary: 'Umumnya gratis untuk sekolah negeri.',
      detail:
        'Portal PPDB tidak menarik biaya untuk submit formulir pada sekolah negeri. Jika ada pungutan, pastikan ada dasar surat resmi dari sekolah/panitia.',
    },
    {
      title: 'Daftar Ulang',
      summary: 'Muncul setelah peserta dinyatakan diterima.',
      detail:
        'Komponen bisa mencakup seragam, atribut, kegiatan awal tahun, atau komite sesuai kebijakan masing-masing sekolah. Selalu minta rincian resmi tertulis.',
    },
    {
      title: 'Metode Pembayaran',
      summary: 'Gunakan jalur pembayaran resmi sekolah.',
      detail:
        'Pembayaran biasanya melalui virtual account, transfer bank mitra, atau kasir sekolah. Hindari transaksi di luar kanal resmi untuk mencegah risiko penipuan.',
    },
    {
      title: 'Dokumen Pembayaran',
      summary: 'Bukti bayar harus disimpan sampai proses selesai.',
      detail:
        'Simpan bukti transfer, mutasi, atau kwitansi asli. Dokumen ini diperlukan saat validasi bendahara, audit internal, atau saat terjadi selisih data pembayaran.',
    },
    {
      title: 'Peringatan Keamanan',
      summary: 'Jangan transfer ke rekening pribadi.',
      detail:
        'Pembayaran hanya ke rekening resmi sekolah/instansi. Konfirmasi nama penerima, nomor rekening, dan referensi pembayaran sebelum transaksi dilakukan.',
    },
  ];

  const handlePrintParentGuide = () => {
    const win = window.open('', '_blank', 'width=1100,height=800');
    if (!win) return;

    const docRows = verificationDocs
      .map(
        (item, idx) =>
          `<tr><td>${String(idx + 1).padStart(2, '0')}</td><td>${item.title}</td><td>${item.status}</td><td>${item.summary}</td></tr>`,
      )
      .join('');

    const payRows = paymentItems
      .map(
        (item, idx) =>
          `<tr><td>${String(idx + 1).padStart(2, '0')}</td><td>${item.title}</td><td>${item.summary}</td><td>${item.detail}</td></tr>`,
      )
      .join('');

    const checklist = [
      'Nomor registrasi sudah dicatat dan bukti pendaftaran sudah dicetak',
      'KK asli + fotokopi sudah disiapkan',
      'Akta lahir asli + fotokopi sudah disiapkan',
      'SKL/Ijazah (jika wajib jenjang) sudah dibawa',
      'Dokumen jalur khusus (prestasi/afirmasi/pindahan) sudah lengkap',
      'Bukti pembayaran (jika ada) tersimpan dengan baik',
      'Datang sesuai jadwal verifikasi sekolah tujuan',
      'Kontak helpdesk sekolah sudah disimpan untuk antisipasi kendala',
    ]
      .map((item) => `<li>${item}</li>`)
      .join('');

    win.document.write(`
      <html>
        <head>
          <title>Panduan Lengkap Orang Tua PPDB</title>
          <style>
            @page { size: A4; margin: 16mm; }
            body { font-family: Arial, sans-serif; color: #0f172a; margin: 0; line-height: 1.45; font-size: 12px; }
            .paper { max-width: 190mm; margin: 0 auto; }
            .head { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 14px; }
            .instansi { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: #475569; }
            h1 { margin: 4px 0 0; font-size: 21px; }
            .meta { margin-top: 4px; color: #475569; }
            h2 { margin: 22px 0 8px; font-size: 16px; }
            h3 { margin: 12px 0 6px; font-size: 13px; }
            p { margin: 4px 0; color: #334155; }
            .note { background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; }
            .flow { display: grid; grid-template-columns: repeat(6, minmax(0,1fr)); gap: 6px; margin-top: 8px; }
            .flow-item { border: 1px solid #cbd5e1; padding: 6px; text-align: center; font-size: 11px; font-weight: 700; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; }
            th, td { border: 1px solid #cbd5e1; padding: 7px; vertical-align: top; }
            th { background: #f1f5f9; text-align: left; }
            ul { margin: 6px 0 0 18px; padding: 0; }
            li { margin: 4px 0; }
            .signature { margin-top: 24px; display: flex; justify-content: space-between; }
            .sig-box { width: 44%; text-align: center; }
            .line { margin-top: 40px; border-top: 1px solid #94a3b8; }
          </style>
        </head>
        <body>
          <div class="paper">
            <div class="head">
              <div class="instansi">Kementerian Pendidikan Republik Indonesia</div>
              <h1>Panduan Lengkap Orang Tua/Wali - PPDB Nasional</h1>
              <p class="meta">Dokumen operasional pendaftaran | Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
            </div>

            <div class="note">
              <strong>Pengantar untuk Orang Tua/Wali:</strong>
              <p>
                Panduan ini disusun agar Bapak/Ibu dapat mengikuti proses pendaftaran secara tenang dan berurutan, mulai dari pendaftaran akun,
                pengisian formulir, verifikasi dokumen, hingga daftar ulang. Gunakan panduan ini sebagai acuan sebelum datang ke sekolah.
              </p>
            </div>

            <h2>1. Diagram Alur Pendaftaran</h2>
            <div class="flow">
              <div class="flow-item">Registrasi Akun</div>
              <div class="flow-item">Isi Formulir</div>
              <div class="flow-item">Unggah Berkas</div>
              <div class="flow-item">Verifikasi Sekolah</div>
              <div class="flow-item">Pengumuman</div>
              <div class="flow-item">Daftar Ulang</div>
            </div>

            <h2>2. Berkas Saat Verifikasi</h2>
            <table>
              <thead>
                <tr><th>No</th><th>Dokumen</th><th>Status</th><th>Ringkasan</th></tr>
              </thead>
              <tbody>${docRows}</tbody>
            </table>

            <h2>3. Skema Pembayaran Resmi</h2>
            <table>
              <thead>
                <tr><th>No</th><th>Komponen</th><th>Ringkasan</th><th>Detail</th></tr>
              </thead>
              <tbody>${payRows}</tbody>
            </table>

            <h2>4. Checklist Sebelum Berangkat Verifikasi</h2>
            <ul>${checklist}</ul>

            <h2>5. FAQ Ringkas</h2>
            <h3>Apakah data bisa direvisi jika ada kesalahan?</h3>
            <p>Bisa selama masa verifikasi masih dibuka. Hubungi helpdesk dan bawa dokumen pembanding asli.</p>
            <h3>Apakah harus datang ke sekolah setelah daftar online?</h3>
            <p>Ya, untuk verifikasi dokumen asli dan proses daftar ulang sesuai jadwal resmi sekolah.</p>
            <h3>Bagaimana jika bukti pembayaran hilang?</h3>
            <p>Segera cetak ulang mutasi bank atau minta rekap transaksi resmi dari kanal pembayaran yang digunakan.</p>

            <div class="signature">
              <div class="sig-box">
                <p>Orang Tua/Wali</p>
                <div class="line"></div>
              </div>
              <div class="sig-box">
                <p>Petugas Verifikasi</p>
                <div class="line"></div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
  <img
    src={`${import.meta.env.BASE_URL}images/siswa%20baru/unique_id.png`}
    alt="Logo PPDB"
    className="h-10 w-auto object-contain"
  />
</div>

          <nav className="flex items-center gap-3 md:gap-5">
            <button
              onClick={onOpenCekKelulusan}
              className="text-sm font-medium text-slate-700 transition hover:text-slate-900 cursor-pointer"
            >
              Cek Kelulusan
            </button>
            <button
              onClick={onOpenForm}
              className="text-sm font-medium text-slate-700 transition hover:text-slate-900 cursor-pointer"
            >
              Daftar Sekarang
            </button>
            <button
              onClick={onClose}
              className="text-sm font-medium text-slate-700 transition hover:text-slate-900 cursor-pointer"
            >
              Tutup
            </button>
          </nav>
        </div>
      </header>

      <main className="overflow-x-hidden">
      <section
        className="relative flex min-h-screen items-end border-b border-slate-200 pt-16"
        style={{
          backgroundImage:
            `linear-gradient(to top, rgba(15,23,42,0.70), rgba(15,23,42,0.35)), url('${import.meta.env.BASE_URL}images/siswa%20baru/f-3.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 1%',
          width: '100%',
          
        }}
      >
          <div className="mx-auto w-full max-w-7xl px-4 py-14 text-white md:px-8 md:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">PPDB Nasional 2026</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
              Penerimaan Peserta Didik Baru
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-100 md:text-lg">
              Sistem pendaftaran resmi untuk jenjang SD, SMP, SMA, dan SMK. Data pendaftar diproses terintegrasi oleh
              sekolah dan operator administrasi.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenForm}
                className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-900"
              >
                Mulai Pendaftaran <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={onOpenCekKelulusan}
                className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Cek Hasil Kelulusan
              </button>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 text-sm md:grid-cols-3 md:px-8">
            <p className="font-medium text-slate-700">Dasar Hukum: Permendikbud tentang PPDB Tahun Berjalan</p>
            <p className="font-medium text-slate-700">Layanan Bantuan: Senin - Jumat 08.00 - 16.00</p>
            <p className="font-medium text-slate-700">Dokumen diproses secara digital dan terarsip aman</p>
          </div>
        </section>

        <section className="border-b border-slate-200">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 md:grid-cols-3 md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Jenjang</p>
              <h2 className="mt-3 text-2xl font-semibold">Pilihan Pendidikan</h2>
              <p className="mt-3 text-sm text-slate-600">
                Pendaftaran tersedia untuk seluruh jenjang pendidikan dasar dan menengah.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="divide-y divide-slate-200 border-y border-slate-200">
                {[
                  { code: 'SD', name: 'Sekolah Dasar', desc: 'Usia 6-12 tahun' },
                  { code: 'SMP', name: 'Sekolah Menengah Pertama', desc: 'Usia 12-15 tahun' },
                  { code: 'SMA', name: 'Sekolah Menengah Atas', desc: 'Usia 15-18 tahun' },
                  { code: 'SMK', name: 'Sekolah Menengah Kejuruan', desc: 'Jenjang vokasi dengan jurusan keahlian' },
                ].map((item) => (
                  <div key={item.code} className="flex w-full items-center justify-between px-1 py-4">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{item.code}</p>
                      <p className="text-sm text-slate-600">{item.name}</p>
                    </div>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 md:grid-cols-3 md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Jalur Pendaftaran</p>
              <h2 className="mt-3 text-2xl font-semibold">Skema Seleksi</h2>
              <p className="mt-3 text-sm text-slate-600">
                Pilih jalur sesuai ketentuan dan dokumen pendukung yang berlaku.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  'Reguler',
                  'Zonasi',
                  'Prestasi',
                  'Afirmasi (KIP/PKH)',
                  'Perpindahan Tugas Orang Tua',
                ].map((item, idx) => (
                  <div key={item} className="border-b border-slate-200 py-3">
                    <p className="text-xs font-semibold text-slate-500">{String(idx + 1).padStart(2, '0')}</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 md:grid-cols-3 md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Tahapan</p>
              <h2 className="mt-3 text-2xl font-semibold">Jadwal Resmi</h2>
            </div>
            <div className="md:col-span-2">
              <div className="divide-y divide-slate-200 border-y border-slate-200">
                {[
                  { name: 'Pendaftaran Online', date: '1 - 14 Juni 2026' },
                  { name: 'Verifikasi Berkas', date: '15 - 21 Juni 2026' },
                  { name: 'Pengumuman Hasil', date: '25 Juni 2026' },
                  { name: 'Daftar Ulang', date: '26 - 30 Juni 2026' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-4">
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-600">{item.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 md:grid-cols-3 md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Panduan Lengkap</p>
              <h2 className="mt-3 text-2xl font-semibold">Tata Cara Pendaftaran</h2>
              <p className="mt-3 text-sm text-slate-600">
                Bagian ini disusun dengan bahasa akademik operasional agar orang tua/wali memahami proses, dokumen,
                serta tahapan validasi secara sistematis.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700">
                <p>
                  Bapak/Ibu, sebelum masuk ke tahap teknis, kami ingin mengajak memahami alur ini sebagai perjalanan
                  yang saling berhubungan. Tujuannya sederhana: agar setiap langkah yang Bapak/Ibu ambil hari ini akan
                  mempermudah langkah berikutnya, tanpa perlu mengulang berkas atau memperbaiki data berkali-kali.
                </p>
                <p className="mt-3">
                  Pada praktiknya, banyak kebingungan terjadi bukan karena prosesnya sulit, tetapi karena urutan
                  langkahnya terlewat. Karena itu, bacalah alur ini pelan-pelan dari awal sampai akhir. Setelah memahami
                  gambaran besarnya, Bapak/Ibu akan lebih tenang saat mengisi formulir, mengunggah dokumen, menunggu
                  verifikasi, hingga daftar ulang.
                </p>
                <p className="mt-3">
                  Prinsipnya adalah: satu tahap selesai dengan benar, maka tahap selanjutnya menjadi lebih ringkas.
                  Jika ada bagian yang belum jelas, Bapak/Ibu dapat kembali ke panduan ini kapan saja sebagai peta
                  proses pendaftaran.
                </p>
              </div>

              <div className="border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Diagram Alur Pendaftaran
                </p>

                <div className="mt-3 hidden items-center justify-between gap-2 md:flex">
                  {[
                    'Registrasi Akun',
                    'Isi Formulir',
                    'Unggah Berkas',
                    'Verifikasi Sekolah',
                    'Pengumuman',
                    'Daftar Ulang',
                  ].map((item, idx, arr) => (
                    <div key={item} className="flex flex-1 items-center gap-2">
                      <div className="flex-1 border border-slate-300 bg-white px-2 py-2 text-center text-xs font-semibold text-slate-800">
                        {item}
                      </div>
                      {idx < arr.length - 1 && <span className="text-sm font-bold text-slate-500">→</span>}
                    </div>
                  ))}
                </div>

                <div className="mt-3 space-y-2 md:hidden">
                  {[
                    'Registrasi Akun',
                    'Isi Formulir',
                    'Unggah Berkas',
                    'Verifikasi Sekolah',
                    'Pengumuman',
                    'Daftar Ulang',
                  ].map((item, idx, arr) => (
                    <div key={item}>
                      <div className="border border-slate-300 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-800">
                        {item}
                      </div>
                      {idx < arr.length - 1 && <p className="py-1 text-center text-sm font-bold text-slate-500">↓</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 divide-y divide-slate-200 border-y border-slate-200">
                {[
                  {
                    title: 'Tahap 1 - Registrasi Akun Pendaftar',
                    detail:
                      'Pada tahap awal ini, Bapak/Ibu membuat akun pada portal resmi dan memastikan nomor telepon atau email aktif dapat menerima notifikasi. Setelah akun aktif, siapkan identitas dasar calon siswa. Jika tahap ini sudah rapi, maka pengisian formulir pada tahap berikutnya akan jauh lebih cepat.',
                  },
                  {
                    title: 'Tahap 2 - Pengisian Formulir Akademik dan Administratif',
                    detail:
                      'Selanjutnya, Bapak/Ibu mengisi data identitas siswa, alamat domisili, data orang tua/wali, serta pilihan jenjang dan jalur pendaftaran. Isikan persis seperti dokumen resmi. Ketelitian pada tahap ini sangat penting, karena data inilah yang akan diperiksa panitia pada tahap verifikasi.',
                  },
                  {
                    title: 'Tahap 3 - Unggah Dokumen Pendukung',
                    detail:
                      'Setelah data terisi, sistem akan meminta berkas pendukung. Unggah dokumen digital (PDF/JPG/PNG) dengan kualitas yang jelas dan terbaca. Anggap tahap ini sebagai pembuktian dari data yang sudah diinput sebelumnya. Jika dokumen buram atau tidak lengkap, verifikasi bisa tertunda.',
                  },
                  {
                    title: 'Tahap 4 - Penerbitan Nomor Registrasi',
                    detail:
                      'Ketika formulir dan dokumen sudah dikirim, sistem menerbitkan nomor registrasi unik. Nomor ini adalah identitas utama pendaftaran Bapak/Ibu. Simpan baik-baik, cetak buktinya, dan gunakan nomor ini untuk cek status maupun saat berkomunikasi dengan petugas sekolah.',
                  },
                  {
                    title: 'Tahap 5 - Verifikasi oleh Panitia Sekolah',
                    detail:
                      'Pada fase ini, panitia sekolah memeriksa kesesuaian antara data formulir dan dokumen pendukung. Jika ada ketidaksesuaian administratif, Bapak/Ibu mungkin diminta melakukan koreksi. Ini adalah proses normal untuk menjaga ketepatan data sebelum hasil seleksi diumumkan.',
                  },
                  {
                    title: 'Tahap 6 - Pengumuman dan Daftar Ulang',
                    detail:
                      'Tahap terakhir adalah pengumuman hasil. Jika dinyatakan diterima, Bapak/Ibu melanjutkan ke daftar ulang dengan membawa dokumen asli, menyerahkan berkas sesuai ketentuan sekolah, dan menyelesaikan komponen administrasi resmi yang berlaku.',
                  },
                ].map((item, idx) => (
                  <div key={item.title} className="py-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {String(idx + 1).padStart(2, '0')}. {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 md:grid-cols-3 md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Dokumen Wajib</p>
              <h2 className="mt-3 text-2xl font-semibold">Berkas Saat Verifikasi</h2>
              <p className="mt-3 text-sm text-slate-600">
                Siapkan berkas asli dan fotokopi sesuai ketentuan sekolah tujuan.
              </p>
              <button
                type="button"
                onClick={handlePrintParentGuide}
                className="mt-4 rounded-full border border-slate-900 px-4 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
              >
                Cetak Panduan Orang Tua (A4)
              </button>
            </div>
            <div className="md:col-span-2">
              <p className="mb-3 text-sm text-slate-600">
                Klik "Cek Detail" untuk membuka penjelasan masing-masing dokumen.
              </p>
              <div className="divide-y divide-slate-200 border border-slate-200 bg-white">
                {verificationDocs.map((item) => {
                  const open = openDocKey === item.title;
                  return (
                    <div key={item.title} className="p-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.status}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOpenDocKey(open ? '' : item.title)}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          {open ? 'Tutup Detail' : 'Cek Detail'}
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
                      {open && (
                        <p className="mt-2 border-t border-slate-200 pt-2 text-sm leading-relaxed text-slate-700">
                          {item.detail}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 md:grid-cols-3 md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Biaya &amp; Pembayaran</p>
              <h2 className="mt-3 text-2xl font-semibold">Skema Pembayaran</h2>
              <p className="mt-3 text-sm text-slate-600">
                Rincian di bawah adalah skema umum. Ikuti ketentuan final dari sekolah tujuan.
              </p>
            </div>
            <div className="md:col-span-2">
              <div className="border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Diagram Alur Pembayaran
                </p>
                <div className="mt-3 hidden items-center justify-between gap-2 md:flex">
                  {[
                    'Pengumuman Diterima',
                    'Tagihan Resmi Sekolah',
                    'Pilih Metode Bayar',
                    'Simpan Bukti Bayar',
                    'Validasi Bendahara',
                    'Status Lunas',
                  ].map((item, idx, arr) => (
                    <div key={item} className="flex flex-1 items-center gap-2">
                      <div className="flex-1 border border-slate-300 bg-white px-2 py-2 text-center text-xs font-semibold text-slate-800">
                        {item}
                      </div>
                      {idx < arr.length - 1 && <span className="text-sm font-bold text-slate-500">→</span>}
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-2 md:hidden">
                  {[
                    'Pengumuman Diterima',
                    'Tagihan Resmi Sekolah',
                    'Pilih Metode Bayar',
                    'Simpan Bukti Bayar',
                    'Validasi Bendahara',
                    'Status Lunas',
                  ].map((item, idx, arr) => (
                    <div key={item}>
                      <div className="border border-slate-300 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-800">
                        {item}
                      </div>
                      {idx < arr.length - 1 && <p className="py-1 text-center text-sm font-bold text-slate-500">↓</p>}
                    </div>
                  ))}
                </div>
              </div>

              <p className="mt-4 mb-3 text-sm text-slate-600">
                Agar tidak terlalu panjang, silakan buka penjelasan per topik dengan tombol "Cek Detail".
              </p>
              <div className="divide-y divide-slate-200 border border-slate-200 bg-white">
                {paymentItems.map((item) => {
                  const open = openPayKey === item.title;
                  return (
                    <div key={item.title} className="p-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        <button
                          type="button"
                          onClick={() => setOpenPayKey(open ? '' : item.title)}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          {open ? 'Tutup Detail' : 'Cek Detail'}
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
                      {open && (
                        <p className="mt-2 border-t border-slate-200 pt-2 text-sm leading-relaxed text-slate-700">
                          {item.detail}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 md:grid-cols-3 md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">FAQ Orang Tua</p>
              <h2 className="mt-3 text-2xl font-semibold">Pertanyaan yang Sering Diajukan</h2>
            </div>
            <div className="md:col-span-2 divide-y divide-slate-200 border-y border-slate-200 text-sm">
              {[
                {
                  q: 'Jika salah input NIK atau nama, apakah bisa diperbaiki?',
                  a: 'Bisa selama masa verifikasi masih dibuka. Catat nomor registrasi, hubungi helpdesk resmi, lalu bawa dokumen pembanding asli.',
                },
                {
                  q: 'Apakah harus datang ke sekolah setelah daftar online?',
                  a: 'Ya, untuk fase verifikasi dokumen asli dan proses daftar ulang sesuai jadwal resmi sekolah.',
                },
                {
                  q: 'Kalau dokumen belum lengkap saat upload bagaimana?',
                  a: 'Tetap unggah dokumen yang tersedia, lalu lengkapi sebelum batas verifikasi. Dokumen tidak lengkap berisiko membuat status ditunda atau tidak valid.',
                },
                {
                  q: 'Bagaimana tahu pembayaran sudah diterima sekolah?',
                  a: 'Simpan bukti pembayaran dan cek status validasi pada kanal resmi sekolah. Jika perlu, konfirmasi ke bendahara dengan nomor registrasi.',
                },
              ].map((item) => (
                <div key={item.q} className="py-4">
                  <p className="font-semibold text-slate-900">{item.q}</p>
                  <p className="mt-1 text-slate-700">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 md:grid-cols-3 md:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Checklist</p>
              <h2 className="mt-3 text-2xl font-semibold">Siap Berangkat Verifikasi</h2>
              <button
                type="button"
                onClick={handlePrintParentGuide}
                className="mt-4 rounded-full border border-slate-900 px-4 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
              >
                Print Checklist + Panduan
              </button>
            </div>
            <div className="md:col-span-2">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  'Nomor registrasi sudah dicatat dan bukti pendaftaran sudah dicetak',
                  'KK asli + fotokopi sudah disiapkan',
                  'Akta lahir asli + fotokopi sudah disiapkan',
                  'SKL/Ijazah (jika wajib jenjang) sudah dibawa',
                  'Dokumen jalur khusus (prestasi/afirmasi/pindahan) sudah lengkap',
                  'Bukti pembayaran (jika ada) tersimpan dengan baik',
                  'Datang sesuai jadwal verifikasi sekolah tujuan',
                  'Kontak helpdesk sekolah sudah disimpan untuk antisipasi kendala',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 border border-slate-200 bg-white p-3 text-sm text-slate-700">
                    <span className="font-semibold text-slate-500">[ ]</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-200">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:justify-between md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">PPDB Nasional</p>
            <p className="mt-2 text-sm text-slate-300">Sistem Penerimaan Peserta Didik Baru Terpadu</p>
          </div>
          <div className="text-sm text-slate-300">
            <p>(021) 1234-5678</p>
            <p>ppdb@domain.go.id</p>
            <p>Jl. Pendidikan Nasional No. 1</p>
          </div>
          <div className="text-sm text-slate-300">
            <p>Senin - Jumat 08.00 - 16.00</p>
            <p>Sabtu 08.00 - 12.00</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { CheckCircle2, FileText, GraduationCap, MapPin, User, Users, X } from 'lucide-react';
import QRCode from 'qrcode';
import { ppdbService } from '../../services/ppdbService';

type PPDBFormProps = {
  onBack: () => void;
  isModal?: boolean;
  onClose?: () => void;
};

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-600';
const labelClass = 'mb-1 block text-xs font-semibold tracking-wide text-slate-700 uppercase';

export default function PPDBForm({ onBack, isModal = false, onClose }: PPDBFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitInfo, setSubmitInfo] = useState<{
    registrationNo: string;
    namaLengkap: string;
    jenjangTujuan: string;
    sekolahTujuan: string;
    jalurPendaftaran: string;
    submittedAt: string;
    qrDataUrl: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    jenjangTujuan: '',
    sekolahTujuan: '',
    jalurPendaftaran: 'REGULER',
    majorId: '',
    nisn: '',
    nik: '',
    namaLengkap: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    agama: '',
    kewenangnegaraan: 'WNI',
    anakKe: '',
    jumlahSaudara: '',
    golonganDarah: '',
    alamatLengkap: '',
    rt: '',
    rw: '',
    dusun: '',
    desaKelurahan: '',
    kecamatan: '',
    kabupatenKota: '',
    provinsi: '',
    kodePos: '',
    namaAyah: '',
    nikAyah: '',
    pendidikanAyah: '',
    pekerjaanAyah: '',
    penghasilanAyah: '',
    namaIbu: '',
    nikIbu: '',
    pendidikanIbu: '',
    pekerjaanIbu: '',
    penghasilanIbu: '',
    namaWali: '',
    hubunganWali: '',
    pendidikanWali: '',
    pekerjaanWali: '',
    penghasilanWali: '',
    nomorHpWali: '',
    nomorHp: '',
    whatsApp: '',
    email: '',
    sekolahAsal: '',
    npsnSekolahAsal: '',
    alasanPindah: '',
  });

  const [files, setFiles] = useState<Record<string, File | null>>({
    pasFoto: null,
    kartuKeluarga: null,
    aktaKelahiran: null,
    sklIjazah: null,
    piagamPrestasi: null,
    suratPindah: null,
    kipPkh: null,
  });

  const stepItems = useMemo(
    () => [
      { step: 1, label: 'Pilihan Sekolah', icon: GraduationCap },
      { step: 2, label: 'Data Siswa', icon: User },
      { step: 3, label: 'Alamat & Kontak', icon: MapPin },
      { step: 4, label: 'Orang Tua / Wali', icon: Users },
      { step: 5, label: 'Berkas', icon: FileText },
    ],
    [],
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (zone: string, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 3 * 1024 * 1024) {
        alert('Batas maksimal ukuran file adalah 3MB.');
        return;
      }
      setFiles((prev) => ({ ...prev, [zone]: file }));
    }
  };

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Gagal membaca file'));
      reader.readAsDataURL(file);
    });

  const handleSubmitPPDB = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    let pasFotoDataUrl: string | undefined;
    if (files.pasFoto) {
      try {
        pasFotoDataUrl = await fileToDataUrl(files.pasFoto);
      } catch {
        pasFotoDataUrl = undefined;
      }
    }

    const application = await ppdbService.submitApplication({
      jenjangTujuan: formData.jenjangTujuan,
      sekolahTujuan: formData.sekolahTujuan,
      jalurPendaftaran: formData.jalurPendaftaran,
      majorId: formData.majorId,
      namaLengkap: formData.namaLengkap,
      nisn: formData.nisn,
      nik: formData.nik,
      tempatLahir: formData.tempatLahir,
      tanggalLahir: formData.tanggalLahir,
      jenisKelamin: formData.jenisKelamin,
      agama: formData.agama,
      kewenangnegaraan: formData.kewenangnegaraan,
      anakKe: formData.anakKe,
      jumlahSaudara: formData.jumlahSaudara,
      golonganDarah: formData.golonganDarah,
      alamatLengkap: formData.alamatLengkap,
      rt: formData.rt,
      rw: formData.rw,
      dusun: formData.dusun,
      desaKelurahan: formData.desaKelurahan,
      kecamatan: formData.kecamatan,
      kabupatenKota: formData.kabupatenKota,
      provinsi: formData.provinsi,
      kodePos: formData.kodePos,
      nomorHp: formData.nomorHp,
      email: formData.email,
      sekolahAsal: formData.sekolahAsal,
      npsnSekolahAsal: formData.npsnSekolahAsal,
      alasanPindah: formData.alasanPindah,
      namaAyah: formData.namaAyah,
      namaIbu: formData.namaIbu,
      namaWali: formData.namaWali,
      hubunganWali: formData.hubunganWali,
      nomorHpWali: formData.nomorHpWali,
      pasFotoDataUrl,
      dokumen: Object.entries(files)
        .filter(([, value]) => Boolean(value))
        .map(([key, value]) => `${key}:${value?.name ?? ''}`),
    });

    let qrDataUrl = '';
    try {
      qrDataUrl = await QRCode.toDataURL(
        JSON.stringify({
          registrationNo: application.registrationNo,
          namaLengkap: application.namaLengkap,
          jenjang: application.jenjangTujuan,
          sekolah: application.sekolahTujuan,
        }),
        { margin: 1, width: 180 },
      );
    } catch {
      qrDataUrl = '';
    }

    setSubmitInfo({
      registrationNo: application.registrationNo,
      namaLengkap: application.namaLengkap,
      jenjangTujuan: application.jenjangTujuan,
      sekolahTujuan: application.sekolahTujuan,
      jalurPendaftaran: application.jalurPendaftaran,
      submittedAt: application.submittedAt,
      qrDataUrl,
    });

    setIsSubmitting(false);
  };

  const handlePrintReceipt = () => {
    if (!submitInfo) return;
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;

    const formattedDate = new Date(submitInfo.submittedAt).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    win.document.write(`
      <html>
        <head>
          <title>Bukti Pendaftaran PPDB - ${submitInfo.registrationNo}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #0f172a; margin: 0; padding: 32px; }
            .paper { max-width: 800px; margin: 0 auto; }
            .head { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
            .head h1 { margin: 0; font-size: 20px; }
            .head p { margin: 4px 0 0; font-size: 12px; color: #475569; }
            .title { font-size: 18px; font-weight: bold; margin-bottom: 16px; }
            .row { display: flex; border-bottom: 1px solid #cbd5e1; padding: 10px 0; font-size: 14px; }
            .label { width: 220px; color: #334155; }
            .value { flex: 1; font-weight: 600; }
            .note { margin-top: 18px; font-size: 12px; color: #475569; line-height: 1.5; }
            .qr-wrap { margin-top: 20px; display: flex; gap: 20px; align-items: center; }
            .qr-wrap img { width: 120px; height: 120px; border: 1px solid #cbd5e1; }
            .signature { margin-top: 52px; display: flex; justify-content: space-between; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="paper">
            <div class="head">
              <h1>PPDB NASIONAL - BUKTI PENDAFTARAN RESMI</h1>
              <p>Kementerian Pendidikan | Sistem Penerimaan Peserta Didik Baru</p>
            </div>
            <div class="title">Nomor Registrasi: ${submitInfo.registrationNo}</div>
            <div class="row"><div class="label">Nama Calon Siswa</div><div class="value">${submitInfo.namaLengkap}</div></div>
            <div class="row"><div class="label">Jenjang Tujuan</div><div class="value">${submitInfo.jenjangTujuan}</div></div>
            <div class="row"><div class="label">Sekolah Tujuan</div><div class="value">${submitInfo.sekolahTujuan}</div></div>
            <div class="row"><div class="label">Jalur Pendaftaran</div><div class="value">${submitInfo.jalurPendaftaran}</div></div>
            <div class="row"><div class="label">Waktu Pengiriman</div><div class="value">${formattedDate}</div></div>
            <div class="note">
               Dokumen ini merupakan bukti pendaftaran awal. Simpan dokumen ini dan nomor registrasi untuk proses verifikasi
               administrasi di sekolah tujuan.
            </div>
            ${submitInfo.qrDataUrl
        ? `<div class="qr-wrap"><img src="${submitInfo.qrDataUrl}" alt="QR Registrasi" /><div><strong>QR Verifikasi</strong><p style="font-size:12px;color:#475569;margin-top:6px;">Dipindai oleh petugas untuk membuka data registrasi.</p></div></div>`
        : ''
      }
            <div class="signature">
              <div>Orang Tua/Wali</div>
              <div>Petugas PPDB</div>
            </div>
          </div>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const handleClose = () => (isModal && onClose ? onClose() : onBack());

  if (submitInfo) {
    return (
      <div className={`${isModal ? 'fixed inset-0 z-[100] overflow-y-auto bg-slate-50 text-slate-900' : 'bg-slate-50 text-slate-900'}`}>
        <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8">
          <div className="border border-slate-200 bg-white p-8 animate-in fade-in zoom-in-95 duration-200">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pendaftaran Berhasil</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Data Berhasil Dikirim</h2>
            <p className="mt-3 text-sm text-slate-600">
              Simpan nomor registrasi berikut untuk cek status dan verifikasi administrasi.
            </p>

            <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
              <div className="flex items-center justify-between py-3">
                <p className="text-sm text-slate-600">Nomor Registrasi</p>
                <p className="text-lg font-semibold text-slate-900">{submitInfo.registrationNo}</p>
              </div>
              <div className="flex items-center justify-between py-3">
                <p className="text-sm text-slate-600">Nama Siswa</p>
                <p className="text-sm font-semibold text-slate-900">{submitInfo.namaLengkap}</p>
              </div>
              <div className="flex items-center justify-between py-3">
                <p className="text-sm text-slate-600">Jenjang</p>
                <p className="text-sm font-semibold text-slate-900">{submitInfo.jenjangTujuan}</p>
              </div>
            </div>

            {submitInfo.qrDataUrl && (
              <div className="mt-5 flex items-center gap-4 border border-slate-200 p-3">
                <img src={submitInfo.qrDataUrl} alt="QR Bukti Registrasi" className="h-24 w-24 border border-slate-200" />
                <p className="text-sm text-slate-600">QR ini digunakan petugas untuk validasi cepat nomor registrasi di loket.</p>
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="rounded-full border border-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white cursor-pointer"
              >
                Cetak Bukti Pendaftaran (A4)
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 cursor-pointer"
              >
                Kembali ke Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formContent = (
    <div className="mx-auto w-full max-w-6xl bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-200">
      <header className="mb-8 border-b border-slate-200 pb-5">
        <div className="mb-3 border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 rounded">
          Kementerian Pendidikan Republik Indonesia - Sistem Penerimaan Peserta Didik Baru Terpadu
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Portal Resmi PPDB</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Formulir Pendaftaran Siswa Baru</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Lengkapi data sesuai dokumen resmi. Seluruh data akan diverifikasi oleh tim administrasi sekolah.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
          >
            <X className="h-4 w-4" /> Tutup
          </button>
        </div>
      </header>

      <section className="mb-8 grid gap-3 md:grid-cols-5">
        {stepItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentStep === item.step;
          const isDone = currentStep > item.step;
          return (
            <div
              key={item.step}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition ${isActive
                  ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                  : isDone
                    ? 'border-slate-300 bg-slate-50 text-slate-800'
                    : 'border-slate-200 bg-white text-slate-400'
                }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${isActive ? 'bg-white text-slate-900' : isDone ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-450'
                  }`}
              >
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : item.step}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold uppercase tracking-wider">{item.label}</p>
                <Icon className="mt-0.5 h-4 w-4" />
              </div>
            </div>
          );
        })}
      </section>

      <form onSubmit={handleSubmitPPDB} className="space-y-8">
        {currentStep === 1 && (
          <section className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">I. Pilihan Instansi Pendidikan</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className={labelClass}>Jenjang Pendidikan Tujuan</label>
                <select name="jenjangTujuan" value={formData.jenjangTujuan} onChange={handleInputChange} className={inputClass} required>
                  <option value="">Pilih jenjang...</option>
                  <option value="SD">SD (Sekolah Dasar)</option>
                  <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                  <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                  <option value="SMK">SMK (Sekolah Menengah Kejuruan)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Sekolah Tujuan</label>
                <select name="sekolahTujuan" value={formData.sekolahTujuan} onChange={handleInputChange} className={inputClass} required>
                  <option value="">Pilih satuan pendidikan...</option>
                  <option value="SK01">Sekolah Percontohan Negeri 01</option>
                  <option value="SK02">Sekolah Swasta Pusat Keunggulan 02</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Jalur Pendaftaran</label>
                <select name="jalurPendaftaran" value={formData.jalurPendaftaran} onChange={handleInputChange} className={inputClass} required>
                  <option value="REGULER">Reguler / Umum</option>
                  <option value="ZONASI">Zonasi</option>
                  <option value="PRESTASI">Prestasi</option>
                  <option value="AFIRMASI">Afirmasi (KIP/PKH)</option>
                  <option value="PINDAHAN">Perpindahan Tugas Orang Tua</option>
                </select>
              </div>
            </div>

            {formData.jenjangTujuan === 'SMK' && (
              <div className="max-w-md animate-in fade-in duration-200">
                <label className={labelClass}>Kompetensi Keahlian</label>
                <select name="majorId" value={formData.majorId} onChange={handleInputChange} className={inputClass} required>
                  <option value="">Pilih jurusan...</option>
                  <option value="RPL">Rekayasa Perangkat Lunak (RPL)</option>
                  <option value="TKJ">Teknik Komputer dan Jaringan (TKJ)</option>
                  <option value="TE">Teknik Elektro (TE)</option>
                  <option value="AK">Akuntansi & Keuangan Lembaga (AK)</option>
                </select>
              </div>
            )}
          </section>
        )}

        {currentStep === 2 && (
          <section className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">II. Identitas Calon Siswa</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className={labelClass}>NIK</label>
                <input name="nik" value={formData.nik} onChange={handleInputChange} maxLength={16} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>NISN {formData.jenjangTujuan !== 'SD' ? '(Wajib)' : '(Opsional)'}</label>
                <input
                  name="nisn"
                  value={formData.nisn}
                  onChange={handleInputChange}
                  maxLength={10}
                  className={inputClass}
                  required={formData.jenjangTujuan !== 'SD'}
                />
              </div>
              <div>
                <label className={labelClass}>Nama Lengkap</label>
                <input name="namaLengkap" value={formData.namaLengkap} onChange={handleInputChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Tempat Lahir</label>
                <input name="tempatLahir" value={formData.tempatLahir} onChange={handleInputChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Tanggal Lahir</label>
                <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleInputChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Jenis Kelamin</label>
                <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleInputChange} className={inputClass} required>
                  <option value="">Pilih...</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {currentStep === 3 && (
          <section className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">III. Alamat dan Kontak</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-3">
                <label className={labelClass}>Alamat Lengkap</label>
                <textarea
                  name="alamatLengkap"
                  value={formData.alamatLengkap}
                  onChange={handleInputChange}
                  className={`${inputClass} min-h-20`}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Kelurahan/Desa</label>
                <input name="desaKelurahan" value={formData.desaKelurahan} onChange={handleInputChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Kecamatan</label>
                <input name="kecamatan" value={formData.kecamatan} onChange={handleInputChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Kabupaten/Kota</label>
                <input name="kabupatenKota" value={formData.kabupatenKota} onChange={handleInputChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Nomor HP</label>
                <input name="nomorHp" value={formData.nomorHp} onChange={handleInputChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>{formData.jenjangTujuan === 'SD' ? 'Asal TK/PAUD' : 'Sekolah Asal'}</label>
                <input name="sekolahAsal" value={formData.sekolahAsal} onChange={handleInputChange} className={inputClass} required />
              </div>
            </div>
          </section>
        )}

        {currentStep === 4 && (
          <section className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">IV. Data Orang Tua / Wali</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/50">
                <p className="mb-4 text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>Data Ayah
                </p>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Nama Ayah</label>
                    <input name="namaAyah" value={formData.namaAyah} onChange={handleInputChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Pekerjaan Ayah</label>
                    <input name="pekerjaanAyah" value={formData.pekerjaanAyah} onChange={handleInputChange} className={inputClass} required />
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/50">
                <p className="mb-4 text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>Data Ibu
                </p>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Nama Ibu</label>
                    <input name="namaIbu" value={formData.namaIbu} onChange={handleInputChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Pekerjaan Ibu</label>
                    <input name="pekerjaanIbu" value={formData.pekerjaanIbu} onChange={handleInputChange} className={inputClass} required />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {currentStep === 5 && (
          <section className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">V. Dokumen Pendukung</h3>
            <p className="text-sm text-slate-600">
              Unggah dokumen PDF/JPG/PNG. Ukuran maksimal tiap berkas 3MB.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="rounded-xl border border-slate-350 p-4 text-sm font-medium text-slate-700 bg-slate-55 flex flex-col justify-between hover:bg-slate-50 select-none cursor-pointer transition">
                <span>Pas Foto 3x4 (Wajib)</span>
                <input type="file" accept="image/*" onChange={(e) => handleFileChange('pasFoto', e)} className="mt-3 block w-full text-xs" required />
              </label>
              <label className="rounded-xl border border-slate-350 p-4 text-sm font-medium text-slate-700 bg-slate-55 flex flex-col justify-between hover:bg-slate-50 select-none cursor-pointer transition">
                <span>Kartu Keluarga (Wajib)</span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => handleFileChange('kartuKeluarga', e)}
                  className="mt-3 block w-full text-xs"
                  required
                />
              </label>
              {formData.jenjangTujuan !== 'SD' && formData.jenjangTujuan !== '' && (
                <label className="rounded-xl border border-slate-350 p-4 text-sm font-medium text-slate-700 bg-slate-55 flex flex-col justify-between hover:bg-slate-50 select-none cursor-pointer transition">
                  <span>SKL / Ijazah (Wajib)</span>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange('sklIjazah', e)}
                    className="mt-3 block w-full text-xs"
                    required
                  />
                </label>
              )}
            </div>
          </section>
        )}

        <footer className="flex items-center justify-between border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            Kembali
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="rounded-full bg-slate-900 border border-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 cursor-pointer"
            >
              Lanjutkan
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 border border-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isSubmitting ? 'Mengirim...' : 'Kirim Data Pendaftaran'}
            </button>
          )}
        </footer>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-50 text-slate-900">
        <div className="px-4 py-8 md:px-8 bg-slate-50 min-h-screen flex items-center justify-center">{formContent}</div>
      </div>
    );
  }

  return <div className="px-4 py-8 md:px-8 bg-slate-50 min-h-screen flex items-center justify-center">{formContent}</div>;
}

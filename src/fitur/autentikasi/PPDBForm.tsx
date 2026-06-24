// PPDBForm.tsx
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { User, FileText, X, MapPin, Users, GraduationCap, CheckCircle } from 'lucide-react';
import { submitPPDBApplication } from '../../data/store';

type PPDBFormProps = {
  onBack: () => void;
};

export default function PPDBForm({ onBack }: PPDBFormProps) {
  // 1. STATE MANAGEMENT CONTROL WIZARD
  const [currentStep, setCurrentStep] = useState<number>(1);

  // 2. STATE FORMULIR UTAMA (COMPLIANT SCHEMA)
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

  // 3. STATE UPLOAD BERKAS DOKUMEN
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    pasFoto: null,
    kartuKeluarga: null,
    aktaKahiran: null,
    sklIjazah: null,
    piagamPrestasi: null,
    suratPindah: null,
    kipPkh: null,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (zone: string, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
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
    let pasFotoDataUrl: string | undefined;
    if (files.pasFoto) {
      try {
        pasFotoDataUrl = await fileToDataUrl(files.pasFoto);
      } catch {
        pasFotoDataUrl = undefined;
      }
    }

    const application = submitPPDBApplication({
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

    alert(
      `Pendaftaran Berhasil Terkirim!\nNomor Registrasi: ${application.registrationNo}\nSilakan cek status di admin/tata usaha.`,
    );
    onBack();
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    /* KONTROL STRUKTUR GITHUB STYLE LAYOUT:
      Menghilangkan pembatasan max-width (max-w-none) dan menyamakan padding horizontal (px-4 sm:px-6) 
      agar pas mentok dan presisi mengikuti layout TutorialModal.
    */
    <div className="w-full">
      
      {/* Header Form */}
      <div className="mb-6 flex items-start justify-between border-b border-slate-300 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">FORMULIR PENDAFTARAN PPDB UNIVERSAL</h2>
          <p className="mt-1 text-xs text-slate-500">
            Sistem Pengisian Riwayat Administratif Siswa Multi-Jenjang Terintegrasi.
          </p>
        </div>
        
        {/* Tombol Tutup disamakan style-nya dengan yang ada pada TutorialModal */}
        <button
          type="button"
          onClick={onBack}
          className="p-2.5 rounded-xl border-2 border-gray-300 text-gray-500 bg-white font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-gray-50 snap-none"
        >
          <X className="h-3.5 w-3.5" /> Tutup
        </button>
      </div>

      {/* Wizard Steps Indicator */}
      <div className="mb-6 grid grid-cols-5 divide-x divide-slate-200 rounded border border-slate-200 bg-slate-50 text-center">
        {[
          { step: 1, label: 'Jalur & Instansi' },
          { step: 2, label: 'Biodata Siswa' },
          { step: 3, label: 'Alamat & Kontak' },
          { step: 4, label: 'Orang Tua / Wali' },
          { step: 5, label: 'Dokumen Lampiran' },
        ].map((item) => (
          <div
            key={item.step}
            className={`py-2.5 text-xs font-bold ${currentStep === item.step ? 'bg-cyan-700 text-white' : 'text-slate-600'}`}
          >
            {item.step}. {item.label}
          </div>
        ))}
      </div>

      {/* Isi Formulir Wizard */}
      <form onSubmit={handleSubmitPPDB} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-1.5 text-sm font-bold tracking-wider text-slate-900 uppercase">
              <GraduationCap className="h-4 w-4 text-cyan-700" /> I. Pilihan Instansi Academic
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Jenjang Pendidikan Tujuan</label>
                <select
                  name="jenjangTujuan"
                  value={formData.jenjangTujuan}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required
                >
                  <option value="">Pilih Jenjang...</option>
                  <option value="SD">SD (Sekolah Dasar)</option>
                  <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                  <option value="SMA">SMA (Sekolah Menengah Atas)</option>
                  <option value="SMK">SMK (Sekolah Menengah Kejuruan)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Sekolah Tujuan</label>
                <select
                  name="sekolahTujuan"
                  value={formData.sekolahTujuan}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required
                >
                  <option value="">Pilih Satuan Pendidikan...</option>
                  <option value="SK01">Sekolah Percontohan Negeri 01</option>
                  <option value="SK02">Sekolah Swasta Pusat Keunggulan 02</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Jalur Pendaftaran</label>
                <select
                  name="jalurPendaftaran"
                  value={formData.jalurPendaftaran}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required
                >
                  <option value="REGULER">REGULER / UMUM</option>
                  <option value="ZONASI">ZONASI</option>
                  <option value="PRESTASI">PRESTASI KEBUTUHAN KHUSUS</option>
                  <option value="AFIRMASI">AFIRMASI (KIP/PKH)</option>
                  <option value="PINDAHAN">PERPINDAHAN TUGAS ORANG TUA</option>
                </select>
              </div>
            </div>

            {formData.jenjangTujuan === 'SMK' ? (
              <div className="space-y-2 rounded border border-slate-300 bg-slate-50 p-4">
                <label className="block text-xs font-bold text-cyan-900">Pilihan Jurusan / Kompetensi Keahlian (Khusus SMK)</label>
                <select
                  name="majorId"
                  value={formData.majorId}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-cyan-700 md:w-1/3"
                  required
                >
                  <option value="">Pilih Kompetensi Keahlian...</option>
                  <option value="RPL">Rekayasa Perangkat Lunak (RPL)</option>
                  <option value="TKJ">Teknik Komputer dan Jaringan (TKJ)</option>
                  <option value="TE">Teknik Elektro (TE)</option>
                  <option value="AK">Akuntansi & Keuangan Lembaga (AK)</option>
                </select>
              </div>
            ) : null}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-1.5 text-sm font-bold tracking-wider text-slate-900 uppercase">
              <User className="h-4 w-4 text-cyan-700" /> II. Identitas Pribadi Calon Siswa
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nomor Induk Kependudukan (NIK)</label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  placeholder="16 Digit Angka Kartu Keluarga"
                  maxLength={16}
                  className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Nomor Induk Siswa Nasional (NISN) {formData.jenjangTujuan !== 'SD' ? '*' : ''}
                </label>
                <input
                  type="text"
                  name="nisn"
                  value={formData.nisn}
                  onChange={handleInputChange}
                  placeholder="10 Digit Angka Resmi Kemendikbud"
                  maxLength={10}
                  className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required={formData.jenjangTujuan !== 'SD'}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  name="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={handleInputChange}
                  placeholder="Sesuai Akta Kelahiran resmi"
                  className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tempat Lahir</label>
                <input
                  type="text"
                  name="tempatLahir"
                  value={formData.tempatLahir}
                  onChange={handleInputChange}
                  placeholder="Kota/Kabupaten"
                  className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Tanggal Lahir</label>
                <input
                  type="date"
                  name="tanggalLahir"
                  value={formData.tanggalLahir}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Jenis Kelamin</label>
                <select
                  name="jenisKelamin"
                  value={formData.jenisKelamin}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required
                >
                  <option value="">Pilih...</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-1.5 text-sm font-bold tracking-wider text-slate-900 uppercase">
              <MapPin className="h-4 w-4 text-cyan-700" /> III. Alamat Tinggal & Riwayat Kontak
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-1 md:col-span-3">
                <label className="text-xs font-bold text-slate-700">Alamat Rumah Lengkap (Nama Jalan, Blok, No. Rumah)</label>
                <input
                  type="text"
                  name="alamatLengkap"
                  value={formData.alamatLengkap}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kelurahan/Desa</label>
                <input
                  type="text"
                  name="desaKelurahan"
                  value={formData.desaKelurahan}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kecamatan</label>
                <input
                  type="text"
                  name="kecamatan"
                  value={formData.kecamatan}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kabupaten / Kota</label>
                <input
                  type="text"
                  name="kabupatenKota"
                  value={formData.kabupatenKota}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nomor HP Aktif</label>
                <input
                  type="tel"
                  name="nomorHp"
                  value={formData.nomorHp}
                  onChange={handleInputChange}
                  placeholder="Contoh: 081234567xxx"
                  className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Alamat Email Aktif</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="nama@domain.com"
                  className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {formData.jenjangTujuan === 'SD' ? 'Nama Asal TK / PAUD' : 'Nama Sekolah Asal'}
                </label>
                <input
                  type="text"
                  name="sekolahAsal"
                  value={formData.sekolahAsal}
                  onChange={handleInputChange}
                  className="w-full rounded border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-cyan-700"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 border-b pb-1.5 text-sm font-bold tracking-wider text-slate-900 uppercase">
                <Users className="h-4 w-4 text-cyan-700" /> IV. Data Orang Tua Kandung (Ayah & Ibu)
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3 rounded border border-slate-200 bg-slate-50 p-3">
                  <span className="block border-b pb-1 text-xs font-bold text-slate-900 uppercase">Data Ayah Kandung</span>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Nama Lengkap Ayah</label>
                    <input
                      type="text"
                      name="namaAyah"
                      value={formData.namaAyah}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 bg-white px-3 py-1 text-sm outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Pekerjaan Ayah</label>
                    <input
                      type="text"
                      name="pekerjaanAyah"
                      value={formData.pekerjaanAyah}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 bg-white px-3 py-1 text-sm outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3 rounded border border-slate-200 bg-slate-50 p-3">
                  <span className="block border-b pb-1 text-xs font-bold text-slate-900 uppercase">Data Ibu Kandung</span>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Nama Lengkap Ibu</label>
                    <input
                      type="text"
                      name="namaIbu"
                      value={formData.namaIbu}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 bg-white px-3 py-1 text-sm outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Pekerjaan Ibu</label>
                    <input
                      type="text"
                      name="pekerjaanIbu"
                      value={formData.pekerjaanIbu}
                      onChange={handleInputChange}
                      className="w-full rounded border border-slate-300 bg-white px-3 py-1 text-sm outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-1.5 text-sm font-bold tracking-wider text-slate-900 uppercase">
              <FileText className="h-4 w-4 text-cyan-700" /> V. Lampiran Berkas Dokumen Administrasi
            </h3>
            <p className="rounded border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
              Sistem mendeteksi tujuan registrasi tingkat <b>{formData.jenjangTujuan || 'Belum Dipilih'}</b>. Unggah
              dokumen berformat PDF/JPG dengan batas ukuran file maksimal berkisar 3MB per berkas.
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex h-32 flex-col justify-between rounded border border-slate-300 bg-slate-50 p-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">1. Pasfoto Calon Siswa (3x4)</h4>
                  <p className="text-[10px] text-slate-500">Format gambar JPG/PNG rapi.</p>
                </div>
                <label className="block w-full cursor-pointer rounded border border-slate-300 bg-white py-1.5 text-center text-xs font-bold shadow-sm hover:bg-slate-100">
                  {files.pasFoto ? 'Berkas Terpilih' : 'Pilih Berkas'}
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange('pasFoto', e)} className="hidden" required />
                </label>
              </div>

              <div className="flex h-32 flex-col justify-between rounded border border-slate-300 bg-slate-50 p-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">2. Kartu Keluarga (KK)</h4>
                  <p className="text-[10px] text-slate-500">Scan dokumen asli jelas.</p>
                </div>
                <label className="block w-full cursor-pointer rounded border border-slate-300 bg-white py-1.5 text-center text-xs font-bold shadow-sm hover:bg-slate-100">
                  {files.kartuKeluarga ? 'Berkas Terpilih' : 'Pilih Berkas'}
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange('kartuKeluarga', e)}
                    className="hidden"
                    required
                  />
                </label>
              </div>

              {formData.jenjangTujuan !== 'SD' && formData.jenjangTujuan !== '' ? (
                <div className="flex h-32 flex-col justify-between rounded border border-cyan-300 bg-cyan-50/40 p-3">
                  <div>
                    <h4 className="text-xs font-bold text-cyan-950">3. SKL / Ijazah Kelulusan</h4>
                    <p className="text-[10px] text-cyan-800">Wajib untuk jenjang {formData.jenjangTujuan}.</p>
                  </div>
                  <label className="block w-full cursor-pointer rounded border border-cyan-300 bg-white py-1.5 text-center text-xs font-bold text-cyan-900 shadow-sm hover:bg-cyan-100">
                    {files.sklIjazah ? 'Berkas Terpilih' : 'Pilih Berkas'}
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => handleFileChange('sklIjazah', e)}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Footer Navigasi Langkah Kontrol */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="rounded border border-slate-300 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
          >
            Kembali
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="rounded bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
            >
              Lanjutkan Langkah
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center gap-1 rounded bg-emerald-700 px-5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 cursor-pointer"
            >
              <CheckCircle className="h-3.5 w-3.5" /> Kirim Data Pendaftaran Final
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
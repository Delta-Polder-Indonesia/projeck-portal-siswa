import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import {
  getCadanganDataAplikasi,
  getRingkasanPenyimpananBrowser,
  hapusSemuaFotoPengumumanAdmin,
  kompresUlangSemuaFotoTersimpan,
  pulihkanDataAplikasiDariCadangan,
} from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import AdminGuruPanel from './AdminGuruPanel';
import AdminSiswaPanel from './AdminSiswaPanel';

interface PanelAdminModalProps {
  open: boolean;
  onClose: () => void;
  scope: 'teacher' | 'student';
  preAuthorized?: boolean;
}

const ADMIN_CREDENTIAL = {
  teacher: { username: 'adm_guru', password: 'admin123' },
  student: { username: 'adm_siswa', password: 'admin123' },
} as const;

export default function PanelAdminModal({
  open,
  onClose,
  scope,
  preAuthorized = false,
}: PanelAdminModalProps) {
  const storeVersion = useStoreVersion();
  const [authorized, setAuthorized] = useState(preAuthorized);
  const [adminUser, setAdminUser] = useState<string>(
    scope === 'teacher' ? ADMIN_CREDENTIAL.teacher.username : ADMIN_CREDENTIAL.student.username
  );
  const [adminPass, setAdminPass] = useState('');
  const [authError, setAuthError] = useState('');
  const [notice, setNotice] = useState('');

  const [sedangKompresFoto, setSedangKompresFoto] = useState(false);
  const [sedangPulihkanCadangan, setSedangPulihkanCadangan] = useState(false);
  const inputCadanganRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setAuthorized(false);
      setAdminPass('');
      setAuthError('');
      setNotice('');
      return;
    }
    setAuthorized(preAuthorized);
    setAdminUser(
      scope === 'teacher' ? ADMIN_CREDENTIAL.teacher.username : ADMIN_CREDENTIAL.student.username
    );
  }, [open, preAuthorized, scope]);

  const handleAdminLogin = () => {
    const expected = scope === 'teacher' ? ADMIN_CREDENTIAL.teacher : ADMIN_CREDENTIAL.student;
    if (adminUser.trim() === expected.username && adminPass === expected.password) {
      setAuthorized(true);
      setAuthError('');
      return;
    }
    setAuthError('Akun admin tidak valid.');
  };

  const handleUnduhCadanganData = () => {
    try {
      const payload = getCadanganDataAplikasi();
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `cadangan-data-absensi-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      setNotice('Cadangan data berhasil diunduh.');
    } catch {
      setNotice('Gagal mengunduh cadangan data. Coba lagi.');
    }
  };

  const handleHapusMassalFotoPengumuman = () => {
    const confirmed = window.confirm(
      'Hapus semua foto pada pengumuman admin? Teks pengumuman tetap tersimpan.'
    );
    if (!confirmed) return;

    const removedCount = hapusSemuaFotoPengumumanAdmin();
    setNotice(`Pembersihan selesai. ${removedCount} foto pengumuman dihapus.`);
  };

  const handleBukaPemulihanCadangan = () => {
    inputCadanganRef.current?.click();
  };

  const handlePilihFileCadangan = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      'Pemulihan cadangan akan menimpa data saat ini. Pastikan Anda sudah mengunduh cadangan terbaru. Lanjutkan?'
    );

    if (!confirmed) {
      event.target.value = '';
      return;
    }

    setSedangPulihkanCadangan(true);
    try {
      const content = await file.text();
      const result = pulihkanDataAplikasiDariCadangan(content);
      setNotice(result.pesan);
    } catch {
      setNotice('Gagal membaca file cadangan. Pastikan file dapat diakses.');
    } finally {
      setSedangPulihkanCadangan(false);
      event.target.value = '';
    }
  };

  const handleKompresUlangFoto = async () => {
    if (sedangKompresFoto) return;
    const confirmed = window.confirm(
      'Kompres ulang semua foto tersimpan (avatar, lampiran gambar, foto pengumuman)?'
    );
    if (!confirmed) return;

    setSedangKompresFoto(true);
    try {
      const summary = await kompresUlangSemuaFotoTersimpan();
      setNotice(
        `Kompres selesai. Ditemukan ${summary.totalDitemukan} foto, berhasil ${summary.totalBerhasil}, gagal ${summary.totalGagal}.`
      );
    } catch {
      setNotice('Proses kompres gagal. Coba lagi beberapa saat.');
    } finally {
      setSedangKompresFoto(false);
    }
  };

  const ringkasanPenyimpanan = useMemo(
    () => getRingkasanPenyimpananBrowser(),
    [storeVersion, open]
  );

  const formatMb = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  const statusPenyimpanan =
    ringkasanPenyimpanan.usedPercent >= 90
      ? 'kritis'
      : ringkasanPenyimpanan.usedPercent >= 75
        ? 'peringatan'
        : 'aman';

  if (!open) return null;

  return (
    // Mengubah penataan luar agar benar-benar menempel ke tepi layar (menghapus sm:p-2)
    <div className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center">
      {/* PERUBAHAN UTAMA:
        - Menggunakan `h-screen w-screen` atau `h-dvh w-screen` agar mutlak memenuhi viewport.
        - Menghapus batas lebar desktop (`sm:max-w-7xl`), `sm:h-[98dvh]`, `sm:w-[98vw]`.
        - Menghapus `sm:rounded-xl` dan `sm:border` agar tidak ada lengkungan/border di pinggir.
      */}
      <div className="flex h-dvh w-screen flex-col overflow-hidden bg-white shadow-2xl">

        {/* COMPACT HEADER */}
        {!authorized ? (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
              {scope === 'teacher' ? 'Admin Guru' : 'Admin Siswa'}
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-md text-gray-500 hover:bg-gray-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50 shrink-0 gap-2 sm:gap-0">
            <div className="flex items-center justify-between sm:justify-start gap-4">
              <h2 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">
                {scope === 'teacher' ? 'Admin Guru' : 'Admin Siswa'}
              </h2>

              {/* Memori Bar in Header */}
              <div className="flex items-center gap-2 border-l border-gray-300 pl-3">
                <span className="text-[10px] font-medium text-gray-500 hidden sm:inline">
                  Memori: {formatMb(ringkasanPenyimpanan.usedBytes)}
                </span>
                <div
                  className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden"
                  title={`${ringkasanPenyimpanan.usedPercent}% terpakai`}
                >
                  <div
                    className={`h-full ${statusPenyimpanan === 'kritis' ? 'bg-red-500' : statusPenyimpanan === 'peringatan' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${ringkasanPenyimpanan.usedPercent}%` }}
                  />
                </div>
              </div>

              {/* Close Button Mobile */}
              <button onClick={onClose} className="p-1 sm:hidden rounded text-red-500 hover:bg-red-50 flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons in Header */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
              <input ref={inputCadanganRef} type="file" accept=".json" onChange={handlePilihFileCadangan} className="hidden" />
              <button
                type="button"
                onClick={handleUnduhCadanganData}
                className="px-2 py-1 text-[10px] font-medium border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 whitespace-nowrap shadow-sm transition-colors"
              >
                Simpan Backup
              </button>
              <button
                type="button"
                onClick={handleBukaPemulihanCadangan}
                disabled={sedangPulihkanCadangan}
                className="px-2 py-1 text-[10px] font-medium border border-emerald-300 rounded bg-white text-emerald-700 hover:bg-emerald-50 whitespace-nowrap shadow-sm transition-colors"
              >
                {sedangPulihkanCadangan ? 'Memulihkan...' : 'Restore'}
              </button>
              {scope === 'teacher' && (
                <>
                  <button
                    type="button"
                    onClick={handleHapusMassalFotoPengumuman}
                    className="px-2 py-1 text-[10px] font-medium border border-amber-300 rounded bg-white text-amber-700 hover:bg-amber-50 whitespace-nowrap shadow-sm transition-colors"
                  >
                    Clear Foto
                  </button>
                  <button
                    type="button"
                    onClick={handleKompresUlangFoto}
                    disabled={sedangKompresFoto}
                    className="px-2 py-1 text-[10px] font-medium border border-blue-300 rounded bg-white text-blue-700 hover:bg-blue-50 whitespace-nowrap shadow-sm transition-colors"
                  >
                    {sedangKompresFoto ? 'Kompresi...' : 'Kompres'}
                  </button>
                </>
              )}

              {/* Close Button Desktop */}
              <button onClick={onClose} className="hidden sm:flex p-1 ml-1 rounded text-red-500 hover:bg-red-50 flex-shrink-0 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* CONTENT AREA */}
        {!authorized ? (
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex items-center justify-center">
            {/* Form Login diposisikan di tengah layar saat belum ter-autorisasi */}
            <div className="w-full max-w-sm border border-gray-200 bg-white shadow-sm rounded-xl p-5 space-y-4">
              <div className="flex flex-col items-center gap-1 text-center mb-6">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-800">Verifikasi Admin</h3>
                <p className="text-[11px] text-gray-500 leading-tight">
                  {scope === 'teacher' ? 'Login sebagai admin guru' : 'Login sebagai admin siswa'}
                </p>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Nama Pengguna"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Kata Sandi"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {authError && <p className="text-xs text-red-600 text-center">{authError}</p>}
              <button
                onClick={handleAdminLogin}
                className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors mt-2"
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {notice && (
              <div className="px-3 py-1.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-center shrink-0">
                <p className="text-[11px] text-emerald-700 font-medium">{notice}</p>
              </div>
            )}
            <div className="flex-1 overflow-hidden h-full">
              {scope === 'teacher' ? (
                <AdminGuruPanel setNotice={setNotice} scope={scope} />
              ) : (
                <AdminSiswaPanel setNotice={setNotice} scope={scope} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
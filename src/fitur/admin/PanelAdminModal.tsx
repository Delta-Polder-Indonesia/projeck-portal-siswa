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
    <div className="fixed inset-0 z-50 bg-black/55 sm:p-3">
      <div className="flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[96dvh] sm:rounded-2xl sm:border sm:border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {scope === 'teacher' ? 'Admin Guru' : 'Admin Siswa'}
            </h2>
            <p className="text-xs text-gray-500">
              {scope === 'teacher'
                ? 'Kelola akun guru, pembagian kelas ajar, dan data kelas.'
                : 'Kelola akun siswa, NIS, dan kata sandi.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:bg-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!authorized ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-md mx-auto border border-gray-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-blue-700">
                <ShieldCheck className="w-5 h-5" />
                <p className="font-medium">Verifikasi Admin</p>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nama Pengguna</label>
                <input
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Kata Sandi</label>
                <input
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {authError && <p className="text-sm text-red-600">{authError}</p>}
              <button
                onClick={handleAdminLogin}
                className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Masuk Sebagai Admin
              </button>
              <p className="text-xs text-gray-500">
                {scope === 'teacher'
                  ? 'Demo admin guru: adm_guru / admin123'
                  : 'Demo admin siswa: adm_siswa / admin123'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {notice && (
              <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                {notice}
              </p>
            )}

            <div
              className={`rounded-lg border px-3 py-2 ${statusPenyimpanan === 'kritis'
                  ? 'border-red-200 bg-red-50'
                  : statusPenyimpanan === 'peringatan'
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
            >
              <div className="flex items-center justify-between gap-3 text-xs">
                <p className="font-medium text-gray-700">Kapasitas Penyimpanan Browser</p>
                <p className="text-gray-600">
                  {formatMb(ringkasanPenyimpanan.usedBytes)} /{' '}
                  {formatMb(ringkasanPenyimpanan.limitBytes)}
                </p>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/80">
                <div
                  className={`h-full ${statusPenyimpanan === 'kritis'
                      ? 'bg-red-500'
                      : statusPenyimpanan === 'peringatan'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  style={{ width: `${ringkasanPenyimpanan.usedPercent}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-gray-600">
                Terpakai {ringkasanPenyimpanan.usedPercent}%. Jika melebihi 90%, upload foto bisa
                gagal atau membuat halaman kosong saat login.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  ref={inputCadanganRef}
                  type="file"
                  accept="application/json,.json"
                  onChange={handlePilihFileCadangan}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleUnduhCadanganData}
                  className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                >
                  Unduh Data Cadangan
                </button>
                <button
                  type="button"
                  onClick={handleBukaPemulihanCadangan}
                  disabled={sedangPulihkanCadangan}
                  className={`rounded-md border px-2.5 py-1.5 text-xs ${sedangPulihkanCadangan
                      ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                      : 'border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50'
                    }`}
                >
                  {sedangPulihkanCadangan ? 'Sedang Memulihkan...' : 'Pulihkan dari Cadangan'}
                </button>
                {scope === 'teacher' && (
                  <>
                    <button
                      type="button"
                      onClick={handleHapusMassalFotoPengumuman}
                      className="rounded-md border border-amber-300 bg-white px-2.5 py-1.5 text-xs text-amber-700 hover:bg-amber-50"
                    >
                      Hapus Foto Pengumuman Lama
                    </button>
                    <button
                      type="button"
                      onClick={handleKompresUlangFoto}
                      disabled={sedangKompresFoto}
                      className={`rounded-md border px-2.5 py-1.5 text-xs ${sedangKompresFoto
                          ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                          : 'border-blue-300 bg-white text-blue-700 hover:bg-blue-50'
                        }`}
                    >
                      {sedangKompresFoto ? 'Sedang Kompres...' : 'Kompres Ulang Semua Foto'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {scope === 'teacher' ? (
              <AdminGuruPanel setNotice={setNotice} scope={scope} />
            ) : (
              <AdminSiswaPanel setNotice={setNotice} scope={scope} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

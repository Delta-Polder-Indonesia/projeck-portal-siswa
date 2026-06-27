import { useState, useMemo, ChangeEvent } from 'react';
import { Save, Trash2, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import {
    addPengumumanAdmin,
    deletePengumumanAdmin,
    getPengumumanAdmin,
    getClasses,
} from '../../../data/store';
import { PengumumanAdmin } from '../../../types';
import { kompresGambarFile } from '../../../utils/gambar';
import { useStoreVersion } from '../../../hooks/useStoreVersion';

interface TabPengumumanAdminProps {
    setNotice: (msg: string) => void;
    scope: 'teacher' | 'student';
}

export default function TabPengumumanAdmin({ setNotice, scope }: TabPengumumanAdminProps) {
    const storeVersion = useStoreVersion();
    const classes = useMemo(() => getClasses(), [storeVersion]);
    const pengumumanAdminList = useMemo(() => getPengumumanAdmin(), [storeVersion]);

    const [judulPengumumanAdmin, setJudulPengumumanAdmin] = useState('');
    const [isiPengumumanAdmin, setIsiPengumumanAdmin] = useState('');
    const [targetPengumumanAdmin, setTargetPengumumanAdmin] = useState<'all' | 'classes'>('all');
    const [targetKelasPengumumanAdmin, setTargetKelasPengumumanAdmin] = useState<string[]>([]);
    const [fotoPengumumanDataUrl, setFotoPengumumanDataUrl] = useState<string | undefined>();
    const [fotoPengumumanNama, setFotoPengumumanNama] = useState<string>('');

    // State untuk notifikasi satu baris & konfirmasi kustom di bawah
    const [localNotice, setLocalNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const handlePilihFotoPengumuman = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setLocalNotice({ message: '⚠️ File pengumuman harus berupa gambar.', type: 'error' });
            event.target.value = '';
            return;
        }
        kompresGambarFile(file, 980, 0.74, 1_050_000)
            .then((dataUrl) => {
                if (dataUrl.length > 1_200_000) {
                    setLocalNotice({ message: '⚠️ Ukuran foto terlalu besar. Gunakan resolusi lebih kecil.', type: 'error' });
                    return;
                }
                setFotoPengumumanDataUrl(dataUrl);
                setFotoPengumumanNama(file.name);
                setLocalNotice({ message: '✅ Foto pengumuman berhasil dipilih.', type: 'success' });
            })
            .catch(() => setLocalNotice({ message: '⚠️ Gagal memproses foto. Coba file lain.', type: 'error' }))
            .finally(() => { event.target.value = ''; });
    };

    // Validasi awal sebelum memunculkan pop-up konfirmasi kustom
    const preCheckValidation = () => {
        const title = judulPengumumanAdmin.trim();
        const message = isiPengumumanAdmin.trim();
        if (!title || !message) {
            setLocalNotice({ message: '⚠️ Judul dan isi pengumuman wajib diisi.', type: 'error' });
            return;
        }
        if (targetPengumumanAdmin === 'classes' && targetKelasPengumumanAdmin.length === 0) {
            setLocalNotice({ message: '⚠️ Pilih minimal satu kelas tujuan pengumuman.', type: 'error' });
            return;
        }

        setLocalNotice(null);
        setShowConfirm(true);
    };

    // Eksekusi final simpan data pengumuman
    const handleExecuteSimpan = () => {
        const title = judulPengumumanAdmin.trim();
        const message = isiPengumumanAdmin.trim();

        const newAnnouncement: PengumumanAdmin = {
            id: `adm_ann_${Date.now()}`,
            title,
            message,
            targetScope: targetPengumumanAdmin,
            targetClassIds: targetPengumumanAdmin === 'classes' ? targetKelasPengumumanAdmin : [],
            imageDataUrl: fotoPengumumanDataUrl,
            imageName: fotoPengumumanNama || undefined,
            createdAt: Date.now(),
            createdBy: scope,
        };

        const saved = addPengumumanAdmin(newAnnouncement);
        if (!saved) {
            setLocalNotice({ message: '⚠️ Gagal menyimpan. Penyimpanan penuh, hapus data lama.', type: 'error' });
            setShowConfirm(false);
            return;
        }

        setJudulPengumumanAdmin('');
        setIsiPengumumanAdmin('');
        setTargetPengumumanAdmin('all');
        setTargetKelasPengumumanAdmin([]);
        setFotoPengumumanDataUrl(undefined);
        setFotoPengumumanNama('');
        setLocalNotice({ message: '✅ Pengumuman berhasil dipublikasikan.', type: 'success' });
        setShowConfirm(false);
    };

    const toggleTargetKelasPengumuman = (classId: string) => {
        setTargetKelasPengumumanAdmin((prev) =>
            prev.includes(classId)
                ? prev.filter((item) => item !== classId)
                : [...prev, classId],
        );
    };

    return (
        <div className="w-full bg-white p-4 rounded-xl space-y-4">

            {/* TWO-COLUMN LAYOUT */}
            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

                {/* KOLOM KIRI — FORM INPUT */}
                <div className="space-y-4">

                    {/* STRIP HEADER */}
                    <div className="border-b border-black pb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-black">
                            Pengumumkan Admin Sekolah
                        </h3>
                        <p className="mt-0.5 text-[10px] text-black">
                            Dapat ditujukan ke semua kelas atau kelas tertentu. Mendukung teks dan foto.
                        </p>
                    </div>

                    {/* JUDUL */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                            Judul Pengumuman
                        </label>
                        <input
                            value={judulPengumumanAdmin}
                            onChange={(e) => {
                                setJudulPengumumanAdmin(e.target.value);
                                setLocalNotice(null);
                                setShowConfirm(false);
                            }}
                            placeholder="Judul pengumuman"
                            className="w-full rounded-md border border-black px-3 py-1.5 text-xs text-black outline-none bg-white placeholder:text-neutral-400"
                        />
                    </div>

                    {/* ISI */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                            Isi Pengumuman
                        </label>
                        <textarea
                            value={isiPengumumanAdmin}
                            onChange={(e) => {
                                setIsiPengumumanAdmin(e.target.value);
                                setLocalNotice(null);
                                setShowConfirm(false);
                            }}
                            placeholder="Isi pengumuman"
                            rows={4}
                            className="w-full resize-none rounded-md border border-black px-3 py-1.5 text-xs text-black outline-none bg-white placeholder:text-neutral-400 leading-relaxed"
                        />
                    </div>

                    {/* TARGET SCOPE */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                            Tujuan Pengumuman
                        </label>
                        <select
                            value={targetPengumumanAdmin}
                            onChange={(e) => {
                                const nextValue = e.target.value as 'all' | 'classes';
                                setTargetPengumumanAdmin(nextValue);
                                setLocalNotice(null);
                                setShowConfirm(false);
                                if (nextValue === 'all') setTargetKelasPengumumanAdmin([]);
                            }}
                            className="w-full rounded-md border border-black bg-white px-3 py-1.5 text-xs text-black outline-none"
                        >
                            <option value="all">Semua Kelas (Global)</option>
                            <option value="classes">Kelas Tertentu</option>
                        </select>
                    </div>

                    {/* CHECKBOX KELAS */}
                    {targetPengumumanAdmin === 'classes' && (
                        <div className="space-y-2 rounded-md border border-black bg-white p-3">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-black">
                                Pilih Kelas Tujuan
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
                                {classes.map((item) => (
                                    <label
                                        key={item.id}
                                        className="flex cursor-pointer items-center gap-2 text-[11px] text-black hover:font-bold select-none"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={targetKelasPengumumanAdmin.includes(item.id)}
                                            onChange={() => {
                                                toggleTargetKelasPengumuman(item.id);
                                                setLocalNotice(null);
                                                setShowConfirm(false);
                                            }}
                                            className="h-3.5 w-3.5 rounded border-black accent-black transition-colors"
                                        />
                                        <span>
                                            {item.name}{' '}
                                            <span className="text-[10px] font-mono">({item.grade})</span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FOTO PENGUMUMAN */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                            Foto Pengumuman{' '}
                            <span className="font-normal normal-case">— opsional</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePilihFotoPengumuman}
                            className="block w-full text-[10px] text-black file:mr-2 file:rounded-md file:border file:border-black file:bg-white file:px-3 file:py-1 file:text-[10px] file:font-bold file:text-black file:transition-colors file:hover:bg-black file:hover:text-white file:cursor-pointer"
                        />
                        <p className="text-[10px] text-black">
                            Foto akan tampil di dasbor kelas tujuan pengumuman.
                        </p>
                    </div>

                    {/* PREVIEW FOTO */}
                    {fotoPengumumanDataUrl && (
                        <div className="rounded-md border border-black p-2 bg-white">
                            <img
                                src={fotoPengumumanDataUrl}
                                alt={fotoPengumumanNama || 'Preview foto pengumuman'}
                                className="max-h-44 w-full rounded-md object-cover border border-black/10"
                            />
                            <div className="mt-2 flex items-center justify-between gap-2">
                                <p className="truncate text-[10px] text-black font-mono">
                                    {fotoPengumumanNama || 'Foto terpilih'}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFotoPengumumanDataUrl(undefined);
                                        setFotoPengumumanNama('');
                                        setLocalNotice(null);
                                        setShowConfirm(false);
                                    }}
                                    className="rounded-md border border-black px-2.5 py-1 text-[10px] font-bold text-black bg-white transition-colors hover:bg-black hover:text-white"
                                >
                                    Hapus Foto
                                </button>
                            </div>
                        </div>
                    )}

                    {/* BAR BAWAH: NOTIFIKASI & AREA TOMBOL DENGAN POPUP KONFIRMASI */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black pt-3 min-h-[44px] relative">
                        
                        {/* Sisi Kiri: Notifikasi Status Inline */}
                        <div className="w-full sm:w-auto flex-1 flex items-center">
                            {localNotice && (
                                <div 
                                    className={`flex items-center gap-1.5 text-[11px] font-bold tracking-tight ${
                                        localNotice.type === 'error' ? 'text-red-600' : 'text-black'
                                    }`}
                                >
                                    {localNotice.type === 'error' ? (
                                        <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                                    ) : (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0" />
                                    )}
                                    <span>{localNotice.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Sisi Kanan: Wadah Tombol & Pop-up Kustom */}
                        <div className="w-full sm:w-auto relative flex flex-col items-end gap-2 shrink-0">
                            
                            {/* POP-UP KONFIRMASI KECIL */}
                            {showConfirm && (
                                <div className="absolute bottom-full right-0 mb-2 w-64 bg-white border border-black p-2.5 rounded-lg shadow-md z-10 space-y-2 text-right">
                                    <div className="flex items-start gap-1.5 text-left">
                                        <HelpCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-black font-bold leading-tight">
                                            Yakin ingin mempublikasikan pengumuman ini sekarang?
                                        </p>
                                    </div>
                                    <div className="flex justify-end gap-1.5 text-[10px]">
                                        <button
                                            onClick={() => setShowConfirm(false)}
                                            className="px-2.5 py-1 border border-black rounded bg-white text-black font-bold hover:bg-gray-100 transition-colors"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={handleExecuteSimpan}
                                            className="px-2.5 py-1 border border-black rounded bg-black text-white font-bold hover:bg-neutral-800 transition-colors"
                                        >
                                            Ya, Publikasikan
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TOMBOL UTAMA */}
                            <button
                                onClick={preCheckValidation}
                                className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-md border border-black px-4 py-2 text-xs font-bold transition-colors shrink-0 ${
                                    showConfirm 
                                    ? 'bg-gray-100 text-black cursor-not-allowed opacity-60' 
                                    : 'bg-white text-black hover:bg-black hover:text-white'
                                }`}
                                disabled={showConfirm}
                            >
                                <Save className="h-3.5 w-3.5" />
                                Publikasikan Pengumuman
                            </button>
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN — RIWAYAT PENGUMUMAN */}
                <div className="space-y-3 lg:border-l lg:border-black lg:pl-6">
                    <div className="border-b border-black pb-2">
                        <p className="text-xs font-bold uppercase tracking-wide text-black">
                            Riwayat Pengumuman{' '}
                            <span className="font-mono">({pengumumanAdminList.length})</span>
                        </p>
                    </div>

                    {/* SCROLL CONTAINER */}
                    <div className="max-h-[540px] space-y-2.5 overflow-y-auto pr-1 scrollbar-thin">
                        {pengumumanAdminList.map((item) => (
                            <article
                                key={item.id}
                                className="rounded-md border border-black bg-white p-3 transition-shadow hover:shadow-sm"
                            >
                                {/* Header artikel */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 space-y-0.5">
                                        <h4 className="truncate text-xs font-bold text-black">
                                            {item.title}
                                        </h4>
                                        <p className="text-[10px] text-black font-mono">
                                            {new Date(item.createdAt).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Hapus pengumuman ini?')) {
                                                deletePengumumanAdmin(item.id);
                                                setLocalNotice({ message: '✅ Pengumuman berhasil dihapus.', type: 'success' });
                                            }
                                        }}
                                        className="shrink-0 rounded-md border border-black p-1.5 text-black transition-colors hover:text-white hover:bg-black"
                                        title="Hapus pengumuman"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                {/* Target kelas */}
                                <div className="mt-1.5 flex items-center">
                                    <span className="rounded border border-black bg-neutral-100 px-1.5 py-0.5 text-[10px] font-bold text-black">
                                        {item.targetScope === 'classes' ? 'Kelas Spesifik' : 'Semua Kelas'}
                                    </span>
                                    {item.targetScope === 'classes' && (
                                        <p className="ml-1.5 truncate text-[10px] text-black font-bold">
                                            {(item.targetClassIds || [])
                                                .map((classId) => classes.find((c) => c.id === classId)?.name || classId)
                                                .join(', ')}
                                        </p>
                                    )}
                                </div>

                                {/* Isi pesan */}
                                <p className="mt-2 border-t border-black/20 pt-2 text-xs text-black leading-relaxed whitespace-pre-line">
                                    {item.message}
                                </p>

                                {/* Gambar lampiran */}
                                {item.imageDataUrl && (
                                    <img
                                        src={item.imageDataUrl}
                                        alt={item.imageName || item.title}
                                        className="mt-2.5 h-auto w-full rounded-md border border-black object-contain max-h-32"
                                    />
                                )}
                            </article>
                        ))}

                        {pengumumanAdminList.length === 0 && (
                            <div className="rounded-md border border-dashed border-black bg-white py-12 text-center">
                                <p className="text-[10px] uppercase tracking-widest text-black font-bold">
                                    — Belum ada pengumuman —
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
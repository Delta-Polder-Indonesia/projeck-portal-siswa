import { useState, useMemo, ChangeEvent } from 'react';
import { Save, Trash2 } from 'lucide-react';
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

    const handlePilihFotoPengumuman = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setNotice('File pengumuman harus berupa gambar.');
            event.target.value = '';
            return;
        }
        kompresGambarFile(file, 980, 0.74, 1_050_000)
            .then((dataUrl) => {
                if (dataUrl.length > 1_200_000) {
                    setNotice('Ukuran foto terlalu besar. Gunakan foto dengan resolusi lebih kecil.');
                    return;
                }
                setFotoPengumumanDataUrl(dataUrl);
                setFotoPengumumanNama(file.name);
                setNotice('Foto pengumuman berhasil dipilih.');
            })
            .catch(() => setNotice('Gagal memproses foto. Coba file lain.'))
            .finally(() => { event.target.value = ''; });
    };

    const handleSimpanPengumumanAdmin = () => {
        const title = judulPengumumanAdmin.trim();
        const message = isiPengumumanAdmin.trim();
        if (!title || !message) {
            setNotice('Judul dan isi pengumuman wajib diisi.');
            return;
        }
        if (targetPengumumanAdmin === 'classes' && targetKelasPengumumanAdmin.length === 0) {
            setNotice('Pilih minimal satu kelas tujuan pengumuman.');
            return;
        }
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
            setNotice('Gagal menyimpan. Penyimpanan penuh, kompres foto atau hapus data lama.');
            return;
        }
        setJudulPengumumanAdmin('');
        setIsiPengumumanAdmin('');
        setTargetPengumumanAdmin('all');
        setTargetKelasPengumumanAdmin([]);
        setFotoPengumumanDataUrl(undefined);
        setFotoPengumumanNama('');
        setNotice('Pengumuman berhasil dipublikasikan.');
    };

    const toggleTargetKelasPengumuman = (classId: string) => {
        setTargetKelasPengumumanAdmin((prev) =>
            prev.includes(classId)
                ? prev.filter((item) => item !== classId)
                : [...prev, classId],
        );
    };

    return (
        <div className="mx-auto max-w-5xl space-y-4 rounded-sm border border-gray-200 p-3">

            {/* TWO-COLUMN LAYOUT */}
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">

                {/* KOLOM KIRI — FORM INPUT */}
                <div className="space-y-3">

                    {/* STRIP HEADER */}
                    <div className="border-b border-gray-200 pb-1.5">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                            Pengumuman Admin Sekolah
                        </h3>
                        <p className="mt-0.5 text-[10px] text-gray-500">
                            Dapat ditujukan ke semua kelas atau kelas tertentu. Mendukung teks dan foto.
                        </p>
                    </div>

                    {/* JUDUL */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                            Judul Pengumuman
                        </label>
                        <input
                            value={judulPengumumanAdmin}
                            onChange={(e) => setJudulPengumumanAdmin(e.target.value)}
                            placeholder="Judul pengumuman"
                            className="w-full rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-500"
                        />
                    </div>

                    {/* ISI */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                            Isi Pengumuman
                        </label>
                        <textarea
                            value={isiPengumumanAdmin}
                            onChange={(e) => setIsiPengumumanAdmin(e.target.value)}
                            placeholder="Isi pengumuman"
                            rows={4}
                            className="w-full resize-none rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-500 leading-4"
                        />
                    </div>

                    {/* TARGET SCOPE */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                            Tujuan Pengumuman
                        </label>
                        <select
                            value={targetPengumumanAdmin}
                            onChange={(e) => {
                                const nextValue = e.target.value as 'all' | 'classes';
                                setTargetPengumumanAdmin(nextValue);
                                if (nextValue === 'all') setTargetKelasPengumumanAdmin([]);
                            }}
                            className="w-full rounded-sm border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors focus:border-gray-500"
                        >
                            <option value="all">Semua Kelas (Global)</option>
                            <option value="classes">Kelas Tertentu</option>
                        </select>
                    </div>

                    {/* CHECKBOX KELAS — hanya muncul jika targetScope = classes */}
                    {targetPengumumanAdmin === 'classes' && (
                        <div className="space-y-1.5 rounded-sm border border-gray-200 bg-gray-50/50 p-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                                Pilih Kelas Tujuan
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
                                {classes.map((item) => (
                                    <label
                                        key={item.id}
                                        className="flex cursor-pointer items-center gap-1.5 text-[11px] text-gray-700 hover:text-gray-900"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={targetKelasPengumumanAdmin.includes(item.id)}
                                            onChange={() => toggleTargetKelasPengumuman(item.id)}
                                            className="h-3 w-3 accent-gray-700"
                                        />
                                        {item.name}{' '}
                                        <span className="text-[10px] text-gray-400">({item.grade})</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FOTO PENGUMUMAN */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                            Foto Pengumuman{' '}
                            <span className="font-normal normal-case text-gray-400">— opsional</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePilihFotoPengumuman}
                            className="block w-full text-[10px] text-gray-600 file:mr-2 file:rounded-sm file:border file:border-gray-300 file:bg-white file:px-2 file:py-1 file:text-[10px] file:font-medium file:text-gray-700 file:transition-colors file:hover:bg-gray-50"
                        />
                        <p className="text-[10px] text-gray-400">
                            Foto akan tampil di dasbor kelas tujuan pengumuman.
                        </p>
                    </div>

                    {/* PREVIEW FOTO */}
                    {fotoPengumumanDataUrl && (
                        <div className="rounded-sm border border-gray-200 p-2">
                            <img
                                src={fotoPengumumanDataUrl}
                                alt={fotoPengumumanNama || 'Preview foto pengumuman'}
                                className="max-h-44 w-full rounded-sm object-cover"
                            />
                            <div className="mt-1.5 flex items-center justify-between gap-2">
                                <p className="truncate text-[10px] text-gray-500">
                                    {fotoPengumumanNama || 'Foto terpilih'}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFotoPengumumanDataUrl(undefined);
                                        setFotoPengumumanNama('');
                                    }}
                                    className="rounded-sm border border-gray-300 px-2 py-1 text-[10px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    Hapus Foto
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TOMBOL PUBLIKASI */}
                    <div className="flex justify-end border-t border-gray-200 pt-2">
                        <button
                            onClick={handleSimpanPengumumanAdmin}
                            className="inline-flex items-center gap-1.5 rounded-sm bg-gray-900 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-gray-800"
                        >
                            <Save className="h-3.5 w-3.5" />
                            Publikasikan Pengumuman
                        </button>
                    </div>
                </div>

                {/* KOLOM KANAN — RIWAYAT PENGUMUMAN */}
                <div className="space-y-2">
                    <div className="border-b border-gray-200 pb-1.5">
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-800">
                            Riwayat Pengumuman{' '}
                            <span className="font-normal text-gray-400">({pengumumanAdminList.length})</span>
                        </p>
                    </div>

                    <div className="max-h-[520px] space-y-2 overflow-y-auto pr-0.5">
                        {pengumumanAdminList.map((item) => (
                            <article
                                key={item.id}
                                className="rounded-sm border border-gray-200 bg-white p-2.5 transition-colors hover:border-gray-300"
                            >
                                {/* Header artikel */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 space-y-0.5">
                                        <h4 className="truncate text-xs font-bold text-gray-800">
                                            {item.title}
                                        </h4>
                                        <p className="text-[10px] text-gray-400">
                                            {new Date(item.createdAt).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => deletePengumumanAdmin(item.id)}
                                        className="shrink-0 rounded-sm border border-red-200 p-1 text-red-600 transition-colors hover:bg-red-50"
                                        title="Hapus pengumuman"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>

                                {/* Target kelas */}
                                <p className="mt-1 text-[10px] font-medium text-blue-700">
                                    Tujuan:{' '}
                                    {item.targetScope === 'classes'
                                        ? (item.targetClassIds || [])
                                            .map(
                                                (classId) =>
                                                    classes.find((c) => c.id === classId)?.name ||
                                                    classId,
                                            )
                                            .join(', ')
                                        : 'Semua kelas'}
                                </p>

                                {/* Isi pesan */}
                                <p className="mt-1 border-t border-gray-100 pt-1 text-xs text-gray-700 leading-4">
                                    {item.message}
                                </p>

                                {/* Gambar lampiran */}
                                {item.imageDataUrl && (
                                    <img
                                        src={item.imageDataUrl}
                                        alt={item.imageName || item.title}
                                        className="mt-2 h-auto w-full rounded-sm border border-gray-200 bg-gray-50 object-contain"
                                    />
                                )}
                            </article>
                        ))}

                        {pengumumanAdminList.length === 0 && (
                            <div className="rounded-sm border border-dashed border-gray-200 bg-gray-50/40 py-10 text-center">
                                <p className="text-[10px] uppercase tracking-widest text-gray-400">
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
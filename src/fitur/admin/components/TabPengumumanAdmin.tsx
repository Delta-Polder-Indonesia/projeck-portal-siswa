import { useState, useMemo, ChangeEvent } from 'react';
import { Save } from 'lucide-react';
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
                    setNotice('Ukuran foto terlalu besar untuk disimpan. Gunakan foto dengan resolusi lebih kecil.');
                    return;
                }
                setFotoPengumumanDataUrl(dataUrl);
                setFotoPengumumanNama(file.name);
                setNotice('Foto pengumuman berhasil dipilih.');
            })
            .catch(() => {
                setNotice('Gagal memproses foto pengumuman. Coba file lain.');
            })
            .finally(() => {
                event.target.value = '';
            });
    };

    const handleSimpanPengumumanAdmin = () => {
        const title = judulPengumumanAdmin.trim();
        const message = isiPengumumanAdmin.trim();
        if (!title || !message) {
            setNotice('Judul dan isi pengumuman admin wajib diisi.');
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
            setNotice('Gagal menyimpan pengumuman. Penyimpanan browser penuh, silakan kompres foto atau hapus data lama.');
            return;
        }
        setJudulPengumumanAdmin('');
        setIsiPengumumanAdmin('');
        setTargetPengumumanAdmin('all');
        setTargetKelasPengumumanAdmin([]);
        setFotoPengumumanDataUrl(undefined);
        setFotoPengumumanNama('');
        setNotice('Pengumuman admin berhasil dipublikasikan.');
    };

    const toggleTargetKelasPengumuman = (classId: string) => {
        setTargetKelasPengumumanAdmin((prev) =>
            prev.includes(classId) ? prev.filter((item) => item !== classId) : [...prev, classId]
        );
    };

    return (
        <div className="min-h-[540px] space-y-4 rounded-xl border border-gray-200 p-4">
            <div>
                <h3 className="font-semibold text-gray-800">Pengumuman Admin Sekolah</h3>
                <p className="text-xs text-gray-500 mt-1">Pengumuman dapat ditujukan ke semua kelas atau kelas tertentu. Dapat berisi teks dan foto.</p>
            </div>

            <div className="grid gap-3">
                <input
                    value={judulPengumumanAdmin}
                    onChange={(e) => setJudulPengumumanAdmin(e.target.value)}
                    placeholder="Judul pengumuman"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <textarea
                    value={isiPengumumanAdmin}
                    onChange={(e) => setIsiPengumumanAdmin(e.target.value)}
                    placeholder="Isi pengumuman"
                    rows={4}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <label className="text-sm text-gray-700">
                    Tujuan Pengumuman
                    <select
                        value={targetPengumumanAdmin}
                        onChange={(e) => {
                            const nextValue = e.target.value as 'all' | 'classes';
                            setTargetPengumumanAdmin(nextValue);
                            if (nextValue === 'all') {
                                setTargetKelasPengumumanAdmin([]);
                            }
                        }}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                        <option value="all">Semua Kelas (Global)</option>
                        <option value="classes">Kelas Tertentu</option>
                    </select>
                </label>
                {targetPengumumanAdmin === 'classes' && (
                    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                        <p className="text-xs font-medium text-gray-700 mb-2">Pilih kelas tujuan</p>
                        <div className="grid sm:grid-cols-2 gap-2">
                            {classes.map((item) => (
                                <label key={item.id} className="flex items-center gap-2 text-sm text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={targetKelasPengumumanAdmin.includes(item.id)}
                                        onChange={() => toggleTargetKelasPengumuman(item.id)}
                                    />
                                    <span>{item.name} ({item.grade})</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
                <label className="text-sm text-gray-700">
                    Foto Pengumuman (opsional)
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePilihFotoPengumuman}
                        className="mt-1 block w-full text-sm text-gray-600"
                    />
                    <span className="mt-1 block text-xs text-gray-500">
                        Foto akan tampil di dasbor kelas tujuan pengumuman.
                    </span>
                </label>
                {fotoPengumumanDataUrl && (
                    <div className="border border-gray-200 rounded-lg p-2">
                        <img
                            src={fotoPengumumanDataUrl}
                            alt={fotoPengumumanNama || 'Preview foto pengumuman'}
                            className="w-full max-h-56 object-cover rounded-md"
                        />
                        <div className="mt-2 flex items-center justify-between gap-2">
                            <p className="text-xs text-gray-500 truncate">{fotoPengumumanNama || 'Foto terpilih'}</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setFotoPengumumanDataUrl(undefined);
                                    setFotoPengumumanNama('');
                                }}
                                className="px-2 py-1 rounded border border-gray-300 text-xs text-gray-700 hover:bg-gray-50"
                            >
                                Hapus Foto
                            </button>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleSimpanPengumumanAdmin}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm w-fit"
                >
                    <Save className="w-4 h-4" /> Publikasikan Pengumuman
                </button>
            </div>

            <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Riwayat Pengumuman Admin</p>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {pengumumanAdminList.map((item) => (
                        <article key={item.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between gap-2">
                                <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                                <button
                                    onClick={() => deletePengumumanAdmin(item.id)}
                                    className="px-2 py-1 rounded-md border border-red-200 text-red-700 text-xs hover:bg-red-50"
                                >
                                    Hapus
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{new Date(item.createdAt).toLocaleString('id-ID')}</p>
                            <p className="text-xs text-blue-700 mt-1">
                                Tujuan:{' '}
                                {item.targetScope === 'classes'
                                    ? (item.targetClassIds || [])
                                        .map((classId) => classes.find((classItem) => classItem.id === classId)?.name || classId)
                                        .join(', ')
                                    : 'Semua kelas'}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">{item.message}</p>
                            {item.imageDataUrl && (
                                <img
                                    src={item.imageDataUrl}
                                    alt={item.imageName || item.title}
                                    className="mt-2 w-full h-auto object-contain rounded-md border border-gray-200 bg-gray-50"
                                />
                            )}
                        </article>
                    ))}
                    {pengumumanAdminList.length === 0 && (
                        <p className="text-sm text-gray-400">Belum ada pengumuman admin.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

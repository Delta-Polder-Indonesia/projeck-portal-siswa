import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import {
    getPengaturanTagihan,
    terapkanTagihanTahunanUntukSemuaSiswa,
} from '../../../data/store';

interface TabTagihanSekolahProps {
    setNotice: (msg: string) => void;
    scope: 'teacher' | 'student';
}

export default function TabTagihanSekolah({ setNotice, scope }: TabTagihanSekolahProps) {
    const [tahunTagihan, setTahunTagihan] = useState(new Date().getFullYear());
    const [nominalTagihan, setNominalTagihan] = useState(250000);
    const [tanggalJatuhTempo, setTanggalJatuhTempo] = useState(10);

    useEffect(() => {
        const billingSettings = getPengaturanTagihan();
        setNominalTagihan(billingSettings.monthlyAmount);
        setTanggalJatuhTempo(billingSettings.dueDay);
        setTahunTagihan(new Date().getFullYear());
    }, []);

    const handleTerapkanTagihanTahunan = () => {
        if (!Number.isFinite(tahunTagihan) || tahunTagihan < 2020 || tahunTagihan > 2100) {
            setNotice('Tahun tagihan tidak valid.');
            return;
        }
        if (!Number.isFinite(nominalTagihan) || nominalTagihan <= 0) {
            setNotice('Nominal tagihan harus lebih dari 0.');
            return;
        }

        const day = Math.max(1, Math.min(28, tanggalJatuhTempo));
        const confirmed = window.confirm(
            `Terapkan tagihan ${tahunTagihan} untuk semua siswa dengan nominal ${new Intl.NumberFormat(
                'id-ID',
            ).format(nominalTagihan)} dan jatuh tempo tanggal ${day}?`,
        );
        if (!confirmed) return;

        terapkanTagihanTahunanUntukSemuaSiswa(tahunTagihan, nominalTagihan, day, scope);
        setNotice(`Pengaturan tagihan tahun ${tahunTagihan} berhasil diterapkan untuk semua siswa.`);
    };

    return (
        // PERUBAHAN: Menghapus border pembungkus luar, max-w, mx-auto, dan p-3 untuk tampilan seamless
        <div className="w-full space-y-5">

            {/* STRIP HEADER */}
            <div className="border-b border-gray-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                    Pengaturan Tagihan Uang Sekolah
                </h3>
                <p className="mt-0.5 text-[10px] text-gray-400">
                    Atur nominal bulanan dan tanggal jatuh tempo, lalu terapkan ke seluruh siswa per tahun.
                </p>
            </div>

            {/* FIELD GRID */}
            <div className="grid gap-3 md:grid-cols-3">

                {/* Tahun */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Tahun
                    </label>
                    <input
                        type="number"
                        value={tahunTagihan}
                        onChange={(e) => setTahunTagihan(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none transition-colors focus:border-blue-500"
                    />
                </div>

                {/* Nominal */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Nominal Bulanan (Rp)
                    </label>
                    <input
                        type="number"
                        min={1000}
                        step={1000}
                        value={nominalTagihan}
                        onChange={(e) => setNominalTagihan(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none transition-colors focus:border-blue-500"
                    />
                </div>

                {/* Jatuh Tempo */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        Tanggal Jatuh Tempo
                    </label>
                    <input
                        type="number"
                        min={1}
                        max={28}
                        value={tanggalJatuhTempo}
                        onChange={(e) => setTanggalJatuhTempo(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-800 outline-none transition-colors focus:border-blue-500"
                    />
                </div>
            </div>

            {/* INFO RINGKAS — Menggunakan subtle background dengan border-l aksen biru */}
            <div className="rounded-md border-l-2 border-blue-500 bg-blue-50/40 px-4 py-2.5">
                <p className="text-[11px] text-gray-600 leading- relaxed">
                    Sistem akan membuat <span className="font-bold text-gray-800">12 tagihan</span> per siswa untuk tahun{' '}
                    <span className="font-bold text-gray-800 font-mono">{tahunTagihan}</span> dengan nominal{' '}
                    <span className="font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded-sm">
                        Rp {new Intl.NumberFormat('id-ID').format(nominalTagihan)}
                    </span>{' '}
                    jatuh tempo setiap tanggal{' '}
                    <span className="font-bold text-gray-800">
                        {Math.max(1, Math.min(28, tanggalJatuhTempo))}
                    </span>. Tagihan yang sudah ada sebelumnya tidak akan ditimpa atau diubah.
                </p>
            </div>

            {/* TOMBOL AKSI */}
            <div className="flex justify-end border-t border-gray-100 pt-3">
                <button
                    onClick={handleTerapkanTagihanTahunan}
                    className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700 shadow-sm"
                >
                    <Save className="h-3.5 w-3.5" />
                    Terapkan Tagihan Tahunan
                </button>
            </div>
        </div>
    );
}
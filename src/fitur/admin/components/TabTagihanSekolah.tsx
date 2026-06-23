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
        <div className="mx-auto max-w-5xl space-y-3 rounded-sm border border-gray-200 p-3">

            {/* STRIP HEADER */}
            <div className="border-b border-gray-200 pb-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-800">
                    Pengaturan Tagihan Uang Sekolah
                </h3>
                <p className="mt-0.5 text-[10px] text-gray-500">
                    Atur nominal bulanan dan tanggal jatuh tempo, lalu terapkan ke seluruh siswa per tahun.
                </p>
            </div>

            {/* FIELD GRID */}
            <div className="grid gap-2 md:grid-cols-3">

                {/* Tahun */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                        Tahun
                    </label>
                    <input
                        type="number"
                        value={tahunTagihan}
                        onChange={(e) => setTahunTagihan(Number(e.target.value))}
                        className="w-full rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors focus:border-gray-500"
                    />
                </div>

                {/* Nominal */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                        Nominal Bulanan (Rp)
                    </label>
                    <input
                        type="number"
                        min={1000}
                        step={1000}
                        value={nominalTagihan}
                        onChange={(e) => setNominalTagihan(Number(e.target.value))}
                        className="w-full rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors focus:border-gray-500"
                    />
                </div>

                {/* Jatuh Tempo */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                        Tanggal Jatuh Tempo
                    </label>
                    <input
                        type="number"
                        min={1}
                        max={28}
                        value={tanggalJatuhTempo}
                        onChange={(e) => setTanggalJatuhTempo(Number(e.target.value))}
                        className="w-full rounded-sm border border-gray-300 px-2.5 py-1.5 text-xs text-gray-800 outline-none transition-colors focus:border-gray-500"
                    />
                </div>
            </div>

            {/* INFO RINGKAS */}
            <div className="rounded-sm border border-gray-100 bg-gray-50/60 px-3 py-2">
                <p className="text-[10px] text-gray-500 leading-4">
                    Sistem akan membuat{' '}
                    <span className="font-bold text-gray-700">12 tagihan</span> per siswa untuk tahun{' '}
                    <span className="font-bold text-gray-700">{tahunTagihan}</span> dengan nominal{' '}
                    <span className="font-bold text-gray-700">
                        Rp {new Intl.NumberFormat('id-ID').format(nominalTagihan)}
                    </span>{' '}
                    jatuh tempo setiap tanggal{' '}
                    <span className="font-bold text-gray-700">
                        {Math.max(1, Math.min(28, tanggalJatuhTempo))}
                    </span>
                    . Tagihan yang sudah ada tidak akan ditimpa.
                </p>
            </div>

            {/* TOMBOL AKSI */}
            <div className="flex justify-end border-t border-gray-200 pt-2">
                <button
                    onClick={handleTerapkanTagihanTahunan}
                    className="inline-flex items-center gap-1.5 rounded-sm bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-blue-700"
                >
                    <Save className="h-3.5 w-3.5" />
                    Terapkan Tagihan Tahunan
                </button>
            </div>
        </div>
    );
}
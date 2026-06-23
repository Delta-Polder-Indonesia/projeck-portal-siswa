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
                'id-ID'
            ).format(nominalTagihan)} dan jatuh tempo tanggal ${day}?`
        );
        if (!confirmed) return;

        terapkanTagihanTahunanUntukSemuaSiswa(tahunTagihan, nominalTagihan, day, scope);
        setNotice(`Pengaturan tagihan tahun ${tahunTagihan} berhasil diterapkan untuk semua siswa.`);
    };

    return (
        <div className="min-h-[540px] space-y-4 rounded-xl border border-gray-200 p-4">
            <div>
                <h3 className="font-semibold text-gray-800">Pengaturan Tagihan Uang Sekolah</h3>
                <p className="text-xs text-gray-500 mt-1">
                    Atur nominal bulanan dan tanggal jatuh tempo, lalu terapkan ke seluruh siswa per tahun.
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
                <label className="text-sm text-gray-700">
                    Tahun
                    <input
                        type="number"
                        value={tahunTagihan}
                        onChange={(e) => setTahunTagihan(Number(e.target.value))}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </label>
                <label className="text-sm text-gray-700">
                    Nominal Bulanan (Rp)
                    <input
                        type="number"
                        min={1000}
                        step={1000}
                        value={nominalTagihan}
                        onChange={(e) => setNominalTagihan(Number(e.target.value))}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </label>
                <label className="text-sm text-gray-700">
                    Tanggal Jatuh Tempo
                    <input
                        type="number"
                        min={1}
                        max={28}
                        value={tanggalJatuhTempo}
                        onChange={(e) => setTanggalJatuhTempo(Number(e.target.value))}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </label>
            </div>
            <button
                onClick={handleTerapkanTagihanTahunan}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
                <Save className="w-4 h-4" /> Terapkan Tagihan Tahunan
            </button>
        </div>
    );
}

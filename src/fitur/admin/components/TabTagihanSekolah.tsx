import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
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

    // State untuk notifikasi satu baris
    const [localNotice, setLocalNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    
    // State baru untuk mengontrol pop-up konfirmasi kustom
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const billingSettings = getPengaturanTagihan();
        setNominalTagihan(billingSettings.monthlyAmount);
        setTanggalJatuhTempo(billingSettings.dueDay);
        setTahunTagihan(new Date().getFullYear());
    }, []);

    // Validasi awal sebelum memunculkan konfirmasi kustom
    const preCheckValidation = () => {
        if (!Number.isFinite(tahunTagihan) || tahunTagihan < 2020 || tahunTagihan > 2100) {
            setLocalNotice({ message: '⚠️ Tahun tagihan tidak valid.', type: 'error' });
            return;
        }
        if (!Number.isFinite(nominalTagihan) || nominalTagihan <= 0) {
            setLocalNotice({ message: '⚠️ Nominal tagihan harus lebih dari 0.', type: 'error' });
            return;
        }
        
        setLocalNotice(null);
        setShowConfirm(true); // Buka pop-up kecil di atas tombol
    };

    // Eksekusi final saat admin menekan tombol "Yakin"
    const handleExecuteTerapkan = () => {
        const day = Math.max(1, Math.min(28, tanggalJatuhTempo));
        
        terapkanTagihanTahunanUntukSemuaSiswa(tahunTagihan, nominalTagihan, day, scope);
        
        setLocalNotice({ 
            message: `✅ Pengaturan tagihan tahun ${tahunTagihan} berhasil diterapkan untuk semua siswa.`, 
            type: 'success' 
        });
        setShowConfirm(false);
    };

    return (
        <div className="w-full bg-white p-4 rounded-xl space-y-4">

            {/* STRIP HEADER */}
            <div className="border-b border-black pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wide text-black">
                    Pengaturan Tagihan Uang Sekolah
                </h3>
                <p className="mt-0.5 text-[10px] text-black">
                    Atur nominal bulanan dan tanggal jatuh tempo, lalu terapkan ke seluruh siswa per tahun.
                </p>
            </div>

            {/* FIELD GRID */}
            <div className="grid gap-3 md:grid-cols-3">
                {/* Tahun */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                        Tahun
                    </label>
                    <input
                        type="number"
                        value={tahunTagihan}
                        onChange={(e) => {
                            setTahunTagihan(Number(e.target.value));
                            setLocalNotice(null);
                            setShowConfirm(false);
                        }}
                        className="w-full rounded-md border border-black px-3 py-1.5 text-xs text-black outline-none bg-white"
                    />
                </div>

                {/* Nominal */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                        Nominal Bulanan (Rp)
                    </label>
                    <input
                        type="number"
                        min={1000}
                        step={1000}
                        value={nominalTagihan}
                        onChange={(e) => {
                            setNominalTagihan(Number(e.target.value));
                            setLocalNotice(null);
                            setShowConfirm(false);
                        }}
                        className="w-full rounded-md border border-black px-3 py-1.5 text-xs text-black outline-none bg-white"
                    />
                </div>

                {/* Jatuh Tempo */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                        Tanggal Jatuh Tempo
                    </label>
                    <input
                        type="number"
                        min={1}
                        max={28}
                        value={tanggalJatuhTempo}
                        onChange={(e) => {
                            setTanggalJatuhTempo(Number(e.target.value));
                            setLocalNotice(null);
                            setShowConfirm(false);
                        }}
                        className="w-full rounded-md border border-black px-3 py-1.5 text-xs text-black outline-none bg-white"
                    />
                </div>
            </div>

            {/* INFO RINGKAS */}
            <div className="rounded-md border-l-2 border-black bg-white px-4 py-2.5 border border-y-gray-100 border-r-gray-100">
                <p className="text-[11px] text-black leading-relaxed">
                    Sistem akan membuat <span className="font-bold">12 tagihan</span> per siswa untuk tahun{' '}
                    <span className="font-bold font-mono">{tahunTagihan}</span> dengan nominal{' '}
                    <span className="font-bold bg-gray-100 px-1 py-0.5 rounded-sm border border-black/20">
                        Rp {new Intl.NumberFormat('id-ID').format(nominalTagihan)}
                    </span>{' '}
                    jatuh tempo setiap tanggal{' '}
                    <span className="font-bold">
                        {Math.max(1, Math.min(28, tanggalJatuhTempo))}
                    </span>. Tagihan yang sudah ada sebelumnya tidak akan ditimpa atau diubah.
                </p>
            </div>

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

                {/* Sisi Kanan: Wadah Kontrol Aksi Eksekusi & Pop-up Kustom */}
                <div className="w-full sm:w-auto relative flex flex-col items-end gap-2 shrink-0">
                    
                    {/* POP-UP KECIL KONFIRMASI (Hanya muncul jika lolos validasi) */}
                    {showConfirm && (
                        <div className="absolute bottom-full right-0 mb-2 w-64 bg-white border border-black p-2.5 rounded-lg shadow-md z-10 space-y-2 text-right">
                            <div className="flex items-start gap-1.5 text-left">
                                <HelpCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
                                <p className="text-[10px] text-black font-bold leading-tight">
                                    Yakin ingin menerapkan 12 tagihan ini ke semua siswa?
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
                                    onClick={handleExecuteTerapkan}
                                    className="px-2.5 py-1 border border-black rounded bg-black text-white font-bold hover:bg-neutral-800 transition-colors"
                                >
                                    Ya, Yakin
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
                        Terapkan Tagihan Tahunan
                    </button>
                </div>
            </div>
        </div>
    );
}
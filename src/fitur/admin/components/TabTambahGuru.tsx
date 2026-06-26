import { useState, useMemo } from 'react';
import { UserPlus, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import { Teacher, getClasses, getTeachers, saveClasses, saveTeachers } from '../../../data/store';
import { applyExclusiveClassAssignment } from './utils';

export default function TabTambahGuru({ setNotice }: { setNotice: (msg: string) => void }) {
    const storeVersion = useStoreVersion();
    const classes = useMemo(() => getClasses(), [storeVersion]);
    const teachers = useMemo(() => getTeachers(), [storeVersion]);

    const [newTeacherName, setNewTeacherName] = useState('');
    const [newTeacherNip, setNewTeacherNip] = useState('');
    const [newTeacherPassword, setNewTeacherPassword] = useState('');
    const [newTeacherSubject, setNewTeacherSubject] = useState('');
    const [newTeacherClassIds, setNewTeacherClassIds] = useState<string[]>([]);

    const [localNotice, setLocalNotice] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const toggleNewTeacherClass = (classId: string) => {
        setNewTeacherClassIds((prev) =>
            prev.includes(classId)
                ? prev.filter((id) => id !== classId)
                : [...prev, classId],
        );
        setLocalNotice(null);
        setShowConfirm(false);
    };

    // Validasi sebelum popup konfirmasi
    const preCheckValidation = () => {
        if (
            !newTeacherName.trim() ||
            !newTeacherNip.trim() ||
            !newTeacherPassword.trim() ||
            !newTeacherSubject.trim()
        ) {
            setLocalNotice({ message: '⚠️ Lengkapi data guru baru terlebih dahulu.', type: 'error' });
            return;
        }

        const nipUsed = teachers.some((item) => item.nip === newTeacherNip.trim());
        if (nipUsed) {
            setLocalNotice({ message: '⚠️ NIP sudah digunakan guru lain.', type: 'error' });
            return;
        }

        setLocalNotice(null);
        setShowConfirm(true);
    };

    // Eksekusi final simpan guru
    const handleExecuteSimpan = () => {
        const newTeacher: Teacher = {
            id: `t_${Date.now()}`,
            name: newTeacherName.trim(),
            nip: newTeacherNip.trim(),
            subject: newTeacherSubject.trim(),
            password: newTeacherPassword,
            classIds: [],
        };

        const withTeacher = [...teachers, newTeacher];
        const { nextTeachers, nextClasses } = applyExclusiveClassAssignment(
            withTeacher,
            classes,
            newTeacher.id,
            newTeacherClassIds,
        );

        saveTeachers(nextTeachers);
        saveClasses(nextClasses);

        setNewTeacherName('');
        setNewTeacherNip('');
        setNewTeacherPassword('');
        setNewTeacherSubject('');
        setNewTeacherClassIds([]);
        setLocalNotice({ message: '✅ Guru baru berhasil ditambahkan.', type: 'success' });
        setShowConfirm(false);
        setNotice('✅ Guru baru berhasil ditambahkan.');
    };

    return (
        <div className="w-full space-y-5">

            {/* TWO-COLUMN LAYOUT */}
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">

                {/* KOLOM KIRI — FORM DATA GURU */}
                <div className="space-y-4">

                    {/* STRIP HEADER */}
                    <div className="border-b border-black pb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-black">
                            Form Data Guru Baru
                        </h3>
                        <p className="mt-0.5 text-[10px] text-black">
                            Isi seluruh field berikut untuk mendaftarkan akun guru baru.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">

                        {/* Nama */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                                Nama Guru
                            </label>
                            <input
                                value={newTeacherName}
                                onChange={(e) => {
                                    setNewTeacherName(e.target.value);
                                    setLocalNotice(null);
                                    setShowConfirm(false);
                                }}
                                placeholder="Contoh: Budi Santoso"
                                className="w-full rounded-md border border-black px-3 py-1.5 text-xs text-black outline-none bg-white placeholder:text-neutral-400"
                            />
                        </div>

                        {/* NIP */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                                NIP
                            </label>
                            <input
                                value={newTeacherNip}
                                onChange={(e) => {
                                    setNewTeacherNip(e.target.value);
                                    setLocalNotice(null);
                                    setShowConfirm(false);
                                }}
                                placeholder="Masukkan NIP"
                                className="w-full rounded-md border border-black px-3 py-1.5 text-xs text-black outline-none bg-white placeholder:text-neutral-400"
                            />
                        </div>

                        {/* Kata Sandi */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                                Kata Sandi
                            </label>
                            <input
                                value={newTeacherPassword}
                                onChange={(e) => {
                                    setNewTeacherPassword(e.target.value);
                                    setLocalNotice(null);
                                    setShowConfirm(false);
                                }}
                                placeholder="Minimal 8 karakter"
                                className="w-full rounded-md border border-black px-3 py-1.5 text-xs text-black outline-none bg-white placeholder:text-neutral-400"
                            />
                        </div>

                        {/* Mata Pelajaran */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                                Mata Pelajaran
                            </label>
                            <input
                                value={newTeacherSubject}
                                onChange={(e) => {
                                    setNewTeacherSubject(e.target.value);
                                    setLocalNotice(null);
                                    setShowConfirm(false);
                                }}
                                placeholder="Contoh: Bahasa Indonesia"
                                className="w-full rounded-md border border-black px-3 py-1.5 text-xs text-black outline-none bg-white placeholder:text-neutral-400"
                            />
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN — PILIH KELAS */}
                <div className="space-y-3 lg:border-l lg:border-black lg:pl-6">

                    {/* STRIP HEADER */}
                    <div className="border-b border-black pb-2">
                        <p className="text-xs font-bold uppercase tracking-wide text-black">
                            Kelas yang Diajar
                        </p>
                        <p className="mt-0.5 text-[10px] text-black">
                            Centang kelas yang akan diampu oleh guru ini.
                        </p>
                    </div>

                    {/* LIST KELAS */}
                    <div className="max-h-[220px] overflow-y-auto rounded-md border border-black bg-white divide-y divide-black/10 scrollbar-thin">
                        {classes.map((item) => (
                            <label
                                key={item.id}
                                className="flex cursor-pointer items-center justify-between px-3 py-2 text-xs text-black hover:font-bold transition-colors select-none"
                            >
                                <span>
                                    {item.name}{' '}
                                    <span className="text-[10px] font-mono">({item.grade})</span>
                                </span>
                                <input
                                    type="checkbox"
                                    checked={newTeacherClassIds.includes(item.id)}
                                    onChange={() => toggleNewTeacherClass(item.id)}
                                    className="h-3.5 w-3.5 rounded border-black accent-black cursor-pointer"
                                />
                            </label>
                        ))}

                        {classes.length === 0 && (
                            <div className="px-3 py-10 text-center">
                                <p className="text-[10px] uppercase tracking-widest text-black font-bold">
                                    — Belum ada kelas terdaftar —
                                </p>
                            </div>
                        )}
                    </div>

                    {/* COUNTER KELAS DIPILIH */}
                    <p className="text-[10px] font-bold text-black">
                        Terpilih:{' '}
                        <span className="font-mono rounded border border-black bg-neutral-100 px-1.5 py-0.5 tabular-nums">
                            {newTeacherClassIds.length}
                        </span>{' '}
                        kelas
                    </p>
                </div>
            </div>

            {/* BAR BAWAH: NOTIFIKASI & TOMBOL DENGAN POPUP KONFIRMASI */}
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
                                    Yakin ingin menambahkan guru baru ini ke sistem?
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
                                    Ya, Tambahkan
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
                        <UserPlus className="h-3.5 w-3.5" />
                        Tambah Guru
                    </button>
                </div>
            </div>
        </div>
    );
}
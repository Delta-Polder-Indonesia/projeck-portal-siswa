import { useState, useMemo, useEffect } from 'react';
import { Save, Search } from 'lucide-react';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import {
    getClasses, getTeachers, saveClasses, saveTeachers
} from '../../../data/store';
import { applyExclusiveClassAssignment } from './utils';

type TeacherEditMap = Record<string, {
    name: string;
    nip: string;
    password: string;
    subject: string;
    classIds: string[];
}>;

export default function TabAkunGuru({ setNotice }: { setNotice: (msg: string) => void }) {
    const storeVersion = useStoreVersion();
    const classes = useMemo(() => getClasses(), [storeVersion]);
    const teachers = useMemo(() => getTeachers(), [storeVersion]);

    const [searchTeacher, setSearchTeacher] = useState('');
    const [selectedTeacherId, setSelectedTeacherId] = useState('');
    const [teacherEdits, setTeacherEdits] = useState<TeacherEditMap>({});

    useEffect(() => {
        const nextTeacherEdits: TeacherEditMap = {};
        teachers.forEach((teacher) => {
            nextTeacherEdits[teacher.id] = {
                name: teacher.name,
                nip: teacher.nip,
                password: teacher.password,
                subject: teacher.subject,
                classIds: [...teacher.classIds],
            };
        });
        setTeacherEdits(nextTeacherEdits);
        setSelectedTeacherId((prev) =>
            prev && nextTeacherEdits[prev] ? prev : teachers[0]?.id || '',
        );
    }, [teachers]);

    const setTeacherField = (
        teacherId: string,
        field: keyof TeacherEditMap[string],
        value: string | string[],
    ) => {
        setTeacherEdits((prev) => ({
            ...prev,
            [teacherId]: { ...prev[teacherId], [field]: value },
        }));
    };

    const toggleTeacherClass = (teacherId: string, classId: string) => {
        const current = teacherEdits[teacherId]?.classIds || [];
        const next = current.includes(classId)
            ? current.filter((id) => id !== classId)
            : [...current, classId];
        setTeacherField(teacherId, 'classIds', next);
    };

    const handleSaveTeacher = (teacherId: string) => {
        const edit = teacherEdits[teacherId];
        if (!edit) return;

        if (!edit.name.trim() || !edit.nip.trim() || !edit.subject.trim()) {
            setNotice('⚠️ NAMA, NIP, DAN MATA PELAJARAN WAJIB DIISI.');
            return;
        }

        const nipUsed = teachers.find(
            (item) => item.nip === edit.nip.trim() && item.id !== teacherId,
        );
        if (nipUsed) {
            setNotice('⚠️ NIP SUDAH DIGUNAKAN GURU LAIN.');
            return;
        }

        const targetTeacher = teachers.find((item) => item.id === teacherId);
        if (!targetTeacher) return;

        const confirmed = window.confirm(`Apakah Anda yakin ingin menyimpan perubahan data untuk guru ${edit.name.trim()}?`);
        if (!confirmed) return;

        const patchedTeachers = teachers.map((item) => {
            if (item.id !== teacherId) return item;
            return {
                ...item,
                name: edit.name.trim(),
                nip: edit.nip.trim(),
                password: edit.password,
                subject: edit.subject.trim(),
            };
        });

        const { nextTeachers, nextClasses } = applyExclusiveClassAssignment(
            patchedTeachers,
            classes,
            teacherId,
            edit.classIds,
        );

        saveTeachers(nextTeachers);
        saveClasses(nextClasses);
        setNotice(`✅ AKUN GURU ${edit.name.trim().toUpperCase()} BERHASIL DIPERBARUI.`);
    };

    // Mengurutkan dan memfilter guru (Diurutkan A-Z secara default)
    const filteredAndSortedTeachers = useMemo(() => {
        const sorted = [...teachers].sort((a, b) =>
            a.name.localeCompare(b.name, 'id', { sensitivity: 'base' })
        );

        const key = searchTeacher.trim().toLowerCase();
        if (!key) return sorted;

        return sorted.filter((item) => {
            const edit = teacherEdits[item.id];
            const classNames = (edit?.classIds || item.classIds)
                .map((classId) => classes.find((c) => c.id === classId)?.name || '')
                .join(' ')
                .toLowerCase();
            return (
                item.name.toLowerCase().includes(key) ||
                item.nip.toLowerCase().includes(key) ||
                item.subject.toLowerCase().includes(key) ||
                classNames.includes(key)
            );
        });
    }, [teachers, searchTeacher, teacherEdits, classes]);

    const selectedTeacher =
        teachers.find((item) => item.id === selectedTeacherId) ||
        filteredAndSortedTeachers[0] ||
        null;
    const selectedTeacherEdit = selectedTeacher
        ? teacherEdits[selectedTeacher.id]
        : null;

    return (
        <div className="w-full bg-white p-4">
            {/* TWO-COLUMN LAYOUT */}
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

                {/* KOLOM KIRI — DAFTAR GURU */}
                <div className="space-y-4">
                    {/* STRIP HEADER PENCARIAN */}
                    <div className="border-b border-black pb-2">
                        <h3 className="text-xs font-bold uppercase tracking-wide text-black">
                            Daftar Guru ({filteredAndSortedTeachers.length})
                        </h3>
                    </div>

                    <div className="relative w-full">
                        <input
                            type="text"
                            value={searchTeacher}
                            onChange={(e) => setSearchTeacher(e.target.value)}
                            placeholder="Cari nama, mata pelajaran, dll..."
                            className="w-full rounded-md border border-black bg-white px-3 py-1.5 pl-8 text-xs text-black outline-none placeholder:text-neutral-400"
                        />
                        <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-black shrink-0" />
                    </div>

                    {/* SCROLL CONTAINER DAFTAR GURU */}
                    <div className="max-h-[440px] space-y-1.5 overflow-y-auto pr-1 scrollbar-thin">
                        {filteredAndSortedTeachers.map((teacher) => {
                            const isActive = selectedTeacher?.id === teacher.id;
                            return (
                                <button
                                    type="button"
                                    key={teacher.id}
                                    onClick={() => setSelectedTeacherId(teacher.id)}
                                    className={`w-full rounded-md border border-black px-3 py-2.5 text-left transition-colors select-none block ${
                                        isActive
                                            ? 'bg-black text-white font-bold'
                                            : 'bg-white text-black hover:bg-neutral-100'
                                    }`}
                                >
                                    <p className="truncate text-xs font-bold uppercase tracking-tight">
                                        {teacher.name}
                                    </p>
                                    <p className={`mt-0.5 text-[10px] truncate ${isActive ? 'text-neutral-300' : 'text-neutral-500'}`}>
                                        {teacher.subject}
                                    </p>
                                </button>
                            );
                        })}

                        {filteredAndSortedTeachers.length === 0 && (
                            <div className="rounded-md border border-dashed border-black bg-white py-12 text-center">
                                <p className="text-[10px] uppercase tracking-widest text-black font-bold">
                                    — Guru tidak ditemukan —
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* KOLOM KANAN — FORM EDITOR */}
                <div className="space-y-4 lg:border-l lg:border-black lg:pl-6">
                    {selectedTeacher && selectedTeacherEdit ? (
                        <div className="space-y-4">

                            {/* STRIP HEADER EDITOR */}
                            <div className="border-b border-black pb-2">
                                <h3 className="text-xs font-bold uppercase tracking-wide text-black">
                                    Ubah Data Akun Guru
                                </h3>
                                <p className="mt-0.5 text-[10px] text-black font-mono uppercase">
                                    ID Guru: <span className="font-bold">{selectedTeacher.id}</span>
                                </p>
                            </div>

                            {/* FIELD GRID INPUT */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                                        Nama Lengkap Guru
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedTeacherEdit.name}
                                        onChange={(e) =>
                                            setTeacherField(selectedTeacher.id, 'name', e.target.value)
                                        }
                                        placeholder="Nama lengkap guru"
                                        className="w-full rounded-md border border-black px-3 py-1.5 text-xs text-black font-bold outline-none bg-white placeholder:text-neutral-400"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                                        Mata Pelajaran Utama
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedTeacherEdit.subject}
                                        onChange={(e) =>
                                            setTeacherField(selectedTeacher.id, 'subject', e.target.value)
                                        }
                                        placeholder="Mata pelajaran"
                                        className="w-full rounded-md border border-black px-3 py-1.5 text-xs text-black font-bold outline-none bg-white placeholder:text-neutral-400"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                                        Nomor Induk Pegawai (NIP)
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedTeacherEdit.nip}
                                        onChange={(e) =>
                                            setTeacherField(selectedTeacher.id, 'nip', e.target.value)
                                        }
                                        placeholder="NIP guru"
                                        className="w-full rounded-md border border-black px-3 py-1.5 font-mono text-xs text-black outline-none bg-white placeholder:text-neutral-400"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wide text-black">
                                        Kata Sandi Akun
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedTeacherEdit.password}
                                        onChange={(e) =>
                                            setTeacherField(selectedTeacher.id, 'password', e.target.value)
                                        }
                                        placeholder="Kata sandi"
                                        className="w-full rounded-md border border-black px-3 py-1.5 font-mono text-xs text-black outline-none bg-white placeholder:text-neutral-400"
                                    />
                                </div>
                            </div>

                            {/* KELAS AJAR — CHECKBOX GRID */}
                            <div className="space-y-2">
                                <div className="border-b border-black/20 pb-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wide text-black">
                                        Hak Akses Kelas Ajar{' '}
                                        <span className="font-normal normal-case text-neutral-500">
                                            — Data bersifat eksklusif antar-guru
                                        </span>
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3 rounded-md border border-black bg-white p-3">
                                    {classes.map((item) => (
                                        <label
                                            key={item.id}
                                            className="flex cursor-pointer items-center gap-2 text-[11px] text-black hover:font-bold select-none"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedTeacherEdit.classIds.includes(item.id)}
                                                onChange={() =>
                                                    toggleTeacherClass(selectedTeacher.id, item.id)
                                                }
                                                className="h-3.5 w-3.5 rounded border-black accent-black transition-colors cursor-pointer"
                                            />
                                            <span>
                                                {item.name}{' '}
                                                <span className="text-[10px] font-mono">({item.grade})</span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* ACTION BUTTON */}
                            <div className="flex justify-end border-t border-black pt-3">
                                <button
                                    type="button"
                                    onClick={() => handleSaveTeacher(selectedTeacher.id)}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-md border border-black bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:bg-black hover:text-white"
                                >
                                    <Save className="h-3.5 w-3.5" />
                                    Simpan Perubahan Guru
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full min-h-[360px] items-center justify-center rounded-md border border-dashed border-black bg-white py-12 text-center">
                            <p className="text-[10px] uppercase tracking-widest text-black font-bold">
                                — Pilih guru untuk mengedit akun —
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
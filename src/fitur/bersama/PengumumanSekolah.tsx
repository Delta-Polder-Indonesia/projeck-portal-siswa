import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    getPengumumanAdmin,
    getPengumumanAdminUntukGuru,
    getPengumumanAdminUntukKelas,
    getStudents,
    getTeachers,
} from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { X, Megaphone } from 'lucide-react';

export default function PengumumanSekolah() {
    const { user } = useAuth();
    const storeVersion = useStoreVersion();
    const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);

    // Menghitung pengumuman berdasarkan role pengguna (Logika bisnis dipertahankan)
    const pengumumanAdmin = useMemo(() => {
        if (user?.role === 'student') {
            const student = getStudents().find((s) => s.id === user.id);
            if (student) return getPengumumanAdminUntukKelas(student.classId);
        } else if (user?.role === 'teacher') {
            const teacher = getTeachers().find((t) => t.id === user.id);
            if (teacher) return getPengumumanAdminUntukGuru(teacher.classIds);
        }
        return getPengumumanAdmin();
    }, [user?.role, user?.id, storeVersion]);

    // Menutup modal preview menggunakan tombol Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setPreviewImage(null);
        };

        if (previewImage) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [previewImage]);

    return (
        <div className="w-full h-full p-6 md:p-8 lg:p-10 antialiased text-slate-700 bg-white">
            {/* Header Judul - Polos & Menyatu dengan Halaman */}
            <div className="border-b border-slate-200 pb-4 mb-6">
                <div className="flex items-center gap-3">
                    <Megaphone className="w-6 h-6 text-slate-800" />
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pengumuman Sekolah</h1>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                    Informasi resmi dan pemberitahuan penting dari manajemen sekolah.
                </p>
            </div>

            {/* List Pengumuman - Aliran List Normal & Akademik */}
            <div className="divide-y divide-slate-100">
                {pengumumanAdmin.map((item) => (
                    <div
                        key={item.id}
                        className="py-6 flex flex-col md:flex-row md:items-start justify-between gap-6 first:pt-2 transition-all hover:bg-slate-50/50 p-2 -mx-2 rounded-lg"
                    >
                        {/* Area Teks Informasi */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded shrink-0 leading-none">
                                    {new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                <h2 className="text-lg font-bold text-slate-900 truncate">{item.title}</h2>
                            </div>
                            <p className="text-base text-slate-600 leading-relaxed whitespace-pre-line">
                                {item.message}
                            </p>
                        </div>

                        {/* Lampiran Gambar jika Ada */}
                        {item.imageDataUrl && (
                            <div className="shrink-0 md:w-48 w-full mt-4 md:mt-0">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPreviewImage({ src: item.imageDataUrl || '', title: item.title })
                                    }
                                    className="block w-full aspect-video overflow-hidden rounded-md border border-slate-200 cursor-zoom-in hover:shadow-md transition-shadow"
                                >
                                    <img
                                        src={item.imageDataUrl}
                                        alt={item.imageName || item.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {pengumumanAdmin.length === 0 && (
                    <div className="py-12 text-center text-sm text-slate-500 font-medium">
                        Belum ada pengumuman sekolah saat ini.
                    </div>
                )}
            </div>

            {/* Image Preview Overlay Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[120] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="relative max-w-3xl w-full flex flex-col bg-white rounded-lg overflow-hidden border border-slate-200 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-200 bg-white">
                            <span className="text-sm font-bold text-slate-900 truncate pr-4">
                                {previewImage.title}
                            </span>
                            <button
                                type="button"
                                onClick={() => setPreviewImage(null)}
                                className="text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded p-1 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-2 bg-slate-100 flex items-center justify-center">
                            <img
                                src={previewImage.src}
                                alt={previewImage.title}
                                className="max-h-[75vh] w-auto h-auto object-contain rounded"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
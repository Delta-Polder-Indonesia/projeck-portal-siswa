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
        <div className="max-w-5xl mx-auto p-4 antialiased text-slate-700 bg-white">
            {/* Header Judul - Polos & Menyatu dengan Halaman */}
            <div className="border-b border-slate-200 pb-3 mb-4">
                <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-slate-800" />
                    <h1 className="text-sm font-bold text-slate-900 tracking-tight">Pengumuman Sekolah</h1>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                    Informasi resmi dan pemberitahuan penting dari sekolah.
                </p>
            </div>

            {/* List Pengumuman - Aliran List Normal & High Density */}
            <div className="divide-y divide-slate-100">
                {pengumumanAdmin.map((item) => (
                    <div
                        key={item.id}
                        className="py-3 flex flex-col md:flex-row md:items-start justify-between gap-4 first:pt-0"
                    >
                        {/* Area Teks Informasi */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-sm shrink-0">
                                    {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                </span>
                                <h2 className="text-xs font-bold text-slate-900 truncate">{item.title}</h2>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line pl-1">
                                {item.message}
                            </p>
                        </div>

                        {/* Lampiran Gambar jika Ada */}
                        {item.imageDataUrl && (
                            <div className="shrink-0 md:w-28 w-full">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPreviewImage({ src: item.imageDataUrl || '', title: item.title })
                                    }
                                    className="block w-full aspect-video md:aspect-square overflow-hidden rounded-sm border border-slate-200 cursor-zoom-in"
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
                    <div className="py-6 text-center text-xs text-slate-400 font-medium">
                        Belum ada pengumuman sekolah saat ini.
                    </div>
                )}
            </div>

            {/* Image Preview Overlay Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[120] bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setPreviewImage(null)}
                >
                    <div 
                        className="relative max-w-xl w-full flex flex-col bg-white rounded-sm overflow-hidden border border-slate-300 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center px-3 py-1.5 border-b border-slate-200 bg-white">
                            <span className="text-xs font-bold text-slate-900 truncate pr-3">
                                {previewImage.title}
                            </span>
                            <button
                                type="button"
                                onClick={() => setPreviewImage(null)}
                                className="text-slate-400 hover:text-slate-700 p-0.5 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-1 bg-slate-50 flex items-center justify-center">
                            <img
                                src={previewImage.src}
                                alt={previewImage.title}
                                className="max-h-[65vh] w-auto h-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
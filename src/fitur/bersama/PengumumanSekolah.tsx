import { useMemo, useState } from 'react';
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

    const pengumumanAdmin = useMemo(() => {
        if (user?.role === 'student') {
            const student = getStudents().find((s) => s.id === user.id);
            if (student) return getPengumumanAdminUntukKelas(student.classId);
        } else if (user?.role === 'teacher') {
            const teacher = getTeachers().find((t) => t.id === user.id);
            if (teacher) return getPengumumanAdminUntukGuru(teacher.classIds);
        }
        return getPengumumanAdmin();
    }, [user, storeVersion]);

    return (
        <div className="space-y-5 max-w-[1400px] mx-auto p-2 antialiased text-slate-600">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Pengumuman Sekolah</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Informasi resmi dan pemberitahuan penting dari sekolah.
                    </p>
                </div>
            </div>

            <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {pengumumanAdmin.map((item) => (
                        <article
                            key={item.id}
                            className="border border-slate-200 rounded-lg p-4 flex flex-col justify-between bg-white hover:border-slate-300 transition-colors"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                                    <h3 className="text-sm font-bold text-slate-800 break-words">{item.title}</h3>
                                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                        {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed whitespace-pre-line mb-3">
                                    {item.message}
                                </p>
                            </div>

                            {item.imageDataUrl && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPreviewImage({ src: item.imageDataUrl || '', title: item.title })
                                    }
                                    className="group relative mt-2 block w-full aspect-video overflow-hidden rounded border border-slate-200 bg-slate-50 cursor-zoom-in hover:border-slate-900 transition-colors"
                                >
                                    <img
                                        src={item.imageDataUrl}
                                        alt={item.imageName || item.title}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-[1.01]"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors" />
                                </button>
                            )}
                        </article>
                    ))}
                    {pengumumanAdmin.length === 0 && (
                        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 py-12 text-center text-sm text-slate-400 font-medium bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            Belum ada pengumuman sekolah saat ini.
                        </div>
                    )}
                </div>
            </section>

            {/* Image Preview Overlay Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-[120] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="relative max-w-4xl w-full flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 shadow-2xl">
                        <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 bg-white">
                            <span className="text-xs font-bold text-slate-800 truncate pr-4">
                                {previewImage.title}
                            </span>
                            <button
                                type="button"
                                onClick={() => setPreviewImage(null)}
                                className="text-slate-500 hover:text-slate-950 p-1.5 rounded border border-slate-200 hover:border-slate-900 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-3 bg-slate-50/50 flex items-center justify-center">
                            <img
                                src={previewImage.src}
                                alt={previewImage.title}
                                className="max-h-[75vh] w-auto h-auto object-contain rounded border border-slate-200/60 shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

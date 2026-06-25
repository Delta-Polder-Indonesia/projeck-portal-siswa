import { useMemo } from 'react';
import { getClasses, getTeachers } from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';

export default function DaftarNamaGuru() {
    const storeVersion = useStoreVersion();

    const daftarGuru = useMemo(() => {
        const classes = getClasses();
        return getTeachers().map((item) => ({
            id: item.id,
            name: item.name,
            subject: item.subject,
            avatar: item.avatar,
            whatsapp: item.whatsapp || item.phone || '',
            kelasAjar:
                item.classIds
                    .map((classId) => classes.find((classItem) => classItem.id === classId)?.name || '')
                    .filter(Boolean)
                    .join(', ') || '-',
        }));
    }, [storeVersion]);

    return (
        <div className="w-full bg-white p-4 text-xs text-slate-700 antialiased selection:bg-slate-200 space-y-4">
            {/* Header */}
            <div className="border-b border-slate-300 pb-4 mb-6">
                <h1 className="text-base font-bold text-slate-900 tracking-tight uppercase">
                    Daftar Nama Guru
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                    Informasi profil korespondensi staf pengajar dan kurikulum.
                </p>
            </div>

            {/* Tabel */}
            <div className="overflow-x-auto border border-slate-300 bg-white">
                <table className="w-full min-w-[800px] text-xs border-collapse">
                    <thead>
                        <tr className="border-b border-slate-300 bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                            <th className="text-left py-3 px-4 w-10">No</th>
                            <th className="text-left py-3 px-4 w-14">Profil</th>
                            <th className="text-left py-3 px-4">Nama Guru</th>
                            <th className="text-left py-3 px-4 w-48">Mata Pelajaran</th>
                            <th className="text-left py-3 px-4 w-56">Kelas Binaan</th>
                            <th className="text-right py-3 px-4 w-40">Kontak WhatsApp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                        {daftarGuru.map((guru, index) => (
                            <tr key={guru.id}>
                                <td className="py-3 px-4 text-slate-400 font-semibold">
                                    {index + 1}
                                </td>
                                <td className="py-3 px-4">
                                    {guru.avatar ? (
                                        <img
                                            src={guru.avatar}
                                            alt={guru.name}
                                            className="w-8 h-8 border border-slate-300 object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-300 text-xs">
                                            {guru.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </td>
                                <td className="py-3 px-4 font-bold text-slate-900">
                                    {guru.name}
                                </td>
                                <td className="py-3 px-4 text-slate-600">
                                    {guru.subject}
                                </td>
                                <td
                                    className="py-3 px-4 text-slate-600 truncate max-w-[200px]"
                                    title={guru.kelasAjar}
                                >
                                    {guru.kelasAjar}
                                </td>
                                <td className="py-3 px-4 text-right">
                                    {guru.whatsapp ? (
                                        <a
                                            href={`https://wa.me/${guru.whatsapp.replace(/[^\d]/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-block border border-slate-900 bg-white text-slate-900 text-xs font-semibold px-3 py-1"
                                        >
                                            {guru.whatsapp}
                                        </a>
                                    ) : (
                                        <span className="text-slate-300 px-4">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {daftarGuru.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-8 text-center text-xs text-slate-400 bg-slate-50 border-t border-slate-200"
                                >
                                    Tidak ada data guru yang ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
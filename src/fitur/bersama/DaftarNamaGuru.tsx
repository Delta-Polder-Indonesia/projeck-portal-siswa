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
        <div className="max-w-5xl mx-auto p-4 antialiased text-slate-700 bg-white">
            {/* Header Judul - Polos & Menyatu Tanpa Box Container */}
            <div className="border-b border-slate-200 pb-3 mb-4">
                <h1 className="text-sm font-bold text-slate-900 tracking-tight">Daftar Nama Guru</h1>
                <p className="text-[11px] text-slate-500 mt-0.5">
                    Informasi profil korespondensi staf pengajar dan kurikulum.
                </p>
            </div>

            {/* Area Tabel Data Tradisional */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-xs">
                    <thead>
                        <tr className="border-b border-slate-300 text-slate-800 font-bold bg-white">
                            <th className="text-left py-2 px-2 w-10">No</th>
                            <th className="text-left py-2 px-2 w-12">Profil</th>
                            <th className="text-left py-2 px-2">Nama Guru</th>
                            <th className="text-left py-2 px-2 w-40">Mata Pelajaran</th>
                            <th className="text-left py-2 px-2 w-44">Kelas Binaan</th>
                            <th className="text-right py-2 px-2 w-32">Kontak</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {daftarGuru.map((guru, index) => (
                            <tr key={guru.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-2 px-2 text-slate-400 font-semibold">{index + 1}</td>
                                <td className="py-2 px-2">
                                    {guru.avatar ? (
                                        <img
                                            src={guru.avatar}
                                            alt={guru.name}
                                            className="w-6 h-6 border border-slate-200 object-cover"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200 text-[10px]">
                                            {guru.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </td>
                                <td className="py-2 px-2 font-bold text-slate-900">{guru.name}</td>
                                <td className="py-2 px-2 text-slate-600 text-[11px]">{guru.subject}</td>
                                <td className="py-2 px-2 text-slate-600 text-[11px] truncate max-w-[170px]" title={guru.kelasAjar}>
                                    {guru.kelasAjar}
                                </td>
                                <td className="py-2 px-2 text-right">
                                    {guru.whatsapp ? (
                                        <a
                                            href={`https://wa.me/${guru.whatsapp.replace(/[^\d]/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-block border border-slate-300 hover:border-slate-900 text-slate-800 text-[11px] font-semibold px-2 py-0.5 transition-colors bg-white"
                                        >
                                            {guru.whatsapp}
                                        </a>
                                    ) : (
                                        <span className="text-slate-300 px-2">-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {daftarGuru.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-6 text-center text-[11px] text-slate-400">
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
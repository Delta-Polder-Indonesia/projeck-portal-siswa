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
        <div className="w-full h-full p-6 md:p-8 lg:p-10 antialiased text-slate-700 bg-white">
            {/* Header Judul - Polos & Menyatu */}
            <div className="border-b border-slate-200 pb-4 mb-6">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daftar Nama Guru</h1>
                <p className="text-sm text-slate-500 mt-2">
                    Informasi profil korespondensi staf pengajar dan kurikulum.
                </p>
            </div>

            {/* Area Tabel Data Tradisional */}
            <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
                <table className="w-full min-w-[800px] text-sm">
                    <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-xs">
                            <th className="text-left py-3 px-4 w-12">No</th>
                            <th className="text-left py-3 px-4 w-16">Profil</th>
                            <th className="text-left py-3 px-4">Nama Guru</th>
                            <th className="text-left py-3 px-4 w-48">Mata Pelajaran</th>
                            <th className="text-left py-3 px-4 w-56">Kelas Binaan</th>
                            <th className="text-right py-3 px-4 w-40">Kontak WhatsApp</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {daftarGuru.map((guru, index) => (
                            <tr key={guru.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 px-4 text-slate-400 font-semibold">{index + 1}</td>
                                <td className="py-3 px-4">
                                    {guru.avatar ? (
                                        <img
                                            src={guru.avatar}
                                            alt={guru.name}
                                            className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center border border-slate-200 text-xs">
                                            {guru.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </td>
                                <td className="py-3 px-4 font-bold text-slate-900">{guru.name}</td>
                                <td className="py-3 px-4 text-slate-600">{guru.subject}</td>
                                <td className="py-3 px-4 text-slate-600 truncate max-w-[200px]" title={guru.kelasAjar}>
                                    {guru.kelasAjar}
                                </td>
                                <td className="py-3 px-4 text-right">
                                    {guru.whatsapp ? (
                                        <a
                                            href={`https://wa.me/${guru.whatsapp.replace(/[^\d]/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-block border border-slate-300 hover:border-slate-800 hover:bg-slate-50 text-slate-800 text-xs font-semibold px-3 py-1 rounded transition-colors bg-white shadow-sm"
                                        >
                                            {guru.whatsapp}
                                        </a>
                                    ) : (
                                        <span className="text-slate-300 px-4">-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {daftarGuru.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-sm text-slate-500 bg-slate-50">
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
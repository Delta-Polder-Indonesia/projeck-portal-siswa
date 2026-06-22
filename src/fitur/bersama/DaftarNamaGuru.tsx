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
        <div className="space-y-4 max-w-[1400px] mx-auto p-2 antialiased text-slate-600">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h1 className="text-xl font-bold text-slate-800">Daftar Nama Guru</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Informasi profil korespondensi staf pengajar dan kurikulum.
                </p>
            </div>

            <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-500 font-semibold bg-slate-50/50">
                                <th className="text-left py-3 px-4 w-12 rounded-tl-lg">No</th>
                                <th className="text-left py-3 px-4 w-16">Profil</th>
                                <th className="text-left py-3 px-4">Nama Guru</th>
                                <th className="text-left py-3 px-4 w-48">Mata Pelajaran</th>
                                <th className="text-left py-3 px-4 w-48">Kelas Binaan</th>
                                <th className="text-right py-3 px-4 w-36 rounded-tr-lg">Kontak</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {daftarGuru.map((guru, index) => (
                                <tr key={guru.id} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="py-3 px-4 text-slate-400 font-semibold">{index + 1}</td>
                                    <td className="py-3 px-4">
                                        {guru.avatar ? (
                                            <img
                                                src={guru.avatar}
                                                alt={guru.name}
                                                className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 font-bold flex items-center justify-center border border-sky-100">
                                                {guru.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 font-semibold text-slate-800">{guru.name}</td>
                                    <td className="py-3 px-4 text-slate-500">{guru.subject}</td>
                                    <td className="py-3 px-4 text-slate-500">{guru.kelasAjar}</td>
                                    <td className="py-3 px-4 text-right">
                                        {guru.whatsapp ? (
                                            <a
                                                href={`https://wa.me/${guru.whatsapp.replace(/[^\d]/g, '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-block border border-slate-200 hover:border-slate-800 hover:bg-slate-800 hover:text-white text-slate-700 font-semibold px-3 py-1.5 rounded transition-all shadow-sm"
                                            >
                                                {guru.whatsapp}
                                            </a>
                                        ) : (
                                            <span className="text-slate-300">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {daftarGuru.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-400">
                                        Tidak ada data guru yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

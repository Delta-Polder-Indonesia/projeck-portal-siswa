import { useState } from 'react';
import TabAkunSiswa from './components/TabAkunSiswa';
import TabTambahSiswa from './components/TabTambahSiswa';

type StudentAdminTab = 'akun-siswa' | 'tambah-siswa';

interface AdminSiswaPanelProps {
    setNotice: (msg: string) => void;
    scope: 'teacher' | 'student';
}

export default function AdminSiswaPanel({ setNotice }: AdminSiswaPanelProps) {
    const [activeStudentTab, setActiveStudentTab] = useState<StudentAdminTab>('akun-siswa');

    return (
        <section className="flex flex-col h-full w-full p-3 bg-gray-50/30">
            <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto shrink-0 scrollbar-hide">
                <button
                    onClick={() => setActiveStudentTab('akun-siswa')}
                    className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${activeStudentTab === 'akun-siswa'
                            ? 'bg-gray-800 text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    Pengaturan Akun Siswa
                </button>
                <button
                    onClick={() => setActiveStudentTab('tambah-siswa')}
                    className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${activeStudentTab === 'tambah-siswa'
                            ? 'bg-gray-800 text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    Input Siswa Baru (PPDB)
                </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-2 bg-white rounded-md border border-gray-200 p-4 shadow-sm">
                {activeStudentTab === 'akun-siswa' && <TabAkunSiswa setNotice={setNotice} />}
                {activeStudentTab === 'tambah-siswa' && <TabTambahSiswa setNotice={setNotice} />}
            </div>
        </section>
    );
}

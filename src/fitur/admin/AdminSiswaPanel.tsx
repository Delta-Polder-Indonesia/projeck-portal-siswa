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
        <section className="space-y-4">
            <div className="grid grid-cols-2 gap-1 rounded-lg border border-gray-200 bg-white p-1 md:grid-cols-2 lg:w-1/2">
                <button
                    onClick={() => setActiveStudentTab('akun-siswa')}
                    className={`px-3 py-1.5 rounded-md text-sm ${activeStudentTab === 'akun-siswa' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    Pengaturan Akun Siswa
                </button>
                <button
                    onClick={() => setActiveStudentTab('tambah-siswa')}
                    className={`px-3 py-1.5 rounded-md text-sm ${activeStudentTab === 'tambah-siswa' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    Input Siswa Baru (PPDB)
                </button>
            </div>

            {activeStudentTab === 'akun-siswa' && <TabAkunSiswa setNotice={setNotice} />}
            {activeStudentTab === 'tambah-siswa' && <TabTambahSiswa setNotice={setNotice} />}
        </section>
    );
}

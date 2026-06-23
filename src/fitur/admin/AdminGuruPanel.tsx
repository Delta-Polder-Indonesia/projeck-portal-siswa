import { useState, useMemo } from 'react';
import TabKelolaKelas from './components/TabKelolaKelas';
import TabTambahGuru from './components/TabTambahGuru';
import TabAkunGuru from './components/TabAkunGuru';
import TabTagihanSekolah from './components/TabTagihanSekolah';
import TabPengumumanAdmin from './components/TabPengumumanAdmin';
import { getTeachers, getClasses } from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';

type TeacherAdminTab = 'kelas' | 'tambah-guru' | 'akun-guru' | 'tagihan' | 'pengumuman-admin';

interface AdminGuruPanelProps {
    setNotice: (msg: string) => void;
    scope: 'teacher' | 'student';
}

export default function AdminGuruPanel({ setNotice, scope }: AdminGuruPanelProps) {
    const storeVersion = useStoreVersion();
    const [activeTeacherTab, setActiveTeacherTab] = useState<TeacherAdminTab>('kelas');

    const teachers = useMemo(() => getTeachers(), [storeVersion]);
    const classes = useMemo(() => getClasses(), [storeVersion]);

    const teacherCountByClass = useMemo(() => {
        const countMap = new Map<string, number>();
        classes.forEach((item) => {
            if (!item.teacherId) {
                countMap.set(item.id, 0);
                return;
            }
            countMap.set(item.id, 1);
        });
        return countMap;
    }, [classes]);

    return (
        <section className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="text-xs text-gray-500">Total Guru</p>
                    <p className="text-2xl font-semibold text-gray-800">{teachers.length}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="text-xs text-gray-500">Total Kelas</p>
                    <p className="text-2xl font-semibold text-gray-800">{classes.length}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                    <p className="text-xs text-gray-500">Kelas Sudah Terisi Guru</p>
                    <p className="text-2xl font-semibold text-gray-800">
                        {Array.from(teacherCountByClass.values()).filter((value) => value > 0).length}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-1 rounded-lg border border-gray-200 bg-white p-1 md:grid-cols-5">
                <button
                    onClick={() => setActiveTeacherTab('kelas')}
                    className={`px-3 py-1.5 rounded-md text-sm ${activeTeacherTab === 'kelas' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    Kelola Kelas
                </button>
                <button
                    onClick={() => setActiveTeacherTab('tambah-guru')}
                    className={`px-3 py-1.5 rounded-md text-sm ${activeTeacherTab === 'tambah-guru' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    Tambah Guru
                </button>
                <button
                    onClick={() => setActiveTeacherTab('akun-guru')}
                    className={`px-3 py-1.5 rounded-md text-sm ${activeTeacherTab === 'akun-guru' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    Pengaturan Akun Guru
                </button>
                <button
                    onClick={() => setActiveTeacherTab('tagihan')}
                    className={`px-3 py-1.5 rounded-md text-sm ${activeTeacherTab === 'tagihan' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    Tagihan Sekolah
                </button>
                <button
                    onClick={() => setActiveTeacherTab('pengumuman-admin')}
                    className={`px-3 py-1.5 rounded-md text-sm ${activeTeacherTab === 'pengumuman-admin' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    Pengumuman Admin
                </button>
            </div>

            {activeTeacherTab === 'kelas' && <TabKelolaKelas setNotice={setNotice} />}
            {activeTeacherTab === 'tambah-guru' && <TabTambahGuru setNotice={setNotice} />}
            {activeTeacherTab === 'akun-guru' && <TabAkunGuru setNotice={setNotice} />}
            {activeTeacherTab === 'tagihan' && <TabTagihanSekolah setNotice={setNotice} scope={scope} />}
            {activeTeacherTab === 'pengumuman-admin' && <TabPengumumanAdmin setNotice={setNotice} scope={scope} />}
        </section>
    );
}

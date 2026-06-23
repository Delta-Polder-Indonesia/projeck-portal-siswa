import { useState, useMemo } from 'react';
import {
    Building2,
    UserPlus,
    UserCog,
    Receipt,
    Megaphone,
    ChevronRight,
} from 'lucide-react';
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

const SIDEBAR_MENU: { id: TeacherAdminTab; label: string; icon: typeof Building2 }[] = [
    { id: 'kelas', label: 'Kelola Kelas', icon: Building2 },
    { id: 'tambah-guru', label: 'Tambah Guru', icon: UserPlus },
    { id: 'akun-guru', label: 'Akun Guru', icon: UserCog },
    { id: 'tagihan', label: 'Tagihan Sekolah', icon: Receipt },
    { id: 'pengumuman-admin', label: 'Pengumuman Admin', icon: Megaphone },
];

export default function AdminGuruPanel({ setNotice, scope }: AdminGuruPanelProps) {
    const storeVersion = useStoreVersion();
    const [activeTab, setActiveTab] = useState<TeacherAdminTab>('kelas');

    const teachers = useMemo(() => getTeachers(), [storeVersion]);
    const classes = useMemo(() => getClasses(), [storeVersion]);

    const teacherCountByClass = useMemo(() => {
        const countMap = new Map<string, number>();
        classes.forEach((item) => {
            countMap.set(item.id, item.teacherId ? 1 : 0);
        });
        return countMap;
    }, [classes]);

    const filledClassCount = Array.from(teacherCountByClass.values()).filter((v) => v > 0).length;
    const activeMenu = SIDEBAR_MENU.find((m) => m.id === activeTab);

    return (
        <section className="flex h-full w-full gap-3 p-3 bg-gray-50/30">
            {/* ═══════════ SIDEBAR KIRI ═══════════ */}
            <aside className="w-44 shrink-0 space-y-3 self-start flex flex-col max-h-full overflow-y-auto pr-1 scrollbar-hide">

                {/* KPI MINI STACK */}
                <div className="space-y-1 rounded-md border border-gray-200 bg-white p-2 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Ringkasan Data
                    </p>
                    {[
                        { label: 'Total Guru', value: teachers.length },
                        { label: 'Total Kelas', value: classes.length },
                        { label: 'Kelas Terisi', value: filledClassCount },
                    ].map((kpi) => (
                        <div
                            key={kpi.label}
                            className="flex items-center justify-between border-t border-gray-100 pt-1"
                        >
                            <span className="text-[10px] text-gray-500">{kpi.label}</span>
                            <span className="text-[11px] font-bold tabular-nums text-gray-800">
                                {kpi.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* NAV MENU */}
                <nav className="space-y-0.5 rounded-md border border-gray-200 bg-white p-1.5 shadow-sm">
                    <p className="px-1 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Menu Navigasi
                    </p>
                    {SIDEBAR_MENU.map((menu) => {
                        const isActive = activeTab === menu.id;
                        return (
                            <button
                                key={menu.id}
                                onClick={() => setActiveTab(menu.id)}
                                className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left transition-all ${isActive
                                        ? 'bg-gray-800 text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                    }`}
                            >
                                <menu.icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                <span className="flex-1 text-[11px] font-bold truncate tracking-wide">
                                    {menu.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* ═══════════ KONTEN UTAMA (EXPANDED) ═══════════ */}
            <main className="min-w-0 flex-1 flex flex-col h-full bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                {/* BREADCRUMB STRIP */}
                <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50/50 px-3 py-2 shrink-0">
                    <span className="text-[10px] text-gray-400 font-medium">Panel Admin</span>
                    <ChevronRight className="h-3 w-3 text-gray-300" />
                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">
                        {activeMenu?.label || '—'}
                    </span>
                </div>

                {/* TAB CONTENT - Mengambil sisa ruang layar */}
                <div className="flex-1 w-full overflow-y-auto p-4">
                    {activeTab === 'kelas' && <TabKelolaKelas setNotice={setNotice} />}
                    {activeTab === 'tambah-guru' && <TabTambahGuru setNotice={setNotice} />}
                    {activeTab === 'akun-guru' && <TabAkunGuru setNotice={setNotice} />}
                    {activeTab === 'tagihan' && <TabTagihanSekolah setNotice={setNotice} scope={scope} />}
                    {activeTab === 'pengumuman-admin' && <TabPengumumanAdmin setNotice={setNotice} scope={scope} />}
                </div>
            </main>
        </section>
    );
}
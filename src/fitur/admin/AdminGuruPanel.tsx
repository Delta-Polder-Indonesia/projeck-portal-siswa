import { useState, useMemo } from 'react';
import {
    Building2,
    UserPlus,
    UserCog,
    Receipt,
    Megaphone,
    ChevronRight,
    Users,        // ← icon untuk Akun Siswa
    ClipboardList, // ← icon untuk PPDB
} from 'lucide-react';
import TabKelolaKelas from './components/TabKelolaKelas';
import TabTambahGuru from './components/TabTambahGuru';
import TabAkunGuru from './components/TabAkunGuru';
import TabTagihanSekolah from './components/TabTagihanSekolah';
import TabPengumumanAdmin from './components/TabPengumumanAdmin';
import TabAkunSiswa from './components/TabAkunSiswa';       // ← import baru
import InboxPPDBAdmin from './InboxPPDBAdmin';               // ← import baru
import { getTeachers, getClasses } from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';

// ── Tambahkan dua id baru ──────────────────────────────────────────────────
type TeacherAdminTab =
    | 'kelas'
    | 'tambah-guru'
    | 'akun-guru'
    | 'tagihan'
    | 'pengumuman-admin'
    | 'akun-siswa'      // ← baru
    | 'tambah-siswa';   // ← baru

interface AdminGuruPanelProps {
    setNotice: (msg: string) => void;
    scope: 'teacher' | 'student';
}

// ── Pisahkan menu menjadi dua grup ────────────────────────────────────────
const MENU_GURU: { id: TeacherAdminTab; label: string; icon: typeof Building2 }[] = [
    { id: 'kelas',             label: 'Kelola Kelas',       icon: Building2  },
    { id: 'tambah-guru',       label: 'Tambah Guru',        icon: UserPlus   },
    { id: 'akun-guru',         label: 'Akun Guru',          icon: UserCog    },
    { id: 'tagihan',           label: 'Tagihan Sekolah',    icon: Receipt    },
    { id: 'pengumuman-admin',  label: 'Pengumuman Admin',   icon: Megaphone  },
];

const MENU_SISWA: { id: TeacherAdminTab; label: string; icon: typeof Building2 }[] = [
    { id: 'akun-siswa',    label: 'Akun Siswa',         icon: Users         },
    { id: 'tambah-siswa',  label: 'Input Siswa (PPDB)', icon: ClipboardList },
];

// ── Helper: render satu grup menu ─────────────────────────────────────────
function MenuGroup({
    title,
    items,
    activeTab,
    onSelect,
}: {
    title: string;
    items: typeof MENU_GURU;
    activeTab: TeacherAdminTab;
    onSelect: (id: TeacherAdminTab) => void;
}) {
    return (
        <nav className="space-y-1">
            <p className="px-1 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {title}
            </p>
            {items.map((menu) => {
                const isActive = activeTab === menu.id;
                return (
                    <button
                        key={menu.id}
                        onClick={() => onSelect(menu.id)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all ${
                            isActive
                                ? 'bg-blue-50 text-blue-600 font-bold'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                        <menu.icon
                            className={`h-4 w-4 shrink-0 ${
                                isActive ? 'text-blue-600' : 'text-gray-400'
                            }`}
                        />
                        <span className="flex-1 truncate text-[11px] tracking-wide">
                            {menu.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}

// ── Komponen utama ────────────────────────────────────────────────────────
export default function AdminGuruPanel({ setNotice, scope }: AdminGuruPanelProps) {
    const storeVersion = useStoreVersion();
    const [activeTab, setActiveTab] = useState<TeacherAdminTab>('kelas');

    const teachers = useMemo(() => getTeachers(), [storeVersion]);
    const classes   = useMemo(() => getClasses(),  [storeVersion]);

    const teacherCountByClass = useMemo(() => {
        const countMap = new Map<string, number>();
        classes.forEach((item) => {
            countMap.set(item.id, item.teacherId ? 1 : 0);
        });
        return countMap;
    }, [classes]);

    const filledClassCount = Array.from(teacherCountByClass.values()).filter((v) => v > 0).length;

    // Cari label aktif dari kedua grup sekaligus
    const activeMenu = [...MENU_GURU, ...MENU_SISWA].find((m) => m.id === activeTab);

    return (
        <section className="flex h-full w-full overflow-hidden bg-white">

            {/* ══ SUB-SIDEBAR ══════════════════════════════════════════════ */}
            <aside className="scrollbar-hide flex h-full max-h-full w-48 shrink-0 flex-col justify-between overflow-y-auto border-r border-gray-100 bg-white p-4">
                <div className="space-y-5">

                    {/* Grup Guru */}
                    <MenuGroup
                        title="Menu Guru"
                        items={MENU_GURU}
                        activeTab={activeTab}
                        onSelect={setActiveTab}
                    />

                    {/* Divider + Grup Siswa */}
                    <div className="border-t border-gray-100 pt-4">
                        <MenuGroup
                            title="Menu Siswa"
                            items={MENU_SISWA}
                            activeTab={activeTab}
                            onSelect={setActiveTab}
                        />
                    </div>

                    {/* KPI Ringkasan */}
                    <div className="space-y-1.5 border-t border-gray-100 pt-4">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Ringkasan Data
                        </p>
                        {[
                            { label: 'Total Guru',   value: teachers.length   },
                            { label: 'Total Kelas',  value: classes.length    },
                            { label: 'Kelas Terisi', value: filledClassCount  },
                        ].map((kpi) => (
                            <div
                                key={kpi.label}
                                className="flex items-center justify-between py-0.5"
                            >
                                <span className="text-[11px] text-gray-500">{kpi.label}</span>
                                <span className="text-[11px] font-bold tabular-nums text-gray-800">
                                    {kpi.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* ══ KONTEN UTAMA ═════════════════════════════════════════════ */}
            <main className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-white">

                {/* Breadcrumb */}
                <div className="flex shrink-0 items-center gap-1.5 border-b border-gray-100 bg-white px-5 py-3">
                    <span className="text-[11px] font-medium text-gray-400">Panel Admin</span>
                    <ChevronRight className="h-3 w-3 text-gray-300" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                        {activeMenu?.label || '—'}
                    </span>
                </div>

                {/* Tab Content */}
                <div className="flex-1 w-full overflow-y-auto p-5">
                    {activeTab === 'kelas'            && <TabKelolaKelas    setNotice={setNotice} />}
                    {activeTab === 'tambah-guru'       && <TabTambahGuru     setNotice={setNotice} />}
                    {activeTab === 'akun-guru'         && <TabAkunGuru       setNotice={setNotice} />}
                    {activeTab === 'tagihan'           && <TabTagihanSekolah setNotice={setNotice} scope={scope} />}
                    {activeTab === 'pengumuman-admin'  && <TabPengumumanAdmin setNotice={setNotice} scope={scope} />}

                    {/* ↓ dua menu baru dari AdminSiswaPanel */}
                    {activeTab === 'akun-siswa'    && <TabAkunSiswa   setNotice={setNotice} />}
                    {activeTab === 'tambah-siswa'  && <InboxPPDBAdmin setNotice={setNotice} />}
                </div>
            </main>
        </section>
    );
}
import { useState, useMemo, Suspense } from 'react';
import PerpusDashboard from './AdminPerpustakaan/PerpusDashboard';
import PerpusInventori from './AdminPerpustakaan/PerpusInventori';
import PerpusMasterData from './AdminPerpustakaan/PerpusMasterData';
import PerpusTransaksi from './AdminPerpustakaan/PerpusTransaksi';
import PerpusDetailBuku from './AdminPerpustakaan/PerpusDetailBuku';
import {
    Building2,
    UserPlus,
    Users,
    CreditCard,
    Megaphone,
    LayoutDashboard,
    Box,
    Database,
    ArrowLeftRight,
    ChevronRight,
    UserCheck,
    CalendarDays
} from 'lucide-react';
import TabKelolaKelas from './components/TabKelolaKelas';
import TabTambahGuru from './components/TabTambahGuru';
import TabAkunGuru from './components/TabAkunGuru';
import TabTagihanSekolah from './components/TabTagihanSekolah';
import TabPengumumanAdmin from './components/TabPengumumanAdmin';
import TabAkunSiswa from './components/TabAkunSiswa';
import TabKelolaRoster from './components/TabKelolaRoster';
import AdminPanel from '../penerimaan-siswa-baru/AdminPanel';
import { getTeachers, getClasses } from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';

// ── Tab IDs ────────────────────────────────────────────────────────────────
type TeacherAdminTab =
    | 'kelas'
    | 'tambah-guru'
    | 'akun-guru'
    | 'tagihan'
    | 'pengumuman-admin'
    | 'akun-siswa'
    | 'kelola-roster'
    | 'ppdb-admin'
    | 'perpus-dashboard'
    | 'perpus-inventori'
    | 'perpus-master-anggota'
    | 'perpus-master-buku'
    | 'perpus-master-kategori'
    | 'perpus-master-penerbit'
    | 'perpus-master-rak'
    | 'perpus-transaksi-pinjam'
    | 'perpus-transaksi-kembali'
    | 'perpus-detail';

interface AdminGuruPanelProps {
    setNotice?: (msg: string) => void;
    scope: 'teacher' | 'student';
    open?: boolean;
    onClose?: () => void;
    preAuthorized?: boolean;
}

// ── Unified Menu Master ──────────────────────────────────────────────────
const MENU_MASTER = [
    { id: 'kelas', label: 'Kelola Kelas', icon: Building2 },
    { id: 'akun-guru', label: 'Daftar Guru', icon: Users },
    { id: 'tambah-guru', label: 'Tambah Guru', icon: UserPlus },
    { id: 'akun-siswa', label: 'Daftar Siswa', icon: UserCheck },
    { id: 'ppdb-admin', label: 'Kelola PPDB', icon: Users },
    { id: 'kelola-roster', label: 'Kelola Roster', icon: CalendarDays },
    { id: 'tagihan', label: 'Tagihan SPP', icon: CreditCard },
    { id: 'pengumuman-admin', label: 'Pengumuman', icon: Megaphone },
] as const;

// ── Grup sidebar kiri: hanya untuk tampilan ──────────────────────────────
const MENU_MASTER_GROUPS = [
    {
        title: 'Akademik',
        items: [
            { id: 'kelas', label: 'Kelola Kelas', icon: Building2 },
            { id: 'kelola-roster', label: 'Kelola Roster', icon: CalendarDays },
        ],
    },
    {
        title: 'Guru',
        items: [
            { id: 'akun-guru', label: 'Daftar Guru', icon: Users },
            { id: 'tambah-guru', label: 'Tambah Guru', icon: UserPlus },
        ],
    },
    {
        title: 'Siswa',
        items: [
            { id: 'akun-siswa', label: 'Daftar Siswa', icon: UserCheck },
            { id: 'ppdb-admin', label: 'Kelola PPDB', icon: Users },
        ],
    },
    {
        title: 'Administrasi',
        items: [
            { id: 'tagihan', label: 'Tagihan SPP', icon: CreditCard },
            { id: 'pengumuman-admin', label: 'Pengumuman', icon: Megaphone },
        ],
    },
] as const;

const MENU_PERPUS = [
    { id: 'perpus-dashboard', label: 'Dashboard Perpus', icon: LayoutDashboard },
    { id: 'perpus-inventori', label: 'Inventori Buku', icon: Box },
    { id: 'perpus-master-anggota', label: 'Data Anggota', icon: Database },
    { id: 'perpus-transaksi-pinjam', label: 'Peminjaman', icon: ArrowLeftRight },
    { id: 'perpus-transaksi-kembali', label: 'Pengembalian', icon: ArrowLeftRight },
] as const;

// ── Helper: render grup menu ─────────────────────────────────────────────
function MenuRenderer({
    items,
    activeTab,
    onSelect,
}: {
    items: readonly { id: string; label: string; icon: any }[];
    activeTab: TeacherAdminTab;
    onSelect: (id: string) => void;
}) {
    return (
        <nav className="space-y-0.5">
            {items.map((menu) => {
                const isActive = activeTab === menu.id;
                return (
                    <button
                        key={menu.id}
                        onClick={() => onSelect(menu.id)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all ${isActive
                                ? 'bg-blue-50 text-blue-600 font-bold'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <menu.icon
                            className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'
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
export default function AdminMasterPanel({
    setNotice,
    open,
    onClose,
    preAuthorized: _preAuthorized,
}: AdminGuruPanelProps) {
    const storeVersion = useStoreVersion();
    const [activeTab, setActiveTab] = useState<TeacherAdminTab>('kelas');
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);

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

    const isPerpusTab = activeTab.startsWith('perpus-');

    const handleViewDetail = (bookId: string) => {
        setSelectedBookId(bookId);
        setActiveTab('perpus-detail' as TeacherAdminTab);
    };

    const handleBackToInventori = () => {
        setSelectedBookId(null);
        setActiveTab('perpus-inventori');
    };

    const activeMenu = [...MENU_MASTER, ...MENU_PERPUS].find((m) => m.id === activeTab);

    const [localNotice, setLocalNotice] = useState('');
    const notice = localNotice;
    const handleNotice = (msg: string) => {
        setNotice?.(msg);
        setLocalNotice(msg);
    };

    const isModal = open !== undefined;
    if (isModal && !open) return null;

    const panel = (
        <section className="flex h-full w-full overflow-hidden bg-white">
            {/* ══ SUB-SIDEBAR ══════════════════════════════════════════════ */}
            <aside className="scrollbar-hide flex h-full max-h-full w-48 shrink-0 flex-col justify-between overflow-y-auto border-r border-gray-100 bg-white p-4">
                <div className="space-y-5">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-sm font-black tracking-tighter text-blue-800 uppercase">
                            Tata usaha
                        </h2>
                        <p className="text-[9px] font-bold text-blue-400 tracking-widest uppercase">
                            Portal Kendali Pusat
                        </p>
                    </div>

                    <div className="space-y-4">
                        {MENU_MASTER_GROUPS.map((group) => (
                            <div key={group.title}>
                                <p className="px-3 mb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    {group.title}
                                </p>
                                <div className="px-2">
                                    <MenuRenderer
                                        items={group.items}
                                        activeTab={activeTab}
                                        onSelect={(id) => setActiveTab(id as TeacherAdminTab)}
                                    />
                                </div>
                            </div>
                        ))}

                        <div>
                            <p className="px-3 mb-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Perpustakaan
                            </p>
                            <div className="px-2">
                                <MenuRenderer
                                    items={MENU_PERPUS}
                                    activeTab={activeTab}
                                    onSelect={(id) => setActiveTab(id as TeacherAdminTab)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* KPI Ringkasan */}
                    <div className="space-y-1.5 border-t border-gray-100 pt-4">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Ringkasan Data
                        </p>
                        {[
                            { label: 'Total Guru', value: teachers.length },
                            { label: 'Total Kelas', value: classes.length },
                            { label: 'Kelas Terisi', value: filledClassCount },
                        ].map((kpi) => (
                            <div key={kpi.label} className="flex items-center justify-between py-0.5">
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
                        {isPerpusTab ? 'Perpustakaan' : activeMenu?.label || '—'}
                    </span>
                    {isPerpusTab && activeMenu && (
                        <>
                            <ChevronRight className="h-3 w-3 text-gray-300" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                                {activeMenu.label}
                            </span>
                        </>
                    )}
                </div>

                {/* Tab Content */}
                <div className="flex-1 w-full overflow-y-auto p-5 bg-white">
                    {activeTab === 'kelas' && <TabKelolaKelas setNotice={handleNotice} />}
                    {activeTab === 'tambah-guru' && <TabTambahGuru setNotice={handleNotice} />}
                    {activeTab === 'akun-guru' && <TabAkunGuru setNotice={handleNotice} />}
                    {activeTab === 'tagihan' && <TabTagihanSekolah setNotice={handleNotice} scope="teacher" />}
                    {activeTab === 'pengumuman-admin' && <TabPengumumanAdmin setNotice={handleNotice} scope="teacher" />}
                    {activeTab === 'akun-siswa' && <TabAkunSiswa setNotice={handleNotice} />}
                    {activeTab === 'ppdb-admin' && <AdminPanel onClose={() => setActiveTab('akun-siswa')} embedded />}
                    {activeTab === 'kelola-roster' && <TabKelolaRoster setNotice={handleNotice} />}

                    {/* Menu Perpustakaan */}
                    <Suspense
                        fallback={
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
                            </div>
                        }
                    >
                        {activeTab === 'perpus-dashboard' && <PerpusDashboard />}
                        {activeTab === 'perpus-inventori' && (
                            <PerpusInventori onViewDetail={handleViewDetail} />
                        )}
                        {activeTab.startsWith('perpus-master-') && (
                            <PerpusMasterData activeSubTab={activeTab.replace('perpus-master-', '')} />
                        )}
                        {activeTab.startsWith('perpus-transaksi-') && (
                            <PerpusTransaksi
                                activeSubTab={
                                    activeTab.replace('perpus-transaksi-', '') as 'pinjam' | 'kembali'
                                }
                            />
                        )}
                        {activeTab === 'perpus-detail' && (
                            <PerpusDetailBuku
                                bookId={selectedBookId}
                                onBack={handleBackToInventori}
                            />
                        )}
                    </Suspense>

                    {notice && (
                        <div className="fixed bottom-4 right-4 z-50 rounded bg-green-600 px-4 py-2 text-xs text-white shadow-lg">
                            {notice}
                        </div>
                    )}
                </div>
            </main>
        </section>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 z-[100] flex items-stretch bg-white">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 z-10 rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500 shadow hover:text-red-600"
                >
                    ✕ Tutup
                </button>
                {panel}
            </div>
        );
    }

    return panel;
}

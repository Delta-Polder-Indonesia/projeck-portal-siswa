import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  LogOut,
  Settings,
  Calendar,
  Menu,
  X,
  Briefcase,
  Megaphone,
  BookOpen,
  BookOpenCheck,
  Mail,
  WalletCards,
  Home,
  AlignJustify,
  Inbox,
  FileText,
  Bell,
  User,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ activePage, onNavigate, collapsed: sidebarCollapsed, onToggleCollapse: setSidebarCollapsed }: SidebarProps) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const avatarInitial = (user?.name || '?').charAt(0).toUpperCase();

  const isTeacher = user?.role === 'teacher';

  const menuSections = [
    {
      title: "MENU UTAMA",
      items: isTeacher
        ? [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'attendance', label: 'Input Absensi', icon: ClipboardCheck }
        ]
        : [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'roster', label: 'Roster Kelas', icon: ClipboardCheck },
          { id: 'history', label: 'Riwayat Absensi', icon: Calendar }
        ]
    },
    {
      title: "AKADEMIK & TUGAS",
      items: isTeacher
        ? [
          { id: 'assignment-settings', label: 'Atur Tugas Online', icon: Briefcase },
          { id: 'rapot-input', label: 'Input Rapot', icon: BookOpenCheck },
          { id: 'report', label: 'Laporan', icon: BarChart3 }
        ]
        : [
          { id: 'tasks', label: 'Kantong Tugas', icon: Briefcase },
          { id: 'rapot', label: 'Rapot Saya', icon: BookOpenCheck },
          { id: 'billing', label: 'Tagihan Sekolah', icon: WalletCards }
        ]
    },
    {
      title: "KOMUNIKASI",
      items: isTeacher
        ? [
          { id: 'letters-teacher', label: 'Kotak Surat', icon: Mail },
          { id: 'announcement-settings', label: 'Atur Pengumuman', icon: Megaphone }
        ]
        : [
          { id: 'letters-student', label: 'Kirim Surat', icon: Mail }
        ]
    }
  ];

  const activeColor = 'bg-sky-50 text-sky-600 font-bold shadow-sm';
  const avatarBg = isTeacher ? 'bg-blue-600' : 'bg-emerald-600';

  const topNavItems = [
    {
      id: 'school-announcements',
      icon: Home,
      label: 'Pengumuman Sekolah'
    },
    {
      id: 'toggle-sidebar',
      icon: AlignJustify,
      label: 'Menu',
      onClick: () => setSidebarCollapsed()
    },
    {
      id: 'personal-messages',
      icon: Inbox,
      label: 'Pesan Masuk'
    },
    {
      id: 'teacher-announcements',
      icon: FileText,
      label: 'Daftar Nama Guru'
    },
  ];

  const sidebarContent = (
    <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
      {menuSections.map((section) => (
        <div key={section.title} className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">
            {section.title}
          </p>

          {section.items.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? activeColor
                    : 'text-gray-600 hover:text-sky-600 hover:bg-gray-50'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Header atas */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-sky-500 shadow-md">
        <div className="flex items-center h-14 px-4">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-2 mr-4 pr-4 border-r border-white/30">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-white/20 bg-white/10 flex items-center justify-center p-1 shrink-0">
                <img
                  src={`${import.meta.env.BASE_URL}images/logo/logo-sekolah.svg`}
                  alt="Logo SMP 1 Majenang"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-sm leading-tight border-none p-0 m-0 bg-transparent">PORTAL SISWA</h1>
                <p className="text-sky-100 text-[10px] leading-tight m-0 p-0">SMP N 1 Majenang</p>
              </div>
            </div>

            {topNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      onNavigate(item.id);
                    }
                  }}
                  className={`p-2 rounded-lg transition-all mx-0.5 ${isActive
                    ? 'bg-white/20 text-white'
                    : 'text-sky-100 hover:bg-white/15 hover:text-white'
                    }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>


          <div className="flex items-center gap-1 ml-auto">
            <button
              onClick={() => onNavigate('announcement-settings')}
              className="p-2 rounded-lg text-sky-100 hover:bg-white/15 hover:text-white transition-all relative"
              title="Pengumuman"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-white/15 transition-all"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Foto profil"
                    className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs bg-white/20 border-2 border-white/30">
                    {avatarInitial}
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <p className="text-white text-xs font-medium leading-tight m-0">{user?.name || 'User'}</p>
                  <p className="text-sky-100 text-[10px] m-0">{isTeacher ? 'Guru' : 'Siswa'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-sky-100 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl z-50 overflow-hidden border border-gray-200">
                    <div className="p-4 bg-sky-50 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        {user?.avatar ? (
                          <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${avatarBg}`}>
                            {avatarInitial}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-gray-800 m-0">{user?.name}</p>
                          <p className="text-xs text-gray-500 m-0">{isTeacher ? 'Guru' : 'Siswa'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => { onNavigate('profile'); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-all"
                      >
                        <User className="w-4 h-4" />
                        Profil Saya
                      </button>
                      <button
                        onClick={() => { onNavigate('settings'); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-all"
                      >
                        <Settings className="w-4 h-4" />
                        Pengaturan
                      </button>
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <button
                        onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="h-14" />

      {/* Tombol menu mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-16 left-4 z-50 p-2 bg-sky-600 text-white rounded-xl shadow-lg"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40 top-14" onClick={() => setMobileOpen(false)} />
      )}

      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex md:flex-col bg-white border-r border-gray-200 min-h-[calc(100vh-3.5rem)] fixed left-0 top-14 bottom-0 z-30 transition-all duration-300 ${sidebarCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-64 opacity-100'
          }`}
      >
        {sidebarContent}
      </aside>

      {/* MOBILE SIDEBAR */}
      <aside className={`md:hidden fixed left-0 top-14 bottom-0 w-64 bg-white border-r border-gray-200 z-40 flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </aside>
    </>
  );
}
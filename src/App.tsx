import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { initializeData } from './data/store';
import LoginPage from './fitur/autentikasi/LoginPage';
import Sidebar from './layout/Sidebar';
import DasborGuru from './fitur/guru/DasborGuru';
import HalamanAbsensi from './fitur/guru/HalamanAbsensi';
import HalamanLaporan from './fitur/guru/HalamanLaporan';
import AturRosterGuru from './fitur/guru/AturRosterGuru';
import AturPengumumanGuru from './fitur/guru/AturPengumumanGuru';
import AturTugasOnlineGuru from './fitur/guru/AturTugasOnlineGuru';
import ProfilGuru from './fitur/guru/ProfilGuru';
import KotakSuratGuru from './fitur/guru/KotakSuratGuru';
import InputRapotGuru from './fitur/guru/InputRapotGuru';
import DasborMurid from './fitur/murid/DasborMurid';
import RiwayatAbsensi from './fitur/murid/RiwayatAbsensi';
import RosterKelas from './fitur/murid/RosterKelas';
import KantongTugas from './fitur/murid/KantongTugas';
import ProfilMurid from './fitur/murid/ProfilMurid';
import KirimSuratMurid from './fitur/murid/KirimSuratMurid';
import TagihanSekolah from './fitur/murid/TagihanSekolah';
import RapotSiswa from './fitur/murid/RapotSiswa';
import PengaturanAkun from './fitur/pengaturan/PengaturanAkun';
import ErrorBoundary from './fitur/bersama/ErrorBoundary';
import PengumumanSekolah from './fitur/bersama/PengumumanSekolah';
import DaftarNamaGuru from './fitur/bersama/DaftarNamaGuru';
import PesanMasuk from './fitur/bersama/PesanMasuk';

function AppContent() {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState('school-announcements');
  const [visitedPages, setVisitedPages] = useState<Record<string, boolean>>({ 'school-announcements': true });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Reset to default page when user changes
  useEffect(() => {
    setActivePage('school-announcements');
    setVisitedPages({ 'school-announcements': true });
  }, [user?.id]);

  useEffect(() => {
    setVisitedPages(prev => ({ ...prev, [activePage]: true }));
  }, [activePage]);

  const teacherPages: Record<string, ComponentType> = {
    dashboard: DasborGuru,
    attendance: HalamanAbsensi,
    report: HalamanLaporan,
    'roster-settings': AturRosterGuru,
    'announcement-settings': AturPengumumanGuru,
    'assignment-settings': AturTugasOnlineGuru,
    'letters-teacher': KotakSuratGuru,
    'rapot-input': InputRapotGuru,
    profile: ProfilGuru,
    settings: PengaturanAkun,
    'school-announcements': PengumumanSekolah,
    'personal-messages': PesanMasuk,
    'teacher-announcements': DaftarNamaGuru,
  };

  const studentPages: Record<string, ComponentType> = {
    dashboard: DasborMurid,
    roster: RosterKelas,
    history: RiwayatAbsensi,
    tasks: KantongTugas,
    'letters-student': KirimSuratMurid,
    rapot: RapotSiswa,
    billing: TagihanSekolah,
    profile: ProfilMurid,
    settings: PengaturanAkun,
    'school-announcements': PengumumanSekolah,
    'personal-messages': PesanMasuk,
    'teacher-announcements': DaftarNamaGuru,
  };

  const pages = user?.role === 'teacher' ? teacherPages : studentPages;

  useEffect(() => {
    if (user && !pages[activePage]) {
      setActivePage('school-announcements');
    }
  }, [activePage, user, pages]);

  if (!user) return <LoginPage />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
      <main className={`flex-1 transition-all duration-300 p-4 md:p-8 pt-16 md:pt-8 ${sidebarCollapsed ? 'md:ml-0' : 'md:ml-64'}`}>
        {Object.entries(pages).map(([pageId, PageComponent]) => {
          if (!visitedPages[pageId]) return null;
          return (
            <section key={pageId} className={activePage === pageId ? 'block' : 'hidden'}>
              <PageComponent />
            </section>
          );
        })}
      </main>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
}

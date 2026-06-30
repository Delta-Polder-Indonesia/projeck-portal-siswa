import { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import { ArrowLeft, Check, Download, Eye, FileText, LogOut, Printer, Search, Trash2, X, HelpCircle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ppdbService } from '../../services/ppdbService';
import { type PPDBAuditLog, type PPDBApplication, type PPDBApplicationStatus, type PPDBNotification } from '../../data/store';
import { jsPDF } from 'jspdf';
import { Mail, Bell, Folder, File, Download as DownloadIcon, LayoutGrid, List } from 'lucide-react';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export type AdminPanelProps = {
  onClose: () => void;
  embedded?: boolean;
};

export default function AdminPanel({ onClose, embedded = false }: AdminPanelProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | PPDBApplicationStatus>('ALL');
  const [filterJenjang, setFilterJenjang] = useState<string>('ALL');
  const [filterJalur, setFilterJalur] = useState<string>('ALL');
  const [selected, setSelected] = useState<PPDBApplication | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [loginError, setLoginError] = useState('');

  const [apps, setApps] = useState<PPDBApplication[]>([]);
  const [stats, setStats] = useState({
    total: 0, pending: 0, verified: 0, accepted: 0, rejected: 0,
    byJenjang: { SD: 0, SMP: 0, SMA: 0, SMK: 0 },
    byJalur: { REGULER: 0, ZONASI: 0, PRESTASI: 0, AFIRMASI: 0, PINDAHAN: 0 },
  });
  const [auditLogs, setAuditLogs] = useState<PPDBAuditLog[]>([]);
  const [notifications, setNotifications] = useState<PPDBNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [showAudit, setShowAudit] = useState(false);
  const [apiHealth, setApiHealth] = useState({
    mode: 'local', online: true, apiReachable: true,
    message: 'Memuat status koneksi...', checkedAt: new Date().toISOString(),
  });

  // Confirmation modal state
  const [confirmAction, setConfirmAction] = useState<{
    type: 'delete' | 'status';
    id: string;
    status?: PPDBApplicationStatus;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (embedded) {
      setShowLogin(false);
    } else {
      const isAuth = ppdbService.isAdminAuthenticated();
      setShowLogin(!isAuth);
    }
    refresh();
  }, [embedded]);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const state = await ppdbService.getApiHealth();
        setApiHealth(state);
      } catch {
        setApiHealth({
          mode: 'local', online: navigator.onLine, apiReachable: false,
          message: 'Tidak dapat memeriksa koneksi API', checkedAt: new Date().toISOString(),
        });
      }
    };
    void checkHealth();
    const timer = window.setInterval(() => void checkHealth(), 30000);
    const handleOnline = () => void checkHealth();
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOnline);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOnline);
    };
  }, []);

  useEffect(() => {
    setAdminNotesInput(selected?.adminNotes || '');
  }, [selected]);

  async function refresh() {
    const [data, s, logs, notifs, count, settings] = await Promise.all([
      ppdbService.getApplications(),
      ppdbService.getStatistics(),
      ppdbService.getAuditLogs(),
      ppdbService.getNotifications(),
      ppdbService.getUnreadCount(),
      ppdbService.getAdminSettings(),
    ]);
    setApps(data);
    setStats(s);
    setAuditLogs(logs);
    setNotifications(notifs);
    setUnreadCount(count);
    setAdminEmail(settings.email);
  }

  async function handleLogin() {
    const ok = await ppdbService.adminLogin(user, pass);
    if (!ok) {
      setLoginError('Username atau password salah.');
      return;
    }
    setShowLogin(false);
    setLoginError('');
  }

  function handleLogout() {
    ppdbService.adminLogout();
    setShowLogin(true);
    setUser('');
    setPass('');
  }

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      const keyword = search.toLowerCase();
      const matchSearch =
        a.namaLengkap.toLowerCase().includes(keyword) ||
        a.nisn.includes(search) ||
        a.registrationNo.toLowerCase().includes(search.toLowerCase()) ||
        a.nik.includes(search);
      const matchStatus = filterStatus === 'ALL' || a.status === filterStatus;
      const matchJenjang = filterJenjang === 'ALL' || a.jenjangTujuan === filterJenjang;
      const matchJalur = filterJalur === 'ALL' || a.jalurPendaftaran === filterJalur;
      return matchSearch && matchStatus && matchJenjang && matchJalur;
    });
  }, [apps, search, filterStatus, filterJenjang, filterJalur]);

  const handleUpdateStatus = async (id: string, status: PPDBApplicationStatus, verifiedBy?: string) => {
    const updated = await ppdbService.updateStatus(id, status, adminNotesInput || undefined, verifiedBy);
    if (updated) setSelected(updated as PPDBApplication);
    refresh();
  };

  const handleUpdateDoc = async (docKey: string, status: 'PENDING' | 'VALID' | 'INVALID') => {
    if (!selected) return;
    const updated = await ppdbService.updateDocumentStatus(selected.id, docKey, status);
    if (updated) setSelected(updated as PPDBApplication);
    refresh();
  };

  const handleDelete = (id: string) => {
    ppdbService.deleteApplication(id);
    if (selected?.id === id) setSelected(null);
    refresh();
  };

  const handleExportCSV = () => {
    const headers = [
      'No Registrasi', 'Nama', 'NIK', 'Jenjang', 'Sekolah Tujuan', 'Jalur',
      'Status', 'Tanggal Daftar', 'Nomor HP', 'Email',
    ];
    const rows = filtered.map((item) => [
      item.registrationNo, item.namaLengkap, item.nik, item.jenjangTujuan,
      item.sekolahTujuan || '', item.jalurPendaftaran, statusText(item.status),
      new Date(item.submittedAt).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      }),
      item.nomorHp, item.email,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekap-ppdb-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await ppdbService.updateAdminSettings({ email: adminEmail });
    setShowSettings(false);
    refresh();
  };

  const handleMarkRead = async (id: string) => {
    await ppdbService.markNotificationAsRead(id);
    refresh();
  };

  const handleDownloadData = (app: PPDBApplication) => {
    const dataStr = JSON.stringify(app, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ppdb_${app.registrationNo}_${app.namaLengkap.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    const dataStr = JSON.stringify(apps, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ppdb_all_applications_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintDetail = (app: PPDBApplication) => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    doc.setFontSize(16);
    doc.text('DETAIL PENDAFTARAN PPDB', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('No. Registrasi', 20, 32);
    doc.setFont('Helvetica', 'bold');
    doc.text(app.registrationNo, 70, 32);
    doc.setFont('Helvetica', 'normal');
    const dataRows = [
      ['Nama Lengkap', app.namaLengkap], ['NISN', app.nisn], ['NIK', app.nik],
      ['Tempat, Tanggal Lahir', `${app.tempatLahir}, ${app.tanggalLahir}`],
      ['Jenis Kelamin', app.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'],
      ['Agama', app.agama], ['Kewarganegaraan', app.kewenangnegaraan],
      ['Jenjang Tujuan', app.jenjangTujuan], ['Jalur Pendaftaran', app.jalurPendaftaran],
      ['Asal Sekolah', app.sekolahAsal], ['Nama Ayah', app.namaAyah],
      ['Nama Ibu', app.namaIbu], ['Nama Wali', app.namaWali],
      ['No. HP', app.nomorHp], ['Alamat', app.alamatLengkap],
    ];
    let y = 40;
    dataRows.forEach(([label, value]) => {
      doc.text(label ?? '', 20, y);
      doc.text(`: ${value ?? '-'}`, 70, y);
      y += 6;
    });
    y += 4;
    doc.text('Status Pendaftaran', 20, y);
    doc.setFont('Helvetica', 'bold');
    doc.text(`: ${app.status}`, 70, y);
    y += 8;
    doc.setFont('Helvetica', 'normal');
    doc.text('Dokumen', 20, y);
    y += 5;
    const docStatuses = Object.entries(app.documentValidation || {}).map(([key, status]) => `${key}: ${status}`);
    docStatuses.forEach((d) => { doc.text(`- ${d}`, 24, y); y += 5; });
    if (app.adminNotes) {
      y += 4; doc.text('Catatan Admin', 20, y); y += 5;
      doc.text(app.adminNotes, 24, y, { maxWidth: 170 });
    }
    doc.save(`detail-${app.registrationNo}.pdf`);
  };

  const downloadBackup = async () => {
    const content = await ppdbService.exportBackupJson();
    const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `backup-ppdb-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importBackup = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const result = await ppdbService.importBackupJson(String(reader.result || ''));
      alert(result.message);
      if (result.ok) void refresh();
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const printRecap = () => {
    const win = window.open('', '_blank', 'width=1200,height=800');
    if (!win) return;
    const rows = filtered
      .map((item, idx) => `
        <tr>
          <td>${idx + 1}</td><td>${item.registrationNo}</td><td>${item.namaLengkap}</td>
          <td>${item.nik}</td><td>${item.jenjangTujuan}</td><td>${item.jalurPendaftaran}</td>
          <td>${statusText(item.status)}</td>
          <td>${new Date(item.submittedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
        </tr>`)
      .join('');
    win.document.write(`
      <html><head><title>Rekap PPDB</title>
      <style>
        body{font-family:Arial,sans-serif;margin:24px;color:#000}
        h1{margin:0 0 6px;font-size:22px}
        p{margin:0 0 12px;color:#666;font-size:12px}
        .meta{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0}
        .meta div{border:1px solid #ccc;padding:8px;font-size:12px}
        table{width:100%;border-collapse:collapse;margin-top:16px;font-size:11px}
        th,td{border:1px solid #ccc;padding:6px;text-align:left}
        th{background:#f5f5f5}
      </style></head>
      <body>
        <h1>Rekap Data Pendaftar PPDB</h1>
        <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
        <div class="meta">
          <div>Total Data: <strong>${filtered.length}</strong></div>
          <div>Menunggu: <strong>${stats.pending}</strong></div>
          <div>Diterima: <strong>${stats.accepted}</strong></div>
        </div>
        <table><thead><tr>
          <th>No</th><th>No Registrasi</th><th>Nama</th><th>NIK</th><th>Jenjang</th><th>Jalur</th><th>Status</th><th>Tanggal</th>
        </tr></thead><tbody>${rows || '<tr><td colspan="8">Tidak ada data</td></tr>'}</tbody></table>
      </body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  if (showLogin) {
    return (
      <div className={cn(embedded ? 'flex min-h-full items-center justify-center bg-white p-4' : 'fixed inset-0 z-50 flex items-center justify-center bg-neutral-100 p-4')}>
        <div className="w-full max-w-md rounded-xl border border-black bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between border-b border-black pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-black">Login Admin PPDB</h2>
            <button onClick={onClose} className="text-black hover:text-neutral-500 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wide text-black">Username</label>
              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full rounded-md border border-black px-3 py-2 text-xs text-black outline-none bg-white placeholder:text-neutral-400"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wide text-black">Password</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full rounded-md border border-black px-3 py-2 text-xs text-black outline-none bg-white placeholder:text-neutral-400"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            {loginError && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
            <button
              onClick={handleLogin}
              className="w-full rounded-md border border-black bg-black px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-neutral-800"
            >
              Masuk
            </button>
            <p className="text-center text-[10px] text-black">
              Gunakan username admin dan PIN yang dikonfigurasi sistem.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-full bg-white flex flex-col", embedded && "overflow-hidden")}>
      {/* Header - Full Width, no max-width constraint */}
      {!embedded && (
        <header className="border-b border-black bg-white w-full shrink-0">
          <div className="flex w-full items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2">
              <span className="rounded border border-black bg-white px-2 py-0.5 text-[10px] font-bold text-black">
                {apiHealth.mode === 'local' ? 'LOCAL MODE' : apiHealth.apiReachable ? 'API ONLINE' : 'API OFFLINE'}
              </span>
              <span className="text-[10px] text-black">{apiHealth.message}</span>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-end">
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative rounded-md border border-black p-1.5 text-black hover:bg-black hover:text-white transition-colors"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[8px] font-bold text-white ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-black bg-white shadow-2xl overflow-hidden">
                    <div className="border-b border-black bg-neutral-50 px-4 py-2.5">
                      <h3 className="text-xs font-bold uppercase tracking-wide">Pesan Masuk</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div 
                            key={n.id} 
                            onClick={() => {
                              handleMarkRead(n.id);
                              setSearch(n.registrationNo);
                              setShowNotifications(false);
                            }}
                            className={cn(
                              "group cursor-pointer border-b border-neutral-100 p-3 hover:bg-neutral-50 transition-colors",
                              !n.isRead && "bg-blue-50/50"
                            )}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className={cn(
                                "mt-1 h-2 w-2 shrink-0 rounded-full",
                                n.type === 'NEW_REGISTRATION' ? "bg-green-500" : "bg-blue-500",
                                n.isRead && "opacity-0"
                              )} />
                              <div className="flex-1 space-y-1">
                                <p className="text-[11px] leading-tight text-neutral-900 font-medium">
                                  {n.message}
                                </p>
                                <p className="text-[9px] text-neutral-500">
                                  {new Date(n.createdAt).toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <Mail className="mx-auto h-8 w-8 text-neutral-200" />
                          <p className="mt-2 text-[10px] font-bold uppercase text-neutral-400">Tidak ada pesan</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Email Settings */}
              <button 
                onClick={() => setShowSettings(true)}
                className="rounded-md border border-black p-1.5 text-black hover:bg-black hover:text-white transition-colors"
                title="Pengaturan Email Admin"
              >
                <Mail className="h-4 w-4" />
              </button>

              <button onClick={() => setShowAudit(true)} className="inline-flex items-center gap-1 rounded-md border border-black px-2.5 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white">
                Audit Log
              </button>
              <button onClick={downloadBackup} className="inline-flex items-center gap-1 rounded-md border border-black px-2.5 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white">
                Backup JSON
              </button>
              <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-black px-2.5 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white">
                Import JSON
                <input type="file" accept="application/json" onChange={importBackup} className="hidden" />
              </label>
              <button onClick={printRecap} className="inline-flex items-center gap-1 rounded-md border border-black px-2.5 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white">
                <Printer className="h-3.5 w-3.5" /> Cetak
              </button>
              <button onClick={handleExportCSV} className="inline-flex items-center gap-1 rounded-md border border-black px-2.5 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white">
                <Download className="h-3.5 w-3.5" /> Export
              </button>
              <button onClick={refresh} className="rounded-md border border-black px-2.5 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white">
                Refresh
              </button>
              {!embedded && (
                <button onClick={handleLogout} className="flex items-center gap-1 rounded-md border border-black px-3 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white">
                  <LogOut className="h-3.5 w-3.5" /> Keluar
                </button>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Embedded Utility Bar (Only when embedded) */}
      {embedded && (
        <div className="flex items-center justify-between border-b border-black bg-neutral-50/50 px-5 py-2 shrink-0">
          <div className="flex items-center gap-3">
            <span className={cn(
              "flex h-2 w-2 rounded-full",
              apiHealth.apiReachable ? "bg-green-500" : "bg-red-500 animate-pulse"
            )} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-black">
              {apiHealth.mode === 'local' ? 'Local System' : 'Cloud Sync Active'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-md border border-black p-1 text-black hover:bg-black hover:text-white transition-colors"
              >
                <Bell className="h-3.5 w-3.5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[7px] font-bold text-white ring-1 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border border-black bg-white shadow-2xl overflow-hidden">
                  <div className="border-b border-black bg-neutral-50 px-3 py-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest">Pesan Masuk</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            handleMarkRead(n.id);
                            setSearch(n.registrationNo);
                            setShowNotifications(false);
                          }}
                          className={cn(
                            "group cursor-pointer border-b border-neutral-100 p-2.5 hover:bg-neutral-50 transition-colors",
                            !n.isRead && "bg-blue-50/30"
                          )}
                        >
                          <p className="text-[10px] leading-tight text-neutral-900 font-bold">{n.message}</p>
                          <p className="mt-1 text-[8px] text-neutral-400">{new Date(n.createdAt).toLocaleString('id-ID')}</p>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-[9px] font-bold uppercase text-neutral-300 tracking-widest">Kosong</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setShowSettings(true)} className="rounded-md border border-black p-1 text-black hover:bg-black hover:text-white transition-colors">
              <Mail className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setShowAudit(true)} className="rounded-md border border-black px-2 py-1 text-[9px] font-black uppercase text-black hover:bg-black hover:text-white transition-colors">
              Audit
            </button>
            <button onClick={refresh} className="rounded-md border border-black px-2 py-1 text-[9px] font-black uppercase text-black hover:bg-black hover:text-white transition-colors">
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Main Content - Full Width Grid, fills entire container */}
      <main className="flex w-full flex-1 overflow-hidden border-1 border-black-500">
        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-2xl border border-black bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-tight">Pengaturan Notifikasi</h3>
                <button onClick={() => setShowSettings(false)} className="text-neutral-400 hover:text-black">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleUpdateSettings} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Email Notifikasi Admin
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@sekolah.id"
                    className="w-full rounded-xl border border-black bg-neutral-50 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-black/5 transition-all"
                    required
                  />
                  <p className="text-[9px] leading-relaxed text-neutral-400 italic">
                    * Email ini akan menerima notifikasi otomatis setiap ada pendaftar baru yang masuk ke sistem.
                  </p>
                </div>
                <button 
                  type="submit"
                  className="w-full rounded-xl bg-black px-4 py-3 text-xs font-bold text-white transition-all hover:bg-neutral-800 active:scale-[0.98]"
                >
                  Simpan Perubahan
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Left Sidebar - Fixed width, no max-width */}
        <section className="w-[280px] shrink-0 border-r border-black bg-white px-5 py-5 overflow-y-auto">
          {/* Stats Summary */}
          <div className="mb-6">
            <div className="border-b border-black pb-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Ringkasan</p>
            </div>
            <div className="mt-2 divide-y divide-black/20 border-y border-black">
              {[
                { label: 'Total Pendaftar', value: stats.total },
                { label: 'Menunggu Verifikasi', value: stats.pending },
                { label: 'Terverifikasi', value: stats.verified },
                { label: 'Diterima', value: stats.accepted },
                { label: 'Ditolak', value: stats.rejected },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5">
                  <p className="text-[11px] text-black">{item.label}</p>
                  <p className="text-base font-bold text-black">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div>
            <div className="border-b border-black pb-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Filter Data</p>
            </div>
            <div className="mt-3 space-y-2.5">
              <div className="relative flex items-center">
                <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-black" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama, no registrasi, atau NIK"
                  className="w-full rounded-md border border-black bg-white pl-9 pr-3 py-2 text-xs text-black outline-none placeholder:text-neutral-400"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none"
              >
                <option value="ALL">Semua Status</option>
                <option value="PENDING">Menunggu</option>
                <option value="VERIFIED">Terverifikasi</option>
                <option value="ACCEPTED">Diterima</option>
                <option value="REJECTED">Ditolak</option>
              </select>
              <select
                value={filterJenjang}
                onChange={(e) => setFilterJenjang(e.target.value)}
                className="w-full rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none"
              >
                <option value="ALL">Semua Jenjang</option>
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
                <option value="SMA">SMA</option>
                <option value="SMK">SMK</option>
              </select>
              <select
                value={filterJalur}
                onChange={(e) => setFilterJalur(e.target.value)}
                className="w-full rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none"
              >
                <option value="ALL">Semua Jalur</option>
                <option value="REGULER">Reguler</option>
                <option value="ZONASI">Zonasi</option>
                <option value="PRESTASI">Prestasi</option>
                <option value="AFIRMASI">Afirmasi</option>
                <option value="PINDAHAN">Pindahan</option>
              </select>
            </div>
          </div>
        </section>

        {/* Right Section - Fills remaining width completely */}
        <section className="flex-1 bg-white px-5 py-5 flex flex-col overflow-hidden min-w-0">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Data Pendaftar</p>
              <div className="mt-1 flex items-center gap-2">
                <button 
                  onClick={() => setCurrentFolder(null)}
                  className={cn(
                    "text-[11px] font-bold transition-colors",
                    !currentFolder ? "text-black border-b border-black" : "text-neutral-400 hover:text-black"
                  )}
                >
                  My Files
                </button>
                {currentFolder && (
                  <>
                    <span className="text-neutral-300">/</span>
                    <span className="text-[11px] font-bold text-black border-b border-black">
                      {currentFolder}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-md border border-black p-0.5">
                <button 
                  onClick={() => setViewMode('list')}
                  className={cn("p-1 rounded", viewMode === 'list' ? "bg-black text-white" : "text-black hover:bg-neutral-100")}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn("p-1 rounded", viewMode === 'grid' ? "bg-black text-white" : "text-black hover:bg-neutral-100")}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
              </div>
              <button 
                onClick={handleDownloadAll}
                className="inline-flex items-center gap-1.5 rounded-md border border-black bg-black px-3 py-1.5 text-[10px] font-bold text-white transition-all hover:bg-neutral-800"
              >
                <DownloadIcon className="h-3.5 w-3.5" />
                Download Semua
              </button>
            </div>
          </div>

          {/* Folder Navigation */}
          {!currentFolder && !search && filterStatus === 'ALL' && filterJenjang === 'ALL' && filterJalur === 'ALL' && (
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {['SD', 'SMP', 'SMA', 'SMK'].map((jenjang) => (
                <button
                  key={jenjang}
                  onClick={() => {
                    setCurrentFolder(jenjang);
                    setFilterJenjang(jenjang);
                  }}
                  className="flex flex-col items-start rounded-xl border border-black bg-neutral-50 p-4 transition-all hover:bg-neutral-100 hover:shadow-md group"
                >
                  <Folder className="mb-2 h-8 w-8 text-neutral-400 group-hover:text-black transition-colors" fill="currentColor" />
                  <span className="text-xs font-bold text-black">{jenjang}</span>
                  <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-tighter">
                    {apps.filter(a => a.jenjangTujuan === jenjang).length} pendaftar
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Desktop Table View - Full width of right section */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {viewMode === 'list' ? (
              <div className="overflow-x-auto border border-black bg-white rounded-md w-full">
                <table className="w-full text-left text-xs text-black">
                  <thead>
                    <tr className="border-b border-black bg-neutral-50 text-[10px] font-bold uppercase tracking-wide">
                      <th className="px-3 py-2.5">Item</th>
                      <th className="px-3 py-2.5">No. Registrasi</th>
                      <th className="px-3 py-2.5">Jalur</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5">Terakhir Diubah</th>
                      <th className="px-3 py-2.5">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/20">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-50 transition-colors group">
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <File className="h-4 w-4 text-neutral-400" />
                            <div>
                              <p className="text-xs font-bold text-black">{item.namaLengkap}</p>
                              <p className="text-[9px] text-neutral-500 font-mono uppercase tracking-tighter">{item.jenjangTujuan}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-[10px] font-mono text-black">{item.registrationNo}</td>
                        <td className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-tighter text-black">{item.jalurPendaftaran}</td>
                        <td className="px-3 py-2.5">
                          <span className={cn(
                            "rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase",
                            item.status === 'ACCEPTED' ? "border-green-600 bg-green-50 text-green-600" :
                            item.status === 'REJECTED' ? "border-red-600 bg-red-50 text-red-600" :
                            item.status === 'VERIFIED' ? "border-blue-600 bg-blue-50 text-blue-600" :
                            "border-amber-600 bg-amber-50 text-amber-600"
                          )}>
                            {statusText(item.status)}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-[10px] text-neutral-500">{formatDate(item.submittedAt)}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setSelected(item)} className="p-1.5 rounded-md hover:bg-neutral-100" title="Detail">
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleDownloadData(item)} className="p-1.5 rounded-md hover:bg-neutral-100" title="Download JSON">
                              <DownloadIcon className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handlePrintDetail(item)} className="p-1.5 rounded-md hover:bg-neutral-100" title="Print PDF">
                              <FileText className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 overflow-y-auto pr-2">
                {filtered.map((item) => (
                  <div 
                    key={item.id}
                    className="group relative flex flex-col items-center rounded-xl border border-black bg-white p-4 transition-all hover:bg-neutral-50 hover:shadow-lg"
                  >
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDownloadData(item)} className="p-1 text-neutral-400 hover:text-black">
                        <DownloadIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    
                    <File className="mb-3 h-12 w-12 text-neutral-200" fill="currentColor" />
                    <p className="w-full truncate text-center text-xs font-bold text-black">{item.namaLengkap}</p>
                    <p className="mt-0.5 text-[9px] font-mono text-neutral-500 uppercase tracking-tighter">{item.registrationNo}</p>
                    
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[8px] font-bold uppercase text-neutral-600">
                        {item.jenjangTujuan}
                      </span>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[8px] font-bold uppercase",
                        item.status === 'ACCEPTED' ? "bg-green-100 text-green-700" :
                        item.status === 'REJECTED' ? "bg-red-100 text-red-700" :
                        item.status === 'VERIFIED' ? "bg-blue-100 text-blue-700" :
                        "bg-amber-100 text-amber-700"
                      )}>
                        {statusText(item.status)}
                      </span>
                    </div>

                    <button 
                      onClick={() => setSelected(item)}
                      className="mt-4 w-full rounded-lg bg-black py-2 text-[10px] font-bold text-white transition-all hover:bg-neutral-800"
                    >
                      Lihat Detail
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-black bg-neutral-50" style={{ minHeight: '300px' }}>
                <Folder className="mb-3 h-12 w-12 text-neutral-200" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 italic">Belum ada file di folder ini</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-100/80 p-4">
          <div className="mx-auto mt-4 w-full max-w-4xl rounded-xl border border-black bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-black px-5 py-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Detail Pendaftar</p>
                <h2 className="text-base font-bold text-black">{selected.namaLengkap}</h2>
                <p className="text-[10px] text-black font-mono">{selected.registrationNo}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-md border border-black p-1 text-black transition-colors hover:bg-black hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-5 px-5 py-4 md:grid-cols-2">
              <div className="space-y-2 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wide text-black border-b border-black pb-1">Biodata Siswa</p>
                <p className="text-black">NIK: {selected.nik}</p>
                <p className="text-black">NISN: {selected.nisn || '-'}</p>
                <p className="text-black">Tempat Lahir: {selected.tempatLahir}</p>
                <p className="text-black">Tanggal Lahir: {selected.tanggalLahir}</p>
                <p className="text-black">Jenis Kelamin: {selected.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                <p className="text-black">Agama: {selected.agama}</p>
                <p className="text-black">Kewarganegaraan: {selected.kewenangnegaraan}</p>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wide text-black border-b border-black pb-1">Data Pendaftaran</p>
                <p className="text-black">Jenjang: {selected.jenjangTujuan}</p>
                <p className="text-black">Sekolah Tujuan: {selected.sekolahTujuan || '-'}</p>
                <p className="text-black">Jalur: {selected.jalurPendaftaran}</p>
                <p className="text-black">Sekolah Asal: {selected.sekolahAsal}</p>
                <p className="text-black">Nomor HP: {selected.nomorHp}</p>
                <p className="text-black">Email: {selected.email}</p>
              </div>

              <div className="space-y-2 text-xs md:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-black border-b border-black pb-1">Alamat & Orang Tua</p>
                <p className="text-black">{selected.alamatLengkap}, {selected.desaKelurahan || ''}, {selected.kecamatan || ''}, {selected.kabupatenKota || ''}</p>
                <p className="text-black">Ayah: {selected.namaAyah} | Ibu: {selected.namaIbu} | Wali: {selected.namaWali || '-'}</p>
                <p className="text-[10px] text-black">Didaftarkan: {formatDate(selected.submittedAt)}</p>
                {selected.adminNotes && <p className="text-[10px] text-black">Catatan Admin: {selected.adminNotes}</p>}
              </div>

              <div className="space-y-2 text-xs md:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-black border-b border-black pb-1">Validasi Dokumen</p>
                <div className="space-y-1.5">
                  {Object.entries(selected.documentValidation || {}).map(([key, status]) => (
                    <div key={key} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-black p-2">
                      <p className="text-xs font-bold text-black">{key.toUpperCase()}</p>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleUpdateDoc(key, 'VALID')} className={`rounded border px-2 py-1 text-[10px] font-bold transition-colors ${status === 'VALID' ? 'border-black bg-black text-white' : 'border-black text-black hover:bg-black hover:text-white'}`}>
                          Valid
                        </button>
                        <button onClick={() => handleUpdateDoc(key, 'INVALID')} className={`rounded border px-2 py-1 text-[10px] font-bold transition-colors ${status === 'INVALID' ? 'border-black bg-neutral-200 text-black' : 'border-black text-black hover:bg-black hover:text-white'}`}>
                          Tidak Valid
                        </button>
                        <button onClick={() => handleUpdateDoc(key, 'PENDING')} className={`rounded border px-2 py-1 text-[10px] font-bold transition-colors ${status === 'PENDING' ? 'border-black bg-neutral-100 text-black' : 'border-black text-black hover:bg-black hover:text-white'}`}>
                          Pending
                        </button>
                      </div>
                    </div>
                  ))}
                  {Object.keys(selected.documentValidation || {}).length === 0 && (
                    <p className="text-[10px] text-black">— Tidak ada dokumen —</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs md:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-black border-b border-black pb-1">Catatan Admin</p>
                <textarea
                  value={adminNotesInput}
                  onChange={(e) => setAdminNotesInput(e.target.value)}
                  placeholder="Tambahkan catatan verifikasi untuk arsip internal..."
                  rows={3}
                  className="w-full resize-none rounded-md border border-black bg-white px-3 py-2 text-xs text-black outline-none placeholder:text-neutral-400 leading-relaxed"
                />
                {selected.adminNotes && (
                  <p className="text-[10px] text-black">Catatan tersimpan: <span className="font-bold">{selected.adminNotes}</span></p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black px-5 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => handleUpdateStatus(selected.id, 'VERIFIED', 'Admin')} className="inline-flex items-center gap-1 rounded-md border border-black px-3 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white">
                  <Check className="h-3.5 w-3.5" /> Verifikasi
                </button>
                <button onClick={() => handleUpdateStatus(selected.id, 'ACCEPTED', 'Admin')} className="inline-flex items-center gap-1 rounded-md border border-black bg-black px-3 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-neutral-800">
                  <Check className="h-3.5 w-3.5" /> Terima
                </button>
                <button onClick={() => handleUpdateStatus(selected.id, 'REJECTED', 'Admin')} className="inline-flex items-center gap-1 rounded-md border border-black px-3 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white">
                  <X className="h-3.5 w-3.5" /> Tolak
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handlePrintDetail(selected)} className="inline-flex items-center gap-1 rounded-md border border-black px-3 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white">
                  <FileText className="h-3.5 w-3.5" /> Print PDF
                </button>
                <button onClick={() => setConfirmAction({ type: 'delete', id: selected.id, message: 'Yakin ingin menghapus pendaftaran ini?' })} className="inline-flex items-center gap-1 rounded-md border border-black px-3 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-black hover:text-white">
                  <Trash2 className="h-3.5 w-3.5" /> Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Modal */}
      {showAudit && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-100/80 p-4">
          <div className="mx-auto mt-4 w-full max-w-4xl rounded-xl border border-black bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-black px-5 py-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black">Audit Trail</p>
                <h2 className="text-base font-bold text-black">Log Aktivitas Sistem</h2>
              </div>
              <button onClick={() => setShowAudit(false)} className="rounded-md border border-black p-1 text-black transition-colors hover:bg-black hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
              {auditLogs.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-black font-bold">— Belum ada log audit —</p>
                </div>
              ) : (
                <div className="divide-y divide-black/20">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="px-5 py-3 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold text-black">{log.action}</p>
                        <p className="text-[10px] text-black font-mono">{formatDate(log.occurredAt)}</p>
                      </div>
                      <p className="text-[10px] text-black">Aktor: {log.actor}</p>
                      {log.metadata && (
                        <p className="text-[10px] text-black">{Object.entries(log.metadata).map(([k, v]) => `${k}: ${v}`).join(' | ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-100/80 p-4">
          <div className="w-full max-w-sm rounded-xl border border-black bg-white p-5 shadow-sm">
            <div className="flex items-start gap-2 mb-3">
              <HelpCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-black leading-relaxed">{confirmAction.message}</p>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmAction(null)} className="rounded-md border border-black px-3 py-1.5 text-[10px] font-bold text-black transition-colors hover:bg-neutral-100">
                Batal
              </button>
              <button
                onClick={() => {
                  if (confirmAction.type === 'delete') {
                    handleDelete(confirmAction.id);
                  } else if (confirmAction.status) {
                    handleUpdateStatus(confirmAction.id, confirmAction.status, 'Admin');
                  }
                  setConfirmAction(null);
                }}
                className="rounded-md border border-black bg-black px-3 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-neutral-800"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function statusText(status: string) {
  if (status === 'PENDING') return 'Menunggu';
  if (status === 'VERIFIED') return 'Terverifikasi';
  if (status === 'ACCEPTED') return 'Diterima';
  if (status === 'REJECTED') return 'Ditolak';
  return status;
}
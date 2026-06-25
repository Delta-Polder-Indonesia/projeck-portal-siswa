import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getClasses,
  getNilaiRapotBySiswa,
  getStudents,
  getTahunAjaranRapotSiswa,
} from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { BookOpenCheck, Download, User } from 'lucide-react';

// Fungsi konversi nilai huruf ke angka SKS sesuai standar akademik
function getBobotNilai(predikat: string): number {
  switch (predikat) {
    case 'A': return 4;
    case 'B': return 3;
    case 'C': return 2;
    case 'D': return 1;
    default: return 0;
  }
}

export default function RapotSiswa() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();

  const student = useMemo(() => getStudents().find(s => s.id === user?.id), [user, storeVersion]);
  
  const className = useMemo(() => {
    if (!student) return '-';
    return getClasses().find(c => c.id === student.classId)?.name || '-';
  }, [student, storeVersion]);

  const tahunAjaranList = useMemo(() => {
    if (!user) return [];
    const list = getTahunAjaranRapotSiswa(user.id);
    if (list.length === 0) {
      const y = new Date().getFullYear();
      return [`${y}/${y + 1}`];
    }
    return list;
  }, [user, storeVersion]);

  const [tahunAjaran, setTahunAjaran] = useState(() => tahunAjaranList[0] || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`);
  const [semester, setSemester] = useState<'ganjil' | 'genap'>('genap');

  const nilaiRapot = useMemo(() => {
    if (!user) return [];
    return getNilaiRapotBySiswa(user.id, tahunAjaran, semester);
  }, [user, tahunAjaran, semester, storeVersion]);

  // Kalkulasi data summary ala KHS UNPAB
  const stats = useMemo(() => {
    const totalSKS = nilaiRapot.length * 3; // Mengasumsikan rata-rata 3 SKS per MK
    const totalKN = nilaiRapot.reduce((sum, item) => sum + (getBobotNilai(item.predikat) * 3), 0);
    const ipSemester = totalSKS > 0 ? (totalKN / totalSKS).toFixed(2) : '0.00';

    return {
      totalSKS,
      totalKN,
      ipSemester,
      totalMapel: nilaiRapot.length
    };
  }, [nilaiRapot]);

  // Format string untuk Tahun Akademik
  const formatTA = useMemo(() => {
    return `${semester === 'ganjil' ? 'GANJIL' : 'GENAP'} ${tahunAjaran.split('/')[0]}`;
  }, [tahunAjaran, semester]);

  // Handle Cetak Dokumen (Desain yang disinkronkan persis dengan UI baru)
  const handleCetakRapot = () => {
    if (nilaiRapot.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rowsHtml = nilaiRapot.map((item, idx) => {
      const bobot = getBobotNilai(item.predikat);
      return `
        <tr style="background: #fff;">
          <td style="border: 1px solid #b4dbf0; padding: 4px; text-align: center;">${idx + 1}</td>
          <td style="border: 1px solid #b4dbf0; padding: 4px; text-align: center;">${formatTA}</td>
          <td style="border: 1px solid #b4dbf0; padding: 4px; text-align: center; font-family: monospace;">${item.id?.substring(0, 5) || '4210' + (idx + 1)}</td>
          <td style="border: 1px solid #b4dbf0; padding: 4px 8px; text-align: left;">${item.mataPelajaran}</td>
          <td style="border: 1px solid #b4dbf0; padding: 4px; text-align: center;">${semester === 'ganjil' ? '1' : '2'}</td>
          <td style="border: 1px solid #b4dbf0; padding: 4px; text-align: center;">3</td>
          <td style="border: 1px solid #b4dbf0; padding: 4px; text-align: center;">KKNI</td>
          <td style="border: 1px solid #b4dbf0; padding: 4px; text-align: center; font-weight: bold;">${item.predikat}</td>
          <td style="border: 1px solid #b4dbf0; padding: 4px; text-align: center;">${bobot}</td>
          <td style="border: 1px solid #b4dbf0; padding: 4px; text-align: center; font-weight: bold;">${bobot * 3}</td>
        </tr>
      `;
    }).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Portal Mahasiswa UNPAB - KHS</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 15px; color: #333; font-size: 11px; }
          .header-blue { background: #2291c3; color: white; padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; border-radius: 2px 2px 0 0; }
          .header-blue h1 { margin: 0; font-size: 13px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 0px; font-size: 10px; }
          th { background: #79c7ec; border: 1px solid #b4dbf0; padding: 6px 2px; color: #1c5877; font-weight: bold; text-transform: uppercase; text-align: center; }
          .sub-th { background: #99d5f1; }
          .summary-strip { background: #79c7ec; color: #1c5877; font-weight: bold; padding: 6px 10px; border: 1px solid #b4dbf0; border-top: none; text-transform: uppercase; font-size: 10px; }
          @media print { .header-blue { background: #2291c3 !important; -webkit-print-color-adjust: exact; } th { background: #79c7ec !important; -webkit-print-color-adjust: exact; } .sub-th { background: #99d5f1 !important; -webkit-print-color-adjust: exact; } .summary-strip { background: #79c7ec !important; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header-blue">
          <div>
            <h1>PORTAL MAHASISWA UNPAB</h1>
            <div style="font-size: 9px; margin-top: 1px; opacity: 0.9;">Kartu Hasil Studi (KHS) Digital</div>
          </div>
          <div style="text-align: right; font-weight: bold; font-size: 9px; line-height: 1.2;">
            NAMA: ${student?.name?.toUpperCase() || '-'}<br>
            NPM/NIS: ${student?.nis || '-'} &bull; KELAS: ${className}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th rowspan="2" style="width: 30px;">No.</th>
              <th rowspan="2" style="width: 100px;">TA</th>
              <th rowspan="2" style="width: 60px;">Kode</th>
              <th rowspan="2">Mata Kuliah</th>
              <th rowspan="2" style="width: 40px;">SMT</th>
              <th rowspan="2" style="width: 40px;">SKS</th>
              <th rowspan="2" style="width: 75px;">Kurikulum</th>
              <th colspan="2" class="sub-th" style="border-bottom: 1px solid #b4dbf0; width: 90px;">Nilai</th>
              <th rowspan="2" style="width: 50px;">(K x N)</th>
            </tr>
            <tr>
              <th class="sub-th" style="border-right: 1px solid #b4dbf0; width: 45px;">Huruf</th>
              <th class="sub-th" style="width: 45px;">Angka</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <div class="summary-strip">
          TOTAL SKS : ${stats.totalSKS} | Jumlah K x N : ${stats.totalKN} | IP Semester : ${stats.ipSemester} | Beban SKS Berikut : 24
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto p-2 antialiased text-slate-600 bg-white selection:bg-slate-200">
      
      {/* PANEL FILTER ATAS (Normal & Compact) */}
      <div className="mb-4 pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tahun Ajaran</span>
            <select
              value={tahunAjaran}
              onChange={e => setTahunAjaran(e.target.value)}
              className="px-2 py-0.5 bg-white border border-slate-200 rounded-sm text-xs font-medium text-slate-700 outline-none focus:border-slate-400"
            >
              {tahunAjaranList.map(ta => (
                <option key={ta} value={ta}>{ta}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Semester</span>
            <select
              value={semester}
              onChange={e => setSemester(e.target.value as 'ganjil' | 'genap')}
              className="px-2 py-0.5 bg-white border border-slate-200 rounded-sm text-xs font-medium text-slate-700 outline-none focus:border-slate-400"
            >
              <option value="ganjil">Ganjil</option>
              <option value="genap">Genap</option>
            </select>
          </div>
        </div>
        
        {nilaiRapot.length > 0 && (
          <button
            type="button"
            onClick={handleCetakRapot}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white rounded-sm text-xs font-medium hover:bg-slate-800 transition-colors self-start sm:self-auto shrink-0"
          >
            <Download className="w-3 h-3" /> 
            <span>Cetak KHS Digital</span>
          </button>
        )}
      </div>

      {/* REPLIKA KHS DIGITAL PORTAL UNPAB */}
      {nilaiRapot.length === 0 ? (
        <div className="py-12 border border-dashed border-slate-200 rounded-sm text-center bg-slate-50/30">
          <BookOpenCheck className="w-6 h-6 text-slate-300 mx-auto mb-1" />
          <p className="text-[11px] text-slate-400 italic">Belum ada nilai Kartu Hasil Studi (KHS) yang diterbitkan untuk semester ini.</p>
        </div>
      ) : (
        <div className="border border-sky-200/80 rounded-sm overflow-hidden shadow-sm">
          
          {/* Header Biru Cerah Khas Portal */}
          <div className="bg-[#2291c3] p-2 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h2 className="text-xs font-bold tracking-wide leading-none">PORTAL MAHASISWA UNPAB</h2>
              <p className="text-[10px] text-sky-100/90 mt-1 leading-none">Sistem Informasi Kartu Hasil Studi (KHS) Akademik</p>
            </div>
            
            <div className="flex items-center gap-2 bg-sky-950/15 px-2 py-1 rounded-sm border border-sky-400/15 text-[11px] max-w-full">
              {student?.avatar ? (
                <img src={student.avatar} alt="" className="w-6 h-6 rounded-sm bg-white object-cover shrink-0" />
              ) : (
                <div className="w-6 h-6 rounded-sm bg-sky-100 flex items-center justify-center text-sky-800 shrink-0">
                  <User className="w-3 h-3" />
                </div>
              )}
              <div className="leading-none truncate">
                <div className="truncate"><span className="text-sky-200/80 text-[10px]">NAMA:</span> <strong className="text-white uppercase font-bold">{student?.name}</strong></div>
                <div className="mt-1 text-[10px] flex flex-wrap gap-x-2 text-sky-100/90 font-mono">
                  <span>NPM: {student?.nis}</span> 
                  <span className="text-sky-300/40">|</span>
                  <span className="font-sans">KELAS: {className}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Grid KHS Utama */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans text-left border-collapse">
              <thead>
                {/* Header Tingkat 1 */}
                <tr className="bg-[#79c7ec] text-[#1c5877] font-bold text-center border-b border-[#b4dbf0]">
                  <th className="px-1.5 py-1.5 border-r border-[#b4dbf0] w-8 shrink-0" rowSpan={2}>No.</th>
                  <th className="px-1.5 py-1.5 border-r border-[#b4dbf0] w-20 shrink-0" rowSpan={2}>TA</th>
                  <th className="px-1.5 py-1.5 border-r border-[#b4dbf0] w-14 shrink-0" rowSpan={2}>Kode</th>
                  <th className="px-2.5 py-1.5 border-r border-[#b4dbf0] text-left" rowSpan={2}>Mata Kuliah</th>
                  <th className="px-1.5 py-1.5 border-r border-[#b4dbf0] w-10 shrink-0" rowSpan={2}>SMT</th>
                  <th className="px-1.5 py-1.5 border-r border-[#b4dbf0] w-10 shrink-0" rowSpan={2}>SKS</th>
                  <th className="px-1.5 py-1.5 border-r border-[#b4dbf0] w-16 shrink-0" rowSpan={2}>Kurikulum</th>
                  <th className="px-1.5 py-0.5 border-b border-[#b4dbf0] bg-[#99d5f1] w-20 shrink-0" colSpan={2}>Nilai</th>
                  <th className="px-1.5 py-1.5 w-12 shrink-0" rowSpan={2}>(K * N)</th>
                </tr>
                {/* Sub-Header Tingkat 2 */}
                <tr className="bg-[#99d5f1] text-[#1c5877] font-bold text-center border-b border-[#b4dbf0]">
                  <th className="px-1.5 py-0.5 border-r border-[#b4dbf0] w-10 shrink-0">Huruf</th>
                  <th className="px-1.5 py-0.5 border-r border-[#b4dbf0] w-10 shrink-0">Angka</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#b4dbf0] bg-white text-slate-700">
                {nilaiRapot.map((item, idx) => {
                  const bobotAngka = getBobotNilai(item.predikat);
                  const sksItem = 3; 
                  return (
                    <tr key={item.id} className="hover:bg-sky-50/10 transition-colors leading-tight">
                      <td className="px-1.5 py-1 text-center text-slate-400 font-mono border-r border-[#b4dbf0] text-[11px]">{idx + 1}</td>
                      <td className="px-1.5 py-1 text-center border-r border-[#b4dbf0] text-slate-500 text-[11px]">{formatTA}</td>
                      <td className="px-1.5 py-1 text-center border-r border-[#b4dbf0] font-mono text-slate-400 text-[10px]">{item.id?.substring(0, 5) || '4210' + (idx + 1)}</td>
                      <td className="px-2.5 py-1 border-r border-[#b4dbf0] font-medium text-slate-900">{item.mataPelajaran}</td>
                      <td className="px-1.5 py-1 text-center border-r border-[#b4dbf0] font-mono">{semester === 'ganjil' ? '1' : '2'}</td>
                      <td className="px-1.5 py-1 text-center border-r border-[#b4dbf0] font-mono">{sksItem}</td>
                      <td className="px-1.5 py-1 text-center border-r border-[#b4dbf0] text-slate-400 text-[10px]">KKNI</td>
                      <td className="px-1.5 py-1 text-center border-r border-[#b4dbf0] font-bold text-sky-700">{item.predikat}</td>
                      <td className="px-1.5 py-1 text-center border-r border-[#b4dbf0] font-mono">{bobotAngka}</td>
                      <td className="px-1.5 py-1 text-center font-bold text-slate-900 font-mono">{sksItem * bobotAngka}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Strip Biru Total Parameter */}
          <div className="bg-[#79c7ec] text-[#1c5877] font-bold px-2.5 py-1.5 text-[10px] border-t border-[#b4dbf0] uppercase tracking-wide flex flex-wrap gap-x-3 gap-y-0.5 items-center">
            <span>TOTAL SKS : <span className="text-slate-900 font-extrabold font-mono">{stats.totalSKS}</span></span>
            <span className="text-sky-400/40">|</span>
            <span>Jumlah K x N : <span className="text-slate-900 font-extrabold font-mono">{stats.totalKN}</span></span>
            <span className="text-sky-400/40">|</span>
            <span>IP Semester : <span className="text-blue-900 font-extrabold font-mono">{stats.ipSemester}</span></span>
            <span className="text-sky-400/40">|</span>
            <span>Beban SKS Berikut : <span className="text-slate-900 font-extrabold font-mono">24</span></span>
          </div>

        </div>
      )}
    </div>
  );
}
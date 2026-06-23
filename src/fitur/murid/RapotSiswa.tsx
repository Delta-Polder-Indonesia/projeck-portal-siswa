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
          <td style="border: 1px solid #b4dbf0; padding: 6px; text-align: center;">${idx + 1}</td>
          <td style="border: 1px solid #b4dbf0; padding: 6px; text-align: center;">${formatTA}</td>
          <td style="border: 1px solid #b4dbf0; padding: 6px; text-align: center; font-family: monospace;">${item.id?.substring(0, 5) || '4210' + (idx + 1)}</td>
          <td style="border: 1px solid #b4dbf0; padding: 6px 12px; text-align: left;">${item.mataPelajaran}</td>
          <td style="border: 1px solid #b4dbf0; padding: 6px; text-align: center;">${semester === 'ganjil' ? '1' : '2'}</td>
          <td style="border: 1px solid #b4dbf0; padding: 6px; text-align: center;">3</td>
          <td style="border: 1px solid #b4dbf0; padding: 6px; text-align: center;">KKNI</td>
          <td style="border: 1px solid #b4dbf0; padding: 6px; text-align: center; font-weight: bold;">${item.predikat}</td>
          <td style="border: 1px solid #b4dbf0; padding: 6px; text-align: center;">${bobot}</td>
          <td style="border: 1px solid #b4dbf0; padding: 6px; text-align: center; font-weight: bold;">${bobot * 3}</td>
        </tr>
      `;
    }).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Portal Mahasiswa UNPAB - KHS</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #333; font-size: 11px; }
          .header-blue { background: #2291c3; color: white; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; border-radius: 4px 4px 0 0; }
          .header-blue h1 { margin: 0; font-size: 15px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 0px; font-size: 11px; }
          th { background: #79c7ec; border: 1px solid #b4dbf0; padding: 8px 4px; color: #1c5877; font-weight: bold; text-transform: uppercase; text-align: center; }
          .sub-th { background: #99d5f1; }
          .summary-strip { background: #79c7ec; color: #1c5877; font-weight: bold; padding: 8px 12px; border: 1px solid #b4dbf0; border-top: none; text-transform: uppercase; }
          @media print { .header-blue { background: #2291c3 !important; -webkit-print-color-adjust: exact; } th { background: #79c7ec !important; -webkit-print-color-adjust: exact; } .sub-th { background: #99d5f1 !important; -webkit-print-color-adjust: exact; } .summary-strip { background: #79c7ec !important; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header-blue">
          <div>
            <h1>PORTAL MAHASISWA UNPAB</h1>
            <div style="font-size: 10px; margin-top: 2px; opacity: 0.9;">Kartu Hasil Studi (KHS) Digital</div>
          </div>
          <div style="text-align: right; font-weight: bold; font-size: 10px; line-height: 1.3;">
            NAMA: ${student?.name?.toUpperCase() || '-'}<br>
            NPM/NIS: ${student?.nis || '-'} &bull; KELAS: ${className}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th rowspan="2" style="width: 35px;">No.</th>
              <th rowspan="2" style="width: 110px;">TA</th>
              <th rowspan="2" style="width: 70px;">Kode</th>
              <th rowspan="2">Mata Kuliah</th>
              <th rowspan="2" style="width: 45px;">SMT</th>
              <th rowspan="2" style="width: 45px;">SKS</th>
              <th rowspan="2" style="width: 85px;">Kurikulum</th>
              <th colspan="2" class="sub-th" style="border-bottom: 1px solid #b4dbf0; width: 100px;">Nilai</th>
              <th rowspan="2" style="width: 60px;">(K x N)</th>
            </tr>
            <tr>
              <th class="sub-th" style="border-right: 1px solid #b4dbf0; width: 50px;">Huruf</th>
              <th class="sub-th" style="width: 50px;">Angka</th>
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
    <div className="space-y-4 max-w-[1600px] mx-auto p-2 antialiased text-slate-600">
      
      {/* Top Filter Workspace Control */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih Tahun Ajaran</span>
            <select
              value={tahunAjaran}
              onChange={e => setTahunAjaran(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
            >
              {tahunAjaranList.map(ta => (
                <option key={ta} value={ta}>{ta}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih Semester</span>
            <select
              value={semester}
              onChange={e => setSemester(e.target.value as 'ganjil' | 'genap')}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
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
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Cetak KHS (Portal Style)
          </button>
        )}
      </div>

      {/* TAMPILAN UTAMA: REPLIKA KHS DIGITAL PORTAL UNPAB */}
      {nilaiRapot.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-slate-200 shadow-sm text-center">
          <BookOpenCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-600">Belum ada Kartu Hasil Studi (KHS) yang diterbitkan.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md border border-sky-200 rounded-lg overflow-hidden">
          
          {/* Header Biru Cerah Khas Portal */}
          <div className="bg-[#2291c3] p-4 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-sky-300">
            <div>
              <h2 className="text-base font-black tracking-wide">PORTAL MAHASISWA UNPAB</h2>
              <p className="text-[11px] text-sky-100 font-medium mt-0.5">Sistem Informasi Kartu Hasil Studi (KHS) Akademik</p>
            </div>
            
            <div className="flex items-center gap-3 bg-sky-900/20 p-2 rounded-md border border-sky-400/30 font-sans text-[11px]">
              {student?.avatar ? (
                <img src={student.avatar} alt="" className="w-9 h-9 rounded bg-white object-cover" />
              ) : (
                <div className="w-9 h-9 rounded bg-sky-100 flex items-center justify-center text-sky-800">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div className="leading-tight">
                <div><span className="text-sky-200">MAHASISWA:</span> <strong className="text-white uppercase">{student?.name}</strong></div>
                <div className="mt-0.5">
                  <span className="text-sky-200">NPM:</span> <span className="font-mono text-white mr-2">{student?.nis}</span> 
                  <span className="text-sky-200">KELAS:</span> <span className="text-white">{className}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Grid KHS Utama */}
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] font-sans">
              <thead>
                {/* Header Tingkat 1 */}
                <tr className="bg-[#79c7ec] text-[#1c5877] font-bold text-center border-b border-[#b4dbf0]">
                  <th className="px-2 py-2.5 border-r border-[#b4dbf0] font-bold text-center w-10" rowSpan={2}>No.</th>
                  <th className="px-2 py-2.5 border-r border-[#b4dbf0] font-bold text-center w-28" rowSpan={2}>TA</th>
                  <th className="px-2 py-2.5 border-r border-[#b4dbf0] font-bold text-center w-20" rowSpan={2}>Kode</th>
                  <th className="px-3 py-2.5 border-r border-[#b4dbf0] font-bold text-left" rowSpan={2}>Mata Kuliah</th>
                  <th className="px-2 py-2.5 border-r border-[#b4dbf0] font-bold text-center w-14" rowSpan={2}>SMT</th>
                  <th className="px-2 py-2.5 border-r border-[#b4dbf0] font-bold text-center w-14" rowSpan={2}>SKS</th>
                  <th className="px-2 py-2.5 border-r border-[#b4dbf0] font-bold text-center w-24" rowSpan={2}>Kurikulum</th>
                  <th className="px-2 py-1.5 border-b border-[#b4dbf0] font-bold text-center bg-[#99d5f1]" colSpan={2}>Nilai</th>
                  <th className="px-2 py-2.5 font-bold text-center w-16" rowSpan={2}>(K * N)</th>
                </tr>
                {/* Sub-Header Tingkat 2 */}
                <tr className="bg-[#99d5f1] text-[#1c5877] font-bold text-center border-b border-[#b4dbf0]">
                  <th className="px-2 py-1 border-r border-[#b4dbf0] font-bold text-center w-14">Huruf</th>
                  <th className="px-2 py-1 border-r border-[#b4dbf0] font-bold text-center w-14">Angka</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#b4dbf0] bg-white text-slate-800">
                {nilaiRapot.map((item, idx) => {
                  const bobotAngka = getBobotNilai(item.predikat);
                  const sksItem = 3; 
                  return (
                    <tr key={item.id} className="hover:bg-sky-50/40 transition-colors">
                      <td className="px-2 py-2 text-center text-slate-400 font-mono border-r border-[#b4dbf0]">{idx + 1}</td>
                      <td className="px-2 py-2 text-center border-r border-[#b4dbf0] font-medium text-slate-600">{formatTA}</td>
                      <td className="px-2 py-2 text-center border-r border-[#b4dbf0] font-mono text-slate-500">{item.id?.substring(0, 5) || '4210' + (idx + 1)}</td>
                      <td className="px-3 py-2 text-left border-r border-[#b4dbf0] font-semibold text-slate-800">{item.mataPelajaran}</td>
                      <td className="px-2 py-2 text-center border-r border-[#b4dbf0]">{semester === 'ganjil' ? '1' : '2'}</td>
                      <td className="px-2 py-2 text-center border-r border-[#b4dbf0] font-medium">{sksItem}</td>
                      <td className="px-2 py-2 text-center border-r border-[#b4dbf0] text-slate-500">KKNI</td>
                      <td className="px-2 py-2 text-center border-r border-[#b4dbf0] font-bold text-blue-800">{item.predikat}</td>
                      <td className="px-2 py-2 text-center border-r border-[#b4dbf0] font-medium">{bobotAngka}</td>
                      <td className="px-2 py-2 text-center font-bold text-slate-900">{sksItem * bobotAngka}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Strip Biru Total Parameter Persis Seperti Foto */}
          <div className="bg-[#79c7ec] text-[#1c5877] font-bold px-4 py-2.5 text-xs border-t border-[#b4dbf0] uppercase tracking-wide flex flex-wrap gap-x-6 gap-y-2">
            <span>TOTAL SKS : <span className="text-slate-900 font-black">{stats.totalSKS}</span></span>
            <span className="text-sky-400/40">|</span>
            <span>Jumlah K x N : <span className="text-slate-900 font-black">{stats.totalKN}</span></span>
            <span className="text-sky-400/40">|</span>
            <span>IP Semester : <span className="text-blue-900 font-black">{stats.ipSemester}</span></span>
            <span className="text-sky-400/40">|</span>
            <span>Beban SKS Berikut : <span className="text-slate-900 font-black">24</span></span>
          </div>

        </div>
      )}
    </div>
  );
}
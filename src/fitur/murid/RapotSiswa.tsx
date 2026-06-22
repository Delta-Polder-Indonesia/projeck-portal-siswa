import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getClasses,
  getNilaiRapotBySiswa,
  getStudents,
  getTahunAjaranRapotSiswa,
} from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { BookOpenCheck, Award, TrendingUp, Download, User, BarChart2 } from 'lucide-react';

function predikatColor(p: string) {
  switch (p) {
    case 'A': return 'bg-slate-100 text-slate-800 border border-slate-300';
    case 'B': return 'bg-slate-100 text-slate-700 border border-slate-250';
    case 'C': return 'bg-slate-50 text-slate-600 border border-slate-200';
    case 'D': return 'bg-amber-50 text-amber-800 border border-amber-200';
    default: return 'bg-rose-50 text-rose-800 border border-rose-200';
  }
}

function predikatLabel(p: string) {
  switch (p) {
    case 'A': return 'Sangat Baik';
    case 'B': return 'Baik';
    case 'C': return 'Cukup';
    case 'D': return 'Kurang';
    default: return 'Sangat Kurang';
  }
}

function hitungPredikat(nilai: number): string {
  if (nilai >= 90) return 'A';
  if (nilai >= 80) return 'B';
  if (nilai >= 70) return 'C';
  if (nilai >= 60) return 'D';
  return 'E';
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

  const stats = useMemo(() => {
    if (nilaiRapot.length === 0) return { rataRata: 0, tertinggi: 0, terendah: 0, predikatRata: 'E', totalMapel: 0 };
    const values = nilaiRapot.map(item => item.nilaiAkhir);
    const rataRata = Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
    return {
      rataRata,
      tertinggi: Math.max(...values),
      terendah: Math.min(...values),
      predikatRata: hitungPredikat(rataRata),
      totalMapel: nilaiRapot.length,
    };
  }, [nilaiRapot]);

  const handleCetakRapot = () => {
    if (nilaiRapot.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rows = nilaiRapot.map((item, idx) => `
      <tr>
        <td style="border:1px solid #e2e8f0; padding:6px 10px; text-align:center">${idx + 1}</td>
        <td style="border:1px solid #e2e8f0; padding:6px 10px; font-weight:500">${item.mataPelajaran}</td>
        <td style="border:1px solid #e2e8f0; padding:6px 10px; text-align:center">${item.nilaiTugas}</td>
        <td style="border:1px solid #e2e8f0; padding:6px 10px; text-align:center">${item.nilaiUTS}</td>
        <td style="border:1px solid #e2e8f0; padding:6px 10px; text-align:center">${item.nilaiUAS}</td>
        <td style="border:1px solid #e2e8f0; padding:6px 10px; text-align:center; font-weight:700">${item.nilaiAkhir}</td>
        <td style="border:1px solid #e2e8f0; padding:6px 10px; text-align:center; font-weight:700">${item.predikat}</td>
        <td style="border:1px solid #e2e8f0; padding:6px 10px; font-size:11px; color:#475569">${item.catatanGuru || '-'}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Arsip_Rapot_${student?.name}_${tahunAjaran}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 30px; color: #1e293b; line-height: 1.4; }
          h1 { font-size: 16px; font-weight: 700; margin-bottom: 2px; letter-tight: -0.02em; }
          h2 { font-size: 12px; color: #64748b; margin-bottom: 24px; font-weight: 500; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 12px; }
          th { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 10px; font-weight: 600; text-align: center; color: #334155; }
          .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; font-size: 11px; border: 1px solid #e2e8f0; padding: 12px; border-radius: 6px; }
          .info-item span { color: #64748b; font-weight: 500; }
          .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px dashed #e2e8f0; padding-top: 12px; }
          .stats-row { display: flex; gap: 12px; margin-top: 16px; }
          .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 16px; min-width: 100px; text-align: center; }
          .stat-card .val { font-size: 18px; font-weight: 700; color: #0f172a; }
          .stat-card .lbl { font-size: 10px; color: #64748b; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.05em; }
          @media print { body { padding: 10px; } .info-grid { background: none; } }
        </style>
      </head>
      <body>
        <h1>LAPORAN HASIL BELAJAR AKADEMIK (RAPOT)</h1>
        <h2>Sistem Informasi Akademik Sekolah</h2>
        <div class="info-grid">
          <div class="info-item"><span>Nama Lengkap:</span> <br><strong>${student?.name || '-'}</strong></div>
          <div class="info-item"><span>Nomor Induk Siswa:</span> <br><strong>${student?.nis || '-'}</strong></div>
          <div class="info-item"><span>Kelas Penempatan:</span> <br><strong>${className}</strong></div>
          <div class="info-item"><span>Tahun Ajaran:</span> <br><strong>${tahunAjaran}</strong></div>
          <div class="info-item"><span>Periode Semester:</span> <br><strong>${semester === 'ganjil' ? 'Ganjil' : 'Genap'}</strong></div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width:35px">No</th>
              <th>Mata Pelajaran</th>
              <th style="width:60px">Tugas</th>
              <th style="width:60px">UTS</th>
              <th style="width:60px">UAS</th>
              <th style="width:70px">Nilai Akhir</th>
              <th style="width:65px">Predikat</th>
              <th>Catatan Evaluasi Guru</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="stats-row">
          <div class="stat-card"><div class="val">${stats.rataRata}</div><div class="lbl">Rata-rata</div></div>
          <div class="stat-card"><div class="val">${stats.tertinggi}</div><div class="lbl">Tertinggi</div></div>
          <div class="stat-card"><div class="val">${stats.terendah}</div><div class="lbl">Terendah</div></div>
          <div class="stat-card"><div class="val">${stats.predikatRata}</div><div class="lbl">Predikat</div></div>
        </div>
        <div class="footer">
          <p>Arsip digital dicetak otomatis pada tanggal: ${new Date().toLocaleString('id-ID')}</p>
          <p>Seluruh rekaman kalkulasi nilai akhir di atas bersifat sah dan tersinkronisasi dalam server pangkalan data lembaga.</p>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto p-1 antialiased text-slate-600">
      
      {/* Top Bar Header */}
      <div className="flex items-center justify-between gap-4 bg-white rounded-xl p-4 border border-slate-200/60 shadow-xs">
        <div>
          <h1 className="text-base font-semibold text-slate-800 tracking-tight">Laporan Hasil Belajar Akademik</h1>
          <p className="text-xs text-slate-400 mt-0.5">Transkrip parameter pencapaian kurikulum individual siswa per periode ajaran berjalan.</p>
        </div>
      </div>

      {/* Workspace Control Filters */}
      <div className="bg-white rounded-xl p-3.5 shadow-xs border border-slate-200/60 flex flex-wrap gap-4 items-end justify-between">
        <div className="flex flex-wrap gap-3">
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Tahun Ajaran</label>
            <select
              value={tahunAjaran}
              onChange={e => setTahunAjaran(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium outline-none focus:border-slate-400 transition-colors"
            >
              {tahunAjaranList.map(ta => (
                <option key={ta} value={ta}>{ta}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Semester</label>
            <select
              value={semester}
              onChange={e => setSemester(e.target.value as 'ganjil' | 'genap')}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium outline-none focus:border-slate-400 transition-colors"
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" /> Eksport Dokumen Rapot
          </button>
        )}
      </div>

      {/* Corporate Meta Profile Strip */}
      <div className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          {student?.avatar ? (
            <img src={student.avatar} alt="" className="w-11 h-11 rounded-lg object-cover border border-slate-200 bg-slate-50" />
          ) : (
            <div className="w-11 h-11 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center text-sm font-semibold border border-slate-700">
              <User className="w-5 h-5 text-slate-400" />
            </div>
          )}
          <div>
            <h2 className="text-sm font-semibold text-slate-800 leading-none">{student?.name}</h2>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">
              NIS: <span className="font-mono text-slate-600">{student?.nis}</span> &bull; Kelas: <span className="text-slate-600">{className}</span> &bull; Periode: <span className="text-slate-600">{tahunAjaran} ({semester === 'ganjil' ? 'Ganjil' : 'Genap'})</span>
            </p>
          </div>
        </div>
      </div>

      {nilaiRapot.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-slate-200/60 shadow-xs text-center">
          <BookOpenCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">Record entri nilai rapor kosong.</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Sistem belum mendeteksi publikasi transkrip mata pelajaran dari instruktur penguji.</p>
        </div>
      ) : (
        <>
          {/* Performance Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
            <div className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] uppercase font-semibold tracking-wider">Rata-Rata</span>
              </div>
              <p className="text-xl font-bold text-slate-800">{stats.rataRata}</p>
            </div>
            
            <div className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Award className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] uppercase font-semibold tracking-wider">Tertinggi</span>
              </div>
              <p className="text-xl font-bold text-slate-800">{stats.tertinggi}</p>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-xs">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block mb-1">Terendah</span>
              <p className="text-xl font-bold text-slate-500">{stats.terendah}</p>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-xs">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block mb-1">Predikat Evaluasi</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <p className="text-xl font-bold text-slate-800">{stats.predikatRata}</p>
                <p className="text-[10px] text-slate-400 font-medium">({predikatLabel(stats.predikatRata)})</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 border border-slate-200/60 shadow-xs col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <BookOpenCheck className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] uppercase font-semibold tracking-wider">Kuantitas Mapel</span>
              </div>
              <p className="text-xl font-bold text-slate-800">{stats.totalMapel}</p>
            </div>
          </div>

          {/* Ledger Table Section */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200/60 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
              <BookOpenCheck className="w-3.5 h-3.5 text-slate-500" />
              <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wide">Spesifikasi Komponen Akademik</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50/40 border-b border-slate-200/60 text-slate-400 font-medium text-left">
                    <th className="px-4 py-2.5 font-medium w-12 text-center">No</th>
                    <th className="px-4 py-2.5 font-medium">Mata Pelajaran</th>
                    <th className="px-4 py-2.5 font-medium w-20 text-center">Tugas</th>
                    <th className="px-4 py-2.5 font-medium w-20 text-center">UTS</th>
                    <th className="px-4 py-2.5 font-medium w-20 text-center">UAS</th>
                    <th className="px-4 py-2.5 font-medium w-24 text-center">Nilai Akhir</th>
                    <th className="px-4 py-2.5 font-medium w-20 text-center">Predikat</th>
                    <th className="px-4 py-2.5 font-medium">Catatan Reviewer Instruktur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {nilaiRapot.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-4 py-2.5 text-center text-slate-400 font-mono">{idx + 1}</td>
                      <td className="px-4 py-2.5 font-semibold text-slate-800">{item.mataPelajaran}</td>
                      <td className="px-4 py-2.5 text-center text-slate-600 font-medium">{item.nilaiTugas}</td>
                      <td className="px-4 py-2.5 text-center text-slate-600 font-medium">{item.nilaiUTS}</td>
                      <td className="px-4 py-2.5 text-center text-slate-600 font-medium">{item.nilaiUAS}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className="font-bold text-slate-900">{item.nilaiAkhir}</span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-bold rounded ${predikatColor(item.predikat)}`}>
                          {item.predikat}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-400 leading-normal text-[11px]">{item.catatanGuru || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <p>Total Cakupan Mata Pelajaran: <strong className="text-slate-700 font-semibold">{stats.totalMapel} Record</strong></p>
              <p className="flex items-center gap-2">
                Akumulasi Rata-Rata: <strong className="text-slate-800 font-bold">{stats.rataRata}</strong>
                <span className="text-slate-200">|</span>
                Kualifikasi: <strong className="text-slate-700 font-semibold">{stats.predikatRata} ({predikatLabel(stats.predikatRata)})</strong>
              </p>
            </div>
          </div>

          {/* Minimalist Grid Distribution Bars */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-xs">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-3">
              <BarChart2 className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-slate-700 text-xs uppercase tracking-wide">Distribusi Deviasi Nilai Akhir</h3>
            </div>
            <div className="space-y-2.5">
              {nilaiRapot.map(item => {
                const pct = Math.max(item.nilaiAkhir, 5);
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-32 text-xs font-medium text-slate-500 truncate">{item.mataPelajaran}</div>
                    <div className="flex-1 bg-slate-50 border border-slate-100 rounded h-5 relative overflow-hidden">
                      <div
                        className="h-full bg-slate-800 rounded-xs transition-all flex items-center justify-end pr-2"
                        style={{ width: `${pct}%` }}
                      >
                        {pct > 20 && <span className="text-[10px] text-white font-mono font-bold">{item.nilaiAkhir}</span>}
                      </div>
                    </div>
                    <div className="w-8 text-right">
                      <span className="text-xs font-mono font-bold text-slate-700">{item.predikat}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
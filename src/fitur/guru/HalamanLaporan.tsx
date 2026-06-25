import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTeachers, getClasses, getStudentsByClass, getAttendanceByDateRange } from '../../data/store';
import { FileText, Download, Filter } from 'lucide-react';

export default function ReportPage() {
  const { user } = useAuth();
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = today.toISOString().split('T')[0];

  const [selectedClass, setSelectedClass] = useState('');
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  const teacher = useMemo(() => getTeachers().find(t => t.id === user?.id), [user]);
  const classes = useMemo(() => getClasses().filter(c => teacher?.classIds.includes(c.id)), [teacher]);

  const reportData = useMemo(() => {
    if (!selectedClass) return [];
    const students = getStudentsByClass(selectedClass).sort((a, b) => a.name.localeCompare(b.name));
    const attendance = getAttendanceByDateRange(startDate, endDate, selectedClass);

    return students.map(student => {
      const studentAtt = attendance.filter(a => a.studentId === student.id);
      const hadir = studentAtt.filter(a => a.status === 'hadir').length;
      const izin = studentAtt.filter(a => a.status === 'izin').length;
      const sakit = studentAtt.filter(a => a.status === 'sakit').length;
      const alpha = studentAtt.filter(a => a.status === 'alpha').length;
      const total = hadir + izin + sakit + alpha;
      const percentage = total > 0 ? Math.round((hadir / total) * 100) : 0;

      const dailyStatus: Record<string, string> = {};
      studentAtt.forEach(a => { dailyStatus[a.date] = a.status; });

      return {
        ...student,
        hadir,
        izin,
        sakit,
        alpha,
        total,
        percentage,
        dailyStatus,
      };
    });
  }, [selectedClass, startDate, endDate]);

  const dates = useMemo(() => {
    if (!selectedClass) return [];
    const attendance = getAttendanceByDateRange(startDate, endDate, selectedClass);
    return [...new Set(attendance.map(a => a.date))].sort();
  }, [selectedClass, startDate, endDate]);

  const overallStats = useMemo(() => {
    const total = reportData.reduce((acc, s) => acc + s.total, 0);
    const hadir = reportData.reduce((acc, s) => acc + s.hadir, 0);
    const izin = reportData.reduce((acc, s) => acc + s.izin, 0);
    const sakit = reportData.reduce((acc, s) => acc + s.sakit, 0);
    const alpha = reportData.reduce((acc, s) => acc + s.alpha, 0);
    return { total, hadir, izin, sakit, alpha, percentage: total > 0 ? Math.round((hadir / total) * 100) : 0 };
  }, [reportData]);

  const statusClassName = (status: string) => {
    switch (status) {
      case 'hadir': return 'border-slate-900 bg-slate-900 text-white font-bold';
      case 'izin': return 'border-slate-900 bg-white text-slate-900 font-bold';
      case 'sakit': return 'border-slate-400 bg-white text-slate-600 font-bold';
      case 'alpha': return 'border-slate-300 bg-white text-slate-400 line-through';
      default: return 'border-slate-200 bg-slate-50/50 text-slate-300';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'hadir': return 'H';
      case 'izin': return 'I';
      case 'sakit': return 'S';
      case 'alpha': return 'A';
      default: return '-';
    }
  };

  const handleExportCSV = () => {
    if (reportData.length === 0) return;
    const className = classes.find(c => c.id === selectedClass)?.name || '';
    const headers = ['No', 'Nama', 'NIS', 'Hadir', 'Izin', 'Sakit', 'Alpha', 'Total', 'Persentase'];
    const rows = reportData.map((s, i) => [
      i + 1, s.name, s.nis, s.hadir, s.izin, s.sakit, s.alpha, s.total, `${s.percentage}%`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Absensi_${className}_${startDate}_${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-white p-4 text-xs text-slate-700 antialiased selection:bg-slate-200 space-y-4">
      
      {/* HEADER BAR */}
      <header className="border-b border-slate-300 pb-3">
        <h1 className="text-base font-bold tracking-tight text-slate-950 uppercase">
          Laporan & Kearsipan Absensi Siswa
        </h1>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Kompilasi matriks kehadiran komprehensif, pelacakan histori data berkala, dan penarikan berkas log eksternal.
        </p>
      </header>

      {/* FILTERS CONTROL MATRIX */}
      <div className="border border-slate-300 p-3 bg-white">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 mb-3">
          <Filter className="w-3 h-3 text-slate-400" />
          <span>Konfigurasi Parameter Penayangan Laporan</span>
        </div>
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">Kompartemen Kelas</label>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 focus:border-slate-900 text-xs font-mono font-bold text-slate-800 outline-none cursor-pointer min-w-[160px] rounded-none"
              >
                <option value="">SELECT_CLASS...</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">Batas Awal Log</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={e => setStartDate(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 focus:border-slate-900 text-xs font-mono font-bold text-slate-800 outline-none rounded-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">Batas Akhir Log</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={e => setEndDate(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 focus:border-slate-900 text-xs font-mono font-bold text-slate-800 outline-none rounded-none" 
              />
            </div>
          </div>
          
          {reportData.length > 0 && (
            <button 
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-950 border border-slate-900 text-white text-xs font-mono font-bold tracking-wide transition-colors flex items-center gap-1.5 cursor-pointer rounded-none"
            >
              <Download className="w-3.5 h-3.5" /> EXPORT_TO_CSV
            </button>
          )}
        </div>
      </div>

      {!selectedClass ? (
        <div className="py-24 text-center border border-dashed border-slate-300 bg-slate-50/50 rounded-none">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">AWAITING_QUERY_PARAMETERS</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Tentukan parameter target kelas binaan di atas untuk memetakan visualisasi histori rekapitulasi data.</p>
        </div>
      ) : (
        <>
          {/* MONOCHROME OVERALL METRIC LOGS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'TOTAL_RECORDS', value: overallStats.total },
              { label: 'INDEXED_HADIR', value: overallStats.hadir },
              { label: 'INDEXED_IZIN', value: overallStats.izin },
              { label: 'INDEXED_SAKIT', value: overallStats.sakit },
              { label: 'INDEXED_ALPHA', value: overallStats.alpha },
              { label: 'AVG_ATTENDANCE', value: `${overallStats.percentage}%` }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-3 border border-slate-300 flex flex-col justify-between min-h-[75px] rounded-none">
                <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 border-b border-slate-200 pb-1">{stat.label}</span>
                <p className="text-base font-bold font-mono text-slate-900 mt-1 tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* MASTER SUMMARY REKAP TABLE */}
          <div className="bg-white border border-slate-300 overflow-hidden rounded-none">
            <div className="px-4 py-2.5 border-b border-slate-300 bg-slate-50 font-mono flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Matriks Komparasi Absensi & Lembar Log Harian</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-300 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-3 py-2.5 w-12 text-center border-r border-slate-200">NO</th>
                    <th className="px-3 py-2.5 w-52 border-r border-slate-200">IDENTITAS_SISWA</th>
                    <th className="px-3 py-2.5 w-24 border-r border-slate-200">NIS_CODE</th>
                    <th className="px-2 py-2.5 w-10 text-center text-slate-900 border-r border-slate-200 bg-slate-100/50">H</th>
                    <th className="px-2 py-2.5 w-10 text-center text-slate-800 border-r border-slate-200">I</th>
                    <th className="px-2 py-2.5 w-10 text-center text-slate-800 border-r border-slate-200">S</th>
                    <th className="px-2 py-2.5 w-10 text-center text-slate-800 border-r border-slate-200">A</th>
                    <th className="px-2 py-2.5 w-12 text-center border-r border-slate-200">TOT</th>
                    <th className="px-3 py-2.5 w-16 text-center border-r border-slate-200">%_RATE</th>
                    
                    {/* Header Tanggal Dinamis */}
                    {dates.map(d => (
                      <th key={d} className="px-1 py-2.5 text-center text-[9px] font-bold border-r border-slate-200 w-11 text-slate-500 bg-slate-50/60 last:border-r-0">
                        {new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }).toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {reportData.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors text-xs">
                      <td className="px-3 py-2 font-mono text-slate-400 text-center border-r border-slate-200">{idx + 1}</td>
                      <td className="px-3 py-2 font-bold text-slate-900 uppercase truncate tracking-tight border-r border-slate-200">{student.name}</td>
                      <td className="px-3 py-2 font-mono text-slate-500 font-bold border-r border-slate-200">{student.nis}</td>
                      <td className="text-center px-2 py-2 font-mono font-bold text-slate-900 bg-slate-50/40 border-r border-slate-200">{student.hadir}</td>
                      <td className="text-center px-2 py-2 font-mono font-bold text-slate-700 border-r border-slate-200">{student.izin}</td>
                      <td className="text-center px-2 py-2 font-mono text-slate-600 font-bold border-r border-slate-200">{student.sakit}</td>
                      <td className="text-center px-2 py-2 font-mono text-slate-400 line-through border-r border-slate-200">{student.alpha}</td>
                      <td className="text-center px-2 py-2 font-mono text-slate-800 font-bold border-r border-slate-200">{student.total}</td>
                      <td className="text-center px-3 py-2 border-r border-slate-200">
                        <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 border rounded-none ${
                          student.percentage >= 80 ? 'bg-slate-900 border-slate-900 text-white' :
                          student.percentage >= 60 ? 'bg-white border-slate-900 text-slate-900' :
                          'bg-white border-slate-300 text-slate-400 line-through'
                        }`}>
                          {student.percentage}%
                        </span>
                      </td>

                      {/* Render Grid Log Harian Monokrom */}
                      {dates.map((d, dIdx) => (
                        <td key={d} className={`text-center px-0.5 py-1.5 align-middle border-r border-slate-200 ${dIdx === dates.length - 1 ? 'border-r-0' : ''}`}>
                          <span className={`text-[9px] font-mono border w-5 h-5 inline-flex items-center justify-center rounded-none ${statusClassName(student.dailyStatus[d] || '')}`}>
                            {statusLabel(student.dailyStatus[d] || '')}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {reportData.length === 0 && (
              <div className="py-12 text-center font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">NO_LOG_DATA_FOUND_WITHIN_RANGE</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
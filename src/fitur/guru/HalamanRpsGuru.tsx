import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import type { RpsMeetingRow } from '../../data/store';
import { getRpsDocument, saveRpsDocument } from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';

type HalamanRpsGuruProps = {
  teacherId: string;
  classId: string;
  className: string;
  subject: string;
  onBack: () => void;
  setNotice: (msg: string) => void;
};

function createDefaultRows(): (RpsMeetingRow & { tanggal?: string })[] {
  return Array.from({ length: 10 }, (_, index) => ({
    pertemuan: String(index + 1),
    tanggal: '',
    kemampuanAkhir: '',
    materiPembelajaran: '',
    indikator: '',
    outputPembelajaran: '',
    strategiPembelajaran: '',
    bentukPembelajaran: 'Tatap muka di kelas',
    estimasiWaktu: '2 x 40 menit',
    bobotPenilaian: '',
  }));
}

export default function HalamanRpsGuru({
  teacherId,
  classId,
  className,
  subject,
  onBack,
  setNotice,
}: HalamanRpsGuruProps) {
  const storeVersion = useStoreVersion();
  const [tingkatSekolah, setTingkatSekolah] = useState('SMA / SMK');
  const [kurikulum, setKurikulum] = useState('Kurikulum Merdeka');
  const [tahunAjaran, setTahunAjaran] = useState('2025/2026');
  const [rows, setRows] = useState<(RpsMeetingRow & { tanggal?: string })[]>(createDefaultRows());
  const [docId, setDocId] = useState('');

  const existing = useMemo(() => getRpsDocument(teacherId, classId, subject), [teacherId, classId, subject, storeVersion]);

  useEffect(() => {
    if (!existing) {
      setDocId('');
      setRows(createDefaultRows());
      return;
    }
    setDocId(existing.id);
    setTingkatSekolah(existing.programStudi || 'SMA / SMK');
    setKurikulum(existing.fakultas || 'Kurikulum Merdeka');
    setTahunAjaran(existing.sks || '2025/2026');
    setRows(existing.rows.length > 0 ? existing.rows : createDefaultRows());
  }, [existing]);

  const updateCell = (index: number, key: keyof RpsMeetingRow | 'tanggal', value: string) => {
    setRows((prev) => prev.map((item, rowIndex) => (rowIndex === index ? { ...item, [key]: value } : item)));
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        pertemuan: String(prev.length + 1),
        tanggal: '',
        kemampuanAkhir: '',
        materiPembelajaran: '',
        indikator: '',
        outputPembelajaran: '',
        strategiPembelajaran: '',
        bentukPembelajaran: 'Tatap muka di kelas',
        estimasiWaktu: '2 x 40 menit',
        bobotPenilaian: '',
      },
    ]);
  };

  const handleRemoveRow = () => {
    setRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  };

  const handleSave = () => {
    saveRpsDocument({
      id: docId || undefined,
      teacherId,
      classId,
      className,
      subject,
      programStudi: tingkatSekolah.trim() || '-',
      fakultas: kurikulum.trim() || '-',
      sks: tahunAjaran.trim() || '-',
      rows: rows as RpsMeetingRow[],
    });
    setNotice(`Rencana Pelaksanaan Pembelajaran (RPP/RPS) ${subject} kelas ${className} berhasil disimpan.`);
  };

  return (
    <div className="w-full bg-white text-[11px] text-slate-900 antialiased p-2 space-y-4">
      
      {/* BAR AKSI UTAMA */}
      <div className="flex items-center justify-between border-b border-slate-400 pb-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 border border-slate-400 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 cursor-pointer rounded-none"
        >
          <ArrowLeft className="h-3 w-3" /> Kembali
        </button>
        
        <div className="text-center">
          <h2 className="text-sm font-bold uppercase tracking-tight">RENCANA PELAKSANAAN PEMBELAJARAN (RPP) / RPS</h2>
          <p className="text-[10px] text-slate-500 font-mono tracking-tighter">ADMINISTRASI PERENCANAAN AGENDA MENGAJAR GURU</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-1 border border-slate-400 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-100 cursor-pointer rounded-none"
          >
            <Plus className="h-3 w-3" /> Baris (+)
          </button>
          <button
            type="button"
            onClick={handleRemoveRow}
            className="inline-flex items-center gap-1 border border-slate-400 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 hover:bg-rose-50 cursor-pointer rounded-none"
          >
            <Trash2 className="h-3 w-3" /> Baris (-)
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1 border border-slate-900 bg-slate-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-slate-800 cursor-pointer rounded-none"
          >
            <Save className="h-3 w-3" /> Simpan Dokumen
          </button>
        </div>
      </div>

      {/* METADATA IDENTITAS */}
      <div className="border-t border-b border-slate-400 py-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 font-medium">
        <div className="flex items-center">
          <span className="w-28 uppercase font-bold text-slate-600 text-[10px]">Mata Pelajaran</span>
          <span className="mx-2">:</span>
          <input value={subject} readOnly className="flex-1 border-b border-slate-300 bg-slate-50 px-1 py-0.5 text-xs font-bold text-slate-800 focus:outline-none rounded-none" />
        </div>
        
        <div className="flex items-center">
          <span className="w-28 uppercase font-bold text-slate-600 text-[10px]">Tingkat Sekolah</span>
          <span className="mx-2">:</span>
          <input value={tingkatSekolah} onChange={(e) => setTingkatSekolah(e.target.value)} placeholder="SD / SMP / SMA / SMK" className="flex-1 border-b border-slate-300 bg-white px-1 py-0.5 text-xs text-slate-800 focus:border-slate-500 focus:outline-none rounded-none" />
        </div>

        <div className="flex items-center">
          <span className="w-28 uppercase font-bold text-slate-600 text-[10px]">Kurikulum Utama</span>
          <span className="mx-2">:</span>
          <input value={kurikulum} onChange={(e) => setKurikulum(e.target.value)} placeholder="Kurikulum Merdeka / K13" className="flex-1 border-b border-slate-300 bg-white px-1 py-0.5 text-xs text-slate-800 focus:border-slate-500 focus:outline-none rounded-none" />
        </div>

        <div className="flex items-center">
          <span className="w-28 uppercase font-bold text-slate-600 text-[10px]">TA / Ruang Kelas</span>
          <span className="mx-2">:</span>
          <div className="flex flex-1 gap-2">
            <input value={tahunAjaran} onChange={(e) => setTahunAjaran(e.target.value)} placeholder="2025/2026" className="w-20 border-b border-slate-300 bg-white px-1 py-0.5 text-xs text-slate-800 focus:border-slate-500 focus:outline-none rounded-none" />
            <input value={className} readOnly className="flex-1 border-b border-slate-300 bg-slate-50 px-1 py-0.5 text-xs font-bold text-slate-800 focus:outline-none rounded-none" />
          </div>
        </div>
      </div>

      {/* TABEL JURNAL AGENDA - AUTO EXPAND */}
      <div className="overflow-x-auto border border-slate-400">
        <table className="w-full min-w-[1400px] border-collapse bg-white text-left table-fixed">
          <thead>
            <tr className="bg-slate-100 text-[10px] font-bold uppercase tracking-tight text-slate-800 border-b border-slate-400">
              <th className="border-r border-slate-300 p-1.5 text-center w-[45px]">Pert.</th>
              <th className="border-r border-slate-300 p-1.5 text-center w-[110px]">Tanggal</th>
              
              {/* Kolom yang di-LOCK Kanan Kiri (Hanya membesar ke atas bawah jika panjang) */}
              <th className="border-r border-slate-300 p-1.5 w-[220px]">Tujuan Pembelajaran (TP) / CP</th>
              <th className="border-r border-slate-300 p-1.5 w-[220px]">Materi Pokok Pembelajaran</th>
              <th className="border-r border-slate-300 p-1.5 w-[220px]">Indikator Ketercapaian (IKTP)</th>
              
              {/* Kolom yang BEBAS (Bisa melar kanan kiri atas bawah jika panjang) */}
              <th className="border-r border-slate-300 p-1.5 min-w-[220px] max-w-none">Aktivitas Kegiatan Siswa</th>
              <th className="border-r border-slate-300 p-1.5 min-w-[220px] max-w-none">Metode / Strategi Guru</th>
              
              <th className="border-r border-slate-300 p-1.5 w-[130px]">Bentuk Belajar</th>
              <th className="border-r border-slate-300 p-1.5 w-[90px]">Durasi</th>
              <th className="p-1.5 w-[130px]">Tugas PR / Remedial</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300">
            {rows.map((row, index) => (
              <tr key={`${row.pertemuan}-${index}`} className="align-top">
                {/* Nomor Pertemuan */}
                <td className="border-r border-slate-300 p-1 text-center font-bold text-slate-700 bg-slate-50">
                  <input value={row.pertemuan} onChange={(e) => updateCell(index, 'pertemuan', e.target.value)} className="w-full bg-transparent text-center font-bold text-slate-800 focus:outline-none" />
                </td>

                {/* Tanggal Pelaksanaan */}
                <td className="border-r border-slate-300 p-1 text-center bg-slate-50/50">
                  <input 
                    type="date" 
                    value={row.tanggal || ''} 
                    onChange={(e) => updateCell(index, 'tanggal', e.target.value)} 
                    className="w-full border border-slate-200 px-1 py-0.5 text-xs text-center font-mono focus:outline-none rounded-none bg-white" 
                  />
                </td>
                
                {/* 1. TP / CP (LOCKED: Hanya Melar Ke Bawah) */}
                <td className="border-r border-slate-300 p-1 whitespace-normal break-words">
                  <textarea 
                    value={row.kemampuanAkhir} 
                    onChange={(e) => updateCell(index, 'kemampuanAkhir', e.target.value)} 
                    className="w-full min-h-[56px] h-auto border border-slate-200 p-1 text-xs resize-y focus:outline-none rounded-none font-sans field-sizing-content overflow-hidden" 
                  />
                </td>
                
                {/* 2. Materi Pokok (LOCKED: Hanya Melar Ke Bawah) */}
                <td className="border-r border-slate-300 p-1 whitespace-normal break-words">
                  <textarea 
                    value={row.materiPembelajaran} 
                    onChange={(e) => updateCell(index, 'materiPembelajaran', e.target.value)} 
                    className="w-full min-h-[56px] h-auto border border-slate-200 p-1 text-xs resize-y focus:outline-none rounded-none font-sans field-sizing-content overflow-hidden" 
                  />
                </td>
                
                {/* 3. Indikator (LOCKED: Hanya Melar Ke Bawah) */}
                <td className="border-r border-slate-300 p-1 whitespace-normal break-words">
                  <textarea 
                    value={row.indikator} 
                    onChange={(e) => updateCell(index, 'indikator', e.target.value)} 
                    className="w-full min-h-[56px] h-auto border border-slate-200 p-1 text-xs resize-y focus:outline-none rounded-none font-sans field-sizing-content overflow-hidden" 
                  />
                </td>
                
                {/* 4. Kegiatan Siswa (BEBAS: Bisa Melar Kanan-Kiri & Atas-Bawah) */}
                <td className="border-r border-slate-300 p-1">
                  <textarea 
                    value={row.outputPembelajaran} 
                    onChange={(e) => updateCell(index, 'outputPembelajaran', e.target.value)} 
                    className="w-full min-h-[56px] h-auto border border-slate-200 p-1 text-xs resize focus:outline-none rounded-none font-sans field-sizing-content" 
                  />
                </td>
                
                {/* 5. Strategi Guru (BEBAS: Bisa Melar Kanan-Kiri & Atas-Bawah) */}
                <td className="border-r border-slate-300 p-1">
                  <textarea 
                    value={row.strategiPembelajaran} 
                    onChange={(e) => updateCell(index, 'strategiPembelajaran', e.target.value)} 
                    className="w-full min-h-[56px] h-auto border border-slate-200 p-1 text-xs resize focus:outline-none rounded-none font-sans field-sizing-content" 
                  />
                </td>
                
                {/* Bentuk Pembelajaran */}
                <td className="border-r border-slate-300 p-1">
                  <input value={row.bentukPembelajaran} onChange={(e) => updateCell(index, 'bentukPembelajaran', e.target.value)} className="w-full border border-slate-200 px-1 py-0.5 text-xs rounded-none focus:outline-none" />
                </td>
                
                {/* Alokasi Waktu */}
                <td className="border-r border-slate-300 p-1">
                  <input value={row.estimasiWaktu} onChange={(e) => updateCell(index, 'estimasiWaktu', e.target.value)} className="w-full border border-slate-200 px-1 py-0.5 text-xs rounded-none focus:outline-none" />
                </td>
                
                {/* PR / Remedial */}
                <td className="p-1">
                  <input value={row.bobotPenilaian} onChange={(e) => updateCell(index, 'bobotPenilaian', e.target.value)} className="w-full border border-slate-200 px-1 py-0.5 text-xs rounded-none focus:outline-none" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
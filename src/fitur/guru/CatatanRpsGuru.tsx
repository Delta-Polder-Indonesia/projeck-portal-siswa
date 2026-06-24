import { useMemo, useState } from 'react';
import { BookMarked, Save } from 'lucide-react';
import { getTeacherLessonNotes, upsertTeacherLessonNote } from '../../data/store';
import { useStoreVersion } from '../../hooks/useStoreVersion';

type CatatanRpsGuruProps = {
  teacherId: string;
  classId: string;
  className: string;
  subject: string;
  setNotice: (msg: string) => void;
};

export default function CatatanRpsGuru({
  teacherId,
  classId,
  className,
  subject,
  setNotice,
}: CatatanRpsGuruProps) {
  const storeVersion = useStoreVersion();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [materi, setMateri] = useState('');
  const [adaPr, setAdaPr] = useState(false);
  const [prDetail, setPrDetail] = useState('');
  const [catatan, setCatatan] = useState('');

  const notes = useMemo(
    () => getTeacherLessonNotes(teacherId, classId, subject),
    [teacherId, classId, subject, storeVersion],
  );

  const handleSave = () => {
    if (!materi.trim()) {
      setNotice('Materi pembelajaran wajib diisi sebelum simpan catatan RPS.');
      return;
    }

    upsertTeacherLessonNote({
      teacherId,
      classId,
      subject,
      date,
      materi: materi.trim(),
      adaPr,
      prDetail: adaPr ? prDetail.trim() : '',
      catatan: catatan.trim(),
    });

    setMateri('');
    setAdaPr(false);
    setPrDetail('');
    setCatatan('');
    setNotice(`Catatan RPS ${subject} kelas ${className} berhasil disimpan.`);
  };

  return (
    <section className="rounded border border-slate-200 bg-white p-3">
      <div className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
        <BookMarked className="h-4 w-4 text-slate-700" />
        <h4 className="text-xs font-bold tracking-wide text-slate-800 uppercase">
          Catatan RPS: {subject} - {className}
        </h4>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">Tanggal Mengajar</label>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">Materi Hari Ini</label>
          <input
            value={materi}
            onChange={(event) => setMateri(event.target.value)}
            placeholder="Contoh: Persamaan Linear Dua Variabel"
            className="w-full rounded border border-slate-300 px-2 py-1.5 text-xs"
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">Catatan Tambahan</label>
          <textarea
            value={catatan}
            onChange={(event) => setCatatan(event.target.value)}
            placeholder="Ringkasan progres kelas, kendala, atau tindak lanjut"
            className="h-16 w-full rounded border border-slate-300 px-2 py-1.5 text-xs"
          />
        </div>
      </div>

      <div className="mt-2 rounded border border-slate-200 bg-slate-50 p-2">
        <label className="inline-flex items-center gap-2 text-xs text-slate-700">
          <input
            type="checkbox"
            checked={adaPr}
            onChange={(event) => setAdaPr(event.target.checked)}
            className="h-3 w-3 accent-slate-700"
          />
          Ada PR untuk pertemuan ini
        </label>
        {adaPr ? (
          <input
            value={prDetail}
            onChange={(event) => setPrDetail(event.target.value)}
            placeholder="Detail PR: halaman, soal, deadline"
            className="mt-2 w-full rounded border border-slate-300 px-2 py-1.5 text-xs"
          />
        ) : null}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1 rounded bg-slate-900 px-3 py-1.5 text-[10px] font-bold tracking-wide text-white uppercase hover:bg-slate-800"
        >
          <Save className="h-3 w-3" /> Simpan Catatan
        </button>
      </div>

      <div className="mt-3 border-t border-slate-200 pt-2">
        <p className="mb-1 text-[10px] font-bold tracking-wide text-slate-500 uppercase">Riwayat Materi Sebelumnya</p>
        <div className="max-h-48 space-y-1 overflow-y-auto">
          {notes.map((item) => (
            <div key={item.id} className="rounded border border-slate-200 p-2 text-xs">
              <p className="font-semibold text-slate-800">{item.date} - {item.materi}</p>
              <p className="text-slate-600">Catatan: {item.catatan || '-'}</p>
              <p className="text-slate-600">PR: {item.adaPr ? item.prDetail || 'Ada PR' : 'Tidak ada PR'}</p>
            </div>
          ))}
          {notes.length === 0 ? (
            <p className="text-xs text-slate-400">Belum ada riwayat materi untuk kelas ini.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

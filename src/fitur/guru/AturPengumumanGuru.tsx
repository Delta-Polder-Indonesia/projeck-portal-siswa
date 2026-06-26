import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  addClassAnnouncement,
  deleteClassAnnouncement,
  getClassAnnouncements,
  getClasses,
  getTeachers,
} from '../../data/store';
import { Megaphone, Trash2, Calendar, Radio } from 'lucide-react';
import { useStoreVersion } from '../../hooks/useStoreVersion';

export default function AturPengumumanGuru() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  // Sinkronisasi data manifest kelas binaan guru
  const teacherClasses = useMemo(() => {
    const teacher = getTeachers().find(item => item.id === user?.id);
    return getClasses().filter(item => teacher?.classIds.includes(item.id));
  }, [user, storeVersion]);

  useEffect(() => {
    if (!selectedClassId && teacherClasses.length > 0) {
      setSelectedClassId(teacherClasses[0].id);
    }
  }, [teacherClasses, selectedClassId]);

  const classAnnouncements = useMemo(
    () => (selectedClassId ? getClassAnnouncements(selectedClassId) : []),
    [selectedClassId, storeVersion],
  );

  const handleAddAnnouncement = () => {
    if (!selectedClassId || !title.trim() || !message.trim() || !user) return;
    addClassAnnouncement({
      id: `a_${Date.now()}`,
      classId: selectedClassId,
      title: title.trim(),
      message: message.trim(),
      content: message.trim(), // alias for compatibility
      createdBy: user.id,
      createdAt: Date.now(),
    });
    setTitle('');
    setMessage('');
  };

  return (
    <div className="w-full bg-white p-4 text-xs text-slate-700 antialiased">
      {/* HEADER CONTROL CONTAINER */}
      <header className="flex items-center justify-between border-b border-slate-300 pb-3">
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-950 uppercase">
            Sistem Informasi Akademik
          </h1>
          <p className="text-[11px] text-slate-500">
            Panel manajemen maklumat, instruksi akademis, dan pengumuman resmi kelas binaan.
          </p>
        </div>
        <div className="flex items-center gap-2 border-l border-slate-300 pl-4 text-right">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Target Kelas
            </span>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="mt-0.5 cursor-pointer border border-slate-900 bg-white px-2 py-1 text-xs font-bold text-slate-900 uppercase outline-none"
            >
              {teacherClasses.map(cls => (
                <option key={cls.id} value={cls.id}>
                  {cls.name.toUpperCase()}
                </option>
              ))}
              {teacherClasses.length === 0 && <option value="">NULL_CLASS</option>}
            </select>
          </div>
        </div>
      </header>

      {/* TWO-COLUMN COMMAND WORKSPACE */}
      <div className="grid items-start gap-4 pt-4 lg:grid-cols-12">
        {/* PANEL KIRI: FORMULIR INPUT EDITOR */}
        <section className="space-y-3 border border-slate-300 p-3 lg:col-span-5">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2 text-xs font-bold tracking-wider text-slate-900 uppercase">
            <Radio className="h-4 w-4 text-slate-950" />
            <span>Tulis Maklumat Baru</span>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wide text-slate-600 uppercase">
              Judul Pengumuman
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ketik topik maklumat utama..."
              className="w-full border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none placeholder:text-slate-300 focus:border-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wide text-slate-600 uppercase">
              Isi Konten Pesan
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tulis deskripsi atau instruksi formal kelas di sini..."
              className="field-sizing-content w-full min-h-[120px] h-auto resize-y border border-slate-300 bg-white px-2.5 py-1.5 text-xs leading-4 text-slate-800 outline-none overflow-hidden placeholder:text-slate-300 focus:border-slate-900"
            />
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={handleAddAnnouncement}
              disabled={!title.trim() || !message.trim()}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 border border-slate-900 bg-slate-900 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase transition-colors hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Megaphone className="h-3.5 w-3.5" />
              <span>SIARKAN PENGUMUMAN</span>
            </button>
          </div>
        </section>

        {/* PANEL KANAN: LIVE STREAM LOG LIST */}
        <section className="flex flex-col border border-slate-300 p-3 lg:col-span-7">
          <div className="mb-3 flex items-center gap-2 border-b border-slate-900 pb-2 text-xs font-bold tracking-wider text-slate-900 uppercase">
            <Megaphone className="h-4 w-4 text-slate-950" />
            <span>Arsip Siaran Aktif Kelas ({classAnnouncements.length})</span>
          </div>

          <div className="max-h-[510px] space-y-3 overflow-y-auto pr-0.5">
            {classAnnouncements.map(item => (
              <div
                key={item.id}
                className="border border-slate-300 bg-white p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-bold tracking-tight text-slate-900">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString('id-ID')} &bull;{' '}
                        {new Date(item.createdAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Button Delete - Line Style Minimalis Stark */}
                  <button
                    type="button"
                    onClick={() => deleteClassAnnouncement(item.id)}
                    className="shrink-0 cursor-pointer border border-slate-300 bg-white p-1.5 text-slate-500 transition-colors hover:border-rose-600 hover:bg-rose-50 hover:text-rose-600"
                    title="Hapus maklumat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="mt-2 border-t border-slate-200 pt-2 text-xs leading-4 text-slate-700 whitespace-pre-line">
                  {item.message}
                </p>
              </div>
            ))}

            {classAnnouncements.length === 0 && (
              <div className="border border-dashed border-slate-300 bg-slate-50/50 py-14 text-center">
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  EMPTY_BROADCAST_FEED
                </p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Belum ada maklumat resmi yang disebarkan ke ruang kelas ini.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
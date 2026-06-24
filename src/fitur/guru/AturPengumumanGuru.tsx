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
      createdBy: user.id,
      createdAt: Date.now(),
    });
    setTitle('');
    setMessage('');
  };

  return (
    /* PERUBAHAN 1: Mengubah mx-auto max-w-5xl menjadi w-full agar full layar */
    <div className="w-full space-y-4 bg-white p-2 text-xs text-slate-600 antialiased selection:bg-slate-200">
      {/* HEADER CONTROL CONTAINER */}
      <div className="flex flex-col justify-between gap-3 rounded-sm border border-slate-200/80 bg-white p-3 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h1 className="text-xs font-bold uppercase tracking-tight text-slate-900">
            Manajemen Maklumat & Pengumuman
          </h1>
          <p className="mt-0.5 text-[10px] text-slate-400">
            Penyiaran informasi akademik, instruksi mendesak, dan jadwal operasional kelas.
          </p>
        </div>

        {/* Dropdown - Line Style Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Target Kelas:
          </label>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="cursor-pointer rounded-sm border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-slate-800 outline-none transition-colors focus:border-slate-900"
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

      {/* TWO-COLUMN COMMAND WORKSPACE */}
      <div className="grid items-start gap-3 lg:grid-cols-12">
        {/* PANEL KIRI: FORMULIR INPUT EDITOR */}
        <section className="space-y-3 rounded-sm border border-slate-200/80 bg-white p-3 lg:col-span-5">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <Radio className="h-3 w-3 text-slate-500" />
            <span>Tulis Maklumat Baru</span>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Judul Pengumuman
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ketik topik maklumat utama..."
              className="w-full rounded-sm border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none transition-colors placeholder:text-slate-300 hover:border-slate-300 focus:border-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Isi Konten Pesan
            </label>
            {/* PERUBAHAN 2: Mengganti resize-none menjadi resize-y dan menambahkan field-sizing-content serta min-h agar melar penuh otomatis ke bawah */}
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tulis deskripsi atau instruksi formal kelas di sini..."
              className="w-full min-h-[120px] h-auto resize-y rounded-sm border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none transition-colors placeholder:text-slate-300 hover:border-slate-300 focus:border-slate-900 leading-4 field-sizing-content overflow-hidden"
            />
          </div>

          <div className="border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={handleAddAnnouncement}
              disabled={!title.trim() || !message.trim()}
              className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-sm border border-slate-900 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Megaphone className="h-3.5 w-3.5" />
              BROADCAST_ANNOUNCEMENT
            </button>
          </div>
        </section>

        {/* PANEL KANAN: LIVE STREAM LOG LIST */}
        <section className="flex flex-col rounded-sm border border-slate-200/80 bg-white p-3 lg:col-span-7">
          <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <Megaphone className="h-3 w-3 text-slate-400" />
            <span>Arsip Siaran Aktif Kelas ({classAnnouncements.length})</span>
          </div>

          <div className="max-h-[510px] space-y-2.5 overflow-y-auto pr-0.5">
            {classAnnouncements.map(item => (
              <div
                key={item.id}
                className="rounded-sm border border-slate-200 bg-white p-2.5 transition-colors hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs font-bold tracking-tight text-slate-900">{item.title}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Calendar className="h-2.5 w-2.5" />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString('id-ID')} &bull;{' '}
                        {new Date(item.createdAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Button Delete - Line Style Minimalis */}
                  <button
                    type="button"
                    onClick={() => deleteClassAnnouncement(item.id)}
                    className="shrink-0 cursor-pointer rounded-sm border border-slate-200 bg-white p-1 text-slate-400 transition-colors hover:border-slate-900 hover:text-slate-900"
                    title="Hapus maklumat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="mt-2 border-t border-slate-100 pt-2 text-xs text-slate-700 whitespace-pre-line leading-4">
                  {item.message}
                </p>
              </div>
            ))}

            {classAnnouncements.length === 0 && (
              <div className="rounded-sm border border-dashed border-slate-200 bg-slate-50/40 py-14 text-center">
                <p className="text-xs uppercase tracking-wider text-slate-400">
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
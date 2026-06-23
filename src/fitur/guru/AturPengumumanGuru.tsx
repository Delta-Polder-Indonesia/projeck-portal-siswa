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
    <div className="space-y-4 max-w-[1400px] mx-auto p-2 antialiased text-slate-600 bg-white selection:bg-slate-200">
      
      {/* HEADER CONTROL CONTAINER */}
      <div className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-sm font-bold text-slate-900 tracking-tight uppercase">Manajemen Maklumat & Pengumuman</h1>
          <p className="text-xs text-slate-400 mt-0.5">Penyiaran informasi akademik, instruksi mendesak, dan jadwal operasional kelas.</p>
        </div>

        {/* Dropdown - Line Style Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Kelas:</label>
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-800 outline-none focus:border-slate-900 cursor-pointer transition-colors"
          >
            {teacherClasses.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name.toUpperCase()}</option>
            ))}
            {teacherClasses.length === 0 && <option value="">NULL_CLASS</option>}
          </select>
        </div>
      </div>

      {/* TWO-COLUMN COMMAND WORKSPACE */}
      <div className="grid lg:grid-cols-12 gap-4 items-start">
        
        {/* PANEL KIRI: FORMULIR INPUT EDITOR */}
        <section className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs lg:col-span-5 space-y-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            <Radio className="w-3 h-3 text-slate-500" />
            <span>Tulis Maklumat Baru</span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Judul Pengumuman</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ketik topik maklumat utama..."
              className="w-full px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded text-xs text-slate-800 outline-none placeholder:text-slate-300 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Isi Konten Pesan</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tulis deskripsi atau instruksi formal kelas di sini..."
              rows={8}
              className="w-full px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 focus:border-slate-900 rounded text-xs font-mono text-slate-800 outline-none placeholder:text-slate-300 resize-none leading-relaxed transition-colors"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleAddAnnouncement}
              disabled={!title.trim() || !message.trim()}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-950 border border-slate-900 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded text-xs font-bold font-mono transition-colors cursor-pointer"
            >
              <Megaphone className="w-3.5 h-3.5" /> BROADCAST_ANNOUNCEMENT
            </button>
          </div>
        </section>

        {/* PANEL KANAN: LIVE STREAM LOG LIST */}
        <section className="bg-white rounded-lg p-4 border border-slate-200/80 shadow-xs lg:col-span-7 flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            <Megaphone className="w-3 h-3 text-slate-400" />
            <span>Arsip Siaran Aktif Kelas ({classAnnouncements.length})</span>
          </div>

          <div className="space-y-3 max-h-[510px] overflow-y-auto pr-0.5">
            {classAnnouncements.map(item => (
              <div key={item.id} className="border border-slate-200 rounded p-3 bg-white hover:border-slate-300 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900 tracking-tight">{item.title}</p>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString('id-ID')} &bull; {new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Button Delete - Line Style Minimalis */}
                  <button
                    type="button"
                    onClick={() => deleteClassAnnouncement(item.id)}
                    className="p-1 bg-white border border-slate-200 hover:border-slate-900 text-slate-400 hover:text-slate-900 rounded transition-colors cursor-pointer shrink-0"
                    title="Hapus maklumat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <p className="text-xs font-mono text-slate-700 mt-3 pt-2.5 border-t border-slate-100 whitespace-pre-line leading-relaxed">
                  {item.message}
                </p>
              </div>
            ))}

            {classAnnouncements.length === 0 && (
              <div className="py-20 text-center border border-dashed border-slate-200 rounded bg-slate-50/40">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">EMPTY_BROADCAST_FEED</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Belum ada maklumat resmi yang disebarkan ke ruang kelas ini.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
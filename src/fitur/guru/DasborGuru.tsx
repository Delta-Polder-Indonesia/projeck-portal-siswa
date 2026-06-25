import { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAttendance, getClasses, getClassRosters, getStudents, getTeachers } from '../../data/store';
import { AlertCircle, CheckCircle, Clock, Users, XCircle, HelpCircle, Calendar, BookOpen, MapPin } from 'lucide-react';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import HalamanRpsGuru from './HalamanRpsGuru';

type JadwalHariIni = {
  no: number;
  classId: string;
  className: string;
  mataPelajaran: string;
  ruang: string;
  hari: string;
  waktu: string;
};

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function DasborGuru() {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const [notice, setNotice] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<JadwalHariIni | null>(null);

  const teacher = useMemo(() => {
    const all = getTeachers();
    const byId = all.find((item) => item.id === user?.id);
    if (byId) return byId;
    const byName = all.find((item) => item.name.toLowerCase() === (user?.name || '').toLowerCase());
    return byName || all[0] || null;
  }, [user?.id, user?.name, storeVersion]);

  const classIds = teacher?.classIds ?? [];

  const stats = useMemo(() => {
    const students = getStudents().filter((item) => classIds.includes(item.classId));
    const allAttendance = getAttendance().filter((item) => classIds.includes(item.classId));
    const today = new Date().toISOString().slice(0, 10);
    const todayAtt = allAttendance.filter((item) => item.date === today);

    const latestPerStudent = new Map<string, (typeof todayAtt)[number]>();
    todayAtt.forEach((item) => {
      latestPerStudent.set(item.studentId, item);
    });

    const statuses = Array.from(latestPerStudent.values());
    const totalStudents = students.length;
    const todayHadir = statuses.filter((item) => item.status === 'Hadir').length;
    const todayIzin = statuses.filter((item) => item.status === 'Izin').length;
    const todaySakit = statuses.filter((item) => item.status === 'Sakit').length;
    const todayAlpha = statuses.filter((item) => item.status === 'Alpa').length;
    const todayBelum = Math.max(0, totalStudents - statuses.length);

    return { totalStudents, todayHadir, todayIzin, todaySakit, todayAlpha, todayBelum };
  }, [classIds, storeVersion]);

  const jadwalMengajar = useMemo(() => {
    const todayDay = new Date().getDay();
    const classes = getClasses().filter((item) => classIds.includes(item.id));

    const rows: JadwalHariIni[] = [];
    classes.forEach((classItem) => {
      const rosters = getClassRosters(classItem.id);
      rosters.forEach((roster) => {
        if ((roster.dayOfWeek ?? todayDay) !== todayDay) return;
        rows.push({
          no: rows.length + 1,
          classId: classItem.id,
          className: classItem.name,
          mataPelajaran: roster.subject || teacher?.subject || 'Mata Pelajaran',
          ruang: roster.room || 'Belum ditentukan',
          hari: DAY_NAMES[todayDay],
          waktu: `${roster.startTime || '--:--'} - ${roster.endTime || '--:--'}`,
        });
      });
    });

    if (rows.length === 0 && classes.length > 0) {
      rows.push({
        no: 1,
        classId: classes[0].id,
        className: classes[0].name,
        mataPelajaran: teacher?.subject || 'Mata Pelajaran',
        ruang: 'Belum dijadwalkan',
        hari: DAY_NAMES[todayDay],
        waktu: 'Silakan cek roster',
      });
    }

    return rows;
  }, [classIds, teacher?.subject, storeVersion]);

  if (selectedSchedule && teacher) {
    return (
      <HalamanRpsGuru
        teacherId={teacher.id}
        classId={selectedSchedule.classId}
        className={selectedSchedule.className}
        subject={selectedSchedule.mataPelajaran}
        onBack={() => setSelectedSchedule(null)}
        setNotice={setNotice}
      />
    );
  }

  return (
    <div className="w-full bg-white p-4 text-xs text-slate-700">
      <header className="flex items-center justify-between border-b border-slate-300 pb-3">
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-950 uppercase">
            Sistem Informasi Akademik
          </h1>
          <p className="text-[11px] text-slate-500">
            Panel ringkas untuk melihat kelas, mata pelajaran, dan ruang mengajar hari ini.
          </p>
        </div>
        <div className="border-l border-slate-300 pl-4 text-right">
          <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Guru Aktif
          </p>
          <p className="text-sm font-bold text-slate-900">
            {user?.name?.toUpperCase() || '-'}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2 border-b border-slate-300 pb-4 pt-4 md:grid-cols-3 lg:grid-cols-6">
        {[
          { label: 'Total Siswa Binaan', value: stats.totalStudents, icon: Users, alert: false },
          { label: 'Hadir Hari Ini', value: stats.todayHadir, icon: CheckCircle, alert: false },
          { label: 'Izin', value: stats.todayIzin, icon: AlertCircle, alert: false },
          { label: 'Sakit', value: stats.todaySakit, icon: Clock, alert: false },
          { label: 'Alpa', value: stats.todayAlpha, icon: XCircle, alert: true },
          { label: 'Belum Presensi', value: stats.todayBelum, icon: HelpCircle, alert: stats.todayBelum > 0 },
        ].map((card) => (
          <div
            key={card.label}
            className={`flex min-h-[74px] flex-col justify-between border p-2.5 ${
              card.alert ? 'border-rose-300 bg-rose-50' : 'border-slate-300 bg-white'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-1 ${
              card.alert ? 'border-rose-200' : 'border-slate-200'
            }`}>
              <span className={`text-[10px] font-bold tracking-wide uppercase ${
                card.alert ? 'text-rose-700' : 'text-slate-600'
              }`}>
                {card.label}
              </span>
              <card.icon className={`h-3.5 w-3.5 ${
                card.alert ? 'text-rose-600' : 'text-slate-500'
              }`} />
            </div>
            <div className="mt-1 text-center">
              <p className={`text-lg font-black tracking-tight ${
                card.alert ? 'text-rose-800' : 'text-slate-900'
              }`}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <section className="space-y-3 pt-4">
        <div className="flex items-center gap-2 border-b border-slate-900 pb-2 text-xs font-bold tracking-wider text-slate-900 uppercase">
          <Calendar className="h-4 w-4 text-slate-950" />
          <span>Informasi Kelas Mengajar Hari Ini & Modul RPS</span>
        </div>

        <div className="overflow-x-auto border border-slate-300">
          <table className="w-full min-w-[700px] border-collapse bg-white text-left">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-100 text-[10px] font-bold tracking-wider text-slate-700 uppercase">
                <th className="w-12 p-3 text-center">No.</th>
                <th className="p-3">Mata Pelajaran / Kelas</th>
                <th className="w-32 p-3">Ruang</th>
                <th className="w-28 p-3">Hari</th>
                <th className="w-36 p-3">Waktu</th>
                <th className="w-28 p-3 text-center">RPS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {jadwalMengajar.map((item) => (
                <tr key={`${item.classId}-${item.mataPelajaran}-${item.waktu}`}>
                  <td className="bg-slate-50 p-3 text-center font-semibold text-slate-600">
                    {item.no}
                  </td>
                  <td className="space-y-1 p-3">
                    <p className="text-sm font-bold tracking-tight text-slate-900">
                      {item.mataPelajaran}
                    </p>
                    <p className="inline-block border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                      Kelas : {item.className}
                    </p>
                  </td>
                  <td className="p-3 font-medium">
                    <div className="flex items-center gap-1 text-slate-700">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      <span>{item.ruang}</span>
                    </div>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{item.hari}</td>
                  <td className="p-3 font-mono font-medium tracking-tight text-slate-700">{item.waktu}</td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedSchedule(item)}
                      className="inline-flex items-center gap-1 border border-slate-900 bg-slate-900 px-3 py-1.5 text-[10px] font-bold tracking-wider text-white uppercase"
                    >
                      <BookOpen className="h-3 w-3" />
                      <span>RPS</span>
                    </button>
                  </td>
                </tr>
              ))}
              {jadwalMengajar.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-slate-500">
                    Tidak ada jadwal mengajar hari ini.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {notice ? (
        <p className="mt-4 border border-emerald-300 bg-emerald-50 p-2 text-xs text-emerald-700">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
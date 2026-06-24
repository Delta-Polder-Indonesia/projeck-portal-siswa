// ==================== TYPES ====================

export type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export type Teacher = {
  id: string;
  name: string;
  nip: string;
  password: string;
  subject: string;
  email: string;
  classIds: string[];
  avatar?: string;
};

export type SchoolClass = {
  id: string;
  name: string;
  grade: string;
  teacherId: string;
};

export type AttendanceEntry = {
  id: string;
  classId: string;
  studentId: string;
  date: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
};

export type ClassRoster = {
  id: string;
  classId: string;
  title: string;
  subject?: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  room?: string;
  teacherName?: string;
  updatedBy?: string;
  updatedAt?: number;
};

export type ClassAnnouncement = {
  id: string;
  classId: string;
  title: string;
  content: string;
  message?: string;
  createdBy?: string;
  createdAt?: number;
};

export type OnlineAssignment = {
  id: string;
  classId: string;
  title: string;
  dueDate: string;
  description?: string;
  createdBy?: string;
  createdAt?: number;
};

export type Student = {
  id: string;
  name: string;
  nis: string;
  password: string;
  classId: string;
  gender: 'L' | 'P';
  avatar?: string;
};

export type PPDBApplicationStatus = 'pending' | 'approved' | 'rejected';

export type PPDBApplication = {
  id: string;
  registrationNo: string;
  submittedAt: string;
  processedAt?: string;
  status: PPDBApplicationStatus;
  jenjangTujuan: string;
  sekolahTujuan: string;
  jalurPendaftaran: string;
  namaLengkap: string;
  nisn: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  alamatLengkap: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  nomorHp: string;
  email: string;
  sekolahAsal: string;
  namaAyah: string;
  namaIbu: string;
  agama?: string;
  kewenangnegaraan?: string;
  anakKe?: string;
  jumlahSaudara?: string;
  golonganDarah?: string;
  rt?: string;
  rw?: string;
  dusun?: string;
  provinsi?: string;
  kodePos?: string;
  namaWali?: string;
  hubunganWali?: string;
  nomorHpWali?: string;
  majorId?: string;
  npsnSekolahAsal?: string;
  alasanPindah?: string;
  pasFotoDataUrl?: string;
  dokumen: string[];
  assignedNis?: string;
  assignedClassId?: string;
  note?: string;
};

export type Message = {
  id: string;
  sender: string;
  receiverRole: 'teacher' | 'student' | 'all';
  subject: string;
  content: string;
  date: string;
};

export type AttendanceRecord = {
  date: string;
  subject: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
};

export type Task = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'Aktif' | 'Selesai';
};

export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'Lunas' | 'Belum Lunas';
};

export type Grade = {
  subject: string;
  assignment: number;
  midterm: number;
  final: number;
};

export type SuratIzin = {
  id: string;
  studentId: string;
  classId: string;
  type: 'izin' | 'sakit';
  subject: string;
  message: string;
  letterDate: string;
  startDate: string;
  endDate: string;
  status: 'menunggu' | 'disetujui' | 'ditolak';
  attachmentDataUrl?: string;
  createdAt: number;
};

export type TagihanSekolah = {
  id: string;
  studentId: string;
  year: number;
  month: number;
  amount: number;
  dueDate: string;
  status: 'lunas' | 'belum_lunas';
  paymentMethod?: string;
  paidAt?: number;
};

export type PengaturanTagihan = {
  monthlyAmount: number;
  dueDay: number;
  updatedAt: number;
  updatedBy: string;
};

export type PengumumanAdmin = {
  id: string;
  title: string;
  message: string;
  targetScope: 'all' | 'classes';
  targetClassIds: string[];
  createdAt: number;
  createdBy: string;
  imageDataUrl?: string;
  imageName?: string;
};

export type AssignmentSubmission = {
  id: string;
  assignmentId: string;
  studentId: string;
  answer: string;
  submittedAt: number;
  grade?: number;
  feedback?: string;
};

export type NilaiRapot = {
  id: string;
  studentId: string;
  classId: string;
  tahunAjaran: string;
  semester: string;
  mataPelajaran: string;
  nilaiHarian: number;
  nilaiUTS: number;
  nilaiUAS: number;
  nilaiAkhir: number;
  createdBy: string;
  createdAt: number;
};

export type StudentClassMutation = {
  id: string;
  studentId: string;
  studentName: string;
  fromClassId: string;
  toClassId: string;
  note: string;
  movedAt: string;
};

export type RpsMeetingRow = {
  pertemuan: string;
  kemampuanAkhir: string;
  materiPembelajaran: string;
  indikator: string;
  outputPembelajaran: string;
  strategiPembelajaran: string;
  bentukPembelajaran: string;
  estimasiWaktu: string;
  bobotPenilaian: string;
};

export type RpsDocument = {
  id: string;
  teacherId: string;
  classId: string;
  className: string;
  subject: string;
  programStudi: string;
  fakultas: string;
  sks: string;
  rows: RpsMeetingRow[];
  updatedAt: number;
};

export type TeacherLessonNote = {
  id: string;
  teacherId: string;
  classId: string;
  subject: string;
  date: string;
  materi: string;
  adaPr: boolean;
  prDetail?: string;
  catatan?: string;
  updatedAt: number;
};

// ==================== DATABASE TYPE ====================

type Database = {
  announcements: Announcement[];
  teachers: Teacher[];
  classes: SchoolClass[];
  students: Student[];
  ppdbApplications: PPDBApplication[];
  attendances: AttendanceEntry[];
  classRosters: ClassRoster[];
  classAnnouncements: ClassAnnouncement[];
  onlineAssignments: OnlineAssignment[];
  messages: Message[];
  attendance: AttendanceRecord[];
  tasks: Task[];
  bills: Bill[];
  grades: Grade[];
  schedule: Array<{ day: string; subject: string; time: string; teacher: string }>;
};

// ==================== CONSTANTS ====================

const STORAGE_KEY = 'portal-siswa-db-v1';
const SURAT_KEY = 'portal-siswa-surat';
const TAGIHAN_KEY = 'portal-siswa-tagihan';
const PENGATURAN_TAGIHAN_KEY = 'portal-siswa-pengaturan-tagihan';
const PENGUMUMAN_ADMIN_KEY = 'portal-siswa-pengumuman-admin';
const SUBMISSION_KEY = 'portal-siswa-submissions';
const RAPOT_KEY = 'portal-siswa-rapot';
const STUDENT_CLASS_MUTATION_KEY = 'portal-siswa-class-mutations';
const LESSON_NOTE_KEY = 'portal-siswa-lesson-notes';
const RPS_DOCUMENT_KEY = 'portal-siswa-rps-documents';
const STORE_UPDATED_EVENT = 'absensi_store_updated';
const APPROX_LOCAL_STORAGE_LIMIT_BYTES = 5 * 1024 * 1024;

let storeVersion = 0;

// ==================== INTERFACES ====================

export interface RingkasanPenyimpananBrowser {
  usedBytes: number;
  limitBytes: number;
  usedPercent: number;
  remainingBytes: number;
}

export interface RingkasanKompresFoto {
  totalDitemukan: number;
  totalBerhasil: number;
  totalGagal: number;
}

export interface HasilPulihkanCadangan {
  berhasil: boolean;
  pesan: string;
}

// ==================== CORE ====================

function notifyStoreUpdated() {
  storeVersion += 1;
  window.dispatchEvent(new CustomEvent(STORE_UPDATED_EVENT));
}

export function subscribeStore(listener: () => void) {
  window.addEventListener(STORE_UPDATED_EVENT, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(STORE_UPDATED_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}

export const store = {
  getSnapshot: () => storeVersion,
  subscribe: (listener: () => void) => subscribeStore(listener),
};

// ==================== INITIAL DATA ====================

const initialData: Database = {
  announcements: [
    {
      id: 'a1',
      title: 'Ujian Tengah Semester Dimulai 5 Oktober',
      content: 'Pastikan seluruh siswa membawa kartu ujian dan hadir 15 menit sebelum jadwal.',
      date: '2026-10-01',
    },
    {
      id: 'a2',
      title: 'Pendaftaran Ekstrakurikuler Dibuka',
      content: 'Pendaftaran kegiatan basket, paduan suara, dan coding dibuka sampai 10 Oktober.',
      date: '2026-09-29',
    },
  ],
  teachers: [
    {
      id: 't1',
      name: 'Bapak Andi Pratama',
      nip: '198501012010011001',
      password: 'guru123',
      subject: 'Matematika',
      email: 'andi@sekolah.id',
      classIds: ['c1'],
    },
    {
      id: 't2',
      name: 'Ibu Rina Kartika',
      nip: '198701022012012002',
      password: 'guru123',
      subject: 'Bahasa Indonesia',
      email: 'rina@sekolah.id',
      classIds: ['c2'],
    },
    {
      id: 't3',
      name: 'Bapak Dedi Saputra',
      nip: '198901032014013003',
      password: 'guru123',
      subject: 'Fisika',
      email: 'dedi@sekolah.id',
      classIds: [],
    },
  ],
  classes: [
    { id: 'c1', name: 'X IPA 1', grade: 'X', teacherId: 't1' },
    { id: 'c2', name: 'X IPA 2', grade: 'X', teacherId: 't2' },
    { id: 'c3', name: 'X IPS 1', grade: 'X', teacherId: '' },
  ],
  students: [
    { id: 's1', name: 'Siti Rahma', nis: '2024001', password: 'siswa123', classId: 'c1', gender: 'P' },
    { id: 's2', name: 'Budi Santoso', nis: '2024002', password: 'siswa123', classId: 'c1', gender: 'L' },
    { id: 's3', name: 'Nabila Putri', nis: '2024003', password: 'siswa123', classId: 'c2', gender: 'P' },
  ],
  ppdbApplications: [],
  attendances: [
    { id: 'att-1', classId: 'c1', studentId: 's1', date: '2026-09-25', status: 'Hadir' },
    { id: 'att-2', classId: 'c1', studentId: 's2', date: '2026-09-25', status: 'Hadir' },
  ],
  classRosters: [],
  classAnnouncements: [],
  onlineAssignments: [],
  messages: [
    {
      id: 'm1',
      sender: 'Wali Kelas X IPA 1',
      receiverRole: 'all',
      subject: 'Pengumpulan Berkas Orang Tua',
      content: 'Mohon kumpulkan fotokopi KTP orang tua paling lambat Jumat ini.',
      date: '2026-09-28',
    },
    {
      id: 'm2',
      sender: 'Kepala Sekolah',
      receiverRole: 'teacher',
      subject: 'Rapat Kurikulum',
      content: 'Rapat kurikulum akan dilaksanakan hari Senin pukul 13.00 di ruang guru.',
      date: '2026-09-27',
    },
  ],
  attendance: [
    { date: '2026-09-25', subject: 'Matematika', status: 'Hadir' },
    { date: '2026-09-24', subject: 'Fisika', status: 'Hadir' },
    { date: '2026-09-23', subject: 'Bahasa Indonesia', status: 'Izin' },
    { date: '2026-09-22', subject: 'Biologi', status: 'Hadir' },
  ],
  tasks: [
    { id: 'k1', title: 'Latihan Soal Trigonometri', subject: 'Matematika', dueDate: '2026-10-04', status: 'Aktif' },
    { id: 'k2', title: 'Rangkuman Bab Cerpen', subject: 'Bahasa Indonesia', dueDate: '2026-10-03', status: 'Aktif' },
    { id: 'k3', title: 'Laporan Praktikum Gaya', subject: 'Fisika', dueDate: '2026-09-29', status: 'Selesai' },
  ],
  bills: [
    { id: 'b1', name: 'SPP Oktober 2026', amount: 300000, dueDate: '2026-10-10', status: 'Belum Lunas' },
    { id: 'b2', name: 'Kegiatan Laboratorium', amount: 150000, dueDate: '2026-09-20', status: 'Lunas' },
  ],
  grades: [
    { subject: 'Matematika', assignment: 84, midterm: 81, final: 88 },
    { subject: 'Bahasa Indonesia', assignment: 86, midterm: 83, final: 85 },
    { subject: 'Fisika', assignment: 80, midterm: 79, final: 84 },
  ],
  schedule: [
    { day: 'Senin', subject: 'Matematika', time: '07.00 - 08.30', teacher: 'Bapak Andi Pratama' },
    { day: 'Selasa', subject: 'Bahasa Indonesia', time: '08.40 - 10.10', teacher: 'Ibu Rina Kartika' },
    { day: 'Rabu', subject: 'Fisika', time: '10.20 - 11.50', teacher: 'Bapak Dedi Saputra' },
  ],
};

// ==================== DB HELPERS ====================

function readDB(): Database {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return initialData;

  try {
    const parsed = JSON.parse(raw) as Partial<Database>;
    return {
      ...initialData,
      ...parsed,
      teachers: (parsed.teachers ?? initialData.teachers).map((teacher, index) => ({
        ...initialData.teachers[index % initialData.teachers.length],
        ...teacher,
        classIds: teacher.classIds ?? [],
      })),
      classes: (parsed.classes ?? initialData.classes).map((classItem, index) => ({
        ...initialData.classes[index % initialData.classes.length],
        ...classItem,
        grade: classItem.grade ?? 'X',
      })),
      students: (parsed.students ?? initialData.students).map((student, index) => ({
        ...initialData.students[index % initialData.students.length],
        ...student,
        gender: student.gender === 'P' ? 'P' : 'L',
      })),
      ppdbApplications: parsed.ppdbApplications ?? initialData.ppdbApplications,
      attendances: parsed.attendances ?? initialData.attendances,
      classRosters: parsed.classRosters ?? initialData.classRosters,
      classAnnouncements: parsed.classAnnouncements ?? initialData.classAnnouncements,
      onlineAssignments: parsed.onlineAssignments ?? initialData.onlineAssignments,
    };
  } catch {
    return initialData;
  }
}

function writeDB(data: Database) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  notifyStoreUpdated();
}

function readLocalKey<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// ==================== INIT ====================

export function initializeData() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    writeDB(initialData);
  }
}

// ==================== ANNOUNCEMENTS ====================

export function getSchoolAnnouncements() {
  return readDB().announcements;
}

export function addSchoolAnnouncement(title: string, content: string) {
  const db = readDB();
  db.announcements = [
    { id: `a${Date.now()}`, title, content, date: new Date().toISOString().slice(0, 10) },
    ...db.announcements,
  ];
  writeDB(db);
}

// ==================== TEACHERS ====================

export function getTeacherList() {
  return readDB().teachers;
}

export function getTeachers() {
  return getTeacherList();
}

export function saveTeachers(nextTeachers: Teacher[]) {
  const db = readDB();
  db.teachers = nextTeachers;
  writeDB(db);
}

// ==================== CLASSES ====================

export function getClasses() {
  return readDB().classes;
}

export function saveClasses(nextClasses: SchoolClass[]) {
  const db = readDB();
  db.classes = nextClasses;
  writeDB(db);
}

// ==================== STUDENTS ====================

export function getStudents() {
  return readDB().students;
}

export function saveStudents(nextStudents: Student[]) {
  const db = readDB();
  db.students = nextStudents;
  writeDB(db);
}

export function getStudentsByClass(classId: string): Student[] {
  return getStudents().filter((s) => s.classId === classId);
}

export function updateStudent(student: Student) {
  const students = getStudents();
  const idx = students.findIndex((s) => s.id === student.id);
  if (idx >= 0) students[idx] = student;
  saveStudents(students);
}

export function deleteStudent(id: string) {
  saveStudents(getStudents().filter((s) => s.id !== id));
  const db = readDB();
  db.attendances = db.attendances.filter((a) => a.studentId !== id);
  writeDB(db);
}

export function addStudent(student: Student) {
  const students = getStudents();
  students.push(student);
  saveStudents(students);
}

export function getStudentClassMutations(studentId?: string) {
  const all = readLocalKey<StudentClassMutation[]>(STUDENT_CLASS_MUTATION_KEY, []);
  const filtered = studentId ? all.filter((item) => item.studentId === studentId) : all;
  return filtered.sort((a, b) => new Date(b.movedAt).getTime() - new Date(a.movedAt).getTime());
}

export function addStudentClassMutation(payload: Omit<StudentClassMutation, 'id' | 'movedAt'>) {
  const all = readLocalKey<StudentClassMutation[]>(STUDENT_CLASS_MUTATION_KEY, []);
  all.unshift({ ...payload, id: `mut-${Date.now()}`, movedAt: new Date().toISOString() });
  localStorage.setItem(STUDENT_CLASS_MUTATION_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

// ==================== PPDB ====================

function generateRegistrationNo() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 900 + 100);
  return `PPDB-${stamp}-${random}`;
}

function generateStudentNis(students: Student[]) {
  const year = new Date().getFullYear();
  const maxSerial = students.reduce((max, student) => {
    const parsed = Number.parseInt(student.nis.slice(-3), 10);
    return Number.isNaN(parsed) ? max : Math.max(max, parsed);
  }, 0);
  return `${year}${String(maxSerial + 1).padStart(3, '0')}`;
}

export function submitPPDBApplication(payload: Omit<PPDBApplication, 'id' | 'registrationNo' | 'submittedAt' | 'status'>) {
  const db = readDB();
  const application: PPDBApplication = {
    ...payload,
    id: `ppdb-${Date.now()}`,
    registrationNo: generateRegistrationNo(),
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };
  db.ppdbApplications = [application, ...db.ppdbApplications];
  writeDB(db);
  return application;
}

export function getPPDBApplications() {
  return readDB().ppdbApplications;
}

export function approvePPDBApplication(applicationId: string, classId: string) {
  const db = readDB();
  const target = db.ppdbApplications.find((item) => item.id === applicationId);
  if (!target) return { ok: false, message: 'Data pendaftar tidak ditemukan.' };
  if (target.status !== 'pending') return { ok: false, message: 'Pendaftar sudah diproses sebelumnya.' };
  const targetClass = db.classes.find((item) => item.id === classId);
  if (!targetClass) return { ok: false, message: 'Kelas tujuan tidak ditemukan.' };

  const newNis = target.nisn.trim() || generateStudentNis(db.students);
  if (db.students.some((item) => item.nis === newNis)) {
    return { ok: false, message: 'NIS/NISN bentrok dengan data siswa aktif.' };
  }

  db.students = [
    {
      id: `s-${Date.now()}`,
      name: target.namaLengkap,
      nis: newNis,
      password: 'siswa123',
      classId,
      gender: target.jenisKelamin?.toLowerCase().startsWith('p') ? 'P' : 'L',
    },
    ...db.students,
  ];

  db.ppdbApplications = db.ppdbApplications.map((item) =>
    item.id === applicationId
      ? { ...item, status: 'approved', processedAt: new Date().toISOString(), assignedNis: newNis, assignedClassId: classId }
      : item,
  );

  writeDB(db);
  return { ok: true, message: `Pendaftar ${target.namaLengkap} diterima ke kelas ${targetClass.name}.` };
}

export function rejectPPDBApplication(applicationId: string, note = '') {
  const db = readDB();
  const target = db.ppdbApplications.find((item) => item.id === applicationId);
  if (!target) return { ok: false, message: 'Data pendaftar tidak ditemukan.' };
  if (target.status !== 'pending') return { ok: false, message: 'Pendaftar sudah diproses sebelumnya.' };
  db.ppdbApplications = db.ppdbApplications.map((item) =>
    item.id === applicationId ? { ...item, status: 'rejected', processedAt: new Date().toISOString(), note } : item,
  );
  writeDB(db);
  return { ok: true, message: `Pendaftar ${target.namaLengkap} ditandai tidak lolos seleksi.` };
}

// ==================== ATTENDANCE ====================

export function getAttendance() {
  return readDB().attendances;
}

export function saveAttendance(nextAttendance: AttendanceEntry[]) {
  const db = readDB();
  db.attendances = nextAttendance;
  writeDB(db);
}

export function getAttendanceByDate(date: string, classId?: string): AttendanceEntry[] {
  return getAttendance().filter((r) => r.date === date && (classId ? r.classId === classId : true));
}

export function getAttendanceByDateRange(startDate: string, endDate: string, classId?: string): AttendanceEntry[] {
  return getAttendance().filter((r) => {
    const dateMatch = r.date >= startDate && r.date <= endDate;
    const classMatch = classId ? r.classId === classId : true;
    return dateMatch && classMatch;
  });
}

export function getAttendanceByStudent(studentId: string): AttendanceEntry[] {
  return getAttendance().filter((r) => r.studentId === studentId);
}

export function addAttendanceRecords(records: AttendanceEntry[]) {
  const existing = getAttendance();
  const newKeys = new Set(records.map((r) => `${r.studentId}_${r.date}`));
  const filtered = existing.filter((e) => !newKeys.has(`${e.studentId}_${e.date}`));
  filtered.push(...records);
  saveAttendance(filtered);
}

export function getAttendanceRecords() {
  return readDB().attendance;
}

// ==================== CLASS ROSTERS ====================

export function getClassRosters(classId: string): ClassRoster[] {
  return readDB().classRosters.filter((item) => item.classId === classId);
}

export function addClassRoster(item: ClassRoster) {
  const db = readDB();
  db.classRosters = [...db.classRosters, item];
  writeDB(db);
}

export function deleteClassRoster(rosterId: string) {
  const db = readDB();
  db.classRosters = db.classRosters.filter((item) => item.id !== rosterId);
  writeDB(db);
}

// ==================== CLASS ANNOUNCEMENTS ====================

export function getClassAnnouncements(classId: string): ClassAnnouncement[] {
  return readDB().classAnnouncements.filter((item) => item.classId === classId);
}

export function addClassAnnouncement(item: ClassAnnouncement) {
  const db = readDB();
  db.classAnnouncements = [item, ...db.classAnnouncements];
  writeDB(db);
}

export function deleteClassAnnouncement(announcementId: string) {
  const db = readDB();
  db.classAnnouncements = db.classAnnouncements.filter((item) => item.id !== announcementId);
  writeDB(db);
}

// ==================== ONLINE ASSIGNMENTS ====================

export function getOnlineAssignmentsByClass(classId: string): OnlineAssignment[] {
  return readDB().onlineAssignments.filter((item) => item.classId === classId);
}

export function addOnlineAssignment(item: OnlineAssignment) {
  const db = readDB();
  db.onlineAssignments = [item, ...db.onlineAssignments];
  writeDB(db);
}

export function deleteOnlineAssignment(assignmentId: string) {
  const db = readDB();
  db.onlineAssignments = db.onlineAssignments.filter((item) => item.id !== assignmentId);
  writeDB(db);
}

// ==================== ASSIGNMENT SUBMISSIONS ====================

export function getSubmissionsByAssignment(assignmentId: string): AssignmentSubmission[] {
  const all = readLocalKey<AssignmentSubmission[]>(SUBMISSION_KEY, []);
  return all.filter((item) => item.assignmentId === assignmentId).sort((a, b) => b.submittedAt - a.submittedAt);
}

export function getSubmissionByAssignmentAndStudent(assignmentId: string, studentId: string): AssignmentSubmission | null {
  const all = readLocalKey<AssignmentSubmission[]>(SUBMISSION_KEY, []);
  return all.find((item) => item.assignmentId === assignmentId && item.studentId === studentId) ?? null;
}

export function upsertAssignmentSubmission(item: AssignmentSubmission) {
  const all = readLocalKey<AssignmentSubmission[]>(SUBMISSION_KEY, []);
  const idx = all.findIndex((s) => s.assignmentId === item.assignmentId && s.studentId === item.studentId);
  if (idx >= 0) all[idx] = item;
  else all.push(item);
  localStorage.setItem(SUBMISSION_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

// ==================== MESSAGES ====================

export function getMessagesForRole(role: 'teacher' | 'student') {
  return readDB().messages.filter((msg) => msg.receiverRole === role || msg.receiverRole === 'all');
}

export function addMessage(sender: string, receiverRole: 'teacher' | 'student' | 'all', subject: string, content: string) {
  const db = readDB();
  db.messages = [{ id: `m${Date.now()}`, sender, receiverRole, subject, content, date: new Date().toISOString().slice(0, 10) }, ...db.messages];
  writeDB(db);
}

// ==================== TASKS ====================

export function getTasks() {
  return readDB().tasks;
}

export function addTask(title: string, subject: string, dueDate: string) {
  const db = readDB();
  db.tasks = [{ id: `k${Date.now()}`, title, subject, dueDate, status: 'Aktif' }, ...db.tasks];
  writeDB(db);
}

// ==================== BILLS (simple) ====================

export function getBills() {
  return readDB().bills;
}

// ==================== GRADES ====================

export function getGrades() {
  return readDB().grades;
}

// ==================== SCHEDULE ====================

export function getSchedule() {
  return readDB().schedule;
}

// ==================== SURAT IZIN ====================

export function getSuratIzin(): SuratIzin[] {
  const all = readLocalKey<SuratIzin[]>(SURAT_KEY, []);
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export function getSuratIzinByStudent(studentId: string): SuratIzin[] {
  return getSuratIzin().filter((item) => item.studentId === studentId);
}

export function addSuratIzin(item: SuratIzin) {
  const all = getSuratIzin();
  all.push(item);
  localStorage.setItem(SURAT_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function updateStatusSuratIzin(id: string, status: SuratIzin['status']) {
  const all = getSuratIzin().map((item) => (item.id === id ? { ...item, status } : item));
  localStorage.setItem(SURAT_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

// ==================== TAGIHAN SEKOLAH ====================

function getDefaultPengaturanTagihan(): PengaturanTagihan {
  return { monthlyAmount: 250000, dueDay: 10, updatedAt: Date.now(), updatedBy: 'system' };
}

export function getTagihanSekolahBySiswa(studentId: string, year: number): TagihanSekolah[] {
  const all = readLocalKey<TagihanSekolah[]>(TAGIHAN_KEY, []);
  return all.filter((item) => item.studentId === studentId && item.year === year).sort((a, b) => a.month - b.month);
}

export function getTahunTagihanSiswa(studentId: string): number[] {
  const all = readLocalKey<TagihanSekolah[]>(TAGIHAN_KEY, []);
  const years = new Set(all.filter((item) => item.studentId === studentId).map((item) => item.year));
  return Array.from(years).sort((a, b) => b - a);
}

export function bayarTagihanSekolah(id: string, paymentMethod: string) {
  const all = readLocalKey<TagihanSekolah[]>(TAGIHAN_KEY, []);
  const updated = all.map((item) => (item.id === id ? { ...item, status: 'lunas', paymentMethod, paidAt: Date.now() } : item));
  localStorage.setItem(TAGIHAN_KEY, JSON.stringify(updated));
  notifyStoreUpdated();
}

export function getPengaturanTagihan(): PengaturanTagihan {
  return readLocalKey<PengaturanTagihan>(PENGATURAN_TAGIHAN_KEY, getDefaultPengaturanTagihan());
}

export function setPengaturanTagihan(config: PengaturanTagihan) {
  localStorage.setItem(PENGATURAN_TAGIHAN_KEY, JSON.stringify(config));
  notifyStoreUpdated();
}

export function terapkanTagihanTahunanUntukSemuaSiswa(year: number, monthlyAmount: number, dueDay: number, updatedBy: string) {
  const students = getStudents();
  const existing = readLocalKey<TagihanSekolah[]>(TAGIHAN_KEY, []);
  const dueDaySafe = Math.min(28, Math.max(1, dueDay));
  const next = [...existing];

  students.forEach((student) => {
    for (let month = 1; month <= 12; month += 1) {
      const billId = `bill_${student.id}_${year}_${month}`;
      const dueDate = `${year}-${String(month).padStart(2, '0')}-${String(dueDaySafe).padStart(2, '0')}`;
      const idx = next.findIndex((item) => item.id === billId);
      if (idx >= 0) next[idx] = { ...next[idx], amount: monthlyAmount, dueDate };
      else {
        next.push({ id: billId, studentId: student.id, year, month, amount: monthlyAmount, dueDate, status: 'belum_lunas' });
      }
    }
  });

  localStorage.setItem(TAGIHAN_KEY, JSON.stringify(next));
  localStorage.setItem(PENGATURAN_TAGIHAN_KEY, JSON.stringify({ monthlyAmount, dueDay: dueDaySafe, updatedAt: Date.now(), updatedBy }));
  notifyStoreUpdated();
}

// ==================== PENGUMUMAN ADMIN ====================

export function getPengumumanAdmin(): PengumumanAdmin[] {
  const all = readLocalKey<PengumumanAdmin[]>(PENGUMUMAN_ADMIN_KEY, []);
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export function getPengumumanAdminUntukKelas(classId: string): PengumumanAdmin[] {
  return getPengumumanAdmin().filter((item) => (item.targetScope === 'classes' ? (item.targetClassIds ?? []).includes(classId) : true));
}

export function getPengumumanAdminUntukGuru(classIds: string[]): PengumumanAdmin[] {
  const classSet = new Set(classIds);
  return getPengumumanAdmin().filter((item) => (item.targetScope === 'classes' ? (item.targetClassIds ?? []).some((id) => classSet.has(id)) : true));
}

export function addPengumumanAdmin(item: PengumumanAdmin): boolean {
  const all = getPengumumanAdmin();
  all.push(item);
  try {
    localStorage.setItem(PENGUMUMAN_ADMIN_KEY, JSON.stringify(all));
  } catch {
    return false;
  }
  notifyStoreUpdated();
  return true;
}

export function deletePengumumanAdmin(id: string) {
  const all = getPengumumanAdmin().filter((item) => item.id !== id);
  localStorage.setItem(PENGUMUMAN_ADMIN_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function hapusSemuaFotoPengumumanAdmin(): number {
  const all = getPengumumanAdmin();
  let count = 0;
  const next = all.map((item) => {
    if (!item.imageDataUrl && !item.imageName) return item;
    count += 1;
    return { ...item, imageDataUrl: undefined, imageName: undefined };
  });
  localStorage.setItem(PENGUMUMAN_ADMIN_KEY, JSON.stringify(next));
  notifyStoreUpdated();
  return count;
}

// ==================== RAPOT ====================

export function getNilaiRapot(): NilaiRapot[] {
  return readLocalKey<NilaiRapot[]>(RAPOT_KEY, []);
}

export function getNilaiRapotBySiswa(studentId: string, tahunAjaran?: string, semester?: string): NilaiRapot[] {
  return getNilaiRapot().filter((item) => {
    if (item.studentId !== studentId) return false;
    if (tahunAjaran && item.tahunAjaran !== tahunAjaran) return false;
    if (semester && item.semester !== semester) return false;
    return true;
  });
}

export function getNilaiRapotByKelas(classId: string, tahunAjaran: string, semester: string): NilaiRapot[] {
  return getNilaiRapot().filter((item) => item.classId === classId && item.tahunAjaran === tahunAjaran && item.semester === semester);
}

export function upsertNilaiRapot(item: NilaiRapot) {
  const all = getNilaiRapot();
  const idx = all.findIndex(
    (existing) =>
      existing.studentId === item.studentId &&
      existing.classId === item.classId &&
      existing.tahunAjaran === item.tahunAjaran &&
      existing.semester === item.semester &&
      existing.mataPelajaran === item.mataPelajaran,
  );
  if (idx >= 0) all[idx] = item;
  else all.push(item);
  localStorage.setItem(RAPOT_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function deleteNilaiRapot(id: string) {
  const all = getNilaiRapot().filter((item) => item.id !== id);
  localStorage.setItem(RAPOT_KEY, JSON.stringify(all));
  notifyStoreUpdated();
}

export function getTahunAjaranRapotSiswa(studentId: string): string[] {
  const set = new Set(getNilaiRapot().filter((item) => item.studentId === studentId).map((item) => item.tahunAjaran));
  return Array.from(set).sort((a, b) => b.localeCompare(a));
}

// ==================== CATATAN RPS GURU ====================

export function getTeacherLessonNotes(teacherId: string, classId?: string, subject?: string): TeacherLessonNote[] {
  const all = readLocalKey<TeacherLessonNote[]>(LESSON_NOTE_KEY, []);
  return all
    .filter((item) => {
      if (item.teacherId !== teacherId) return false;
      if (classId && item.classId !== classId) return false;
      if (subject && item.subject !== subject) return false;
      return true;
    })
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export function upsertTeacherLessonNote(
  payload: Omit<TeacherLessonNote, 'id' | 'updatedAt'> & { id?: string },
) {
  const all = readLocalKey<TeacherLessonNote[]>(LESSON_NOTE_KEY, []);
  const note: TeacherLessonNote = {
    ...payload,
    id: payload.id || `note-${Date.now()}`,
    updatedAt: Date.now(),
  };

  const index = all.findIndex((item) => item.id === note.id);
  if (index >= 0) {
    all[index] = note;
  } else {
    all.push(note);
  }

  localStorage.setItem(LESSON_NOTE_KEY, JSON.stringify(all));
  notifyStoreUpdated();
  return note;
}

// ==================== DOKUMEN RPS GURU ====================

export function getRpsDocument(teacherId: string, classId: string, subject: string): RpsDocument | null {
  const all = readLocalKey<RpsDocument[]>(RPS_DOCUMENT_KEY, []);
  return all.find((item) => item.teacherId === teacherId && item.classId === classId && item.subject === subject) || null;
}

export function saveRpsDocument(payload: Omit<RpsDocument, 'id' | 'updatedAt'> & { id?: string }) {
  const all = readLocalKey<RpsDocument[]>(RPS_DOCUMENT_KEY, []);
  const id = payload.id || `rps-${Date.now()}`;
  const next: RpsDocument = {
    ...payload,
    id,
    updatedAt: Date.now(),
  };
  const index = all.findIndex((item) => item.id === id || (item.teacherId === next.teacherId && item.classId === next.classId && item.subject === next.subject));
  if (index >= 0) all[index] = next;
  else all.push(next);
  localStorage.setItem(RPS_DOCUMENT_KEY, JSON.stringify(all));
  notifyStoreUpdated();
  return next;
}

// ==================== BACKUP & RESTORE ====================

export function getCadanganDataAplikasi() {
  return {
    metadata: { exportedAt: new Date().toISOString(), storageKey: STORAGE_KEY },
    data: readDB(),
  };
}

export function pulihkanDataAplikasiDariCadangan(content: string): HasilPulihkanCadangan {
  try {
    const parsed = JSON.parse(content) as { data?: Database } | Database;
    const restoredData = 'data' in parsed && parsed.data ? parsed.data : (parsed as Database);
    writeDB(restoredData);
    return { berhasil: true, pesan: 'Pemulihan data cadangan berhasil.' };
  } catch {
    return { berhasil: false, pesan: 'Format file cadangan tidak valid.' };
  }
}

// ==================== STORAGE INFO ====================

export function getRingkasanPenyimpananBrowser(): RingkasanPenyimpananBrowser {
  let usedBytes = 0;
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key) continue;
    const value = localStorage.getItem(key) ?? '';
    usedBytes += (key.length + value.length) * 2;
  }
  const usedPercent = Math.min(100, Math.round((usedBytes / APPROX_LOCAL_STORAGE_LIMIT_BYTES) * 100));
  return {
    usedBytes,
    limitBytes: APPROX_LOCAL_STORAGE_LIMIT_BYTES,
    usedPercent,
    remainingBytes: Math.max(0, APPROX_LOCAL_STORAGE_LIMIT_BYTES - usedBytes),
  };
}

export async function kompresUlangSemuaFotoTersimpan(): Promise<RingkasanKompresFoto> {
  return { totalDitemukan: 0, totalBerhasil: 0, totalGagal: 0 };
}

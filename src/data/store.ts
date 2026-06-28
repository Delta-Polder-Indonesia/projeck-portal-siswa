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
  phone?: string;
  whatsapp?: string;
  address?: string;
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

// ── Perpustakaan (BARU) ──────────────────────────────────────────────────
export type Book = {
  id: string;
  isbn?: string;
  title: string;
  author: string;
  category: string;
  publisher: string;
  rack: string;
  stock: number;
  available: number;
  coverImage?: string;
};

export type LibraryMember = {
  id: string;
  name: string;
  memberType: 'siswa' | 'guru' | 'staf';
  joinedAt: number;
};

export type LibraryTransaction = {
  id: string;
  bookId: string;
  memberId: string;
  memberName: string;
  borrowDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  status: 'dipinjam' | 'dikembalikan' | 'terlambat' | 'menunggu' | 'ditolak';
  dueDate: string; // YYYY-MM-DD
  note?: string;
};

// ── PPDB (ENHANCED) ─────────────────────────────────────────────────────────
export type PPDBApplicationStatus = 'PENDING' | 'VERIFIED' | 'ACCEPTED' | 'REJECTED';

export type PPDBDocumentFile = {
  name: string;
  data: string;
};

export interface PPDBApplication {
  id: string;
  registrationNo: string;
  submittedAt: string;
  status: PPDBApplicationStatus;
  jenjangTujuan: string;
  sekolahTujuan: string;
  jalurPendaftaran: string;
  majorId?: string;
  namaLengkap: string;
  nisn: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  agama: string;
  kewenangnegaraan: string;
  anakKe: string;
  jumlahSaudara: string;
  golonganDarah: string;
  alamatLengkap: string;
  rt: string;
  rw: string;
  dusun: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  kodePos: string;
  nomorHp: string;
  whatsApp?: string;
  email: string;
  sekolahAsal: string;
  npsnSekolahAsal: string;
  alasanPindah?: string;
  namaAyah: string;
  nikAyah?: string;
  pendidikanAyah?: string;
  pekerjaanAyah?: string;
  penghasilanAyah?: string;
  namaIbu: string;
  nikIbu?: string;
  pendidikanIbu?: string;
  pekerjaanIbu?: string;
  penghasilanIbu?: string;
  namaWali?: string;
  hubunganWali?: string;
  pendidikanWali?: string;
  pekerjaanWali?: string;
  penghasilanWali?: string;
  nomorHpWali?: string;
  pasFotoDataUrl?: string;
  dokumen?: string[];
  documents?: Record<string, PPDBDocumentFile | null>;
  documentValidation?: Record<string, 'PENDING' | 'VALID' | 'INVALID'>;
  adminNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export type PPDBAuditAction =
  | 'SUBMIT_APPLICATION'
  | 'UPDATE_STATUS'
  | 'UPDATE_DOCUMENT_VALIDATION'
  | 'DELETE_APPLICATION'
  | 'IMPORT_BACKUP'
  | 'ADMIN_LOGIN_SUCCESS'
  | 'ADMIN_LOGIN_FAILED'
  | 'ADMIN_LOGOUT';

export type PPDBAuditLog = {
  id: string;
  action: PPDBAuditAction;
  actor: string;
  occurredAt: string;
  metadata?: Record<string, string>;
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
  // Library
  books: Book[];
  libraryMembers: LibraryMember[];
  libraryTransactions: LibraryTransaction[];
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
const PPDB_AUDIT_KEY = 'portal-siswa-ppdb-audit';
const PPDB_ADMIN_SESSION_KEY = 'portal-siswa-ppdb-admin-session';
const PPDB_ADMIN_LOCK_KEY = 'portal-siswa-ppdb-admin-lock';
const STORE_UPDATED_EVENT = 'absensi_store_updated';
const APPROX_LOCAL_STORAGE_LIMIT_BYTES = 5 * 1024 * 1024;

const ADMIN_MAX_ATTEMPTS = Number((import.meta as any).env.VITE_ADMIN_MAX_ATTEMPTS || '5');
const ADMIN_LOCK_MINUTES = Number((import.meta as any).env.VITE_ADMIN_LOCK_MINUTES || '15');
const ADMIN_SESSION_MINUTES = Number((import.meta as any).env.VITE_ADMIN_SESSION_MINUTES || '480');
const ADMIN_PIN = (import.meta as any).env.VITE_ADMIN_PIN || '26012026';

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

// ==================== UTILS ====================

/**
 * Simulasi hashing password sederhana untuk demo/local storage.
 * Dalam produksi sesungguhnya, gunakan bcrypt/argon2 di server.
 */
export async function hashPassword(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain + 'sekolah_salt'); // Simple salt
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

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

export function getStorageSummary(): RingkasanPenyimpananBrowser {
  let usedBytes = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      if (value) {
        // approximate size in bytes for a string in JS (UTF-16 mostly, but we can do simple char count * 2)
        usedBytes += (key.length + value.length) * 2;
      }
    }
  }
  return {
    usedBytes,
    limitBytes: APPROX_LOCAL_STORAGE_LIMIT_BYTES,
    usedPercent: Number(((usedBytes / APPROX_LOCAL_STORAGE_LIMIT_BYTES) * 100).toFixed(2)),
    remainingBytes: Math.max(0, APPROX_LOCAL_STORAGE_LIMIT_BYTES - usedBytes),
  };
}

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const createRegistrationNo = (): string => {
  const year = new Date().getFullYear();
  const yearCode = String(year).slice(-2);
  const regionCode = ((import.meta as any).env.VITE_REGION_CODE || 'NAS').toUpperCase();
  const applications = getPPDBApplications();
  const maxSeq = applications.reduce((acc, item) => {
    const matched = item.registrationNo.match(/PPDB-\d{2}-[A-Z]+-(\d{6})/);
    const value = matched ? Number(matched[1]) : 0;
    return value > acc ? value : acc;
  }, 0);
  return `PPDB-${yearCode}-${regionCode}-${String(maxSeq + 1).padStart(6, '0')}`;
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
  books: [
    {
      id: 'b1',
      title: 'Laskar Pelangi',
      author: 'Andrea Hirata',
      category: 'Fiksi',
      publisher: 'Bentang Pustaka',
      rack: 'A1',
      stock: 5,
      available: 4,
    },
    {
      id: 'b2',
      title: 'Bumi Manusia',
      author: 'Pramoedya Ananta Toer',
      category: 'Fiksi Sejarah',
      publisher: 'Lentera Dipantara',
      rack: 'A2',
      stock: 3,
      available: 2,
    },
    {
      id: 'b3',
      title: 'Matematika Dasar Kelas X',
      author: 'Prof. Budi Santoso',
      category: 'Pelajaran',
      publisher: 'Erlangga',
      rack: 'B1',
      stock: 10,
      available: 8,
    },
    {
      id: 'b4',
      title: 'Fisika untuk SMA',
      author: 'Dr. Rina Wulandari',
      category: 'Pelajaran',
      publisher: 'Yudhistira',
      rack: 'B2',
      stock: 7,
      available: 6,
    },
  ],
  libraryMembers: [],
  libraryTransactions: [
    {
      id: 'TX-1750924800001',
      bookId: 'b1',
      memberId: 's1',
      memberName: 'Siti Rahma',
      borrowDate: '2026-06-20',
      dueDate: '2026-06-27',
      status: 'dipinjam',
    },
    {
      id: 'TX-1750924800002',
      bookId: 'b3',
      memberId: 's2',
      memberName: 'Budi Santoso',
      borrowDate: '2026-06-22',
      dueDate: '2026-06-29',
      status: 'dipinjam',
    },
    {
      id: 'TX-1750924800003',
      bookId: 'b1',
      memberId: 's3',
      memberName: 'Nabila Putri',
      borrowDate: '2026-06-25',
      dueDate: '2026-07-02',
      status: 'menunggu',
    },
  ],
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
      teachers: (parsed.teachers ?? initialData.teachers).map((teacher) => ({
        ...teacher,
        classIds: teacher.classIds ?? [],
      })),
      classes: (parsed.classes ?? initialData.classes).map((classItem) => ({
        ...classItem,
        grade: classItem.grade ?? 'X',
      })),
      students: (parsed.students ?? initialData.students).map((student) => ({
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

function saveLocalKey<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  notifyStoreUpdated();
}

function createAuditId() {
  return `ppdb-audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getPPDBAuditLogsRaw(): PPDBAuditLog[] {
  return readLocalKey<PPDBAuditLog[]>(PPDB_AUDIT_KEY, []);
}

function savePPDBAuditLogs(logs: PPDBAuditLog[]) {
  saveLocalKey(PPDB_AUDIT_KEY, logs.slice(0, 1000));
}

function appendPPDBAuditLog(
  action: PPDBAuditAction,
  actor: string,
  metadata?: Record<string, string>
) {
  const logs = getPPDBAuditLogsRaw();
  logs.unshift({
    id: createAuditId(),
    action,
    actor,
    occurredAt: new Date().toISOString(),
    metadata,
  });
  savePPDBAuditLogs(logs);
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

export function updateTeacher(teacher: Teacher) {
  const teachers = getTeachers();
  const idx = teachers.findIndex((t) => t.id === teacher.id);
  if (idx >= 0) teachers[idx] = teacher;
  saveTeachers(teachers);
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

// ==================== PPDB (ENHANCED) ====================

function generateStudentNis(students: Student[]) {
  const year = new Date().getFullYear();
  const maxSerial = students.reduce((max, student) => {
    const parsed = Number.parseInt(student.nis.slice(-3), 10);
    return Number.isNaN(parsed) ? max : Math.max(max, parsed);
  }, 0);
  return `${year}${String(maxSerial + 1).padStart(3, '0')}`;
}

export const getPPDBApplications = (): PPDBApplication[] => readDB().ppdbApplications;

const savePPDBApplications = (applications: PPDBApplication[]): void => {
  const db = readDB();
  db.ppdbApplications = applications;
  writeDB(db);
};

export const submitPPDBApplication = (
  data: Omit<PPDBApplication, 'id' | 'registrationNo' | 'submittedAt' | 'status'>
): PPDBApplication => {
  const applications = getPPDBApplications();
  const documentValidation = (data.dokumen || []).reduce<Record<string, 'PENDING'>>((acc, item) => {
    const key = item.split(':')[0];
    if (key) acc[key] = 'PENDING';
    return acc;
  }, {});

  const created: PPDBApplication = {
    ...data,
    id: createId(),
    registrationNo: createRegistrationNo(),
    submittedAt: new Date().toISOString(),
    status: 'PENDING',
    documentValidation,
  };

  applications.push(created);
  savePPDBApplications(applications);
  appendPPDBAuditLog('SUBMIT_APPLICATION', 'PUBLIC_FORM', {
    registrationNo: created.registrationNo,
    namaLengkap: created.namaLengkap,
  });
  return created;
};

export const updateApplicationStatus = (
  id: string,
  status: PPDBApplicationStatus,
  adminNotes?: string,
  verifiedBy?: string
): PPDBApplication | null => {
  const applications = getPPDBApplications();
  const index = applications.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated: PPDBApplication = {
    ...applications[index],
    status,
    adminNotes: adminNotes || applications[index].adminNotes,
    verifiedBy: verifiedBy || applications[index].verifiedBy,
    verifiedAt: new Date().toISOString(),
  };

  applications[index] = updated;
  savePPDBApplications(applications);
  appendPPDBAuditLog('UPDATE_STATUS', verifiedBy || getAdminProfileName(), {
    registrationNo: updated.registrationNo,
    status,
  });

  // If accepted, add to students
  if (status === 'ACCEPTED') {
    const db = readDB();
    const newNis = updated.nisn.trim() || generateStudentNis(db.students);
    if (!db.students.some((s) => s.nis === newNis)) {
      addStudent({
        id: `s-${Date.now()}`,
        name: updated.namaLengkap,
        nis: newNis,
        password: 'siswa123',
        classId: db.classes[0]?.id || '',
        gender: updated.jenisKelamin.toLowerCase().startsWith('p') ? 'P' : 'L',
      });
    }
  }

  return updated;
};

export const updateDocumentValidation = (
  id: string,
  documentKey: string,
  status: 'PENDING' | 'VALID' | 'INVALID'
): PPDBApplication | null => {
  const applications = getPPDBApplications();
  const index = applications.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const app = applications[index];
  const nextValidation = {
    ...(app.documentValidation || {}),
    [documentKey]: status,
  };

  const updated: PPDBApplication = {
    ...app,
    documentValidation: nextValidation,
    verifiedAt: new Date().toISOString(),
  };

  applications[index] = updated;
  savePPDBApplications(applications);
  appendPPDBAuditLog('UPDATE_DOCUMENT_VALIDATION', getAdminProfileName(), {
    registrationNo: updated.registrationNo,
    documentKey,
    status,
  });
  return updated;
};

export const getPPDBApplicationById = (id: string): PPDBApplication | null => {
  return getPPDBApplications().find((item) => item.id === id) || null;
};

export const getPPDBApplicationByRegNo = (regNo: string): PPDBApplication | null => {
  return getPPDBApplications().find((item) => item.registrationNo === regNo) || null;
};

export const deletePPDBApplication = (id: string): boolean => {
  const applications = getPPDBApplications();
  const target = applications.find((item) => item.id === id);
  const filtered = applications.filter((item) => item.id !== id);
  if (filtered.length === applications.length) return false;
  savePPDBApplications(filtered);
  appendPPDBAuditLog('DELETE_APPLICATION', getAdminProfileName(), {
    registrationNo: target?.registrationNo || '-',
  });
  return true;
};

export const getPPDBStatistics = () => {
  const applications = getPPDBApplications();
  return {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'PENDING').length,
    verified: applications.filter((a) => a.status === 'VERIFIED').length,
    accepted: applications.filter((a) => a.status === 'ACCEPTED').length,
    rejected: applications.filter((a) => a.status === 'REJECTED').length,
    byJenjang: {
      SD: applications.filter((a) => a.jenjangTujuan === 'SD').length,
      SMP: applications.filter((a) => a.jenjangTujuan === 'SMP').length,
      SMA: applications.filter((a) => a.jenjangTujuan === 'SMA').length,
      SMK: applications.filter((a) => a.jenjangTujuan === 'SMK').length,
    },
    byJalur: {
      REGULER: applications.filter((a) => a.jalurPendaftaran === 'REGULER').length,
      ZONASI: applications.filter((a) => a.jalurPendaftaran === 'ZONASI').length,
      PRESTASI: applications.filter((a) => a.jalurPendaftaran === 'PRESTASI').length,
      AFIRMASI: applications.filter((a) => a.jalurPendaftaran === 'AFIRMASI').length,
      PINDAHAN: applications.filter((a) => a.jalurPendaftaran === 'PINDAHAN').length,
    },
  };
};

export const getPPDBAuditLogs = (): PPDBAuditLog[] => getPPDBAuditLogsRaw();

export const exportPPDBBackupJson = (): string => {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      applications: getPPDBApplications(),
      auditLogs: getPPDBAuditLogs(),
    },
    null,
    2
  );
};

export const importPPDBBackupJson = (rawJson: string): { ok: boolean; message: string } => {
  try {
    const parsed = JSON.parse(rawJson) as {
      applications?: PPDBApplication[];
      auditLogs?: PPDBAuditLog[];
    };
    if (!Array.isArray(parsed.applications)) {
      return { ok: false, message: 'Format backup tidak valid.' };
    }
    const db = readDB();
    db.ppdbApplications = parsed.applications;
    writeDB(db);
    if (Array.isArray(parsed.auditLogs)) {
      savePPDBAuditLogs(parsed.auditLogs);
    }
    appendPPDBAuditLog('IMPORT_BACKUP', 'admin');
    return { ok: true, message: 'Backup berhasil diimpor.' };
  } catch {
    return { ok: false, message: 'File backup tidak dapat dibaca.' };
  }
};

// PPDB Admin Session & Security
type AdminSession = {
  username: string;
  issuedAt: string;
  expiresAt: string;
};

type AdminLockState = {
  failedCount: number;
  lockedUntil: string | null;
};

const getAdminLockState = (): AdminLockState =>
  readLocalKey<AdminLockState>(PPDB_ADMIN_LOCK_KEY, {
    failedCount: 0,
    lockedUntil: null,
  });

const setAdminLockState = (state: AdminLockState) => {
  saveLocalKey(PPDB_ADMIN_LOCK_KEY, state);
};

const isLockActive = (lockedUntil: string | null) => {
  if (!lockedUntil) return false;
  return new Date(lockedUntil).getTime() > Date.now();
};

export const getAdminSecurityState = () => {
  const lock = getAdminLockState();
  return {
    isLocked: isLockActive(lock.lockedUntil),
    failedCount: lock.failedCount,
    lockedUntil: lock.lockedUntil,
  };
};

export const adminLogin = (username: string, pin: string): boolean => {
  const lock = getAdminLockState();
  if (isLockActive(lock.lockedUntil)) {
    appendPPDBAuditLog('ADMIN_LOGIN_FAILED', username || 'UNKNOWN', { reason: 'LOCKED' });
    return false;
  }

  const normalized = username.trim();
  if (!normalized || pin !== ADMIN_PIN) {
    const nextFailed = lock.failedCount + 1;
    const shouldLock = nextFailed >= ADMIN_MAX_ATTEMPTS;
    const lockedUntil = shouldLock ? new Date(Date.now() + ADMIN_LOCK_MINUTES * 60 * 1000).toISOString() : null;
    setAdminLockState({
      failedCount: shouldLock ? 0 : nextFailed,
      lockedUntil,
    });
    appendPPDBAuditLog('ADMIN_LOGIN_FAILED', normalized || 'UNKNOWN', {
      reason: shouldLock ? 'MAX_ATTEMPTS' : 'INVALID_CREDENTIALS',
    });
    return false;
  }

  const session: AdminSession = {
    username: normalized,
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + ADMIN_SESSION_MINUTES * 60 * 1000).toISOString(),
  };
  saveLocalKey(PPDB_ADMIN_SESSION_KEY, session);
  setAdminLockState({ failedCount: 0, lockedUntil: null });
  appendPPDBAuditLog('ADMIN_LOGIN_SUCCESS', normalized);
  return true;
};

export const adminLogout = (): void => {
  const actor = getAdminProfileName();
  localStorage.removeItem(PPDB_ADMIN_SESSION_KEY);
  appendPPDBAuditLog('ADMIN_LOGOUT', actor);
};

export const isAdminAuthenticated = (): boolean => {
  const session = readLocalKey<AdminSession | null>(PPDB_ADMIN_SESSION_KEY, null);
  if (!session) return false;
  const isValid = new Date(session.expiresAt).getTime() > Date.now();
  if (!isValid) {
    localStorage.removeItem(PPDB_ADMIN_SESSION_KEY);
    return false;
  }
  return true;
};

export const getAdminProfileName = (): string => {
  const session = readLocalKey<AdminSession | null>(PPDB_ADMIN_SESSION_KEY, null);
  return session?.username || 'Admin PPDB';
};

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

// ==================== LIBRARY (ENHANCED) ====================

export function getBooks() {
  return readDB().books;
}

export function saveBooks(nextBooks: Book[]) {
  const db = readDB();
  db.books = nextBooks;
  writeDB(db);
}

export function getLibraryTransactions() {
  return readDB().libraryTransactions;
}

export function saveLibraryTransactions(nextTx: LibraryTransaction[]) {
  const db = readDB();
  db.libraryTransactions = nextTx;
  writeDB(db);
}

export function borrowBook(bookId: string, memberId: string, memberName: string, borrowDate: string, dueDate: string) {
  const db = readDB();
  const book = db.books.find((b) => b.id === bookId);
  if (!book) return { ok: false, message: 'Buku tidak ditemukan.' };
  if (book.available <= 0) return { ok: false, message: 'Stok buku habis.' };

  const tx: LibraryTransaction = {
    id: `TX-${Date.now()}`,
    bookId,
    memberId,
    memberName,
    borrowDate,
    dueDate,
    status: 'menunggu',
  };

  db.libraryTransactions.push(tx);
  writeDB(db);
  return { ok: true, message: 'Permohonan pinjaman berhasil diajukan. Menunggu konfirmasi admin.' };
}

export function approveLibraryLoan(txId: string) {
  const db = readDB();
  const tx = db.libraryTransactions.find((t) => t.id === txId);
  if (!tx) return { ok: false, message: 'Transaksi tidak ditemukan.' };
  if (tx.status !== 'menunggu') return { ok: false, message: 'Buku sudah diproses sebelumnya.' };

  const book = db.books.find((b) => b.id === tx.bookId);
  if (!book) return { ok: false, message: 'Buku tidak ditemukan.' };
  if (book.available <= 0) return { ok: false, message: 'Stok buku habis.' };

  book.available -= 1;
  tx.status = 'dipinjam';
  writeDB(db);
  return { ok: true, message: 'Peminjaman disetujui.' };
}

export function rejectLibraryLoan(txId: string, note = '') {
  const db = readDB();
  const tx = db.libraryTransactions.find((t) => t.id === txId);
  if (!tx) return { ok: false, message: 'Transaksi tidak ditemukan.' };

  tx.status = 'ditolak';
  tx.note = note;
  writeDB(db);
  return { ok: true, message: 'Peminjaman ditolak.' };
}

export function returnBook(txId: string, returnDate: string) {
  const db = readDB();
  const tx = db.libraryTransactions.find((t) => t.id === txId);
  if (!tx) return { ok: false, message: 'Transaksi tidak ditemukan.' };
  if (tx.status === 'dikembalikan') return { ok: false, message: 'Buku sudah dikembalikan.' };

  const book = db.books.find((b) => b.id === tx.bookId);
  if (book) book.available += 1;

  tx.returnDate = returnDate;
  tx.status = 'dikembalikan';
  writeDB(db);
  return { ok: true, message: 'Buku berhasil dikembalikan.' };
}

export function addOrUpdateBook(book: Book) {
  const db = readDB();
  const idx = db.books.findIndex((b) => b.id === book.id);
  if (idx >= 0) {
    db.books[idx] = book;
  } else {
    db.books.push(book);
  }
  writeDB(db);
}

export function deleteBook(id: string) {
  saveBooks(getBooks().filter((b) => b.id !== id));
}

export function getLibraryMembers(): LibraryMember[] {
  return readDB().libraryMembers;
}

export function saveLibraryMembers(nextMembers: LibraryMember[]) {
  const db = readDB();
  db.libraryMembers = nextMembers;
  writeDB(db);
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

export function getTahunAjaranRapotSiswa(studentId: string): string[] {
  const all = getNilaiRapotBySiswa(studentId);
  const ta = Array.from(new Set(all.map((item) => item.tahunAjaran)));
  return ta.sort((a, b) => b.localeCompare(a));
}

export function saveNilaiRapot(nilai: NilaiRapot[]) {
  localStorage.setItem(RAPOT_KEY, JSON.stringify(nilai));
  notifyStoreUpdated();
}

export function getNilaiRapotByKelas(classId: string, tahunAjaran?: string, semester?: string): NilaiRapot[] {
  return getNilaiRapot().filter((item) => {
    if (item.classId !== classId) return false;
    if (tahunAjaran && item.tahunAjaran !== tahunAjaran) return false;
    if (semester && item.semester !== semester) return false;
    return true;
  });
}

export function upsertNilaiRapot(nilai: NilaiRapot) {
  const all = getNilaiRapot();
  const idx = all.findIndex((item) => item.id === nilai.id);
  if (idx >= 0) all[idx] = nilai;
  else all.push(nilai);
  saveNilaiRapot(all);
}

export function deleteNilaiRapot(id: string) {
  saveNilaiRapot(getNilaiRapot().filter((item) => item.id !== id));
}

// ==================== RPS DOCUMENT ====================

const RPS_DOCUMENT_KEY = 'portal-siswa-rps-documents';

export function getRpsDocument(classId: string, subject: string): RpsDocument | null {
  const allDocs = readLocalKey<RpsDocument[]>(RPS_DOCUMENT_KEY, []);
  return allDocs.find((d) => d.classId === classId && d.subject === subject) || null;
}

export function saveRpsDocument(doc: RpsDocument) {
  const allDocs = readLocalKey<RpsDocument[]>(RPS_DOCUMENT_KEY, []);
  const idx = allDocs.findIndex((d) => d.classId === doc.classId && d.subject === doc.subject);
  if (idx >= 0) {
    allDocs[idx] = { ...doc, updatedAt: Date.now() };
  } else {
    allDocs.push({ ...doc, id: createId(), updatedAt: Date.now() });
  }
  saveLocalKey(RPS_DOCUMENT_KEY, allDocs);
}

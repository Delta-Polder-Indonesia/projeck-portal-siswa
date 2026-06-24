import { useState } from 'react';
import TabAkunSiswa from './components/TabAkunSiswa';
import InboxPPDBAdmin from './InboxPPDBAdmin';

type StudentAdminTab = 'akun-siswa' | 'tambah-siswa';

interface AdminSiswaPanelProps {
  setNotice: (msg: string) => void;
  scope: 'teacher' | 'student';
}

export default function AdminSiswaPanel({ setNotice }: AdminSiswaPanelProps) {
  const [activeStudentTab, setActiveStudentTab] = useState<StudentAdminTab>('akun-siswa');

  return (
    <section className="flex h-full w-full flex-col bg-gray-50/30 p-3">
      <div className="scrollbar-hide flex shrink-0 gap-2 overflow-x-auto border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveStudentTab('akun-siswa')}
          className={`whitespace-nowrap rounded px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-all ${
            activeStudentTab === 'akun-siswa'
              ? 'bg-gray-800 text-white shadow-sm'
              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Pengaturan Akun Siswa
        </button>
        <button
          onClick={() => setActiveStudentTab('tambah-siswa')}
          className={`whitespace-nowrap rounded px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase transition-all ${
            activeStudentTab === 'tambah-siswa'
              ? 'bg-gray-800 text-white shadow-sm'
              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Input Siswa Baru (PPDB)
        </button>
      </div>

      <div className="mt-2 flex-1 overflow-y-auto rounded-md border border-gray-200 bg-white p-4 shadow-sm">
        {activeStudentTab === 'akun-siswa' && <TabAkunSiswa setNotice={setNotice} />}
        {activeStudentTab === 'tambah-siswa' && <InboxPPDBAdmin setNotice={setNotice} />}
      </div>
    </section>
  );
}

import { Users, BookMarked, Tag, Building, MapPin, GraduationCap, FileText } from 'lucide-react';

interface PerpusMasterDataProps {
  activeSubTab: string;
}

const MASTER_CONFIG: Record<string, { title: string; icon: React.ElementType; fields: string[] }> = {
  'anggota': { 
    title: 'Data Anggota', 
    icon: Users,
    fields: ['ID Anggota', 'Nama', 'Kelas', 'No. HP', 'Alamat', 'Status'] 
  },
  'buku': { 
    title: 'Data Buku', 
    icon: BookMarked,
    fields: ['ID Buku', 'Judul', 'Pengarang', 'Penerbit', 'Tahun', 'Stok'] 
  },
  'kategori': { 
    title: 'Data Kategori', 
    icon: Tag,
    fields: ['ID Kategori', 'Nama Kategori', 'Keterangan'] 
  },
  'penerbit': { 
    title: 'Data Penerbit', 
    icon: Building,
    fields: ['ID Penerbit', 'Nama Penerbit', 'Alamat', 'No. Telp'] 
  },
  'rak': { 
    title: 'Data Rak', 
    icon: MapPin,
    fields: ['Kode Rak', 'Lokasi', 'Kapasitas', 'Terisi'] 
  },
};

const DUMMY_DATA: Record<string, any[]> = {
  'anggota': [
    { id: 'A001', nama: 'Ahmad Rizky', kelas: 'VII-A', hp: '08123456789', alamat: 'Jl. Mawar No. 1', status: 'Aktif' },
    { id: 'A002', nama: 'Siti Nurhaliza', kelas: 'VIII-B', hp: '08198765432', alamat: 'Jl. Melati No. 5', status: 'Aktif' },
  ],
  'buku': [
    { id: 'B001', judul: 'Matematika Dasar', pengarang: 'Prof. Budi', penerbit: 'Erlangga', tahun: '2023', stok: 15 },
    { id: 'B002', judul: 'Bahasa Indonesia', pengarang: 'Dr. Ani', penerbit: 'Yudhistira', tahun: '2024', stok: 20 },
  ],
  'kategori': [
    { id: 'K001', nama: 'Pelajaran', keterangan: 'Buku pelajaran sekolah' },
    { id: 'K002', nama: 'Novel', keterangan: 'Karya fiksi' },
  ],
  'penerbit': [
    { id: 'P001', nama: 'Erlangga', alamat: 'Jakarta', telp: '021-1234567' },
    { id: 'P002', nama: 'Yudhistira', alamat: 'Bandung', telp: '022-7654321' },
  ],
  'rak': [
    { kode: 'A01', lokasi: 'Ruang Baca Lt. 1', kapasitas: 100, terisi: 85 },
    { kode: 'A02', lokasi: 'Ruang Baca Lt. 2', kapasitas: 100, terisi: 60 },
  ],
};

export default function PerpusMasterData({ activeSubTab }: PerpusMasterDataProps) {
  const config = MASTER_CONFIG[activeSubTab] || MASTER_CONFIG['buku'];
  const data = DUMMY_DATA[activeSubTab] || [];
  const Icon = config.icon;
  const dataKeys = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="bg-white rounded shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <Icon className="w-5 h-5 text-[#3c8dbc]" />
        <h2 className="text-lg font-semibold text-gray-800">{config.title}</h2>
      </div>

      <div className="p-4">
        <button className="flex items-center gap-2 px-3 py-2 bg-[#00a65a] text-white text-xs font-bold rounded hover:bg-[#008d4c] mb-4">
          + Tambah {config.title.replace('Data ', '')}
        </button>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                {dataKeys.map((key) => (
                  <th key={key} className="px-3 py-2.5 text-left font-semibold text-gray-700 border-b border-r border-gray-200 capitalize">
                    {key.replace(/_/g, ' ')}
                  </th>
                ))}
                <th className="px-3 py-2.5 text-left font-semibold text-gray-700 border-b border-gray-200">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  {dataKeys.map((key) => (
                    <td key={key} className="px-3 py-2.5 text-gray-600 border-r border-gray-100">
                      {item[key]}
                    </td>
                  ))}
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      <button className="px-2 py-1 bg-[#f39c12] text-white text-[10px] rounded">Edit</button>
                      <button className="px-2 py-1 bg-[#dd4b39] text-white text-[10px] rounded">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
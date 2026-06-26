import { useState, useMemo } from 'react';
import { Search, Plus, Printer, Edit, Trash2, X, Save } from 'lucide-react';
import { getBooks, addOrUpdateBook, saveBooks } from '../../../data/store';
import { useStoreVersion } from '../../../hooks/useStoreVersion';
import { Book } from '../../../data/store';

interface PerpusInventoriProps {
  onViewDetail: (id: string) => void;
}

export default function PerpusInventori({ onViewDetail }: PerpusInventoriProps) {
  const storeVersion = useStoreVersion();
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    category: '',
    publisher: '',
    rack: '',
    stock: 0,
    available: 0
  });

  const allBooks = useMemo(() => getBooks(), [storeVersion]);

  const filtered = allBooks.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingBook(null);
    setFormData({
      id: `B-${Date.now().toString().slice(-4)}`,
      title: '',
      author: '',
      category: 'Fiksi',
      publisher: '',
      rack: 'A1',
      stock: 1,
      available: 1
    });
    setShowForm(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData(book);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus buku ini?')) {
      const next = allBooks.filter(b => b.id !== id);
      saveBooks(next);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addOrUpdateBook(formData as Book);
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {showForm && (
        <div className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 uppercase tracking-tight">
                {editingBook ? 'Edit Data Buku' : 'Tambah Buku Baru'}
              </h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Judul Literatur</label>
                  <input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Penulis</label>
                  <input
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="Fiksi">Fiksi</option>
                    <option value="Non-Fiksi">Non-Fiksi</option>
                    <option value="Sains">Sains</option>
                    <option value="Sejarah">Sejarah</option>
                    <option value="Religi">Religi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Stok Total</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value), available: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Letak Rak</label>
                  <input
                    value={formData.rack}
                    onChange={e => setFormData({ ...formData, rack: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Batal</button>
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white text-xs font-bold rounded uppercase shadow-lg shadow-blue-500/20 flex items-center gap-2">
                <Save className="w-3.5 h-3.5" /> Simpan Data
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Data Inventory Buku</h2>
        </div>

        <div className="p-4 flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-3 py-2 bg-[#00a65a] text-white text-xs font-bold rounded hover:bg-[#008d4c]"
          >
            <Plus className="w-3.5 h-3.5" />
            Entry Buku Baru
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-50">
            <Printer className="w-3.5 h-3.5" />
            Cetak Katalog
          </button>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Search:</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1 w-36 outline-none focus:border-[#3c8dbc]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['ID', 'Judul', 'Pengarang', 'Stok', 'Kategori', 'Rak', 'Aksi'].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((book) => (
                <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2.5 text-gray-600">{book.id}</td>
                  <td
                    className="px-3 py-2.5 text-[#3c8dbc] font-bold cursor-pointer hover:underline"
                    onClick={() => onViewDetail(book.id)}
                  >
                    {book.title}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">{book.author}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded font-bold ${book.available > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {book.available} / {book.stock}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">{book.category}</td>
                  <td className="px-3 py-2.5 text-gray-600">{book.rack}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(book)} className="w-7 h-7 bg-[#f39c12] text-white rounded flex items-center justify-center hover:bg-[#e08e0b]">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDelete(book.id)} className="w-7 h-7 bg-[#dd4b39] text-white rounded flex items-center justify-center hover:bg-[#c9302c]">
                        <Trash2 className="w-3 h-3" />
                      </button>
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
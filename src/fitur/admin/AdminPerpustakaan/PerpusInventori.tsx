import { useState, useMemo } from 'react';
import { Search, Plus, Printer, Edit, Trash2, X, Save, ImageIcon, Upload, FileText } from 'lucide-react';
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
    id: '',
    title: '',
    author: '',
    category: '',
    publisher: '',
    rack: '',
    stock: 0,
    available: 0,
    isbn: '',
    coverImage: '',
    description: ''
  });

  // State untuk preview cover
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const allBooks = useMemo(() => getBooks(), [storeVersion]);

  const filtered = allBooks.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingBook(null);
    setCoverPreview(null);
    setFormData({
      id: `B-${Date.now().toString().slice(-4)}`,
      title: '',
      author: '',
      category: 'Fiksi',
      publisher: '',
      rack: 'A1',
      stock: 1,
      available: 1,
      isbn: '',
      coverImage: '',
      description: ''
    });
    setShowForm(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData(book);
    setCoverPreview(book.coverImage || null);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus buku ini?')) {
      const next = allBooks.filter(b => b.id !== id);
      saveBooks(next);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setCoverPreview(base64);
      setFormData(prev => ({ ...prev, coverImage: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
    setFormData(prev => ({ ...prev, coverImage: '' }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addOrUpdateBook(formData as Book);
    setShowForm(false);
    setCoverPreview(null);
  };

  return (
    <div className="space-y-4">
      {showForm && (
        <div className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSave} className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden my-8">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 uppercase tracking-tight">
                {editingBook ? 'Edit Data Buku' : 'Tambah Buku Baru'}
              </h3>
              <button type="button" onClick={() => { setShowForm(false); setCoverPreview(null); }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* ID Buku */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">ID Buku</label>
                <input
                  value={formData.id}
                  onChange={e => setFormData({ ...formData, id: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 bg-gray-50"
                  required
                  readOnly={!!editingBook}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Judul */}
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Judul Literatur</label>
                  <input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>
                {/* Penulis */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Penulis</label>
                  <input
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>
                {/* ISBN */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">ISBN</label>
                  <input
                    value={formData.isbn || ''}
                    onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                    placeholder="978-602-xxx-xx-x"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                {/* Kategori */}
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
                    <option value="Biografi">Biografi</option>
                    <option value="Teknologi">Teknologi</option>
                    <option value="Pelajaran">Pelajaran</option>
                  </select>
                </div>
                {/* Penerbit */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Penerbit</label>
                  <input
                    value={formData.publisher || ''}
                    onChange={e => setFormData({ ...formData, publisher: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                {/* Stok */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Stok Total</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={e => {
                      const stock = Number(e.target.value);
                      setFormData({ ...formData, stock, available: editingBook ? formData.available : stock });
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>
                {/* Rak */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Letak Rak</label>
                  <input
                    value={formData.rack}
                    onChange={e => setFormData({ ...formData, rack: e.target.value })}
                    placeholder="Contoh: A1, B2, C3"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Upload Cover */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Sampul Buku</label>
                <div className="flex items-start gap-4">
                  {/* Preview */}
                  {coverPreview ? (
                    <div className="relative flex-shrink-0">
                      <img
                        src={coverPreview}
                        alt="Preview cover"
                        className="w-24 h-32 object-cover rounded border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveCover}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-8 h-8 mb-1" />
                      <span className="text-[9px]">Belum ada</span>
                    </div>
                  )}
                  {/* Upload Button */}
                  <div className="flex-1">
                    <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded cursor-pointer hover:bg-blue-100 transition w-fit">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-blue-700">{coverPreview ? 'Ganti Gambar' : 'Upload Cover'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-gray-400 mt-1">Format: JPG, PNG. Maks: 2MB</p>
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Deskripsi / Sinopsis Buku
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tulis deskripsi singkat tentang isi buku ini..."
                  rows={4}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button type="button" onClick={() => { setShowForm(false); setCoverPreview(null); }} className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Batal</button>
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
                {['Cover', 'ID', 'Judul', 'Pengarang', 'Stok', 'Kategori', 'Rak', 'Aksi'].map((h) => (
                  <th key={h} className={`px-3 py-2.5 text-left font-semibold text-gray-700 border-r border-gray-200 last:border-r-0 ${h === 'Cover' ? 'w-16' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((book) => (
                <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {/* Cover Preview */}
                  <td className="px-3 py-2.5">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded border border-gray-200 cursor-pointer hover:scale-110 transition"
                        onClick={() => onViewDetail(book.id)}
                        title="Klik untuk detail"
                      />
                    ) : (
                      <div className="w-10 h-14 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-gray-300" />
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 font-mono text-[10px]">{book.id}</td>
                  <td
                    className="px-3 py-2.5 text-[#3c8dbc] font-bold cursor-pointer hover:underline max-w-[180px] truncate"
                    onClick={() => onViewDetail(book.id)}
                    title={book.title}
                  >
                    {book.title}
                  </td>
                  <td className="px-3 py-2.5 text-gray-600">{book.author}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${book.available > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {book.available} / {book.stock}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                      {book.category}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-gray-600 font-mono text-[10px]">{book.rack}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(book)} className="w-7 h-7 bg-[#f39c12] text-white rounded flex items-center justify-center hover:bg-[#e08e0b]" title="Edit">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleDelete(book.id)} className="w-7 h-7 bg-[#dd4b39] text-white rounded flex items-center justify-center hover:bg-[#c9302c]" title="Hapus">
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
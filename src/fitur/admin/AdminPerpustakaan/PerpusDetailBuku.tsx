import { ArrowLeft, Download } from 'lucide-react';

interface PerpusDetailBukuProps {
  bookId: string | null;
  onBack: () => void;
}

const BOOK_DETAILS: Record<string, any> = {
  'B0009': {
    judul: 'Mau Order Pustaka Digital',
    pengarang: 'Masri',
    isbn: '123-321-345-51-309',
    tahun: '2020',
    kategori: 'Sistem Informasi',
    rak: 'A01 [Rak 1]',
    penerbit: 'Elexmedia Komputindo',
    jumlah: 22,
    sinopsis: 'Buku ini merupakan buku siswa yang dipersiapkan Pemerintah dalam rangka implementasi Kurikulum 2013.',
    cover: 'https://via.placeholder.com/200x280/4ade80/ffffff?text=Sehat+Itu+Penting',
    ebook: 'Sehat Itu Penting.pdf'
  },
  'B0010': {
    judul: 'Sistem Imunisasi',
    pengarang: 'Janti Sudiono',
    isbn: '978-602-1234-56-7',
    tahun: '2021',
    kategori: 'Kesehatan',
    rak: 'A01 [Rak 1]',
    penerbit: 'Elexmedia Komputindo',
    jumlah: 42,
    sinopsis: 'Buku tentang sistem imunisasi dan kesehatan masyarakat.',
    cover: 'https://via.placeholder.com/200x280/3b82f6/ffffff?text=Sistem+Imunisasi',
    ebook: 'Sistem Imunisasi.pdf'
  },
  'B0011': {
    judul: 'Sehat Itu Penting',
    pengarang: 'Ari Subekti',
    isbn: '123-321-345-51-309',
    tahun: '2020',
    kategori: 'Sistem Informasi',
    rak: 'A01 [Rak 1]',
    penerbit: 'Elexmedia Komputindo',
    jumlah: 22,
    sinopsis: 'Buku ini merupakan buku siswa yang dipersiapkan Pemerintah dalam rangka implementasi Kurikulum 2013.',
    cover: 'https://via.placeholder.com/200x280/f59e0b/ffffff?text=Sehat+Itu+Penting',
    ebook: 'Sehat Itu Penting.pdf'
  }
};

export default function PerpusDetailBuku({ bookId, onBack }: PerpusDetailBukuProps) {
  const book = bookId ? BOOK_DETAILS[bookId] : null;

  if (!book) {
    return (
      <div className="bg-white rounded shadow-sm p-8 text-center">
        <p className="text-gray-500">Buku tidak ditemukan</p>
        <button onClick={onBack} className="mt-4 text-[#3c8dbc] hover:underline text-sm">
          Kembali ke daftar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-sm p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-gray-800 mb-2">
          Detail Buku Pilihan Anda
        </h2>
        <div className="w-16 h-0.5 bg-orange-300 mx-auto mb-4" />
        <p className="text-gray-600 text-sm">Silahkan cek detail buku yang Anda pilih</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
        {/* Cover */}
        <div className="flex-shrink-0">
          <img 
            src={book.cover} 
            alt={book.judul}
            className="w-48 h-64 object-cover rounded-lg shadow-md border border-gray-200"
          />
        </div>

        {/* Details */}
        <div className="flex-1">
          <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-gray-800 mb-6">
            {book.judul}
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Pengarang', value: book.pengarang },
              { label: 'ISBN', value: book.isbn },
              { label: 'Tahun Terbit', value: book.tahun },
              { label: 'Kategori', value: book.kategori },
              { label: 'Rak', value: book.rak },
              { label: 'Penerbit', value: book.penerbit },
              { label: 'Jumlah Buku', value: book.jumlah },
            ].map((item) => (
              <div key={item.label} className="flex border-b border-gray-100 pb-2">
                <span className="w-28 text-sm text-gray-600 flex-shrink-0">{item.label}</span>
                <span className="text-sm text-gray-800">: {item.value}</span>
              </div>
            ))}

            <div className="flex border-b border-gray-100 pb-2">
              <span className="w-28 text-sm text-gray-600 flex-shrink-0">Sinopsis</span>
              <span className="text-sm text-gray-800 flex-1">: {book.sinopsis}</span>
            </div>
          </div>

          {/* Download */}
          <div className="mt-6">
            <p className="text-sm font-bold text-gray-800 mb-2">Download e-book di sini</p>
            <a 
              href="#"
              className="inline-flex items-center gap-2 text-[#3c8dbc] hover:underline text-sm"
            >
              <Download className="w-4 h-4" />
              {book.ebook}
            </a>
          </div>

          {/* Back Button */}
          <button 
            onClick={onBack}
            className="mt-6 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Inventori
          </button>
        </div>
      </div>
    </div>
  );
}
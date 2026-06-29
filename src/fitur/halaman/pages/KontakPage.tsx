import type { PageProps } from '../types';

export default function KontakPage({ onNavigate }: PageProps) {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Kontak</h2>
        <p className="text-sm text-slate-600">Hubungi kami untuk informasi PPDB, kerja sama, dan layanan administrasi.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
        <div className="space-y-3 border border-slate-200 bg-[#f8f9fc] p-5 text-sm text-gray-700">
          <h3 className="font-bold text-blue-950 mb-2">Informasi Kontak</h3>
          <p><span className="font-semibold">Alamat:</span> Jl. Mahar Martanegara No. 48, Cimahi Selatan</p>
          <p><span className="font-semibold">Telepon:</span> 022 - 6629683</p>
          <p><span className="font-semibold">Email:</span> smkn1cimahi@gmail.com</p>
          <p><span className="font-semibold">Jam Layanan:</span> Senin - Jumat, 07.00 - 15.00 WIB</p>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <h4 className="font-bold text-xs text-gray-800 mb-2">Jam Operasional Kantor</h4>
            <div className="text-xs space-y-1 text-gray-600">
              <div className="flex justify-between"><span>Senin - Kamis:</span><span className="font-semibold">07.00 - 14.00 WIB</span></div>
              <div className="flex justify-between"><span>Jumat:</span><span className="font-semibold">07.00 - 11.00 WIB</span></div>
              <div className="flex justify-between text-gray-400"><span>Sabtu - Minggu:</span><span>Tutup / Libur</span></div>
            </div>
          </div>
        </div>

        <form className="space-y-3 border border-slate-200 bg-white p-5">
          <h3 className="font-bold text-blue-950 mb-2 text-sm">Kirim Pesan</h3>
          <input
            placeholder="Nama Lengkap"
            className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-800"
          />
          <input
            placeholder="Email"
            type="email"
            className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-800"
          />
          <input
            placeholder="Subjek"
            className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-800"
          />
          <textarea
            rows={4}
            placeholder="Pesan Anda"
            className="w-full resize-none border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-800"
          />
          <button type="button" className="bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 cursor-pointer w-full">
            Kirim Pesan
          </button>
        </form>
      </div>
    </section>
  );
}
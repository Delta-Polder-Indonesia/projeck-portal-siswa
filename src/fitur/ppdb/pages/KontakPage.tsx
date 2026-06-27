export default function KontakPage() {
  return (
    <section className="px-6 py-8">
      <div className="border-b-2 border-amber-500 pb-3">
        <h2 className="text-2xl font-bold text-blue-900">Kontak</h2>
        <p className="text-sm text-slate-600">Hubungi kami untuk informasi PPDB, kerja sama, dan layanan administrasi.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
        <div className="space-y-2 border border-slate-200 bg-[#f8f9fc] p-5 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Alamat:</span> Jl. Mahar Martanegara No. 48, Cimahi Selatan
          </p>
          <p>
            <span className="font-semibold">Telepon:</span> 022 - 6629683
          </p>
          <p>
            <span className="font-semibold">Email:</span> smkn1cimahi@gmail.com
          </p>
          <p>
            <span className="font-semibold">Jam Layanan:</span> Senin - Jumat, 07.00 - 15.00 WIB
          </p>
        </div>

        <form className="space-y-3 border border-slate-200 bg-white p-5">
          <input
            placeholder="Nama"
            className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-800"
          />
          <input
            placeholder="Email"
            className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-800"
          />
          <textarea
            rows={4}
            placeholder="Pesan"
            className="w-full resize-none border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-800"
          />
          <button type="button" className="bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
            Kirim Pesan
          </button>
        </form>
      </div>
    </section>
  );
}
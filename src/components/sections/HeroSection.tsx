export default function HeroSection() {
  return (
    <section className="relative h-[392px] overflow-hidden border-b border-[#d7d7d7]">
      <img
        src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1600&q=80"
        alt="Siswa dan siswi SMK"
        className="h-full w-full object-cover"
      />

      <button className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#1f4f85] text-lg text-white">
        &lsaquo;
      </button>
      <button className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#1f4f85] text-lg text-white">
        &rsaquo;
      </button>

      <div className="absolute left-10 top-14 max-w-[350px] bg-white/95 px-6 py-5 text-[#1f3450] shadow-[0_0_0_1px_#cfd8e3]">
        <h2 className="text-[35px] leading-none text-[#1d4f82]">PPDB SMK Negeri 1 Cimahi</h2>
        <p className="mt-2 text-[12px] leading-[1.45] text-[#4c5a6a]">
          Silahkan anda bisa akses ppdb.smkn1-cmsch.id untuk mendapatkan informasi resmi pendaftaran peserta
          didik baru 2019 di SMK Negeri 1 Cimahi.
        </p>
      </div>
    </section>
  );
}
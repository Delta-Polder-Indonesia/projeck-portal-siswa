import { ChevronLeft, ChevronRight } from "lucide-react";
import { activityItems, introItems, newsItems } from "../data";

interface BerandaPageProps {
  onRegister: () => void;
}

export default function BerandaPage({ onRegister }: BerandaPageProps) {
  return (
    <>
      <div className="relative flex h-[420px] items-center justify-start overflow-hidden border-b-4 border-amber-500 bg-gradient-to-r from-blue-100 to-amber-100">
        <img
          src="https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1600&q=80"
          alt="Siswa-siswi SMK Negeri 1 Cimahi"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/35 via-slate-900/25 to-amber-900/20" />

        <button
          type="button"
          className="absolute left-3 z-10 hidden rounded-full bg-blue-950/70 p-2 text-white transition-colors hover:bg-blue-950 sm:block"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="absolute right-3 z-10 hidden rounded-full bg-blue-950/70 p-2 text-white transition-colors hover:bg-blue-950 sm:block"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="relative z-10 ml-4 max-w-lg rounded-r-3xl border-l-8 border-amber-500 bg-white/95 p-7 text-left shadow-2xl shadow-slate-900/25 sm:ml-12 sm:rounded-r-full">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-700">Penerimaan Peserta Didik Baru</p>
          <h1 className="text-xl md:text-2xl font-bold leading-tight tracking-tight text-blue-900">PPDB SMP Negeri 1 Majenang</h1>
          <p className="mt-2 max-w-[400px] text-sm leading-relaxed text-gray-700">
            Silahkan anda bisa akses <span className="font-bold text-blue-700">ppdb.smkn1-cimahi.sch.id</span> untuk
            mendapatkan semua informasi pendaftaran PPDB tahun 2026 di SMK Negeri 1 Cimahi.
          </p>
          <button
            type="button"
            onClick={onRegister}
            className="mt-5 cursor-pointer rounded bg-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-900 shadow transition-all hover:bg-amber-600"
          >
            Daftar Sekarang
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 border-b border-slate-200 bg-[#f8f9fc] md:grid-cols-4">
        {[
          ["1.850+", "Total Siswa"],
          ["97", "Guru dan Staf"],
          ["92%", "Serapan Lulusan"],
          ["26", "Mitra Industri"],
        ].map(([value, label]) => (
          <div key={label} className="border-r border-slate-200 px-6 py-5 last:border-r-0">
            <p className="text-2xl font-bold text-blue-900">{value}</p>
            <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 border-b border-gray-200 px-6 py-10 md:grid-cols-3">
        {introItems.map((item) => (
          <div key={item.title}>
            <h3 className="mb-3 border-b border-gray-200 pb-2 text-lg font-bold text-blue-900">{item.title}</h3>
            <p className="text-justify text-sm leading-relaxed text-gray-600">{item.content}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 bg-white px-6 py-8 md:grid-cols-12">
        <div className="space-y-4 md:col-span-7">
          <h3 className="flex items-center gap-1.5 border-b-2 border-amber-500 pb-1 text-base font-bold uppercase text-blue-950">
            Berita Terbaru
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {newsItems.map((item) => (
              <div key={item.title} className="border border-gray-200 bg-slate-50/60 p-4">
                <h4 className="cursor-pointer text-sm font-bold uppercase leading-tight text-blue-900 hover:underline">{item.title}</h4>
                <span className="my-1 block text-[11px] text-gray-500">{item.date}</span>
                <p className="line-clamp-3 text-justify text-xs leading-relaxed text-gray-600">{item.excerpt}</p>
                <span className="mt-2 inline-block cursor-pointer text-xs font-semibold text-blue-700 hover:underline">
                  Baca Selengkapnya
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 md:col-span-5">
          <h3 className="flex items-center gap-1.5 border-b-2 border-amber-500 pb-1 text-base font-bold uppercase text-blue-950">
            Info Kegiatan
          </h3>
          <div className="space-y-3">
            {activityItems.map((kegiatan) => (
              <div key={kegiatan.title} className="flex items-center gap-3 border border-gray-100 bg-slate-50 p-2">
                <img
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=240&q=80"
                  alt={kegiatan.title}
                  className="h-14 w-20 flex-shrink-0 object-cover"
                />
                <div className="text-xs">
                  <h4 className="line-clamp-1 cursor-pointer font-bold leading-tight text-blue-950 hover:underline">
                    {kegiatan.title}
                  </h4>
                  <p className="mt-0.5 line-clamp-2 text-gray-500">{kegiatan.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
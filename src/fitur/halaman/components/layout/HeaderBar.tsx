export default function HeaderBar() {
  return (
    <header className="w-full bg-white">
      <div className="mx-auto flex w-full max-w-[1070px] items-center justify-between px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#1f4d84] bg-[#f4f7fc] text-[9px] font-bold text-[#1f4d84]">
            SMKN1
          </div>
          <div>
            <h1 className="text-[34px] leading-none text-[#1a4b83]">SMK Negeri 1 Cimahi</h1>
            <p className="pt-1 text-[10px] uppercase tracking-[1.4px] text-[#7e7e7e]">
              SMK unggul yang menghasilkan SDM bermutu dan berdaya saing tinggi
            </p>
          </div>
        </div>
        <form className="flex items-center gap-1">
          <input
            aria-label="Cari"
            placeholder="search ..."
            className="h-8 w-36 border border-[#c7c7c7] px-2 text-xs outline-none"
          />
          <button className="h-8 bg-[#173a62] px-4 text-xs font-semibold text-white">Search</button>
        </form>
      </div>
    </header>
  );
}
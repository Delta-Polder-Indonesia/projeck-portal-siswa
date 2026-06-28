const footerColumns = [
  {
    title: "Social Media Kami",
    items: ["f", "Ayo Follow dan ikut informasi seputar kegiatan di SMK Negeri 1 Cimahi di sosial media kami."],
  },
  {
    title: "Tentang SMKN 1 Cimahi",
    items: [
      "SMK Negeri 1 Cimahi SMP Penerapan dan Bandung merupakan salah satu Lembaga Pendidikan Masyarakat Kejuruan di Kota Cimahi.",
      "Mari pantau terus perkembangan program pendidikan kejuruan 4 tahun.",
    ],
  },
  {
    title: "Link Tautan Kami",
    items: ["> DISDIK - Kementerian", "> PUSDATIN - Provinsi", "> e-TRUBUS SMKN 1 Cimahi", "> e-LIBRARY SMKN 1 Cimahi"],
  },
  {
    title: "Informasi Terkini",
    items: [
      "> ACHIEVEMENT MOTIVATION TRAINING SESSION 2, CITARIK, SUKABUMI, 19-20 APRIL 2019",
      "> TOGETHER IN HARMONY",
      "> DIES NATALIS SMKN 1 CIMAHI KE 42 & PEMBUKAAN PTM ANGKATAN 29",
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-0 w-full border-t-[3px] border-[#ea9f2f] bg-[#173a62] text-white">
      <div className="mx-auto grid w-full max-w-[1070px] grid-cols-1 gap-6 px-10 py-8 text-[12px] md:grid-cols-4">
        {footerColumns.map((column) => (
          <div key={column.title}>
            <h4 className="mb-3 text-[20px] text-white">{column.title}</h4>
            <div className="space-y-2 text-[11px] leading-[1.5] text-[#d8e6f4]">
              {column.items.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-[#335b84] py-3 text-center text-[11px] text-[#d3e0f0]">
        SMKN 1 Program sekolah | Program keahlian | kontak kami
      </div>
      <div className="bg-[#123054] py-2 text-center text-[10px] text-[#9fbbd8]">
        Copyright powered by VitePress | Redesign 2026
      </div>
    </footer>
  );
}
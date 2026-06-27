import { activities, latestNews } from "../../data/schoolData";

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="mb-3 border-b border-[#d8d8d8] pb-2 text-[30px] leading-none text-[#173d66]">{title}</h3>
  );
}

export default function NewsAndActivities() {
  return (
    <section className="grid grid-cols-1 gap-6 px-10 pb-12 pt-2 md:grid-cols-[1.1fr_1fr]">
      <div>
        <SectionTitle title="Berita Terbaru" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {latestNews.map((item) => (
            <article key={item.title} className="min-h-[205px] bg-[#f2f2f2] p-4 text-[#2b3f56]">
              <h4 className="border-t-[3px] border-[#ea9f2f] pt-2 text-[16px] leading-tight text-[#1b4a7d]">{item.title}</h4>
              <p className="pt-2 text-[11px] text-[#7e7e7e]">{item.date}</p>
              <p className="pt-2 text-[12px] leading-[1.5]">{item.excerpt}</p>
              <button className="pt-3 text-[12px] text-[#1b4a7d]">Baca Selengkapnya &gt;</button>
            </article>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle title="Info Kegiatan" />
        <div className="space-y-3">
          {activities.map((activity) => (
            <article key={activity.title} className="flex gap-3 bg-[#f2f2f2] p-3">
              <img src={activity.image} alt={activity.title} className="h-20 w-24 flex-shrink-0 object-cover" />
              <div>
                <h4 className="text-[16px] leading-tight text-[#1b4a7d]">{activity.title}</h4>
                <p className="pt-2 text-[12px] leading-[1.45] text-[#44566d]">{activity.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
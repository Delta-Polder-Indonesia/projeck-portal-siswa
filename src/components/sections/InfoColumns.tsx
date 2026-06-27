import { introSections } from "../../data/schoolData";

export default function InfoColumns() {
  return (
    <section className="grid grid-cols-1 gap-8 px-10 py-8 md:grid-cols-3">
      {introSections.map((section) => (
        <article key={section.title}>
          <h3 className="border-b border-[#d8d8d8] pb-2 text-[28px] leading-none text-[#173d66]">{section.title}</h3>
          <p className="pt-3 text-[12px] leading-[1.65] text-[#3e4a59]">{section.text}</p>
        </article>
      ))}
    </section>
  );
}
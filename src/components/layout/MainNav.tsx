import { quickLinks } from "../../data/schoolData";

export default function MainNav() {
  return (
    <nav className="w-full border-y-[3px] border-[#ea9f2f] bg-[#0d3b67]">
      <div className="mx-auto flex w-full max-w-[1070px] items-center px-3">
        {quickLinks.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            className={`border-r border-[#2f5f8f] px-3 py-[7px] text-[11px] text-white hover:bg-[#1a4f82] ${
              index === 0 ? "bg-[#ea9f2f] font-semibold" : ""
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
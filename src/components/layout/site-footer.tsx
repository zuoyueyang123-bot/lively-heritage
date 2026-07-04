import Link from "next/link";

const columns = [
  {
    title: "创作",
    links: [
      { href: "/create", label: "创作台" },
      { href: "/gallery", label: "作品广场" },
    ],
  },
  {
    title: "文化",
    links: [
      { href: "/heritage", label: "非遗图鉴" },
      { href: "/about", label: "项目理念" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--line)] bg-[#fffaf2]/60">
      <div className="page-shell grid gap-8 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-black text-[var(--ink)]">非遗有灵</span>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--muted)]">Lively Heritage</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--muted)]">
            让非遗传承从「观看」变成「参与」。输入一句灵感，生成属于你自己的非遗文创提案。
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <div className="text-sm font-black text-[var(--ink)]">{col.title}</div>
            <ul className="mt-4 flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--muted)] transition hover:text-[var(--gold)]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--line)]">
        <div className="page-shell flex flex-col items-center justify-between gap-2 py-5 text-xs text-[var(--muted)] sm:flex-row">
          <span>© 2026 非遗有灵 · 让每一次创作都是一次传承</span>
          <span>TRAE 创造力大赛 · 社会服务 / 社会公益赛道</span>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const links = [
  { href: "/create", label: "创作台", highlight: false },
  { href: "/gallery", label: "作品广场", highlight: false },
  { href: "/heritage", label: "📖 图鉴", highlight: true },
  { href: "/about", label: "关于", highlight: false },
];

export function AppHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--bg-surface)]/78 backdrop-blur-xl">
      <div className="page-shell flex h-16 items-center justify-between gap-5">
        <Link href="/" className="flex items-baseline gap-3" onClick={() => setOpen(false)}>
          <span className="text-xl font-black text-[var(--foreground)]">非遗有灵</span>
          <span className="hidden text-xs font-bold uppercase tracking-[0.24em] text-[var(--foreground-dim)] sm:inline">
            Lively Heritage
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-bold transition hover:bg-white/5 ${
                link.highlight ? "text-[var(--foreground)]" : "text-[var(--foreground-dim)] hover:text-[var(--foreground)]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/create" className="gold-button px-4 py-2 text-sm">
            开始生成
          </Link>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--bg-elevated)]/70 md:hidden"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {open && (
        <nav className="border-t border-[var(--line)] bg-[var(--bg-surface)]/95 backdrop-blur-xl md:hidden">
          <div className="page-shell flex flex-col py-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-bold text-[var(--foreground)] transition hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
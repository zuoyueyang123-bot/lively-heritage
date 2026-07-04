"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { demoArtworks } from "@/lib/artwork-store";
import { getCraft } from "@/lib/heritage";
import { PatternThumb } from "@/components/gallery/pattern-thumb";

export function FeaturedWorks() {
  const works = demoArtworks.slice(0, 3);
  return (
    <section className="page-shell py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold)]">Featured</div>
          <h2 className="mt-2 text-4xl font-black">看看别人炼出了什么</h2>
          <p className="mt-2 text-[var(--muted)]">每一件都是一句灵感生成的完整文创提案</p>
        </div>
        <Link href="/gallery" className="quiet-button px-5 py-3">
          进入作品广场
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {works.map((item) => {
          const craft = getCraft(item.craft);
          return (
            <Link key={item.slug} href={`/work/${item.slug}`} className="group glass-panel overflow-hidden rounded-[28px] transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative">
                <PatternThumb craft={item.craft} prompt={item.prompt} className="aspect-square w-full bg-[#161321] object-cover" />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100">
                  <div className="flex w-full items-center justify-between p-5 text-white">
                    <span className="text-sm font-bold">查看提案</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {craft.palette.slice(0, 3).map((c, i) => (
                      <div key={i} className="h-2 w-2 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[var(--muted)]">{item.craftName}</span>
                </div>
                <div className="mt-2 text-xl font-black">{item.title}</div>
                <p className="mt-2 line-clamp-1 text-sm text-[var(--muted)]">{item.prompt}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { demoArtworks } from "@/lib/artwork-store";
import { getCraft } from "@/lib/heritage";
import { PatternThumb } from "@/components/gallery/pattern-thumb";
import type { Artwork, CraftId } from "@/lib/types";

export function SimilarWorks({ craft, currentSlug }: { craft: CraftId; currentSlug: string }) {
  const [items, setItems] = useState<Artwork[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/artworks")
      .then((r) => r.json() as Promise<{ artworks: Artwork[] }>)
      .then((res) => {
        if (!active) return;
        const pool = res.artworks?.length ? res.artworks : demoArtworks;
        const sameCraft = pool.filter((a) => a.craft === craft && a.slug !== currentSlug);
        const others = pool.filter((a) => a.craft !== craft && a.slug !== currentSlug);
        setItems([...sameCraft, ...others].slice(0, 3));
      })
      .catch(() => {
        setItems(demoArtworks.filter((a) => a.slug !== currentSlug).slice(0, 3));
      });
    return () => {
      active = false;
    };
  }, [craft, currentSlug]);

  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-2xl font-black">相似作品推荐</h2>
        <Link href="/gallery" className="flex items-center gap-1 text-sm font-bold text-[var(--gold)] hover:underline">
          查看全部 <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item) => {
          const c = getCraft(item.craft);
          return (
            <Link key={item.slug} href={`/work/${item.slug}`} className="group glass-panel overflow-hidden rounded-[24px] transition hover:-translate-y-1 hover:shadow-lg">
              {item.patternImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.patternImage} alt={item.title} className="aspect-square w-full object-cover" />
              ) : (
                <PatternThumb craft={item.craft} prompt={item.prompt} className="aspect-square w-full bg-[#161321] object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {c.palette.slice(0, 3).map((col, i) => (
                      <div key={i} className="h-2 w-2 rounded-full" style={{ background: col }} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[var(--muted)]">{item.craftName}</span>
                </div>
                <div className="mt-2 font-black">{item.title}</div>
                <p className="mt-1 line-clamp-1 text-sm text-[var(--muted)]">{item.prompt}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

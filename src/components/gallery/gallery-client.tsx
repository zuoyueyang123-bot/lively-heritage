"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Clock, Eye, Heart } from "lucide-react";
import { demoArtworks, getArtworks } from "@/lib/artwork-store";
import { crafts, getCraft } from "@/lib/heritage";
import { PatternThumb } from "@/components/gallery/pattern-thumb";
import { getLikeState, getViewCount } from "@/lib/engagement";
import { useEngagement } from "@/components/gallery/use-engagement";
import type { Artwork } from "@/lib/types";

/** 避免 toLocaleDateString 在服务端/客户端 Hydration 不一致 */
function formatDate(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

/** 纯客户端渲染 like/view 统计，避免 SSR hydration 不一致 */
function LikeViewStats({ slug }: { slug: string }) {
  const { likes, views } = useEngagement(slug);
  return (
    <>
      <span className="flex items-center gap-1"><Heart size={12} /> {likes}</span>
      <span className="flex items-center gap-1"><Eye size={12} /> {views}</span>
    </>
  );
}

export function GalleryClient() {
  const [items, setItems] = useState<Artwork[]>(demoArtworks);
  const [remoteItems, setRemoteItems] = useState<Artwork[] | null>(null);
  const [craftFilter, setCraftFilter] = useState("all");
  const [sort, setSort] = useState<"latest" | "popular">("latest");

  useEffect(() => {
    let active = true;
    const raf = requestAnimationFrame(() => {
      if (active) setItems([...getArtworks(), ...demoArtworks]);
    });
    fetch("/api/artworks")
      .then((response) => response.json() as Promise<{ artworks: Artwork[] }>)
      .then((result) => {
        if (active) setRemoteItems(result.artworks);
      })
      .catch(() => {
        if (active) setRemoteItems(null);
      });
    return () => {
      active = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  const visibleItems = (remoteItems ?? items)
    .filter((item) => craftFilter === "all" || item.craft === craftFilter)
    .sort((a, b) => {
      if (sort === "popular") return getLikeState(b.slug).count - getLikeState(a.slug).count;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="page-shell py-10">
      <div className="mb-8">
        <div className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold)]">Gallery</div>
        <h1 className="section-title mt-2">作品广场</h1>
        <p className="mt-3 max-w-2xl text-lg font-semibold text-[var(--foreground-dim)]">
          展示已生成的非遗文创提案，每个作品都有独立的提案页、3D 贴图和产品 mockup。
        </p>
      </div>

      {/* Filters + sort */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="mobile-option-strip flex max-w-full gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
          <button
            onClick={() => setCraftFilter("all")}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-black transition ${craftFilter === "all" ? "bg-[var(--gold)] text-white shadow-md shadow-[var(--gold)]/20" : "border border-[var(--line)] bg-white/5 text-[var(--foreground-dim)] hover:bg-white/8"}`}
          >
            全部
          </button>
          {crafts.map((craft) => (
            <button
              key={craft.id}
              onClick={() => setCraftFilter(craft.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-black transition ${craftFilter === craft.id ? "bg-[var(--gold)] text-white shadow-md shadow-[var(--gold)]/20" : "border border-[var(--line)] bg-white/70 text-[var(--foreground-dim)] hover:bg-white"}`}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: craft.palette[0] }} />
              {craft.name}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 gap-1 rounded-full border border-[var(--line)] bg-white/5 p-1">
          {([["latest", "最新"], ["popular", "热门"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${sort === key ? "bg-[var(--gold)] text-white" : "text-[var(--foreground-dim)]"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item) => {
          const craft = getCraft(item.craft);
          return (
            <Link key={item.slug} href={`/work/${item.slug}`} className="group glass-panel overflow-hidden rounded-[28px] transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative">
                {item.patternImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.patternImage} alt={item.title} className="aspect-square w-full object-cover" />
                ) : (
                  <PatternThumb craft={item.craft} prompt={item.prompt} className="aspect-square w-full bg-[var(--bg-deep)] object-cover" />
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100">
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
                  <span className="text-xs font-bold text-[var(--foreground-dim)]">{item.craftName}</span>
                </div>
                <div className="mt-2 text-xl font-black">{item.title}</div>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--foreground-dim)]">{item.prompt}</p>
                <div className="mt-3 flex items-center gap-3 text-xs text-[var(--foreground-dim)]" suppressHydrationWarning>
                  <LikeViewStats slug={item.slug} />
                  <span className="flex items-center gap-1"><Clock size={12} /> {formatDate(item.createdAt)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {visibleItems.length === 0 && (
        <div className="rounded-[28px] border border-dashed border-[var(--line)] p-16 text-center">
          <div className="text-xl font-bold text-[var(--foreground-dim)]">还没有作品</div>
          <p className="mt-2 text-sm text-[var(--foreground-dim)]">去创作台生成你的第一个非遗文创提案吧</p>
          <Link href="/create" className="gold-button mt-6 inline-flex items-center gap-2 px-6 py-3">
            开始创作 <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}

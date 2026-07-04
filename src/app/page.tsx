import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { crafts } from "@/lib/heritage";
import { HeroShowcase } from "@/components/home/hero-showcase";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="page-shell grid min-h-[calc(100vh-64px)] items-center gap-8 py-12 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <h1 className="section-title max-w-lg leading-[1.15]">
            一句灵感，
            <br />
            一套非遗文创提案。
          </h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-[var(--muted)]">
            选一种非遗工艺，写下你的主题，30 秒拿到纹样、产品图和可分享的作品页。
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/create" className="gold-button px-7 py-4 text-base">
              试一下 <ArrowRight size={16} className="ml-1 inline" />
            </Link>
            <Link href="/gallery" className="quiet-button px-7 py-4 text-base">
              看看作品
            </Link>
          </div>
          <div className="mt-8 flex gap-6 text-sm text-[var(--muted)]">
            <span><b className="text-[var(--ink)]">11</b> 种工艺</span>
            <span><b className="text-[var(--ink)]">50+</b> 母题</span>
            <span><b className="text-[var(--ink)]">30s</b> 出提案</span>
          </div>
        </div>
        <HeroShowcase />
      </section>

      {/* Craft entry */}
      <section className="page-shell py-12">
        <h2 className="text-2xl font-black">选一种工艺开始</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {crafts.slice(0, 6).map((craft) => (
            <Link key={craft.id} href={`/create?craft=${craft.id}`} className="glass-panel rounded-[18px] p-4 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex gap-1">
                {craft.palette.slice(0, 4).map((c, i) => (
                  <div key={i} className="h-2 w-2 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div className="mt-2 text-lg font-black">{craft.name}</div>
              <div className="text-xs text-[var(--muted)]">{craft.origin}</div>
            </Link>
          ))}
          <Link href="/heritage" className="glass-panel grid place-items-center rounded-[18px] p-4 text-center transition hover:shadow-lg">
            <div>
              <div className="font-black text-[var(--gold)]">更多</div>
              <div className="text-xs text-[var(--muted)]">11 种工艺 →</div>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="page-shell py-12">
        <div className="glass-panel rounded-[24px] p-8 text-center sm:p-10">
          <h2 className="text-2xl font-black">30 秒做一件非遗文创</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--muted)]">
            选工艺、写主题、点生成。拿到提案，发给朋友。
          </p>
          <Link href="/create" className="gold-button mx-auto mt-6 inline-flex items-center gap-2 px-8 py-4">
            开始 <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

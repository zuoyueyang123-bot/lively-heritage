import Link from "next/link";
import { ArrowRight, Boxes, GalleryHorizontalEnd, Share2, Sparkles, Palette, Layers } from "lucide-react";
import { crafts } from "@/lib/heritage";
import { HeroParticles } from "@/components/home/hero-particles";
import { HeroShowcase } from "@/components/home/hero-showcase";
import { FeaturedWorks } from "@/components/home/featured-works";

const capabilities = [
  { icon: Sparkles, label: "选工艺，写灵感", text: "选一种非遗工艺，输入一句话，系统实时生成纹样。" },
  { icon: Boxes, label: "贴到 3D 器物", text: "纹样实时上物：景泰蓝花瓶、苗绣绣绷、扎染挂布。" },
  { icon: Palette, label: "生成产品图", text: "帆布包、手机壳、陶瓷杯、壁纸、海报自动出图。" },
  { icon: GalleryHorizontalEnd, label: "一页提案", text: "作品自动生成独立页面，配文化解读和导出。" },
  { icon: Share2, label: "分享出去", text: "链接、二维码、海报图，一键发给朋友或评委。" },
  { icon: Layers, label: "AI 帮你讲", text: "AI 解释纹样寓意，推荐场景和传播文案。" },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <HeroParticles className="z-0" />
        <div className="page-shell relative z-10 grid min-h-[calc(100vh-64px)] items-center gap-10 py-16 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-sm font-bold text-[var(--gold)] backdrop-blur">
              <Sparkles size={14} />
              非遗文创提案生成平台
            </div>
            <h1 className="section-title max-w-4xl leading-[1.15]">
              一句灵感，
              <br />
              一套非遗文创提案。
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              写下一句祝福或主题，选择一种非遗工艺——30 秒后你会拿到：纹样、3D 贴图、帆布包手机壳等 mockup、AI 文化解读，和一个可以直接分享的作品页。
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:gap-4">
              <Link href="/create" className="gold-button flex items-center justify-center gap-2 px-7 py-4 text-base sm:text-lg">
                试一下
                <ArrowRight size={18} />
              </Link>
              <Link href="/gallery" className="quiet-button flex items-center justify-center px-7 py-4 text-base sm:text-lg">
                看看别人做了什么
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 text-sm text-[var(--muted)]">
              <div><span className="text-2xl font-black text-[var(--ink)]">11</span> 种工艺</div>
              <div><span className="text-2xl font-black text-[var(--ink)]">50+</span> 母题</div>
              <div><span className="text-2xl font-black text-[var(--ink)]">3</span> 种 3D</div>
            </div>
          </div>

          {/* Showcase */}
          <div>
            <HeroShowcase />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="page-shell py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black">怎么用</h2>
          <p className="mt-3 text-[var(--muted)]">6 步，从一句话到一套完整文创提案</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {capabilities.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="glass-panel rounded-[22px] p-5 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--gold)]/10 text-xs font-black text-[var(--gold)]">{i + 1}</span>
                  <Icon size={18} className="text-[var(--gold)]" />
                </div>
                <h3 className="mt-3 font-black">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why — 用文化本身的视角说话，不自嗨 */}
      <section className="page-shell py-16">
        <div className="rounded-[32px] border border-[var(--line)] p-10 lg:p-14" style={{ background: "linear-gradient(160deg, #2a2135 0%, #151020 100%)" }}>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="text-white">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--gold-soft)]">为什么做这个</p>
              <h2 className="mt-3 text-2xl font-black leading-snug lg:text-3xl">
                1557 项国家级非遗里，<br />
                大多数你只&ldquo;看过&rdquo;，没&ldquo;用过&rdquo;。
              </h2>
              <p className="mt-5 max-w-xl leading-8 text-white/65">
                现有的非遗数字化，基本是展厅+百科。你看完了解了，但手里什么都没留下。
                我们想让你真的动手做一件东西——哪怕只是一张帆布包的 mockup、一个可以发给朋友的链接。
                当更多人愿意&ldquo;用&rdquo;非遗，传承才真正在发生。
              </p>
              <Link href="/about" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white/80 transition hover:bg-white/20">
                详细了解 <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { num: "1557", unit: "项", label: "国家级非遗" },
                { num: "3057", unit: "名", label: "传承人" },
                { num: "11", unit: "种", label: "已支持工艺" },
                { num: "∞", unit: "", label: "可生成提案" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/8 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-black text-[var(--gold-soft)]">
                    {stat.num}<span className="text-base">{stat.unit}</span>
                  </div>
                  <div className="mt-1 text-xs text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Heritage DNA */}
      <section className="page-shell py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-black">选一种工艺开始</h2>
          <p className="mt-2 text-[var(--muted)]">每种工艺有独立的纹样算法、色板和传承人档案</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {crafts.slice(0, 10).map((craft) => (
            <Link key={craft.id} href={`/create?craft=${craft.id}`} className="group glass-panel rounded-[20px] p-4 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex gap-1.5">
                {craft.palette.slice(0, 4).map((c, i) => (
                  <div key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div className="mt-2 text-xl font-black">{craft.name}</div>
              <div className="text-xs text-[var(--muted)]">{craft.origin}</div>
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-[var(--muted)]">{craft.tagline}</p>
            </Link>
          ))}
          <Link href="/heritage" className="glass-panel flex items-center justify-center rounded-[20px] p-4 text-center transition hover:shadow-lg">
            <div>
              <div className="text-lg font-black text-[var(--gold)]">查看全部</div>
              <div className="mt-1 text-xs text-[var(--muted)]">11 种工艺图鉴 →</div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Works */}
      <FeaturedWorks />

      {/* CTA */}
      <section className="page-shell py-16">
        <div className="glass-panel rounded-[28px] p-10 text-center sm:p-12">
          <h2 className="text-2xl font-black sm:text-3xl">30 秒做一件非遗文创</h2>
          <p className="mx-auto mt-3 max-w-lg text-[var(--muted)]">
            选工艺、写主题、点生成。拿到一套完整提案，发给朋友看看。
          </p>
          <Link href="/create" className="gold-button mx-auto mt-8 inline-flex items-center gap-2 px-8 py-4 text-lg">
            开始
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

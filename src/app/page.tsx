import Link from "next/link";
import { ArrowRight, Boxes, GalleryHorizontalEnd, Share2, Sparkles, Palette, Layers } from "lucide-react";
import { crafts } from "@/lib/heritage";
import { ShowroomScene } from "@/components/showroom/showroom-scene";
import { HeroParticles } from "@/components/home/hero-particles";
import { FeaturedWorks } from "@/components/home/featured-works";

const capabilities = [
  { icon: Sparkles, label: "纹样实时炼成", text: "输入主题，选择工艺，Perlin 噪声 + 工艺算法分阶段生成非遗纹样。" },
  { icon: Boxes, label: "3D 文创贴图", text: "实时贴到景泰蓝花瓶、苗绣绣绷、扎染挂布等多种 3D 载体。" },
  { icon: Palette, label: "产品 Mockup", text: "帆布包、手机壳、陶瓷杯、壁纸、海报一键生成。" },
  { icon: GalleryHorizontalEnd, label: "作品提案页", text: "每个作品都有独立页面，可展示、导出、分享和再创作。" },
  { icon: Share2, label: "可分享闭环", text: "复制链接、二维码、OG 分享图，作品带得出去。" },
  { icon: Layers, label: "AI 策展人", text: "百炼 AI 自动生成文化叙事、场景推荐和传播文案。" },
];

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <HeroParticles className="z-0" />
        <div className="page-shell relative z-10 grid min-h-[calc(100vh-64px)] items-center gap-10 py-16 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/30 bg-linear-to-r from-[#fdf6e3] to-white/80 px-5 py-2.5 text-sm font-black text-[var(--gold)] shadow-sm backdrop-blur">
              <Sparkles size={14} />
              非遗文创提案生成平台
            </div>
            <h1 className="section-title max-w-4xl leading-[1.15]">
              不只是看非遗，
              <br />
              <span className="bg-linear-to-r from-[var(--gold)] to-[#b9362d] bg-clip-text text-transparent">
                把灵感炼成文创作品。
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-[var(--muted)] sm:text-xl sm:leading-9">
              输入祝福、城市主题或活动场景，系统自动生成非遗纹样，并形成 3D 贴图、产品 mockup、壁纸、海报和可分享作品提案页。
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
              <Link href="/create" className="gold-button flex items-center justify-center gap-2 px-7 py-4 text-base shadow-lg shadow-[var(--gold)]/20 transition hover:shadow-xl hover:shadow-[var(--gold)]/30 sm:text-lg">
                开始生成作品
                <ArrowRight size={20} />
              </Link>
              <Link href="/gallery" className="quiet-button flex items-center justify-center px-7 py-4 text-base sm:text-lg">
                查看作品广场
              </Link>
            </div>
            {/* Quick stats */}
            <div className="mt-10 grid grid-cols-3 gap-3 text-sm text-[var(--muted)] sm:flex sm:gap-8">
              <div><span className="text-2xl font-black text-[var(--fg)]">11</span> 种非遗工艺</div>
              <div><span className="text-2xl font-black text-[var(--fg)]">5</span> 类产品载体</div>
              <div><span className="text-2xl font-black text-[var(--fg)]">3</span> 种 3D 模型</div>
            </div>
          </div>

          {/* 3D Showroom Hero */}
          <div className="glass-panel rounded-[36px] p-5 shadow-2xl">
            <div className="rounded-[28px] bg-linear-to-br from-[#1b1630] to-[#0d0a1a] p-4 text-white">
              <ShowroomScene variant="vase" showDownload={false} className="h-[320px] sm:h-[420px] lg:h-[480px]" />
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { label: "景泰蓝花瓶", sub: "掐丝工艺 · 实时贴图" },
                  { label: "苗绣绣绷", sub: "织物质感 · 自动匹配" },
                  { label: "扎染挂布", sub: "布料动画 · 晕染纹理" },
                  { label: "产品 Mockup", sub: "5种载体 · 一键导出" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/8 p-4 backdrop-blur-sm">
                    <div className="text-sm font-black">{item.label}</div>
                    <div className="mt-1 text-xs text-white/50">{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="page-shell py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black">从灵感到完整文创提案的全链路</h2>
          <p className="mt-3 text-[var(--muted)]">一个平台覆盖生成、贴图、导出、分享四大环节</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="glass-panel rounded-[26px] p-5 transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--gold)]/10">
                  <Icon size={20} className="text-[var(--gold)]" />
                </div>
                <h3 className="mt-4 text-lg font-black">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Social Value / Mission Section */}
      <section className="page-shell py-16">
        <div className="glass-panel rounded-[32px] bg-linear-to-br from-[#1b1630] to-[#0d0a1a] p-10 text-white lg:p-14">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold-soft)]">Our Mission</div>
              <h2 className="mt-3 text-3xl font-black leading-snug lg:text-4xl">
                别让非遗只躺在展柜里，
                <br />
                让每个人都能亲手创造它。
              </h2>
              <p className="mt-5 max-w-xl leading-8 text-white/70">
                大量非遗技艺正面临「人亡技绝」，传承人日渐老去，年轻人却只是旁观。
                我们想做的，是把非遗从「被观看」变成「被参与」——让一句灵感，就能长成一件属于你的非遗文创作品。
              </p>
              <Link href="/about" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-black backdrop-blur transition hover:bg-white/20">
                了解我们的理念 <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "1557", unit: "项", label: "国家级非遗代表项目" },
                { num: "3057", unit: "名", label: "国家级传承人" },
                { num: "11", unit: "种", label: "平台已支持工艺" },
                { num: "∞", unit: "", label: "可生成的文创提案" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/8 p-5 backdrop-blur-sm">
                  <div className="text-3xl font-black text-[var(--gold-soft)]">
                    {stat.num}<span className="text-lg">{stat.unit}</span>
                  </div>
                  <div className="mt-1 text-xs text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Heritage DNA Section */}
      <section className="page-shell py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold)]">Heritage DNA</div>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">11 种非遗工艺，11 条创作入口</h2>
            <p className="mt-2 text-[var(--muted)]">每种工艺有独立的文化档案、纹样母题、色板和产品推荐</p>
          </div>
          <Link href="/heritage" className="quiet-button px-5 py-3">
            查看图鉴
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {crafts.map((craft) => (
            <Link key={craft.id} href={`/create?craft=${craft.id}`} className="group glass-panel rounded-[24px] p-5 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ background: craft.palette[0] }} />
                <div className="h-3 w-3 rounded-full" style={{ background: craft.palette[1] }} />
                <div className="h-3 w-3 rounded-full" style={{ background: craft.palette[2] }} />
              </div>
              <div className="mt-3 text-2xl font-black">{craft.name}</div>
              <div className="mt-1 text-xs text-[var(--muted)]">{craft.origin}</div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{craft.tagline}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[var(--gold)] opacity-0 transition group-hover:opacity-100">
                开始创作 <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Works */}
      <FeaturedWorks />

      {/* CTA Section */}
      <section className="page-shell py-16">
        <div className="glass-panel rounded-[32px] bg-linear-to-r from-[#fdf6e3] to-[#fff9f0] p-12 text-center">
          <h2 className="text-3xl font-black">准备好把灵感变成作品了吗？</h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
            选择一种非遗工艺，输入你的主题，30 秒内生成完整文创提案。
          </p>
          <Link href="/create" className="gold-button mx-auto mt-8 inline-flex items-center gap-2 px-8 py-4 text-lg shadow-lg shadow-[var(--gold)]/20">
            立即体验
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}

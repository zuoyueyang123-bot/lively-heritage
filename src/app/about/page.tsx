import Link from "next/link";
import { ArrowRight, Eye, Hand, Share2, Sparkles, Users, AlertTriangle, Repeat, GraduationCap, Building2, Heart, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "关于非遗有灵 | 项目理念",
  description: "非遗有灵是一个非遗文创提案生成平台，让传承从「观看」变成「参与」。",
};

const problems = [
  { icon: AlertTriangle, title: "技艺濒危", text: "大量非遗项目面临「人亡技绝」，一些技艺甚至没有年轻人愿意继承。" },
  { icon: Users, title: "传承人老龄化", text: "国家级传承人平均年龄偏高，古老智慧亟需被更多人看见、参与和延续。" },
  { icon: Eye, title: "年轻人只是旁观", text: "现有的非遗数字化多停留在「展示」，用户看完就走，缺少真正的参与和创造。" },
];

const comparison = [
  { them: "看非遗展品", us: "用非遗创作自己的作品" },
  { them: "固定的 3D 展厅", us: "把你生成的纹样实时贴到 3D 器物上" },
  { them: "站点级分享", us: "每件作品都有独立可分享的提案页" },
  { them: "文化单向展示", us: "文化转译 + 产品落地 + 再创作闭环" },
  { them: "看完就结束", us: "保存、分享、再创作，让传播继续发生" },
];

const steps = [
  { icon: Sparkles, title: "生成", text: "输入一句灵感，选择工艺，AI 与算法实时炼成非遗纹样。" },
  { icon: Hand, title: "落地", text: "纹样自动贴到 3D 器物、帆布包、手机壳、壁纸、海报。" },
  { icon: Share2, title: "传播", text: "生成独立作品页，一键分享链接、二维码与提案图。" },
  { icon: Repeat, title: "再创作", text: "别人看到你的作品，可以用同一主题继续创作，形成循环。" },
];

const valueTiers = [
  { icon: Users, title: "大众端 · 文化普惠", text: "零门槛创作，人人都能亲手生成属于自己的非遗文创作品并分享出去。", tags: ["零门槛", "可分享", "再创作"] },
  { icon: GraduationCap, title: "教育端 · 教学辅助", text: "为学校、社团的非遗美育提供可动手、可导出的数字化工具，让文化课变成创作课。", tags: ["动手实践", "作品导出", "文化解读"] },
  { icon: Building2, title: "文旅端 · 文创赋能", text: "为文旅机构、非遗工坊快速产出有文化底蕴的文创提案与传播物料。", tags: ["提案图", "产品Mockup", "品牌联名"] },
];

const commitments = [
  { icon: Heart, title: "技术向善", text: "以生成式技术降低非遗创作门槛，让传承从观看变成参与。" },
  { icon: ShieldCheck, title: "文化尊重", text: "纹样寓意、工艺流程、传承人信息均基于公开资料整理，标注来源，不歪曲不虚构。" },
  { icon: Share2, title: "开放分享", text: "每件作品都有独立可分享页，鼓励创意流动与二次创作，让传播持续发生。" },
];

const architecture = [
  { step: "输入灵感", detail: "一句祝福 / 主题 / 场景" },
  { step: "工艺 + 母题", detail: "11 种工艺 × 多母题选择" },
  { step: "生成引擎", detail: "Perlin 噪声 + 工艺算法四阶段炼成" },
  { step: "AI 策展人", detail: "百炼生成文化叙事，失败降级本地知识库" },
  { step: "3D 实时贴图", detail: "R3F 将纹样贴到器物 / 产品" },
  { step: "作品页 + 导出", detail: "独立链接 · 提案海报 · 二维码分享" },
];

export default function AboutPage() {
  return (
    <main className="page-shell py-12">
      {/* Hero */}
      <section className="mb-16 text-center">
        <div className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold)]">About</div>
        <h1 className="section-title mx-auto mt-3 max-w-4xl">
          让非遗传承，从「观看」变成「参与」
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-xl font-semibold leading-9 text-[var(--foreground-dim)]">
          非遗有灵是一个非遗文创提案生成平台。我们相信，真正的活态传承，不是把非遗放进玻璃展柜，
          而是让每个人都能亲手用非遗创造、表达和传播。
        </p>
      </section>

      {/* Problems */}
      <section className="mb-16">
        <h2 className="text-3xl font-black">我们想解决的社会问题</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {problems.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="glass-panel rounded-[26px] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#b9362d]/10">
                  <Icon size={22} className="text-[#b9362d]" />
                </div>
                <h3 className="mt-4 text-xl font-black">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--foreground-dim)]">{p.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Our approach */}
      <section className="mb-16">
        <h2 className="text-3xl font-black">我们的答案：让人人都能创造非遗</h2>
        <p className="mt-3 max-w-2xl text-[var(--foreground-dim)]">
          与其让用户被动浏览，不如给他们一支「数字的绣花针」。从一句灵感开始，走完创造与传播的完整闭环。
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="glass-panel rounded-[26px] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gold)]/10">
                    <Icon size={22} className="text-[var(--gold)]" />
                  </div>
                  <span className="text-3xl font-black text-[var(--line)]">0{i + 1}</span>
                </div>
                <h3 className="mt-4 text-xl font-black">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--foreground-dim)]">{s.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Differentiation table */}
      <section className="mb-16">
        <h2 className="text-3xl font-black">看非遗 vs 用非遗创作</h2>
        <div className="mt-6 glass-panel overflow-hidden rounded-[28px]">
          <div className="grid grid-cols-2 border-b border-[var(--line)] bg-white/5">
            <div className="p-5 text-center text-sm font-black text-[var(--foreground-dim)]">传统非遗数字化</div>
            <div className="p-5 text-center text-sm font-black text-[var(--gold)]">非遗有灵</div>
          </div>
          {comparison.map((row, i) => (
            <div key={i} className={`grid grid-cols-2 ${i % 2 === 0 ? "bg-white/3" : ""}`}>
              <div className="border-r border-[var(--line)] p-5 text-sm text-[var(--foreground-dim)]">{row.them}</div>
              <div className="p-5 text-sm font-bold">{row.us}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Social value tiers */}
      <section className="mb-16">
        <h2 className="text-3xl font-black">落地价值 · 三端普惠</h2>
        <p className="mt-3 max-w-2xl text-[var(--foreground-dim)]">
          同一套能力，服务从大众到教育、文旅的不同场景，让非遗创作真正可用、可推广。
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {valueTiers.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.title} className="glass-panel rounded-[26px] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gold)]/10">
                  <Icon size={22} className="text-[var(--gold)]" />
                </div>
                <h3 className="mt-4 text-lg font-black">{t.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--foreground-dim)]">{t.text}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-bold text-[var(--foreground-dim)]">{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Architecture flow */}
      <section className="mb-16">
        <h2 className="text-3xl font-black">技术架构 · 全链路诚实透明</h2>
        <p className="mt-3 max-w-2xl text-[var(--foreground-dim)]">
          从一句灵感到可分享作品的完整技术链路。AI 不可用时自动降级本地知识库，核心创作与分享永不阻塞。
        </p>
        <div className="mt-6 flex flex-wrap items-stretch gap-3">
          {architecture.map((a, i) => (
            <div key={a.step} className="flex items-center gap-3">
              <div className="glass-panel rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--gold)] text-xs font-black text-white">{i + 1}</span>
                  <span className="font-black">{a.step}</span>
                </div>
                <p className="mt-2 max-w-[180px] text-xs leading-5 text-[var(--foreground-dim)]">{a.detail}</p>
              </div>
              {i < architecture.length - 1 && <ArrowRight size={18} className="hidden shrink-0 text-[var(--gold)] lg:block" />}
            </div>
          ))}
        </div>
      </section>

      {/* Public commitment */}
      <section className="mb-16">
        <h2 className="text-3xl font-black">我们的承诺</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {commitments.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="glass-panel rounded-[26px] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#b9362d]/10">
                  <Icon size={22} className="text-[#b9362d]" />
                </div>
                <h3 className="mt-4 text-lg font-black">{c.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--foreground-dim)]">{c.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-16">
        <h2 className="text-3xl font-black">技术栈</h2>
        <p className="mt-3 max-w-2xl text-[var(--foreground-dim)]">
          平台采用现代 Web 技术栈搭建，兼顾生成体验、3D 表现与可分享性。
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            "Next.js App Router",
            "TypeScript",
            "Tailwind CSS",
            "React Three Fiber (3D)",
            "Canvas 生成引擎 + Perlin 噪声",
            "Supabase (数据库 + 存储)",
            "阿里云百炼 (AI 策展人)",
            "OG 分享图",
          ].map((tech) => (
            <span key={tech} className="rounded-full border border-[var(--line)] bg-white/5 px-4 py-2 text-sm font-bold">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="glass-panel rounded-[32px] p-12 text-center">
        <h2 className="text-3xl font-black">每一次创作，都是一次传承</h2>
        <p className="mx-auto mt-4 max-w-xl text-[var(--foreground-dim)]">
          当越来越多人愿意亲手创造非遗，这些古老的技艺才真正活在了当下。
        </p>
        <Link href="/create" className="gold-button mx-auto mt-8 inline-flex items-center gap-2 px-8 py-4 text-lg">
          开始你的创作 <ArrowRight size={20} />
        </Link>
      </section>
    </main>
  );
}

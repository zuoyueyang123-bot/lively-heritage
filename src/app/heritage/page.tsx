import Link from "next/link";
import { ArrowRight, Award, MapPin, Sparkles } from "lucide-react";
import { crafts } from "@/lib/heritage";

export const metadata = {
  title: "非遗图鉴 | 非遗有灵",
  description: "苗绣、景泰蓝、扎染、剪纸、蓝印花布五大非遗工艺的历史、工艺流程与传承人档案。",
};

export default function HeritagePage() {
  return (
    <main className="page-shell py-10">
      <div className="mb-10">
        <div className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold)]">Heritage Atlas</div>
        <h1 className="section-title mt-2">非遗图鉴</h1>
        <p className="mt-3 max-w-3xl text-lg font-semibold text-[var(--muted)]">
          图鉴不只是文化百科，更是创作引擎的文化依据。每个工艺都记录着历史、工艺流程与守护它的传承人，
          也都能一键进入创作台，把这份文化转译成你自己的文创作品。
        </p>
      </div>

      <div className="grid gap-8">
        {crafts.map((craft) => (
          <section key={craft.id} className="glass-panel overflow-hidden rounded-[32px]">
            {/* Header band */}
            <div className="flex flex-col gap-4 border-b border-[var(--line)] bg-gradient-to-r from-[#fdf6e3] to-white/50 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black">{craft.name}</span>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">{craft.pinyin}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {craft.origin}</span>
                  <span className="flex items-center gap-1"><Award size={14} className="text-[var(--gold)]" /> {craft.level}</span>
                </div>
              </div>
              <Link href={`/create?craft=${craft.id}`} className="gold-button flex items-center gap-2 self-start px-5 py-3 sm:self-auto">
                <Sparkles size={16} />
                用此工艺创作
              </Link>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_1fr]">
              {/* Left: history + inheritor */}
              <div className="flex flex-col gap-5">
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-[var(--gold)]">历史渊源</div>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{craft.history}</p>
                  <div className="mt-3 inline-flex rounded-full bg-[var(--gold)]/10 px-3 py-1 text-xs font-bold text-[var(--gold)]">
                    {craft.status}
                  </div>
                </div>

                {/* Inheritor card */}
                <div className="rounded-2xl border border-[var(--line)] bg-white/62 p-5">
                  <div className="text-xs font-black uppercase tracking-wide text-[var(--gold)]">代表性传承人</div>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--gold)] to-[#b9362d] text-xl font-black text-white">
                      {craft.inheritor.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-lg font-black">{craft.inheritor.name}</div>
                      <div className="text-xs text-[var(--muted)]">{craft.inheritor.title} · {craft.inheritor.origin}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{craft.inheritor.story}</p>
                  {craft.inheritor.honor && (
                    <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#b9362d]/8 px-3 py-1 text-xs font-bold text-[#b9362d]">
                      <Award size={12} /> {craft.inheritor.honor}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: process + motifs + palette */}
              <div className="flex flex-col gap-5">
                {/* Process timeline */}
                <div className="rounded-2xl border border-[var(--line)] bg-white/62 p-5">
                  <div className="text-xs font-black uppercase tracking-wide text-[var(--gold)]">工艺流程</div>
                  <ol className="mt-3 flex flex-col gap-3">
                    {craft.process.map((p, i) => (
                      <li key={p.step} className="flex gap-3">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--gold)] text-xs font-black text-white">
                          {i + 1}
                        </span>
                        <div>
                          <span className="font-black">{p.step}</span>
                          <span className="ml-2 text-sm text-[var(--muted)]">{p.detail}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Representative motif */}
                  <div className="rounded-2xl border border-[var(--line)] bg-white/62 p-4">
                    <div className="text-xs font-black uppercase tracking-wide text-[var(--gold)]">代表纹样</div>
                    <div className="mt-2 font-black">{craft.motifs[0].name}</div>
                    <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{craft.motifs[0].meaning}</p>
                    {craft.motifs.length > 1 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {craft.motifs.slice(1).map((m) => (
                          <span key={m.name} className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-[var(--muted)]">
                            {m.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="rounded-2xl border border-[var(--line)] bg-white/62 p-4">
                    <div className="text-xs font-black uppercase tracking-wide text-[var(--gold)]">工艺特征</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {craft.features.map((f) => (
                        <span key={f} className="rounded-full bg-[var(--gold)]/10 px-2.5 py-1 text-xs font-bold text-[var(--gold)]">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Palette */}
                <div className="rounded-2xl border border-[var(--line)] bg-white/62 p-4">
                  <div className="text-xs font-black uppercase tracking-wide text-[var(--gold)]">色彩体系</div>
                  <div className="mt-3 flex gap-2">
                    {craft.palette.map((color) => (
                      <div key={color} className="flex flex-col items-center gap-1">
                        <span className="h-10 w-10 rounded-xl border border-black/10 shadow-sm" style={{ background: color }} />
                        <span className="text-[10px] text-[var(--muted)]">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 glass-panel rounded-[28px] bg-gradient-to-r from-[#fdf6e3] to-[#fff9f0] p-8 text-center">
        <h2 className="text-2xl font-black">读懂了非遗，不如亲手创造一次</h2>
        <p className="mt-3 text-[var(--muted)]">选择一种工艺，把你的灵感炼成属于自己的非遗文创提案。</p>
        <Link href="/create" className="gold-button mx-auto mt-6 inline-flex items-center gap-2 px-7 py-3">
          进入创作台 <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}

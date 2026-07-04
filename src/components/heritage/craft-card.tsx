"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { PatternThumb } from "@/components/gallery/pattern-thumb";
import type { HeritageCraft } from "@/lib/types";

/**
 * Visual-first craft card for the heritage atlas.
 * Shows pattern + name + tagline + palette at a glance.
 * Details (history, inheritor, process) are collapsed by default.
 */
export function HeritageCraftCard({ craft }: { craft: HeritageCraft }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-panel overflow-hidden rounded-[22px] transition hover:shadow-lg">
      {/* Pattern visual */}
      <PatternThumb craft={craft.id} prompt={craft.motifs[0].name} className="aspect-[4/3] w-full" />

      {/* Quick info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black">{craft.name}</h3>
            <p className="text-xs text-[var(--muted)]">{craft.origin} · {craft.pinyin}</p>
          </div>
          <Link href={`/create?craft=${craft.id}`} className="gold-button flex items-center gap-1 px-3 py-2 text-xs">
            <Sparkles size={12} /> 创作
          </Link>
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{craft.tagline}</p>

        {/* Palette + inheritor hint */}
        <div className="mt-3 flex items-center gap-2">
          {craft.palette.map((c, i) => (
            <div key={i} className="h-5 w-5 rounded-full border border-black/10" style={{ background: c }} />
          ))}
          <div className="ml-auto flex items-center gap-1.5">
            <div className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-black text-white" style={{ background: craft.palette[0] }}>
              {craft.inheritor.name.slice(0, 1)}
            </div>
            <span className="text-xs text-[var(--muted)]">{craft.inheritor.name}</span>
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl border border-[var(--line)] py-2 text-xs font-bold text-[var(--muted)] transition hover:bg-white/80"
        >
          {open ? "收起" : "了解更多"}
          <ChevronDown size={14} className={`transition ${open ? "rotate-180" : ""}`} />
        </button>

        {/* Collapsible details */}
        {open && (
          <div className="mt-3 space-y-3 text-sm">
            <div>
              <span className="font-bold text-[var(--gold)]">历史</span>
              <p className="mt-1 leading-6 text-[var(--muted)]">{craft.history}</p>
            </div>
            <div>
              <span className="font-bold text-[var(--gold)]">传承人</span>
              <p className="mt-1 leading-6 text-[var(--muted)]">{craft.inheritor.name} · {craft.inheritor.title}</p>
            </div>
            <div>
              <span className="font-bold text-[var(--gold)]">工艺流程</span>
              <ol className="mt-1 space-y-1">
                {craft.process.map((p, i) => (
                  <li key={i} className="leading-5 text-[var(--muted)]">
                    <span className="font-bold text-[var(--ink)]">{i + 1}. {p.step}</span> {p.detail}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <span className="font-bold text-[var(--gold)]">代表纹样</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {craft.motifs.map((m) => (
                  <span key={m.name} className="rounded-full bg-black/5 px-2 py-0.5 text-xs">{m.name}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

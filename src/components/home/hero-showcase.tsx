"use client";

import { useEffect, useRef } from "react";
import { generatePattern } from "@/lib/pattern-engine";
import { getCraft } from "@/lib/heritage";

/**
 * Homepage hero showcase: a large generated pattern + small product hints.
 * Replaces the 3D vase (which was ugly and crashed mobile).
 * Fast, lightweight, works everywhere.
 */
export function HeroShowcase() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const craft = getCraft("miao");
      generatePattern(canvas, craft.render, "蝶母纹·毕业祝福", craft.palette, 1.0, 5);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="glass-panel overflow-hidden rounded-[32px] shadow-2xl">
      {/* Main pattern */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="aspect-square w-full"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-5">
          <p className="text-sm font-bold text-white/90">苗绣 · 蝶母纹 · 实时生成</p>
        </div>
      </div>
      {/* Mini product hints */}
      <div className="grid grid-cols-4 gap-px bg-[var(--line)]">
        {["帆布包", "手机壳", "3D 贴图", "海报"].map((label) => (
          <div key={label} className="bg-[var(--paper)] px-3 py-3 text-center">
            <div className="text-xs font-black text-[var(--ink)]">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

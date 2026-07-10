"use client";

import { useEffect, useRef } from "react";
import { generatePattern } from "@/lib/pattern-engine";
import { getCraft } from "@/lib/heritage";

/**
 * Homepage hero showcase: a large generated pattern + small product hints.
 * Replaces the 3D vase (which was ugly and crashed mobile).
 * Fast, lightweight, works everywhere.
 */
export function HeroShowcase({
  craftId = "miao",
  prompt = "蝶母纹·毕业祝福",
  detail = 5,
}: {
  craftId?: string;
  prompt?: string;
  detail?: number;
} = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const craft = getCraft(craftId as Parameters<typeof getCraft>[0]);
      generatePattern(canvas, craft.render, prompt, craft.palette, 1.0, detail);
    });
    return () => cancelAnimationFrame(raf);
  }, [craftId, prompt, detail]);

  return (
    <div className="overflow-hidden rounded-[28px] shadow-xl">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="aspect-square w-full"
      />
    </div>
  );
}

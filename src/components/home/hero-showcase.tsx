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

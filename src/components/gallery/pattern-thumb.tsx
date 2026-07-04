"use client";

import { useEffect, useRef } from "react";
import { generatePattern, type CraftAlgorithm } from "@/lib/pattern-engine";
import { getCraft } from "@/lib/heritage";
import type { CraftId } from "@/lib/types";

/**
 * Renders a generated pattern thumbnail for artworks that have no stored image
 * (e.g. demo/showcase artworks). Uses the shared pattern engine with a
 * deterministic seed derived from the prompt so results are stable.
 */
export function PatternThumb({
  craft,
  prompt,
  className = "",
}: {
  craft: CraftId;
  prompt: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const info = getCraft(craft);
    generatePattern(canvas, info.render as CraftAlgorithm, prompt, info.palette, 1.0);
  }, [craft, prompt]);

  return <canvas ref={canvasRef} width={480} height={480} className={className} aria-hidden="true" />;
}

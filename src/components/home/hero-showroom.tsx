"use client";

import { useEffect, useState } from "react";
import { ShowroomScene } from "@/components/showroom/showroom-scene";
import { generatePattern } from "@/lib/pattern-engine";
import { getCraft } from "@/lib/heritage";

/**
 * Homepage hero 3D showroom with a pre-generated jingtai pattern.
 * Generates the texture on mount so the vase displays a real pattern
 * instead of the ugly fallback text.
 */
export function HeroShowroom() {
  const [texture, setTexture] = useState("");

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const craft = getCraft("jingtai");
    generatePattern(canvas, craft.render, "非遗文创提案", craft.palette, 1.0, 3);
    setTexture(canvas.toDataURL("image/png"));
  }, []);

  return (
    <ShowroomScene
      variant="vase"
      showDownload={false}
      className="h-[320px] sm:h-[420px] lg:h-[480px]"
      textureUrl={texture || undefined}
    />
  );
}

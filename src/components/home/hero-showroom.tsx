"use client";

import { useEffect, useState } from "react";
import { HeritageModel3D } from "@/components/showroom/heritage-model";
import { HeroShowcase } from "@/components/home/hero-showcase";

/**
 * 首页 Hero 3D 花瓶展示。
 * 桌面端渲染真实馆藏景泰蓝花瓶（cloisonne.glb，Minneapolis 博物馆 CC0，自带真实纹理），可自动旋转；
 * 移动端窄屏 / prefers-reduced-motion / 不支持 WebGL 时降级为轻量 2D 景泰蓝纹样，
 * 完全规避早年移动端 WebGL 崩溃问题。
 */
export function HeroShowroom() {
  const [use3D, setUse3D] = useState(true);

  useEffect(() => {
    const smallScreen = window.matchMedia("(max-width: 768px)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(
        c.getContext("webgl2") ||
        c.getContext("webgl") ||
        c.getContext("experimental-webgl")
      );
    } catch {
      webgl = false;
    }
    setUse3D(!smallScreen && !reduced && webgl);
  }, []);

  if (!use3D) {
    return (
      <HeroShowcase craftId="jingtai" prompt="景泰蓝缠枝纹·非遗文创" detail={0} />
    );
  }

  return (
    <HeritageModel3D
      modelKey="cloisonne"
      pattern="cloisonne"
      className="h-[320px] sm:h-[420px] lg:h-[480px]"
      enableControls={false}
    />
  );
}

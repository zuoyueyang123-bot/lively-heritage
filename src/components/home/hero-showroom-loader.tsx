"use client";

import dynamic from "next/dynamic";
import { HeroShowcase } from "@/components/home/hero-showcase";

const HeroShowroom = dynamic(
  () => import("@/components/home/hero-showroom").then((m) => m.HeroShowroom),
  {
    ssr: false,
    loading: () => (
      <HeroShowcase
        craftId="jingtai"
        prompt="景泰蓝缠枝纹·非遗文创"
        detail={0}
      />
    ),
  },
);

export function HeroShowroomLoader() {
  return <HeroShowroom />;
}

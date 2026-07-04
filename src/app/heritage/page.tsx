import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { crafts } from "@/lib/heritage";
import { HeritageCraftCard } from "@/components/heritage/craft-card";

export const metadata = {
  title: "非遗图鉴 | 非遗有灵",
  description: "11 种非遗工艺的纹样、色彩与文化故事。点击感兴趣的工艺，直接开始创作。",
};

export default function HeritagePage() {
  return (
    <main className="page-shell py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black">非遗图鉴</h1>
        <p className="mt-2 max-w-lg text-[var(--muted)]">
          11 种工艺，每种都能生成纹样。看到喜欢的，直接点进去创作。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {crafts.map((craft) => (
          <HeritageCraftCard key={craft.id} craft={craft} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/create" className="gold-button inline-flex items-center gap-2 px-8 py-4">
          进入创作台 <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}

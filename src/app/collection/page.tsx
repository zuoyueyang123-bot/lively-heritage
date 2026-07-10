import type { Metadata } from "next";
import Link from "next/link";
import { CollectionViewer } from "@/components/showroom/collection-viewer";

export const metadata: Metadata = {
  title: "3D 数字藏品馆 · 非遗有灵",
  description:
    "集中展示平台全部真实 3D 模型：CC0 真实馆藏扫描、Poly Pizza 社区模型，以及腾讯混元 3D 生成的器物，可自由旋转查看。",
};

export default function CollectionPage() {
  return (
    <main className="page-shell py-12">
      <header className="mb-10 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--gold)]/15 px-4 py-1.5 text-xs font-black text-[var(--gold)]">
          REAL 3D · 真实模型
        </div>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          3D 数字藏品馆
        </h1>
        <p className="mt-4 text-base leading-8 text-[var(--foreground-dim)]">
          这里的每一件都是<strong className="text-[var(--foreground)]">真实三维模型</strong>
          ，而非贴图占位：既有博物馆公开馆藏（CC0）的扫描件，也有社区开源模型，以及由腾讯混元
          3D 生成的器物。拖动主展品可 360° 旋转，点击右侧清单切换藏品。
        </p>
        <p className="mt-3 text-sm leading-7 text-[var(--foreground-dim)]/80">
          在作品详情页，这些真实载体还会承接你生成的纹样——让非遗图案真正"上物"。
          想看更多玩法，可前往{" "}
          <Link href="/demo-3d" className="font-black text-[var(--cyan)] underline-offset-4 hover:underline">
            3D 演示页
          </Link>
          。
        </p>
      </header>

      <CollectionViewer />

      <section className="mt-14 rounded-[28px] border border-[var(--line)] bg-[var(--bg-elevated)]/40 p-6 sm:p-8">
        <h2 className="text-xl font-black">关于模型来源与版权</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--foreground-dim)]">
          <li>
            <span className="font-black text-[var(--foreground)]">真实馆藏（CC0）</span>
            ：来自公开博物馆馆藏扫描，进入公有领域，可自由使用与再创作。
          </li>
          <li>
            <span className="font-black text-[var(--foreground)]">社区模型（CC-BY 3.0 / CC0）</span>
            ：来自 Poly Pizza 等开源社区，使用时保留作者署名。
          </li>
          <li>
            <span className="font-black text-[var(--foreground)]">混元 3D 生成</span>
            ：由腾讯混元 3D（Hunyuan 3D）文生 / 图生 3D 生成，仅作内部展示用途。
          </li>
        </ul>
        <p className="mt-4 text-xs leading-6 text-[var(--foreground-dim)]/70">
          所有模型均经 gltf-transform 压缩纹理至 1K，并在不支持 WebGL 的环境下降级为
          2D 纹样展示，保证可用性。
        </p>
      </section>
    </main>
  );
}

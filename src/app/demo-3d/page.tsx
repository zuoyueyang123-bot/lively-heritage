import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WebglDemo } from "@/components/showroom/webgl-demo";

export const metadata = {
  title: "3D 实时贴图演示 | 非遗有灵",
  description: "独立低配 WebGL 页面，用于展示非遗纹样实时贴到器物上的 3D 能力。",
};

export default function Demo3DPage() {
  return (
    <main className="page-shell py-10">
      <Link href="/" className="quiet-button inline-flex items-center gap-2 px-4 py-2 text-sm">
        <ArrowLeft size={16} />
        返回首页
      </Link>
      <section className="mt-8 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <div className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold)]">3D Demo</div>
          <h1 className="section-title mt-3">独立 3D 实时贴图演示</h1>
          <p className="mt-5 text-base leading-8 text-[var(--foreground-dim)]">
            作品页采用 CSS 3D 稳定上物预览，确保手机扫码和分享链路不崩。这个页面单独承载低配 WebGL 演示，用于评审电脑端验证真实 3D 贴图能力。
          </p>
          <div className="mt-6 grid gap-3 text-sm font-bold text-[var(--foreground-dim)]">
            <div className="rounded-2xl border border-[var(--line)] bg-white/5 p-4">低 DPR、低面数、无重型环境贴图</div>
            <div className="rounded-2xl border border-[var(--line)] bg-white/5 p-4">独立路由隔离，失败不影响作品页主链路</div>
            <div className="rounded-2xl border border-[var(--line)] bg-white/5 p-4">纹样作为贴图实时映射到器物表面</div>
          </div>
        </div>
        <WebglDemo />
      </section>
    </main>
  );
}

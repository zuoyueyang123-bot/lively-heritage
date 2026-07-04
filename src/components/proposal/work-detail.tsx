"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Copy, Download, RotateCcw, Share2 } from "lucide-react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";
import { buildProposalPoster } from "@/lib/proposal-poster";
import type { Artwork } from "@/lib/types";
import { ShowroomScene } from "@/components/showroom/showroom-scene";
import { ProductMockups } from "@/components/mockup/product-mockups";
import { generatePattern, type CraftAlgorithm } from "@/lib/pattern-engine";
import { getCraft } from "@/lib/heritage";
import { Eye, Heart } from "lucide-react";
import { getLikeState, registerView, toggleLike } from "@/lib/engagement";
import { SimilarWorks } from "@/components/proposal/similar-works";

export function WorkDetail({ slug }: { slug: string }) {
  const [artwork, setArtwork] = useState<Artwork | undefined>();
  const [missing, setMissing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState("");
  const [origin, setOrigin] = useState("");
  const [likeState, setLikeState] = useState({ count: 0, liked: false });
  const [views, setViews] = useState(0);
  const shareUrl = useMemo(() => `${origin}/work/${slug}`, [origin, slug]);

  // Set origin on client only, to avoid SSR/CSR hydration mismatch.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setOrigin(window.location.origin));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Register a view and load like state once we know the artwork exists.
  const hasArtwork = Boolean(artwork);
  useEffect(() => {
    if (!hasArtwork) return;
    const raf = requestAnimationFrame(() => {
      setViews(registerView(slug));
      setLikeState(getLikeState(slug));
    });
    return () => cancelAnimationFrame(raf);
  }, [hasArtwork, slug]);

  useEffect(() => {
    let active = true;
    fetch(`/api/artworks/${slug}`)
      .then((response) => {
        if (!response.ok) throw new Error("not found");
        return response.json() as Promise<{ artwork: Artwork }>;
      })
      .then((result) => {
        if (active) setArtwork(result.artwork);
      })
      .catch(() => {
        if (active) setMissing(true);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  // For showcase/demo artworks without a stored image, generate one client-side
  // so the 3D showroom and mockups have a real texture to work with.
  const needsGeneration = Boolean(artwork && !artwork.patternImage);
  useEffect(() => {
    if (!needsGeneration || !artwork) return;
    const raf = requestAnimationFrame(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 720;
      canvas.height = 720;
      const info = getCraft(artwork.craft);
      generatePattern(canvas, info.render as CraftAlgorithm, artwork.prompt, info.palette, 1.0);
      setGeneratedImage(canvas.toDataURL("image/png"));
    });
    return () => cancelAnimationFrame(raf);
  }, [needsGeneration, artwork]);

  if (missing) {
    return (
      <div className="page-shell py-20">
        <div className="glass-panel rounded-[28px] p-8">
          <h1 className="text-3xl font-black">作品未找到</h1>
          <Link href="/create" className="gold-button mt-6 inline-block px-5 py-3">
            重新创作
          </Link>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return <div className="page-shell py-20 text-lg font-black">正在加载作品提案...</div>;
  }

  const patternImage = artwork.patternImage || generatedImage;
  const craftInfo = getCraft(artwork.craft);

  async function shareWork() {
    const text = `我用「非遗有灵」生成了一套${artwork?.craftName || "非遗"}文创提案：${artwork?.prompt || ""}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: artwork?.title || "非遗有灵作品", text, url: shareUrl });
        return;
      } catch {
        // fallback to clipboard below
      }
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      } else {
        // Fallback for insecure (http) contexts where clipboard API is unavailable
        const ta = document.createElement("textarea");
        ta.value = `${text}\n${shareUrl}`;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
    } catch {
      // ignore — sharing is best-effort
    }
  }

  async function exportProposal() {
    const node = document.getElementById("proposal-card");
    if (!node) return;
    const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: "#fffaf2" });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${artwork?.slug}-proposal.png`;
    link.click();
  }

  async function exportPoster() {
    if (!artwork) return;
    const img = artwork.patternImage || generatedImage;
    const qrCanvas = document.querySelector<HTMLCanvasElement>("#feiyi-qr-canvas canvas");
    const qrDataUrl = qrCanvas?.toDataURL("image/png");
    const posterUrl = await buildProposalPoster(artwork, img, qrDataUrl);
    if (!posterUrl) return;
    const link = document.createElement("a");
    link.href = posterUrl;
    link.download = `${artwork.slug}-poster-1920x1080.png`;
    link.click();
  }

  const products = ["3D 花瓶", "文创帆布包", "手机壁纸", "传播海报"];

  return (
    <main className="page-shell py-10">
      <section className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold)]">Work Proposal</div>
          <h1 className="section-title mt-2">{artwork.title}</h1>
          <p className="mt-3 max-w-2xl text-lg font-semibold text-[var(--muted)]">
            主题：{artwork.prompt}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <div className="flex items-center gap-1 rounded-full bg-white/62 px-3 py-2 text-sm font-bold text-[var(--muted)]">
            <Eye size={16} /> {views.toLocaleString()}
          </div>
          <button
            onClick={() => setLikeState(toggleLike(slug))}
            className={`flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition ${
              likeState.liked ? "bg-[#b9362d] text-white" : "quiet-button"
            }`}
            aria-pressed={likeState.liked}
          >
            <Heart size={17} fill={likeState.liked ? "currentColor" : "none"} />
            {likeState.count.toLocaleString()}
          </button>
          <button onClick={shareWork} className="quiet-button flex items-center justify-center gap-2 px-4 py-3">
            <Copy size={17} />
            分享作品
          </button>
          <button onClick={exportProposal} className="quiet-button flex items-center justify-center gap-2 px-4 py-3">
            <Download size={17} />
            下载提案
          </button>
          <button onClick={exportPoster} className="gold-button col-span-2 flex items-center justify-center gap-2 px-4 py-3 sm:col-span-1">
            <Download size={17} />
            导出海报
          </button>
        </div>
        {/* Hidden high-res QR for poster composition */}
        <div id="feiyi-qr-canvas" className="pointer-events-none absolute -left-[9999px] top-0" aria-hidden="true">
          <QRCodeCanvas value={shareUrl || "https://feiyi.local"} size={300} />
        </div>
      </section>

      <section id="proposal-card" className="glass-panel grid gap-6 rounded-[34px] p-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] bg-[#171326] p-4">
          {patternImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={patternImage} alt={artwork.title} className="aspect-square w-full rounded-[22px] object-cover" />
          ) : (
            <div className="grid aspect-square place-items-center rounded-[22px] bg-[#211b31] text-3xl font-black text-[#e8c66a]">
              非遗有灵
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-sm font-black text-[var(--gold)]">{artwork.craftName}</div>
            <h2 className="mt-1 text-3xl font-black">{artwork.narrative.slogan}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["文化符号", artwork.narrative.symbol, artwork.narrative.meaning],
              ["应用场景", "文旅礼品", artwork.narrative.scenario],
              ["落地价值", "可分享可再创作", artwork.narrative.value],
            ].map(([label, title, text]) => (
              <div key={label} className="rounded-2xl border border-[var(--line)] bg-white/62 p-4">
                <div className="text-xs font-black text-[var(--gold)]">{label}</div>
                <div className="mt-2 font-black">{title}</div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {products.map((product) => (
              <div key={product} className="rounded-2xl bg-[#efe4d4] p-3 text-center text-sm font-black">
                {product}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-2xl font-black">3D 文创贴图展厅</h2>
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-black text-[var(--muted)]">当前纹样实时上物</span>
          </div>
          <ShowroomScene textureUrl={patternImage} variant={craftInfo.showroom} className="h-[320px] sm:h-[420px]" />
        </div>
        <aside className="glass-panel rounded-[28px] p-5">
          <div className="flex items-center gap-2 text-sm font-black text-[var(--gold)]">
            <Share2 size={18} />
            分享与再创作
          </div>
          <div className="mt-5 inline-block rounded-2xl bg-white p-3">
            <QRCodeSVG value={shareUrl || "https://lively-heritage.local"} size={132} />
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
            分享这件作品，别人可以打开独立作品页，也可以带着同一主题继续生成新的非遗文创提案。
          </p>
          <Link
            href={`/create?prompt=${encodeURIComponent(artwork.prompt)}&craft=${artwork.craft}`}
            className="gold-button mt-5 flex items-center justify-center gap-2 px-5 py-4"
          >
            <RotateCcw size={18} />
            用这个主题再炼一次
          </Link>
        </aside>
      </section>

      {/* Cultural story — gives the "taken away" work real depth */}
      <section className="mt-8">
        <h2 className="mb-4 text-2xl font-black">这件作品背后的文化</h2>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="glass-panel rounded-[28px] p-6">
            <div className="text-xs font-black uppercase tracking-wide text-[var(--gold)]">工艺渊源 · {craftInfo.name}</div>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{craftInfo.history}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {craftInfo.features.map((f) => (
                <span key={f} className="rounded-full bg-[var(--gold)]/10 px-2.5 py-1 text-xs font-bold text-[var(--gold)]">{f}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="glass-panel rounded-[28px] p-6">
              <div className="text-xs font-black uppercase tracking-wide text-[var(--gold)]">纹样寓意 · {artwork.narrative.symbol}</div>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{craftInfo.motifs[0].story}</p>
            </div>
            <div className="glass-panel rounded-[28px] p-6">
              <div className="text-xs font-black uppercase tracking-wide text-[var(--gold)]">守护这门技艺的人</div>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--gold)] to-[#b9362d] text-lg font-black text-white">
                  {craftInfo.inheritor.name.slice(0, 1)}
                </div>
                <div>
                  <div className="font-black">{craftInfo.inheritor.name}</div>
                  <div className="text-xs text-[var(--muted)]">{craftInfo.inheritor.title}</div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{craftInfo.inheritor.story}</p>
            </div>
          </div>
        </div>
      </section>

      <ProductMockups artwork={{ ...artwork, patternImage }} />

      <SimilarWorks craft={artwork.craft} currentSlug={artwork.slug} />
    </main>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import type { Artwork } from "@/lib/types";

type MockupKind = "bag" | "phone" | "cup" | "wallpaper" | "poster";

const items: { kind: MockupKind; title: string; size: string }[] = [
  { kind: "bag", title: "文创帆布包", size: "1600x1200" },
  { kind: "phone", title: "手机壳", size: "1200x1600" },
  { kind: "cup", title: "陶瓷杯", size: "1600x1200" },
  { kind: "wallpaper", title: "手机壁纸", size: "1170x2532" },
  { kind: "poster", title: "传播海报", size: "1080x1440" },
];

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

async function drawMockup(canvas: HTMLCanvasElement, artwork: Artwork, kind: MockupKind) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const ratio = kind === "phone" ? [900, 1200] : kind === "wallpaper" ? [760, 1200] : kind === "poster" ? [900, 1200] : [1100, 820];
  canvas.width = ratio[0];
  canvas.height = ratio[1];
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  let pattern: HTMLImageElement | null = null;
  if (artwork.patternImage) {
    try {
      pattern = await loadImage(artwork.patternImage);
    } catch {
      pattern = null;
    }
  }
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#fffaf2");
  bg.addColorStop(1, "#ead9c2");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  if (kind === "bag") {
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.ellipse(w / 2, h - 92, 300, 42, 0, 0, Math.PI * 2);
    ctx.fill();
    const x = w * 0.25;
    const y = h * 0.18;
    const bw = w * 0.5;
    const bh = h * 0.62;
    ctx.strokeStyle = "#b9ad9c";
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(w / 2, y + 16, 115, Math.PI, 0);
    ctx.stroke();
    roundRect(ctx, x, y + 48, bw, bh, 16);
    ctx.fillStyle = "#e8ddcb";
    ctx.fill();
    ctx.strokeStyle = "#c7b9a3";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.save();
    roundRect(ctx, x + 72, y + 120, bw - 144, bh * 0.45, 18);
    ctx.clip();
    if (pattern) ctx.drawImage(pattern, x + 72, y + 100, bw - 144, bw - 144);
    ctx.restore();
    ctx.fillStyle = "rgba(90,70,45,0.08)";
    for (let i = 0; i < 60; i++) ctx.fillRect(x + Math.random() * bw, y + 48 + Math.random() * bh, 1, 1);
  }

  if (kind === "phone") {
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-0.12);
    const pw = 330;
    const ph = 720;
    roundRect(ctx, -pw / 2 - 8, -ph / 2 - 8, pw + 16, ph + 16, 56);
    ctx.fillStyle = "#2b2d35";
    ctx.fill();
    roundRect(ctx, -pw / 2, -ph / 2, pw, ph, 50);
    ctx.fillStyle = "#111520";
    ctx.fill();
    ctx.save();
    roundRect(ctx, -pw / 2 + 12, -ph / 2 + 12, pw - 24, ph - 24, 44);
    ctx.clip();
    if (pattern) ctx.drawImage(pattern, -ph / 2 + 20, -ph / 2 + 30, ph - 60, ph - 60);
    const shine = ctx.createLinearGradient(-pw / 2, 0, pw / 2, 0);
    shine.addColorStop(0, "rgba(0,0,0,0.3)");
    shine.addColorStop(0.48, "rgba(255,255,255,0.12)");
    shine.addColorStop(1, "rgba(0,0,0,0.24)");
    ctx.fillStyle = shine;
    ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
    ctx.restore();
    roundRect(ctx, -pw / 2 + 26, -ph / 2 + 26, 112, 112, 30);
    ctx.fillStyle = "rgba(20,20,24,0.88)";
    ctx.fill();
    for (const [lx, ly] of [[-110, -292], [-52, -292], [-82, -238]]) {
      ctx.beginPath();
      ctx.arc(lx, ly, 20, 0, Math.PI * 2);
      ctx.fillStyle = "#05070d";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.stroke();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  if (kind === "cup") {
    ctx.fillStyle = "rgba(0,0,0,0.14)";
    ctx.ellipse(w / 2, h * 0.78, 260, 42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 34;
    ctx.strokeStyle = "#d7c9b6";
    ctx.beginPath();
    ctx.arc(w * 0.67, h * 0.46, 112, -1.1, 1.1);
    ctx.stroke();
    const topW = 420;
    const botW = 330;
    const cupH = 430;
    const topY = h * 0.22;
    ctx.beginPath();
    ctx.moveTo(w / 2 - topW / 2, topY);
    ctx.lineTo(w / 2 - botW / 2, topY + cupH);
    ctx.lineTo(w / 2 + botW / 2, topY + cupH);
    ctx.lineTo(w / 2 + topW / 2, topY);
    ctx.closePath();
    ctx.fillStyle = "#efe7d7";
    ctx.fill();
    ctx.save();
    ctx.clip();
    if (pattern) ctx.drawImage(pattern, w / 2 - 190, topY + 80, 380, 380);
    const curve = ctx.createLinearGradient(w / 2 - topW / 2, 0, w / 2 + topW / 2, 0);
    curve.addColorStop(0, "rgba(0,0,0,0.22)");
    curve.addColorStop(0.52, "rgba(255,255,255,0.2)");
    curve.addColorStop(1, "rgba(0,0,0,0.18)");
    ctx.fillStyle = curve;
    ctx.fillRect(w / 2 - topW / 2, topY, topW, cupH);
    ctx.restore();
    ctx.ellipse(w / 2, topY, topW / 2, 34, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#f8f1e7";
    ctx.fill();
    ctx.strokeStyle = "#c7b9a3";
    ctx.stroke();
  }

  if (kind === "wallpaper") {
    const px = w * 0.18;
    const py = h * 0.06;
    const pw = w * 0.64;
    const ph = h * 0.88;
    roundRect(ctx, px, py, pw, ph, 60);
    ctx.fillStyle = "#111520";
    ctx.fill();
    ctx.save();
    roundRect(ctx, px + 14, py + 14, pw - 28, ph - 28, 48);
    ctx.clip();
    ctx.fillStyle = "#0e1325";
    ctx.fillRect(px, py, pw, ph);
    if (pattern) ctx.drawImage(pattern, px - 50, py + 80, pw + 100, pw + 100);
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "700 58px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("09:28", w / 2, py + 160);
    ctx.font = "700 20px sans-serif";
    ctx.fillText(artwork.prompt.slice(0, 16), w / 2, py + 202);
    ctx.restore();
  }

  if (kind === "poster") {
    ctx.fillStyle = "#171326";
    ctx.fillRect(0, 0, w, h);
    if (pattern) ctx.drawImage(pattern, 145, 120, 610, 610);
    ctx.fillStyle = "#e8c66a";
    ctx.font = "900 54px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(artwork.title, w / 2, 820);
    ctx.fillStyle = "rgba(255,250,242,0.82)";
    ctx.font = "700 26px sans-serif";
    ctx.fillText(artwork.prompt, w / 2, 872);
    ctx.font = "500 22px sans-serif";
    wrapText(ctx, artwork.narrative.meaning, w / 2, 940, 680, 34);
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  let line = "";
  for (const char of text) {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = char;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y);
}

function MockupCanvas({ artwork, kind, title, size }: { artwork: Artwork; kind: MockupKind; title: string; size: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) void drawMockup(canvas, artwork, kind);
  }, [artwork, kind]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${artwork.slug}-${kind}.png`;
    link.click();
  }

  return (
    <div className="glass-panel rounded-[20px] p-3">
      <div className="aspect-square overflow-hidden rounded-[14px] bg-[#fffaf2]">
        <canvas ref={canvasRef} className="h-full w-full object-contain" />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-black">{title}</div>
          <div className="text-xs text-[var(--muted)]">{size}</div>
        </div>
        <button onClick={download} className="quiet-button shrink-0 px-3 py-1.5 text-xs">
          <Download size={13} />
        </button>
      </div>
    </div>
  );
}

export function ProductMockups({ artwork }: { artwork: Artwork }) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">产品应用与导出</h2>
          <p className="mt-1 text-sm font-semibold text-[var(--muted)]">把同一套纹样落到文创商品、壁纸和传播海报。</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <MockupCanvas key={item.kind} artwork={artwork} {...item} />
        ))}
      </div>
    </section>
  );
}

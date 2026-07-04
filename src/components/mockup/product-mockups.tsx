"use client";

import { useEffect, useRef, useCallback } from "react";
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

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

async function drawMockup(
  canvas: HTMLCanvasElement,
  artwork: Artwork,
  kind: MockupKind,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Set canvas pixel dimensions for each mockup type
  const dims: Record<MockupKind, [number, number]> = {
    bag: [1100, 820],
    phone: [900, 1200],
    cup: [1100, 820],
    wallpaper: [760, 1200],
    poster: [900, 1200],
  };
  const [cw, ch] = dims[kind];
  canvas.width = cw;
  canvas.height = ch;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Load pattern image
  let pattern: HTMLImageElement | null = null;
  if (artwork.patternImage) {
    try {
      pattern = await loadImage(artwork.patternImage);
    } catch {
      pattern = null;
    }
  }

  // Dark theme background gradient
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#151827");
  bg.addColorStop(0.5, "#1a1d30");
  bg.addColorStop(1, "#111420");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  if (kind === "bag") {
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(w / 2, h - 84, 280, 36, 0, 0, Math.PI * 2);
    ctx.fill();

    const x = w * 0.26;
    const y = h * 0.16;
    const bw = w * 0.48;
    const bh = h * 0.64;

    // Handle
    ctx.strokeStyle = "#8a8fa8";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(w / 2, y + 20, 108, Math.PI, 0);
    ctx.stroke();

    // Bag body
    roundRect(ctx, x, y + 52, bw, bh, 16);
    ctx.fillStyle = "#252838";
    ctx.fill();
    ctx.strokeStyle = "rgba(138,143,168,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Pattern area
    ctx.save();
    roundRect(ctx, x + 60, y + 130, bw - 120, bh * 0.42, 14);
    ctx.clip();
    if (pattern) {
      ctx.drawImage(pattern, x + 60, y + 110, bw - 120, bw - 120);
    }
    ctx.restore();

    // Subtle fabric texture (deterministic grid, no random)
    ctx.fillStyle = "rgba(138,143,168,0.06)";
    for (let i = 0; i < 40; i++) {
      const px = x + 20 + (i % 8) * (bw / 8);
      const py = y + 52 + Math.floor(i / 8) * (bh / 5);
      ctx.fillRect(px, py, 1.5, 1.5);
    }
  }

  if (kind === "phone") {
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-0.12);

    const pw = 320;
    const ph = 700;

    // Phone body
    roundRect(ctx, -pw / 2 - 8, -ph / 2 - 8, pw + 16, ph + 16, 54);
    ctx.fillStyle = "#1a1d2e";
    ctx.fill();
    ctx.strokeStyle = "rgba(138,143,168,0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Screen
    roundRect(ctx, -pw / 2, -ph / 2, pw, ph, 48);
    ctx.fillStyle = "#0d1117";
    ctx.fill();

    // Pattern on screen
    ctx.save();
    roundRect(ctx, -pw / 2 + 14, -ph / 2 + 14, pw - 28, ph - 28, 42);
    ctx.clip();
    if (pattern) {
      ctx.drawImage(pattern, -ph / 2 + 24, -ph / 2 + 34, ph - 70, ph - 70);
    }
    // Screen reflection
    const shine = ctx.createLinearGradient(-pw / 2, 0, pw / 2, 0);
    shine.addColorStop(0, "rgba(0,0,0,0.25)");
    shine.addColorStop(0.45, "rgba(255,255,255,0.08)");
    shine.addColorStop(1, "rgba(0,0,0,0.2)");
    ctx.fillStyle = shine;
    ctx.fillRect(-pw / 2, -ph / 2, pw, ph);
    ctx.restore();

    // Camera module
    roundRect(ctx, -pw / 2 + 28, -ph / 2 + 28, 100, 100, 28);
    ctx.fillStyle = "rgba(15,17,25,0.9)";
    ctx.fill();
    ctx.strokeStyle = "rgba(138,143,168,0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();

    for (const [lx, ly] of [
      [-100, -280],
      [-48, -280],
      [-76, -228],
    ]) {
      ctx.beginPath();
      ctx.arc(lx, ly, 18, 0, Math.PI * 2);
      ctx.fillStyle = "#05070d";
      ctx.fill();
      ctx.strokeStyle = "rgba(138,143,168,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }

  if (kind === "cup") {
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.8, 250, 38, 0, 0, Math.PI * 2);
    ctx.fill();

    // Handle
    ctx.lineWidth = 30;
    ctx.strokeStyle = "#2a2d3d";
    ctx.beginPath();
    ctx.arc(w * 0.68, h * 0.44, 108, -1.1, 1.1);
    ctx.stroke();
    ctx.strokeStyle = "rgba(138,143,168,0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Cup body - trapezoid
    const topW = 400;
    const botW = 310;
    const cupH = 420;
    const topY = h * 0.2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - topW / 2, topY);
    ctx.lineTo(w / 2 - botW / 2, topY + cupH);
    ctx.lineTo(w / 2 + botW / 2, topY + cupH);
    ctx.lineTo(w / 2 + topW / 2, topY);
    ctx.closePath();
    ctx.fillStyle = "#252838";
    ctx.fill();

    // Pattern on cup
    ctx.save();
    ctx.clip();
    if (pattern) {
      ctx.drawImage(pattern, w / 2 - 180, topY + 90, 360, 360);
    }
    // Cylinder shading
    const curve = ctx.createLinearGradient(
      w / 2 - topW / 2,
      0,
      w / 2 + topW / 2,
      0,
    );
    curve.addColorStop(0, "rgba(0,0,0,0.3)");
    curve.addColorStop(0.5, "rgba(255,255,255,0.08)");
    curve.addColorStop(1, "rgba(0,0,0,0.25)");
    ctx.fillStyle = curve;
    ctx.fillRect(w / 2 - topW / 2, topY, topW, cupH);
    ctx.restore();

    // Cup rim
    ctx.beginPath();
    ctx.ellipse(w / 2, topY, topW / 2, 32, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1e2235";
    ctx.fill();
    ctx.strokeStyle = "rgba(138,143,168,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (kind === "wallpaper") {
    const px = w * 0.18;
    const py = h * 0.05;
    const pw = w * 0.64;
    const ph = h * 0.9;

    // Phone frame
    roundRect(ctx, px, py, pw, ph, 56);
    ctx.fillStyle = "#0d1117";
    ctx.fill();
    ctx.strokeStyle = "rgba(138,143,168,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Screen
    ctx.save();
    roundRect(ctx, px + 12, py + 12, pw - 24, ph - 24, 46);
    ctx.clip();

    // Wallpaper background
    ctx.fillStyle = "#0a0c14";
    ctx.fillRect(px, py, pw, ph);

    if (pattern) {
      ctx.drawImage(pattern, px - 40, py + 60, pw + 80, pw + 80);
    }

    // Lock screen UI
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "700 52px 'PingFang SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("09:28", w / 2, py + 150);

    ctx.font = "700 18px 'PingFang SC', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(artwork.prompt.slice(0, 14), w / 2, py + 190);

    ctx.restore();
  }

  if (kind === "poster") {
    // Poster background
    ctx.fillStyle = "#0f111d";
    ctx.fillRect(0, 0, w, h);

    // Decorative top border
    const topBorder = ctx.createLinearGradient(0, 0, w, 0);
    topBorder.addColorStop(0, "transparent");
    topBorder.addColorStop(0.3, "rgba(94,196,176,0.3)");
    topBorder.addColorStop(0.5, "rgba(201,152,74,0.4)");
    topBorder.addColorStop(0.7, "rgba(94,196,176,0.3)");
    topBorder.addColorStop(1, "transparent");
    ctx.fillStyle = topBorder;
    ctx.fillRect(0, 0, w, 2);

    // Pattern
    if (pattern) {
      ctx.drawImage(pattern, 130, 110, 640, 640);
    }

    // Title
    ctx.fillStyle = "#e8c66a";
    ctx.font = "900 50px 'PingFang SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(artwork.title, w / 2, 820);

    // Prompt
    ctx.fillStyle = "rgba(232,228,221,0.8)";
    ctx.font = "700 24px 'PingFang SC', sans-serif";
    ctx.fillText(artwork.prompt, w / 2, 870);

    // Meaning
    ctx.fillStyle = "rgba(232,228,221,0.55)";
    ctx.font = "500 20px 'PingFang SC', sans-serif";
    wrapText(ctx, artwork.narrative.meaning, w / 2, 930, 660, 32);
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
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

function MockupCanvas({
  artwork,
  kind,
  title,
  size,
}: {
  artwork: Artwork;
  kind: MockupKind;
  title: string;
  size: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawnRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || drawnRef.current) return;
    drawnRef.current = true;
    void drawMockup(canvas, artwork, kind);
  }, [artwork, kind]);

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL("image/png");
      if (!dataUrl || dataUrl === "data:,") {
        alert("画布内容为空，请稍后重试");
        return;
      }
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${artwork.slug}-${kind}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      alert("导出失败，请重试");
    }
  }, [artwork.slug, kind]);

  return (
    <div className="glass-panel rounded-[20px] p-3">
      <div className="relative aspect-square overflow-hidden rounded-[14px] bg-[var(--bg-deep)]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-black">{title}</div>
          <div className="text-xs text-[var(--foreground-muted)]">{size}</div>
        </div>
        <button
          onClick={download}
          className="quiet-button shrink-0 px-3 py-1.5 text-xs"
          aria-label={`下载${title}`}
        >
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
          <p className="mt-1 text-sm font-semibold text-[var(--foreground-dim)]">
            把同一套纹样落到文创商品、壁纸和传播海报。
          </p>
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
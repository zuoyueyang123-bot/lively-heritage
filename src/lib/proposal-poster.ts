import type { Artwork } from "./types";

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const ch of text) {
    if (ctx.measureText(current + ch).width > maxWidth) {
      lines.push(current);
      current = ch;
    } else {
      current += ch;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Composes a 1920x1080 deluxe proposal poster:
 * title, craft, pattern, culture symbol, products, QR placeholder, logo.
 */
export async function buildProposalPoster(
  artwork: Artwork,
  patternImage: string,
  qrDataUrl?: string
): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Background gradient (dark cyberpunk theme)
  const bg = ctx.createLinearGradient(0, 0, 1920, 1080);
  bg.addColorStop(0, "#0f111d");
  bg.addColorStop(0.5, "#151827");
  bg.addColorStop(1, "#0a0c14");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1920, 1080);

  // Decorative side band with craft palette
  const [c0, c1] = artwork.palette;
  ctx.fillStyle = c0 || "#b9362d";
  ctx.fillRect(0, 0, 24, 1080);
  ctx.fillStyle = c1 || "#c8912d";
  ctx.fillRect(24, 0, 12, 1080);

  // Left: pattern panel
  const pImg = await loadImage(patternImage);
  const panelX = 110;
  const panelY = 150;
  const panelSize = 780;
  ctx.save();
  ctx.shadowColor = "rgba(70,47,20,0.25)";
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;
  ctx.fillStyle = "#151827";
  roundRectPath(ctx, panelX, panelY, panelSize, panelSize, 32);
  ctx.fill();
  ctx.restore();
  if (pImg) {
    ctx.save();
    roundRectPath(ctx, panelX + 20, panelY + 20, panelSize - 40, panelSize - 40, 24);
    ctx.clip();
    ctx.drawImage(pImg, panelX + 20, panelY + 20, panelSize - 40, panelSize - 40);
    ctx.restore();
  }

  // Right column
  const rx = 990;
  // Brand
  ctx.fillStyle = "#e8c66a";
  ctx.font = "900 34px 'PingFang SC', sans-serif";
  ctx.fillText("非遗有灵 · LIVELY HERITAGE", rx, 175);

  // Title
  ctx.fillStyle = "#e8e4dd";
  ctx.font = "900 74px 'PingFang SC', sans-serif";
  const titleLines = wrapText(ctx, artwork.narrative.slogan || artwork.title, 780);
  let ty = 270;
  for (const line of titleLines.slice(0, 2)) {
    ctx.fillText(line, rx, ty);
    ty += 88;
  }

  // Craft + prompt
  ctx.fillStyle = "#9a958a";
  ctx.font = "700 34px 'PingFang SC', sans-serif";
  ctx.fillText(`工艺：${artwork.craftName}`, rx, ty + 10);
  ty += 60;
  const promptLines = wrapText(ctx, `主题：${artwork.prompt}`, 780);
  for (const line of promptLines.slice(0, 2)) {
    ctx.fillText(line, rx, ty + 10);
    ty += 48;
  }

  // Culture cards
  ty += 40;
  const cards = [
    ["文化符号", artwork.narrative.symbol],
    ["寓意", artwork.narrative.meaning],
    ["应用场景", artwork.narrative.scenario],
  ];
  for (const [label, text] of cards) {
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    roundRectPath(ctx, rx, ty, 780, 96, 18);
    ctx.fill();
    ctx.fillStyle = "#e8c66a";
    ctx.font = "900 26px 'PingFang SC', sans-serif";
    ctx.fillText(label, rx + 28, ty + 40);
    ctx.fillStyle = "#c8c4bd";
    ctx.font = "600 26px 'PingFang SC', sans-serif";
    const lines = wrapText(ctx, text || "", 700);
    ctx.fillText(lines[0] || "", rx + 28, ty + 74);
    ty += 116;
  }

  // Palette swatches row
  ty += 10;
  ctx.fillStyle = "#9a958a";
  ctx.font = "800 26px 'PingFang SC', sans-serif";
  ctx.fillText("工艺色板", rx, ty);
  let sx = rx;
  const swatchY = ty + 24;
  for (const color of artwork.palette) {
    ctx.fillStyle = color;
    roundRectPath(ctx, sx, swatchY, 60, 60, 12);
    ctx.fill();
    sx += 76;
  }

  // QR code bottom-right
  if (qrDataUrl) {
    const qrImg = await loadImage(qrDataUrl);
    if (qrImg) {
      const qrSize = 150;
      const qx = 1920 - qrSize - 90;
      const qy = 1080 - qrSize - 90;
      ctx.fillStyle = "#ffffff";
      roundRectPath(ctx, qx - 14, qy - 14, qrSize + 28, qrSize + 28, 16);
      ctx.fill();
      ctx.drawImage(qrImg, qx, qy, qrSize, qrSize);
      ctx.fillStyle = "#9a958a";
      ctx.font = "700 22px 'PingFang SC', sans-serif";
      ctx.fillText("扫码查看作品", qx - 4, qy + qrSize + 44);
    }
  }

  // Footer tagline
  ctx.fillStyle = "#e8c66a";
  ctx.font = "800 26px 'PingFang SC', sans-serif";
  ctx.fillText("让每一次创作，都是一次传承", 110, 1010);

  return canvas.toDataURL("image/png");
}

/**
 * Pattern Engine — Enhanced generative algorithms for 5 heritage crafts
 * Migrated and improved from feiyi_youling/js/algorithms.js
 */

/* ====== Perlin Noise 2D ====== */
const GRADS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];
const PERM: number[] = [];
(() => {
  const p: number[] = [];
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
})();

function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a: number, b: number, t: number) { return a + t * (b - a); }
function grad(hash: number, x: number, y: number) { const g = GRADS[hash & 7]; return g[0] * x + g[1] * y; }

function perlin2D(x: number, y: number): number {
  const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255;
  const xf = x - Math.floor(x), yf = y - Math.floor(y);
  const u = fade(xf), v = fade(yf);
  const aa = PERM[PERM[xi] + yi], ab = PERM[PERM[xi] + yi + 1];
  const ba = PERM[PERM[xi + 1] + yi], bb = PERM[PERM[xi + 1] + yi + 1];
  return lerp(lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u), lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u), v);
}

function perlinOctave(x: number, y: number, octaves: number, persistence: number): number {
  let tot = 0, freq = 1, amp = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    tot += perlin2D(x * freq, y * freq) * amp;
    max += amp;
    amp *= persistence;
    freq *= 2;
  }
  return tot / max;
}

/* ====== Helpers ====== */
function easeOut(t: number) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 2.5); }
function hex2rgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ====== Primitives ====== */
function drawButterfly(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, r: number) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(r); ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-20, -12, -35, -45, -15, -55);
  ctx.bezierCurveTo(0, -40, 0, -20, 0, 0);
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(20, -12, 35, -45, 15, -55);
  ctx.bezierCurveTo(0, -40, 0, -20, 0, 0);
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-12, 6, -22, 28, -10, 32);
  ctx.bezierCurveTo(0, 22, 0, 12, 0, 0);
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(12, 6, 22, 28, 10, 32);
  ctx.bezierCurveTo(0, 22, 0, 12, 0, 0);
  // Antennae
  ctx.moveTo(-2, -8); ctx.bezierCurveTo(-10, -22, -14, -32, -16, -36);
  ctx.moveTo(2, -8); ctx.bezierCurveTo(10, -22, 14, -32, 16, -36);
  ctx.restore();
}

function drawFlower(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, petals: number) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
  for (let i = 0; i < petals; i++) {
    const angle = (Math.PI * 2 / petals) * i;
    ctx.save(); ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-8, -14, -6, -32, 0, -38);
    ctx.bezierCurveTo(6, -32, 8, -14, 0, 0);
    ctx.restore();
  }
  // Center
  ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.restore();
}

function drawLotus(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, r: number) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(r); ctx.scale(s, s);
  // Outer petals
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 / 8) * i;
    ctx.save(); ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-10, -20, -8, -45, 0, -52);
    ctx.bezierCurveTo(8, -45, 10, -20, 0, 0);
    ctx.restore();
  }
  // Inner petals
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 / 6) * i + Math.PI / 6;
    ctx.save(); ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-6, -12, -5, -28, 0, -32);
    ctx.bezierCurveTo(5, -28, 6, -12, 0, 0);
    ctx.restore();
  }
  ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.restore();
}

function drawVine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, amplitude: number) {
  const steps = 24;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = lerp(x1, x2, t);
    const y = lerp(y1, y2, t) + Math.sin(t * Math.PI * 3) * amplitude;
    ctx.lineTo(x, y);
  }
}

/* ====== Texture Overlay (post-processing) ====== */
function applyTextureOverlay(ctx: CanvasRenderingContext2D, craftId: string, w: number, h: number) {
  switch (craftId) {
    case "miao": applyMiaoTexture(ctx, w, h); break;
    case "tieDye": applyTieDyeTexture(ctx, w, h); break;
    case "paperCut": applyPaperCutTexture(ctx, w, h); break;
    case "bluePrint": applyBluePrintTexture(ctx, w, h); break;
    case "jingtai": applyJingtaiTexture(ctx, w, h); break;
  }
}

function applyMiaoTexture(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Weave texture overlay
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.globalCompositeOperation = "overlay";
  ctx.strokeStyle = "#a0a0a0";
  ctx.lineWidth = 0.4;
  for (let i = 0; i <= w; i += 3) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
  }
  for (let i = 0; i <= h; i += 3) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
  }
  ctx.restore();
  // Silk thread highlights
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 180; i++) {
    const x = Math.random() * w, y = Math.random() * h;
    const l = 2 + Math.random() * 5;
    const a = Math.random() * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); ctx.stroke();
  }
  ctx.restore();
}

function applyTieDyeTexture(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Dye bleed noise
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.globalCompositeOperation = "soft-light";
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * w, y = Math.random() * h;
    const v = Math.floor(Math.random() * 55);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x, y, 2, 2);
  }
  ctx.restore();
  // White resist dots
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * w, y = Math.random() * h;
    ctx.beginPath(); ctx.arc(x, y, 1 + Math.random() * 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function applyPaperCutTexture(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Paper grain
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.globalCompositeOperation = "multiply";
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * w, y = Math.random() * h;
    const v = 110 + Math.floor(Math.random() * 40);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.restore();
  // Light through paper
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.globalCompositeOperation = "screen";
  const g = ctx.createRadialGradient(w * 0.35, h * 0.3, 0, w * 0.35, h * 0.3, w * 0.55);
  g.addColorStop(0, "#ffffff"); g.addColorStop(1, "transparent");
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function applyBluePrintTexture(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Cotton weave
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.globalCompositeOperation = "multiply";
  ctx.strokeStyle = "#606060";
  ctx.lineWidth = 0.3;
  for (let i = 0; i <= w; i += 4) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
  }
  for (let i = 0; i <= h; i += 4) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
  }
  ctx.restore();
  // Resist paste white dots
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * w, y = Math.random() * h;
    ctx.beginPath(); ctx.arc(x, y, 0.6 + Math.random() * 1.2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function applyJingtaiTexture(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Metal sheen gradient
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.globalCompositeOperation = "screen";
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.3, "rgba(255,255,255,0.12)");
  g.addColorStop(0.5, "rgba(255,255,255,0.03)");
  g.addColorStop(0.7, "rgba(255,255,255,0.1)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.restore();
  // Enamel specular highlights
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * w, y = Math.random() * h;
    ctx.beginPath(); ctx.arc(x, y, 1 + Math.random() * 3, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

/* ====== Main craft algorithms ====== */
export type CraftAlgorithm = "miao" | "jingtai" | "tieDye" | "paperCut" | "bluePrint";

export function generatePattern(
  canvas: HTMLCanvasElement,
  craftId: CraftAlgorithm,
  prompt: string,
  palette: string[],
  progress: number = 1.0,
  variantSeed: number = 0
) {
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  if (!ctx || size <= 0) return;
  // Normalize palette to at least 4 valid hex colors so draw functions never
  // hit undefined/NaN on an unexpected input.
  const FALLBACK = ["#b9362d", "#c8912d", "#176d7a", "#ffffff"];
  const pal = FALLBACK.map((f, i) => {
    const c = palette?.[i];
    return typeof c === "string" && /^#[0-9a-fA-F]{6}$/.test(c) ? c : f;
  });
  const seed = ([...prompt].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) || 128) + variantSeed * 137;
  ctx.clearRect(0, 0, size, size);

  switch (craftId) {
    case "miao": drawMiao(ctx, size, seed, pal, progress); break;
    case "jingtai": drawJingtai(ctx, size, seed, pal, progress); break;
    case "tieDye": drawTieDye(ctx, size, seed, pal, progress); break;
    case "paperCut": drawPaperCut(ctx, size, seed, pal, progress); break;
    case "bluePrint": drawBluePrint(ctx, size, seed, pal, progress); break;
  }

  // Post-process texture overlay
  if (progress > 0.75) {
    applyTextureOverlay(ctx, craftId, size, size);
  }
}

/* ====== Miao Embroidery ====== */
function drawMiao(ctx: CanvasRenderingContext2D, size: number, seed: number, palette: string[], prog: number) {
  const [primary, secondary, accent, light] = palette;
  const cx = size / 2, cy = size / 2;

  // Dark embroidery cloth background
  const bg = ctx.createRadialGradient(cx, cy, 20, cx, cy, size * 0.72);
  bg.addColorStop(0, "#1e1428");
  bg.addColorStop(0.6, "#0f0b18");
  bg.addColorStop(1, "#080510");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Seed-derived style so different motifs/prompts produce visibly different layouts
  const vineCount = 4 + (seed % 4); // 4..7 radiating vines
  const centerKind = seed % 3; // 0 butterfly, 1 flower, 2 layered

  // Stage 1: Base structure — central motif
  if (prog > 0) {
    const lp = Math.min(1, prog / 0.25);
    ctx.strokeStyle = light;
    ctx.lineWidth = 2;
    const bfScale = easeOut(lp) * (size / 240);
    if (centerKind === 0) {
      drawButterfly(ctx, cx, cy - size * 0.05, bfScale, 0);
    } else if (centerKind === 1) {
      drawFlower(ctx, cx, cy - size * 0.05, bfScale * 1.4, 6 + (seed % 3));
    } else {
      drawFlower(ctx, cx, cy - size * 0.05, bfScale * 1.1, 8);
      drawButterfly(ctx, cx, cy - size * 0.05, bfScale * 0.55, 0);
    }
    ctx.stroke();

    // Radiating vines
    for (let v = 0; v < vineCount; v++) {
      const angle = (Math.PI * 2 / vineCount) * v + seed * 0.01;
      const len = size * 0.28 * easeOut(Math.min(1, lp * 1.3));
      const ex = cx + Math.cos(angle) * len;
      const ey = cy + Math.sin(angle) * len;
      ctx.strokeStyle = hex2rgba(accent, 0.7);
      ctx.lineWidth = 1.5;
      drawVine(ctx, cx, cy, ex, ey, 12);
      ctx.stroke();
    }
  }

  // Stage 2: Color fill with radial reveal
  if (prog > 0.25) {
    const lp = Math.min(1, (prog - 0.25) / 0.25);
    const clipR = easeOut(lp) * size * 0.48;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, clipR, 0, Math.PI * 2); ctx.clip();

    ctx.fillStyle = hex2rgba(primary, 0.8);
    const bfScale = size / 240;
    if (centerKind === 1) {
      drawFlower(ctx, cx, cy - size * 0.05, bfScale * 1.4, 6 + (seed % 3));
    } else {
      drawButterfly(ctx, cx, cy - size * 0.05, bfScale, 0);
    }
    ctx.fill();

    // Fill ring elements (ring count varies by seed)
    const ringCount = 2 + (seed % 3); // 2..4 rings
    for (let ring = 0; ring < ringCount; ring++) {
      const r = size * 0.12 + ring * size * 0.1;
      const count = 6 + ring * 4;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + ring * 0.2 + seed * 0.005;
        const ex = cx + Math.cos(angle) * r;
        const ey = cy + Math.sin(angle) * r;
        ctx.fillStyle = ring % 2 === 0 ? hex2rgba(secondary, 0.6) : hex2rgba(accent, 0.5);
        drawFlower(ctx, ex, ey, 0.5 + ring * 0.15, 5);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // Stage 3: Pattern details — birds, fish, secondary motifs
  if (prog > 0.5) {
    const lp = Math.min(1, (prog - 0.5) / 0.25);
    ctx.strokeStyle = hex2rgba(secondary, 0.8);
    ctx.lineWidth = 1.2;

    // Outer ring of smaller butterflies
    const outerR = size * 0.35;
    const bCount = 8;
    for (let i = 0; i < bCount; i++) {
      const angle = (Math.PI * 2 / bCount) * i + seed * 0.003;
      const bx = cx + Math.cos(angle) * outerR;
      const by = cy + Math.sin(angle) * outerR;
      if (easeOut(lp) > i / bCount) {
        ctx.strokeStyle = i % 2 === 0 ? primary : accent;
        ctx.lineWidth = 1;
        drawButterfly(ctx, bx, by, size / 520, angle + Math.PI / 2);
        ctx.stroke();
      }
    }

    // Perlin-driven decorative dots
    if (lp > 0.4) {
      ctx.fillStyle = hex2rgba(light, 0.5);
      const dotCount = Math.floor(lp * 40);
      for (let d = 0; d < dotCount; d++) {
        const angle = d * 0.618 * Math.PI * 2;
        const dist = size * 0.08 + d * size * 0.008;
        const nx = perlinOctave(d * 0.3 + seed * 0.01, 0, 3, 0.5) * 20;
        const ny = perlinOctave(0, d * 0.3 + seed * 0.01, 3, 0.5) * 20;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(angle) * dist + nx, cy + Math.sin(angle) * dist + ny, 2 + Math.random(), 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Stage 4: Final details and border
  if (prog > 0.75) {
    const lp = Math.min(1, (prog - 0.75) / 0.25);

    // Re-stroke outlines for crispness
    ctx.strokeStyle = light;
    ctx.lineWidth = 1.8;
    const bfScale = size / 240;
    drawButterfly(ctx, cx, cy - size * 0.05, bfScale, 0);
    ctx.stroke();

    // Central jewel
    ctx.fillStyle = primary;
    ctx.beginPath(); ctx.arc(cx, cy - size * 0.05, 8 + lp * 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = light; ctx.lineWidth = 2; ctx.stroke();

    // Decorative border
    if (lp > 0.5) {
      const margin = size * 0.04;
      ctx.strokeStyle = hex2rgba(accent, 0.4);
      ctx.lineWidth = 2;
      ctx.strokeRect(margin, margin, size - margin * 2, size - margin * 2);
      ctx.strokeStyle = hex2rgba(light, 0.2);
      ctx.lineWidth = 1;
      ctx.strokeRect(margin + 6, margin + 6, size - margin * 2 - 12, size - margin * 2 - 12);
    }
  }
}

/* ====== Jingtai Lan (Cloisonné) ====== */
function drawJingtai(ctx: CanvasRenderingContext2D, size: number, seed: number, palette: string[], prog: number) {
  const [primary, secondary, accent] = palette;
  const cx = size / 2, cy = size / 2;

  // Deep enamel background
  const bg = ctx.createRadialGradient(cx, cy, 10, cx, cy, size * 0.7);
  bg.addColorStop(0, "#1a2840");
  bg.addColorStop(0.5, "#0d1a2e");
  bg.addColorStop(1, "#060d18");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Seed-derived compartment count so motifs look distinct
  const sectorN = [8, 10, 12, 16][seed % 4];

  // Stage 1: Gold filigree wire structure
  if (prog > 0) {
    const lp = Math.min(1, prog / 0.25);
    ctx.strokeStyle = "#d4a84b";
    ctx.lineWidth = 1.8;

    // Central lotus wire
    const lotusScale = easeOut(lp) * (size / 180);
    drawLotus(ctx, cx, cy, lotusScale, 0);
    ctx.stroke();

    // Concentric circles (cloisonné compartments)
    const rings = [0.12, 0.22, 0.34, 0.44];
    for (let r = 0; r < rings.length; r++) {
      if (lp > r * 0.2) {
        ctx.beginPath();
        ctx.arc(cx, cy, size * rings[r], 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Radiating lines between rings
    if (lp > 0.5) {
      const rayCount = sectorN;
      for (let i = 0; i < rayCount; i++) {
        const angle = (Math.PI * 2 / rayCount) * i + seed * 0.002;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * size * 0.12, cy + Math.sin(angle) * size * 0.12);
        ctx.lineTo(cx + Math.cos(angle) * size * 0.44, cy + Math.sin(angle) * size * 0.44);
        ctx.stroke();
      }
    }
  }

  // Stage 2: Enamel color fill
  if (prog > 0.25) {
    const lp = Math.min(1, (prog - 0.25) / 0.25);

    // Fill sectors with enamel colors (count varies by seed)
    const sectors = sectorN;
    for (let i = 0; i < sectors; i++) {
      const sectorProg = (lp - i * 0.06);
      if (sectorProg <= 0) continue;
      const angle1 = (Math.PI * 2 / sectors) * i;
      const angle2 = (Math.PI * 2 / sectors) * (i + 1);
      const colors = [primary, secondary, accent];
      ctx.fillStyle = hex2rgba(colors[i % 3], 0.65 * Math.min(1, sectorProg * 3));
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, size * 0.44, angle1, angle2);
      ctx.closePath();
      ctx.fill();
    }

    // Lotus center fill
    if (lp > 0.5) {
      ctx.fillStyle = hex2rgba(primary, 0.75);
      const lotusScale = size / 180;
      drawLotus(ctx, cx, cy, lotusScale, 0);
      ctx.fill();
    }
  }

  // Stage 3: Pattern enrichment
  if (prog > 0.5) {
    const lp = Math.min(1, (prog - 0.5) / 0.25);

    // Vine scrollwork between rings
    ctx.strokeStyle = hex2rgba("#d4a84b", 0.5);
    ctx.lineWidth = 0.8;
    const vineR = size * 0.28;
    const vCount = 8;
    for (let i = 0; i < vCount; i++) {
      if (lp < i / vCount) break;
      const a = (Math.PI * 2 / vCount) * i + seed * 0.004;
      const x1 = cx + Math.cos(a) * vineR * 0.8;
      const y1 = cy + Math.sin(a) * vineR * 0.8;
      const x2 = cx + Math.cos(a) * vineR * 1.3;
      const y2 = cy + Math.sin(a) * vineR * 1.3;
      drawVine(ctx, x1, y1, x2, y2, 8);
      ctx.stroke();
    }

    // Small lotus at cardinal points
    if (lp > 0.4) {
      const outerR = size * 0.36;
      for (let i = 0; i < 4; i++) {
        const a = (Math.PI / 2) * i + Math.PI / 4;
        ctx.strokeStyle = "#d4a84b";
        ctx.lineWidth = 1;
        drawLotus(ctx, cx + Math.cos(a) * outerR, cy + Math.sin(a) * outerR, size / 420, a);
        ctx.stroke();
      }
    }
  }

  // Stage 4: Gold wire re-emphasis + final polish
  if (prog > 0.75) {
    const lp = Math.min(1, (prog - 0.75) / 0.25);

    // Re-draw gold wires on top
    ctx.strokeStyle = "#d4a84b";
    ctx.lineWidth = 2;
    const lotusScale = size / 180;
    drawLotus(ctx, cx, cy, lotusScale, 0);
    ctx.stroke();

    const rings = [0.12, 0.22, 0.34, 0.44];
    for (const r of rings) {
      ctx.beginPath(); ctx.arc(cx, cy, size * r, 0, Math.PI * 2); ctx.stroke();
    }

    // Outer decorative border
    if (lp > 0.3) {
      ctx.strokeStyle = "#b8860b";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, size * 0.47, 0, Math.PI * 2); ctx.stroke();
    }

    // Center jewel
    if (lp > 0.6) {
      const jewel = ctx.createRadialGradient(cx, cy, 2, cx, cy, 12);
      jewel.addColorStop(0, "#ffd700");
      jewel.addColorStop(0.6, "#b8860b");
      jewel.addColorStop(1, "#8b6914");
      ctx.fillStyle = jewel;
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();
    }
  }
}

/* ====== Tie Dye (扎染) ====== */
function drawTieDye(ctx: CanvasRenderingContext2D, size: number, seed: number, palette: string[], prog: number) {
  const [primary, secondary, accent] = palette;
  const cx = size / 2, cy = size / 2;

  // White cotton base
  ctx.fillStyle = "#f0ebe3";
  ctx.fillRect(0, 0, size, size);

  // Stage 1: Base indigo wash with Perlin noise.
  // Compute on a downscaled buffer then upscale — avoids a 720x720 per-pixel
  // Perlin loop on the main thread (which caused typing/preview lag on mobile).
  if (prog > 0) {
    const lp = Math.min(1, prog / 0.25);
    const N = 96; // low-res noise field, scaled up by the canvas
    const baseColor = {
      r: parseInt(primary.slice(1, 3), 16),
      g: parseInt(primary.slice(3, 5), 16),
      b: parseInt(primary.slice(5, 7), 16),
    };
    const buf = document.createElement("canvas");
    buf.width = N;
    buf.height = N;
    const bctx = buf.getContext("2d");
    if (bctx) {
      const imgData = bctx.createImageData(N, N);
      const data = imgData.data;
      const half = N / 2;
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const noise = (perlinOctave(x / N * 4 + seed * 0.01, y / N * 4 + seed * 0.01, 4, 0.5) + 1) * 0.5;
          const dist = Math.sqrt((x - half) ** 2 + (y - half) ** 2) / half;
          const intensity = Math.max(0, noise * (1 - dist * 0.4) * lp);
          const idx = (y * N + x) * 4;
          data[idx] = Math.floor(lerp(240, baseColor.r, intensity * 0.7));
          data[idx + 1] = Math.floor(lerp(235, baseColor.g, intensity * 0.7));
          data[idx + 2] = Math.floor(lerp(227, baseColor.b, intensity * 0.7));
          data[idx + 3] = 255;
        }
      }
      bctx.putImageData(imgData, 0, 0);
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(buf, 0, 0, size, size);
      ctx.restore();
    }
  }

  // Stage 2: Tie-dye radial patterns (folded circles)
  if (prog > 0.25) {
    const lp = Math.min(1, (prog - 0.25) / 0.25);
    const rings = 5 + Math.floor(seed % 4);

    for (let r = 0; r < rings; r++) {
      if (lp < r / rings) break;
      const radius = size * 0.06 + r * size * 0.07;
      const alpha = 0.3 + (1 - r / rings) * 0.4;

      ctx.strokeStyle = hex2rgba(secondary, alpha);
      ctx.lineWidth = 3 + (rings - r) * 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();

      // White resist between rings
      ctx.strokeStyle = hex2rgba("#ffffff", 0.25);
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2); ctx.stroke();
    }

    // Secondary tie points
    if (lp > 0.5) {
      const points = [[cx - size * 0.25, cy - size * 0.2], [cx + size * 0.25, cy - size * 0.15], [cx - size * 0.2, cy + size * 0.25], [cx + size * 0.22, cy + size * 0.22]];
      for (const [px, py] of points) {
        for (let r = 0; r < 3; r++) {
          ctx.strokeStyle = hex2rgba(accent, 0.3 - r * 0.08);
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(px, py, 15 + r * 12, 0, Math.PI * 2); ctx.stroke();
        }
      }
    }
  }

  // Stage 3: Dye bleed and organic shapes
  if (prog > 0.5) {
    const lp = Math.min(1, (prog - 0.5) / 0.25);
    ctx.globalAlpha = lp * 0.35;
    ctx.globalCompositeOperation = "multiply";

    // Organic bleed shapes using perlin
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i + seed * 0.005;
      const dist = size * 0.15 + perlinOctave(i * 0.7, seed * 0.01, 3, 0.5) * size * 0.1;
      const bx = cx + Math.cos(angle) * dist;
      const by = cy + Math.sin(angle) * dist;
      const blobR = size * 0.04 + Math.abs(perlinOctave(i * 1.3, 0, 2, 0.6)) * size * 0.03;

      const grad = ctx.createRadialGradient(bx, by, 0, bx, by, blobR);
      grad.addColorStop(0, primary);
      grad.addColorStop(0.7, hex2rgba(accent, 0.5));
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(bx, by, blobR, 0, Math.PI * 2); ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  // Stage 4: Final accents
  if (prog > 0.75) {
    const lp = Math.min(1, (prog - 0.75) / 0.25);

    // Decorative motifs overlaid
    ctx.strokeStyle = hex2rgba(primary, 0.6);
    ctx.lineWidth = 1.5;
    const motifR = size * 0.32;
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i;
      const mx = cx + Math.cos(angle) * motifR;
      const my = cy + Math.sin(angle) * motifR;
      drawFlower(ctx, mx, my, 0.8, 5 + (i % 2));
      ctx.stroke();
    }

    // Border pattern
    if (lp > 0.5) {
      ctx.strokeStyle = hex2rgba(primary, 0.3);
      ctx.lineWidth = 4;
      ctx.strokeRect(size * 0.05, size * 0.05, size * 0.9, size * 0.9);
    }
  }
}

/* ====== Paper Cut (剪纸) ====== */
function drawPaperCut(ctx: CanvasRenderingContext2D, size: number, seed: number, palette: string[], prog: number) {
  const [primary] = palette;
  const cx = size / 2, cy = size / 2;

  // Red paper background
  const bg = ctx.createRadialGradient(cx, cy, 10, cx, cy, size * 0.7);
  bg.addColorStop(0, "#d42a2a");
  bg.addColorStop(0.6, "#b92020");
  bg.addColorStop(1, "#8a1515");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Stage 1: Cut-out negative space structure
  if (prog > 0) {
    const lp = Math.min(1, prog / 0.25);
    ctx.fillStyle = "#0a0505";

    // Central medallion negative space
    const medalR = size * 0.2 * easeOut(lp);
    ctx.beginPath(); ctx.arc(cx, cy, medalR, 0, Math.PI * 2); ctx.fill();

    // Symmetrical cut-outs
    const cutCount = 8;
    for (let i = 0; i < cutCount; i++) {
      if (lp < i / cutCount * 0.8) break;
      const angle = (Math.PI * 2 / cutCount) * i;
      const dist = size * 0.25;
      const cutX = cx + Math.cos(angle) * dist;
      const cutY = cy + Math.sin(angle) * dist;
      ctx.save(); ctx.translate(cutX, cutY); ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, -18); ctx.bezierCurveTo(14, -10, 16, 12, 0, 22);
      ctx.bezierCurveTo(-16, 12, -14, -10, 0, -18);
      ctx.fill();
      ctx.restore();
    }
  }

  // Stage 2: Positive space red shapes revealed
  if (prog > 0.25) {
    const lp = Math.min(1, (prog - 0.25) / 0.25);
    ctx.fillStyle = primary || "#d42a2a";

    // Central positive motif
    const s = easeOut(lp) * (size / 320);
    drawButterfly(ctx, cx, cy, s, 0);
    ctx.fill();

    // Corner zodiac-style elements
    if (lp > 0.4) {
      const corners = [[size * 0.15, size * 0.15], [size * 0.85, size * 0.15], [size * 0.15, size * 0.85], [size * 0.85, size * 0.85]];
      for (const [px, py] of corners) {
        drawFlower(ctx, px, py, 1.2, 6);
        ctx.fill();
      }
    }
  }

  // Stage 3: Intricate cut details
  if (prog > 0.5) {
    const lp = Math.min(1, (prog - 0.5) / 0.25);
    ctx.strokeStyle = "#0a0505";
    ctx.lineWidth = 1.5;

    // Radiating cut lines
    const lineCount = 16;
    for (let i = 0; i < lineCount; i++) {
      if (lp < i / lineCount) break;
      const angle = (Math.PI * 2 / lineCount) * i + seed * 0.003;
      const innerR = size * 0.1;
      const outerR = size * 0.38;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
      ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
      ctx.stroke();
    }

    // Scalloped border pattern
    if (lp > 0.5) {
      ctx.fillStyle = "#0a0505";
      const borderR = size * 0.42;
      const scallops = 24;
      for (let i = 0; i < scallops; i++) {
        const angle = (Math.PI * 2 / scallops) * i;
        const sx = cx + Math.cos(angle) * borderR;
        const sy = cy + Math.sin(angle) * borderR;
        ctx.beginPath(); ctx.arc(sx, sy, 6, 0, Math.PI * 2); ctx.fill();
      }
    }
  }

  // Stage 4: Final frame and accents
  if (prog > 0.75) {
    const lp = Math.min(1, (prog - 0.75) / 0.25);

    // Double frame border
    ctx.strokeStyle = "#0a0505";
    ctx.lineWidth = 3;
    const m = size * 0.04;
    ctx.strokeRect(m, m, size - m * 2, size - m * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(m + 8, m + 8, size - m * 2 - 16, size - m * 2 - 16);

    // "福" character style center accent
    if (lp > 0.5) {
      ctx.fillStyle = "#ffd700";
      ctx.font = `bold ${size * 0.06}px serif`;
      ctx.textAlign = "center";
      ctx.fillText("福", cx, cy + size * 0.02);
    }
  }
}

/* ====== Blue Print (蓝印花布) ====== */
function drawBluePrint(ctx: CanvasRenderingContext2D, size: number, seed: number, palette: string[], prog: number) {
  const [primary, secondary] = palette;
  const cx = size / 2, cy = size / 2;

  // Deep indigo base
  ctx.fillStyle = primary || "#0d4a6b";
  ctx.fillRect(0, 0, size, size);

  // Stage 1: White resist paste structure
  if (prog > 0) {
    const lp = Math.min(1, prog / 0.25);
    ctx.fillStyle = secondary || "#e9eef0";
    ctx.strokeStyle = secondary || "#e9eef0";
    ctx.lineWidth = 2;

    // Central medallion
    const medalR = size * 0.18 * easeOut(lp);
    ctx.beginPath(); ctx.arc(cx, cy, medalR, 0, Math.PI * 2); ctx.stroke();

    // Geometric repeat grid hints
    if (lp > 0.4) {
      const gridSize = size * 0.12;
      for (let gx = gridSize; gx < size; gx += gridSize) {
        for (let gy = gridSize; gy < size; gy += gridSize) {
          if (Math.sqrt((gx - cx) ** 2 + (gy - cy) ** 2) < size * 0.42) {
            ctx.beginPath(); ctx.arc(gx, gy, 2, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
    }
  }

  // Stage 2: White motif fill
  if (prog > 0.25) {
    const lp = Math.min(1, (prog - 0.25) / 0.25);
    ctx.fillStyle = hex2rgba(secondary || "#e9eef0", 0.9);

    // Lotus center
    const lotusS = easeOut(lp) * (size / 280);
    drawLotus(ctx, cx, cy, lotusS, 0);
    ctx.fill();

    // Surrounding flowers
    if (lp > 0.3) {
      const flowerR = size * 0.26;
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i + Math.PI / 6;
        const fx = cx + Math.cos(angle) * flowerR;
        const fy = cy + Math.sin(angle) * flowerR;
        drawFlower(ctx, fx, fy, 0.7, 5);
        ctx.fill();
      }
    }
  }

  // Stage 3: Connecting vines and secondary pattern
  if (prog > 0.5) {
    const lp = Math.min(1, (prog - 0.5) / 0.25);
    ctx.strokeStyle = hex2rgba(secondary || "#e9eef0", 0.7);
    ctx.lineWidth = 1.2;

    // Vine connections
    const flowerR = size * 0.26;
    for (let i = 0; i < 6; i++) {
      if (lp < i / 6) break;
      const a1 = (Math.PI * 2 / 6) * i + Math.PI / 6;
      const a2 = (Math.PI * 2 / 6) * ((i + 1) % 6) + Math.PI / 6;
      drawVine(ctx, cx + Math.cos(a1) * flowerR, cy + Math.sin(a1) * flowerR, cx + Math.cos(a2) * flowerR, cy + Math.sin(a2) * flowerR, 10);
      ctx.stroke();
    }

    // Dot pattern fill in background
    if (lp > 0.4) {
      ctx.fillStyle = hex2rgba(secondary || "#e9eef0", 0.3);
      for (let y = 0; y < size; y += size * 0.05) {
        for (let x = 0; x < size; x += size * 0.05) {
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
          if (dist > size * 0.35 && dist < size * 0.45) {
            ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
    }
  }

  // Stage 4: Border and final touches
  if (prog > 0.75) {
    const lp = Math.min(1, (prog - 0.75) / 0.25);

    // Re-stroke outlines
    ctx.strokeStyle = secondary || "#e9eef0";
    ctx.lineWidth = 2;
    const lotusS = size / 280;
    drawLotus(ctx, cx, cy, lotusS, 0);
    ctx.stroke();

    // Decorative border
    if (lp > 0.3) {
      ctx.strokeStyle = hex2rgba(secondary || "#e9eef0", 0.6);
      ctx.lineWidth = 2.5;
      const m = size * 0.05;
      ctx.strokeRect(m, m, size - m * 2, size - m * 2);

      // Wave border detail
      ctx.lineWidth = 1;
      const bm = size * 0.07;
      ctx.beginPath();
      for (let x = bm; x < size - bm; x += 10) {
        const y = bm + Math.sin(x * 0.1) * 3;
        if (x === bm) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let x = bm; x < size - bm; x += 10) {
        const y = size - bm + Math.sin(x * 0.1) * 3;
        if (x === bm) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
}

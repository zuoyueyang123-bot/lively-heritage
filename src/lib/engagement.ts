"use client";

/**
 * Lightweight client-side engagement (likes / views) for the prototype.
 * Persists per-browser in localStorage and seeds a stable baseline count per
 * artwork so the gallery feels alive without requiring a backend migration.
 */

const LIKES_KEY = "feiyi-likes";
const VIEWS_KEY = "feiyi-views";

function readMap(key: string): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(key) || "{}") as Record<string, number>;
  } catch {
    return {};
  }
}

function writeMap(key: string, map: Record<string, number>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(map));
}

/** Deterministic baseline so the same slug always shows the same seed count. */
function seedCount(slug: string, min: number, max: number) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) & 0xffffffff;
  }
  const range = max - min;
  return min + (Math.abs(hash) % range);
}

export function getLikeState(slug: string): { count: number; liked: boolean } {
  const likes = readMap(LIKES_KEY);
  const liked = likes[slug] === 1;
  const base = seedCount(slug, 18, 240);
  return { count: base + (liked ? 1 : 0), liked };
}

export function toggleLike(slug: string): { count: number; liked: boolean } {
  const likes = readMap(LIKES_KEY);
  const liked = likes[slug] === 1;
  if (liked) delete likes[slug];
  else likes[slug] = 1;
  writeMap(LIKES_KEY, likes);
  return getLikeState(slug);
}

export function registerView(slug: string): number {
  const views = readMap(VIEWS_KEY);
  const base = seedCount(slug, 120, 1600);
  views[slug] = (views[slug] || 0) + 1;
  writeMap(VIEWS_KEY, views);
  return base + views[slug];
}

export function getViewCount(slug: string): number {
  const views = readMap(VIEWS_KEY);
  const base = seedCount(slug, 120, 1600);
  return base + (views[slug] || 0);
}

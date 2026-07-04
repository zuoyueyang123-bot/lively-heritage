"use client";

import { buildNarrative, createArtwork, demoArtworks } from "./demo-artworks";
import type { Artwork } from "./types";

export { buildNarrative, createArtwork, demoArtworks };

const STORAGE_KEY = "feiyi-platform-artworks";

export function saveArtwork(artwork: Artwork) {
  const list = getArtworks();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([artwork, ...list]));
}

export function getArtworks(): Artwork[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as Artwork[];
  } catch {
    return [];
  }
}

export function getArtwork(slug: string) {
  return getArtworks().find((artwork) => artwork.slug === slug) ?? demoArtworks.find((artwork) => artwork.slug === slug);
}



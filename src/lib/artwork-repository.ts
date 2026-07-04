import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { demoArtworks } from "./demo-artworks";
import type { Artwork } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "artworks.json");

type ArtworkRow = {
  id: string;
  share_slug: string;
  title: string;
  prompt: string;
  craft: Artwork["craft"];
  craft_name: string;
  palette: string[];
  pattern_image_url: string;
  narrative: Artwork["narrative"];
  created_at: string;
};

function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function supabaseAdmin() {
  if (!hasSupabaseConfig()) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}

function rowToArtwork(row: ArtworkRow): Artwork {
  return {
    id: row.id,
    slug: row.share_slug,
    title: row.title,
    prompt: row.prompt,
    craft: row.craft,
    craftName: row.craft_name,
    palette: row.palette,
    patternImage: row.pattern_image_url,
    narrative: row.narrative,
    createdAt: row.created_at,
  };
}

function artworkToRow(artwork: Artwork, patternUrl: string): Omit<ArtworkRow, "created_at"> {
  return {
    id: artwork.id,
    share_slug: artwork.slug,
    title: artwork.title,
    prompt: artwork.prompt,
    craft: artwork.craft,
    craft_name: artwork.craftName,
    palette: artwork.palette,
    pattern_image_url: patternUrl,
    narrative: artwork.narrative,
  };
}

function dataUrlToBuffer(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  return {
    mime: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

async function uploadPatternIfNeeded(artwork: Artwork) {
  const supabase = supabaseAdmin();
  if (!supabase || !artwork.patternImage.startsWith("data:")) return artwork.patternImage;
  const parsed = dataUrlToBuffer(artwork.patternImage);
  if (!parsed) return artwork.patternImage;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "patterns";
  const objectPath = `${artwork.id}/pattern.png`;
  try {
    const { error } = await supabase.storage.from(bucket).upload(objectPath, parsed.buffer, {
      contentType: parsed.mime,
      upsert: true,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    return data.publicUrl;
  } catch (err) {
    // Storage upload is best-effort: fall back to the inline data URL so
    // saving never fails just because Storage is misconfigured.
    console.error("Pattern upload failed, falling back to data URL:", err instanceof Error ? err.message : err);
    return artwork.patternImage;
  }
}

async function ensureDataFile() {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(DATA_FILE, "utf8");
  } catch {
    await writeFile(DATA_FILE, "[]", "utf8");
  }
}

export async function readArtworks(): Promise<Artwork[]> {
  const supabase = supabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("artworks")
      .select("id,share_slug,title,prompt,craft,craft_name,palette,pattern_image_url,narrative,created_at")
      .order("created_at", { ascending: false })
      .limit(60);
    if (!error && data) return [...(data as ArtworkRow[]).map(rowToArtwork), ...demoArtworks];
    if (error) console.error("Supabase readArtworks error:", error.message);
  }

  await ensureDataFile();
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Artwork[];
    return [...parsed, ...demoArtworks];
  } catch {
    return demoArtworks;
  }
}

export async function writeArtwork(artwork: Artwork) {
  const supabase = supabaseAdmin();
  if (supabase) {
    const patternUrl = await uploadPatternIfNeeded(artwork);
    const { data, error } = await supabase
      .from("artworks")
      .upsert(artworkToRow(artwork, patternUrl))
      .select("id,share_slug,title,prompt,craft,craft_name,palette,pattern_image_url,narrative,created_at")
      .single();
    if (error) throw error;
    return rowToArtwork(data as ArtworkRow);
  }

  await ensureDataFile();
  const current = await readArtworks();
  const withoutDemos = current.filter((item) => !item.id.startsWith("demo-"));
  const next = [artwork, ...withoutDemos.filter((item) => item.slug !== artwork.slug)];
  await writeFile(DATA_FILE, JSON.stringify(next, null, 2), "utf8");
  return artwork;
}

export async function findArtwork(slug: string) {
  const supabase = supabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("artworks")
      .select("id,share_slug,title,prompt,craft,craft_name,palette,pattern_image_url,narrative,created_at")
      .eq("share_slug", slug)
      .maybeSingle();
    if (!error && data) return rowToArtwork(data as ArtworkRow);
  }

  const list = await readArtworks();
  return list.find((item) => item.slug === slug);
}

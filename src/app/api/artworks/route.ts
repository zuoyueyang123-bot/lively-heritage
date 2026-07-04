import { NextResponse } from "next/server";
import { createArtwork } from "@/lib/demo-artworks";
import { readArtworks, writeArtwork } from "@/lib/artwork-repository";
import type { CraftId } from "@/lib/types";

export async function GET() {
  const artworks = await readArtworks();
  return NextResponse.json({ artworks });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      prompt?: string;
      craft?: CraftId;
      patternImage?: string;
      narrative?: ReturnType<typeof createArtwork>["narrative"];
    };

    if (!body.craft || !body.patternImage) {
      return NextResponse.json({ error: "craft and patternImage are required" }, { status: 400 });
    }

    const artwork = createArtwork({
      prompt: body.prompt || "一份新的祝福",
      craft: body.craft,
      patternImage: body.patternImage,
      narrative: body.narrative,
    });

    const savedArtwork = await writeArtwork(artwork);
    return NextResponse.json({ artwork: savedArtwork, url: `/work/${savedArtwork.slug}` });
  } catch (error) {
    console.error("POST /api/artworks failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "failed to save artwork" }, { status: 500 });
  }
}

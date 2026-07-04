import { NextResponse } from "next/server";
import { findArtwork } from "@/lib/artwork-repository";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const artwork = await findArtwork(slug);
  if (!artwork) {
    return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
  }
  return NextResponse.json({ artwork });
}

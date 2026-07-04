"use client";

import dynamic from "next/dynamic";

const GalleryClient = dynamic(
  () => import("@/components/gallery/gallery-client").then((mod) => ({ default: mod.GalleryClient })),
  { ssr: false }
);

export function GalleryPageClient() {
  return <GalleryClient />;
}
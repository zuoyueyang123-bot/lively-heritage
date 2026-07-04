"use client";

import { useEffect, useState } from "react";
import { GalleryClient } from "@/components/gallery/gallery-client";

export function GalleryPageClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  if (!mounted) return null;
  return <GalleryClient />;
}
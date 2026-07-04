"use client";

import { useEffect, useState } from "react";
import { getLikeState, getViewCount } from "@/lib/engagement";

/** 服务端安全的 engagement hook，初始化用 seed 值，客户端 hydrate 后更新 */
export function useEngagement(slug: string) {
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setLikes(getLikeState(slug).count);
      setViews(getViewCount(slug));
    });
    return () => cancelAnimationFrame(raf);
  }, [slug]);

  return { likes, views };
}
"use client";

import { useEffect, useState } from "react";

/**
 * 只在客户端渲染 children，彻底避免 SSR hydration 不一致。
 * 服务端渲染一个不可见的占位 span 保持 DOM 结构一致。
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <span style={{ display: "none" }} aria-hidden="true" />;
  }
  return <>{children}</>;
}
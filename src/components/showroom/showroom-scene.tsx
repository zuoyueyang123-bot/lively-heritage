"use client";

import { Box } from "lucide-react";

export type ShowroomVariant = "vase" | "hoop" | "fabric";

function fallbackPattern() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#151827"/><circle cx="256" cy="256" r="160" fill="#d44a3d"/><circle cx="256" cy="256" r="92" fill="#c9984a"/><text x="256" y="276" text-anchor="middle" font-size="44" font-family="sans-serif" fill="#e8e4dd">非遗有灵</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function ShowroomObject({ textureUrl, variant }: { textureUrl?: string; variant: ShowroomVariant }) {
  const image = textureUrl || fallbackPattern();

  if (variant === "hoop") {
    return (
      <div className="absolute left-1/2 top-[9%] aspect-square w-[78%] max-w-[300px] -translate-x-1/2 rounded-full border-[14px] border-[#c69a54] bg-[#2a2340] p-4 shadow-2xl">
        <div
          className="h-full w-full rounded-full border-4 border-[#a97f3c]"
          style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute left-1/2 top-[-7%] h-9 w-8 -translate-x-1/2 rounded-t-lg bg-[#b8894a]" />
      </div>
    );
  }

  if (variant === "fabric") {
    return (
      <>
        <div className="absolute left-1/2 top-[5%] h-3 w-[84%] max-w-[360px] -translate-x-1/2 rounded-full bg-[#5e3d1a] shadow-lg" />
        <div
          className="absolute left-1/2 top-[8%] h-[78%] w-[68%] max-w-[290px] -translate-x-1/2 rounded-b-[36px] border border-white/10 shadow-2xl"
          style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        {[-34, 0, 34].map((x) => (
          <div key={x} className="absolute top-[6%] h-14 w-1 rounded-full bg-[#8a6a3e]" style={{ left: `calc(50% + ${x}px)` }} />
        ))}
      </>
    );
  }

  return (
    <>
      <div className="absolute left-1/2 top-[3%] h-[13%] w-[26%] max-w-[90px] -translate-x-1/2 rounded-t-full border-x-4 border-t-4 border-[#d7aa46] bg-[#2a2340]" />
      <div
        className="absolute left-1/2 top-[12%] h-[74%] w-[58%] max-w-[240px] -translate-x-1/2 rounded-[48%_48%_34%_34%/22%_22%_46%_46%] border-[5px] border-[#d7aa46] shadow-2xl"
        style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute left-1/2 top-[34%] h-2 w-[70%] max-w-[280px] -translate-x-1/2 rounded-full bg-[#d7aa46]" />
      <div className="absolute left-1/2 bottom-[6%] h-[9%] w-[38%] max-w-[150px] -translate-x-1/2 rounded-full bg-[#8b6914] shadow-lg" />
    </>
  );
}

export function ShowroomScene({
  textureUrl,
  variant = "vase",
  className = "h-[420px]",
}: {
  textureUrl?: string;
  variant?: ShowroomVariant;
  showDownload?: boolean;
  className?: string;
}) {
  const label = variant === "hoop" ? "苗绣绣绷" : variant === "fabric" ? "扎染挂布" : "景泰蓝花瓶";

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[#151827] ${className}`}
      id="feiyi-showroom-canvas"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(232,198,106,0.16),transparent_34%),linear-gradient(180deg,#151827,#0e1220)]" />
      <div className="absolute inset-x-10 bottom-10 h-10 rounded-full bg-black/35 blur-xl" />
      <ShowroomObject textureUrl={textureUrl} variant={variant} />
      <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-[#171326]/92 p-4 text-white shadow-lg backdrop-blur sm:inset-x-8">
        <div className="flex items-center gap-2 text-base font-black">
          <Box size={17} />
          {label}
        </div>
        <div className="mt-1 text-xs font-semibold text-white/62">稳定预览 · 纹样实时上物</div>
      </div>
    </div>
  );
}

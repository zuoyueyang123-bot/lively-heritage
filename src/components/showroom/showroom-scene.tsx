"use client";

import { Box, Rotate3D } from "lucide-react";
import { type PointerEvent, useEffect, useMemo, useState } from "react";

export type ShowroomVariant =
  | "vase"
  | "hoop"
  | "fabric"
  | "lantern"
  | "winepot"
  | "pouch"
  | "cloisonne"
  | "bracelet"
  | "xianglu"
  | "miao_attire"
  | "qinghua"
  | "shadow"
  | "thangka"
  | "tiedye"
  | "blueprint"
  | "yunjin";

function fallbackPattern() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#151827"/><circle cx="256" cy="256" r="160" fill="#d44a3d"/><circle cx="256" cy="256" r="92" fill="#c9984a"/><text x="256" y="276" text-anchor="middle" font-size="44" font-family="sans-serif" fill="#e8e4dd">非遗有灵</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function useDragRotation() {
  const [rotation, setRotation] = useState({ x: -8, y: -18 });
  const [drag, setDrag] = useState<{ x: number; y: number; rx: number; ry: number } | null>(null);

  useEffect(() => {
    if (drag) return;
    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame += 0.012;
      setRotation((r) => ({ x: r.x, y: r.y + Math.sin(frame) * 0.08 }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [drag]);

  return {
    rotation,
    dragProps: {
      onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setDrag({ x: event.clientX, y: event.clientY, rx: rotation.x, ry: rotation.y });
      },
      onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
        if (!drag) return;
        const nextY = drag.ry + (event.clientX - drag.x) * 0.22;
        const nextX = Math.max(-28, Math.min(18, drag.rx - (event.clientY - drag.y) * 0.16));
        setRotation({ x: nextX, y: nextY });
      },
      onPointerUp: () => setDrag(null),
      onPointerCancel: () => setDrag(null),
    },
  };
}

function VaseObject({ image }: { image: string }) {
  return (
    <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      <div
        className="absolute left-1/2 top-[9%] h-[76%] w-[56%] max-w-[240px] -translate-x-1/2 rounded-[48%_48%_34%_34%/22%_22%_46%_46%] border-[5px] border-[#d7aa46] shadow-2xl"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(0,0,0,.32),transparent 22%,rgba(255,255,255,.22) 47%,transparent 66%,rgba(0,0,0,.38)),url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "translateZ(30px)",
        }}
      />
      <div className="absolute left-1/2 top-[3%] h-[15%] w-[25%] max-w-[90px] -translate-x-1/2 rounded-t-full border-x-4 border-t-4 border-[#d7aa46] bg-[#2a2340] shadow-lg" style={{ transform: "translateZ(42px)" }} />
      <div className="absolute left-1/2 top-[33%] h-2 w-[70%] max-w-[280px] -translate-x-1/2 rounded-full bg-[#d7aa46]" style={{ transform: "translateZ(48px)" }} />
      <div className="absolute left-1/2 bottom-[8%] h-[9%] w-[38%] max-w-[150px] -translate-x-1/2 rounded-full bg-[#8b6914] shadow-lg" style={{ transform: "translateZ(24px)" }} />
    </div>
  );
}

function HoopObject({ image }: { image: string }) {
  return (
    <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      <div className="absolute left-1/2 top-[10%] aspect-square w-[78%] max-w-[300px] -translate-x-1/2 rounded-full border-[14px] border-[#c69a54] bg-[#2a2340] p-4 shadow-2xl" style={{ transform: "translateZ(26px)" }}>
        <div
          className="h-full w-full rounded-full border-4 border-[#a97f3c]"
          style={{
            backgroundImage: `radial-gradient(circle at 35% 28%,rgba(255,255,255,.2),transparent 30%),url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
      <div className="absolute left-1/2 top-[3%] h-9 w-8 -translate-x-1/2 rounded-t-lg bg-[#b8894a] shadow-lg" style={{ transform: "translateZ(52px)" }} />
      <div className="absolute left-1/2 bottom-[5%] h-[22%] w-2 -translate-x-1/2 rounded-full bg-[#7a5c2e]" style={{ transform: "translateZ(-8px)" }} />
    </div>
  );
}

function FabricObject({ image }: { image: string }) {
  return (
    <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      <div className="absolute left-1/2 top-[5%] h-3 w-[84%] max-w-[360px] -translate-x-1/2 rounded-full bg-[#5e3d1a] shadow-lg" style={{ transform: "translateZ(42px)" }} />
      <div
        className="absolute left-1/2 top-[8%] h-[78%] w-[68%] max-w-[290px] -translate-x-1/2 rounded-b-[36px] border border-white/10 shadow-2xl"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(0,0,0,.24),transparent 30%,rgba(255,255,255,.16) 52%,transparent 74%,rgba(0,0,0,.25)),url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "translateZ(18px) rotateX(2deg)",
        }}
      />
      {[-34, 0, 34].map((x) => (
        <div key={x} className="absolute top-[6%] h-14 w-1 rounded-full bg-[#8a6a3e]" style={{ left: `calc(50% + ${x}px)`, transform: "translateZ(50px)" }} />
      ))}
    </div>
  );
}

function ShowroomObject({ textureUrl, variant, rotation }: { textureUrl?: string; variant: ShowroomVariant; rotation: { x: number; y: number } }) {
  const image = textureUrl || fallbackPattern();
  const body = useMemo(() => {
    if (variant === "hoop" || variant === "lantern") return <HoopObject image={image} />;
    if (
      variant === "fabric" ||
      variant === "pouch" ||
      variant === "tiedye" ||
      variant === "blueprint" ||
      variant === "yunjin" ||
      variant === "shadow" ||
      variant === "thangka"
    )
      return <FabricObject image={image} />;
    return <VaseObject image={image} />;
  }, [image, variant]);

  return (
    <div
      className="absolute inset-x-0 top-[6%] mx-auto h-[74%] w-[80%] max-w-[420px] cursor-grab touch-none active:cursor-grabbing"
      style={{
        perspective: "900px",
      }}
    >
      <div
        className="h-full w-full transition-transform duration-100 ease-out"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {body}
      </div>
    </div>
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
  const label =
    variant === "hoop"
      ? "苗绣绣绷"
      : variant === "fabric"
        ? "扎染挂布"
        : variant === "lantern"
          ? "中式灯笼"
          : variant === "winepot"
            ? "紫砂壶"
            : variant === "pouch"
              ? "苗绣荷包"
              : variant === "bracelet"
                ? "真·手镯"
                : variant === "qinghua"
                  ? "青花瓷"
                  : variant === "shadow"
                    ? "皮影影人"
                    : variant === "thangka"
                      ? "唐卡"
                      : variant === "tiedye"
                        ? "扎染挂布"
                        : variant === "blueprint"
                          ? "蓝印花布"
                          : variant === "yunjin"
                            ? "南京云锦"
                            : "景泰蓝花瓶";
  const { rotation, dragProps } = useDragRotation();

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[#151827] ${className}`}
      id="feiyi-showroom-canvas"
      {...dragProps}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(232,198,106,0.16),transparent_34%),linear-gradient(180deg,#151827,#0e1220)]" />
      <div className="absolute inset-x-10 bottom-10 h-10 rounded-full bg-black/35 blur-xl" />
      <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-xs font-black text-white/70 backdrop-blur">
        <Rotate3D size={14} />
        拖动旋转
      </div>
      <ShowroomObject textureUrl={textureUrl} variant={variant} rotation={rotation} />
      <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-[#171326]/92 p-4 text-white shadow-lg backdrop-blur sm:inset-x-8">
        <div className="flex items-center gap-2 text-base font-black">
          <Box size={17} />
          {label}
        </div>
        <div className="mt-1 text-xs font-semibold text-white/62">CSS 3D 稳定预览 · 纹样实时上物</div>
      </div>
    </div>
  );
}

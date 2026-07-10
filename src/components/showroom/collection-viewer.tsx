"use client";

import { useState } from "react";
import { HeritageModel3D, BUILTIN_MODELS } from "@/components/showroom/heritage-model";
import type { ModelDef } from "@/components/showroom/heritage-model";

// 每件藏品的策展说明（重点是"真实来源"的可信度）
const BLURB: Record<string, string> = {
  cloisonne:
    "十八世纪中国景泰蓝花瓶，来自明尼阿波利斯艺术博物馆公开馆藏（CC0），保留真实扫描纹理与釉色，是平台最硬核的真实文物。",
  vase: "Poly Pizza 通用花瓶（CC-BY 3.0），作为用户生成纹样的 3D 实物载体——你的非遗纹样会被实时贴附到这件器物上。",
  bracelet: "珍珠手镯，Poly Pizza 社区模型（CC0），用于首饰类非遗的 3D 呈现。",
  lantern: "灯笼，由腾讯混元 3D 文生 3D 生成，内部使用；形态来自文本描述，适合节庆类非遗。",
  winepot: "酒壶，由腾讯混元 3D 图生 3D 生成，内部使用；从参考图还原器型与纹饰。",
  pouch: "苗绣荷包，由腾讯混元 3D 图生 3D 生成，内部使用；与苗绣工艺天然契合的 3D 载体。",
  jade_disc: "玉璧，由腾讯混元 3D 图生 3D 生成，内部使用；取意上古礼器，用于礼器类非遗展示。",
};

function licenseTag(license: ModelDef["license"]) {
  if (license === "CC0") return "CC0 · 公有领域";
  if (license === "CC-BY 3.0") return "CC-BY 3.0";
  if (license === "程序生成") return "程序生成";
  return "内部使用 · 混元3D";
}

export function CollectionViewer() {
  const [selected, setSelected] = useState<string>("cloisonne");
  const current =
    BUILTIN_MODELS.find((m) => m.key === selected) ?? BUILTIN_MODELS[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      {/* 主展品：单一 WebGL 上下文，可轨道旋转 */}
      <div className="flex flex-col">
        <HeritageModel3D
          modelKey={current.key}
          pattern="cloisonne"
          className="h-[360px] sm:h-[460px]"
          enableControls={true}
        />
        <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)]/60 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-black">{current.label}</h3>
            <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-black text-[var(--foreground-dim)]">
              {current.category}
            </span>
            <span className="rounded-full bg-[var(--gold)]/15 px-3 py-1 text-xs font-black text-[var(--gold)]">
              {licenseTag(current.license)}
            </span>
          </div>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground-dim)]">
            {BLURB[current.key]}
          </p>
          <p className="mt-3 text-xs leading-6 text-[var(--foreground-dim)]/80">
            来源：{current.credit}
          </p>
        </div>
      </div>

      {/* 藏品清单：点击切换主展品（缩略为卡片，避免多 WebGL 上下文） */}
      <div>
        <div className="mb-3 text-sm font-black text-[var(--foreground-dim)]">
          馆内藏品 · {BUILTIN_MODELS.length} 件真实 3D 模型
        </div>
        <div className="grid gap-3">
          {BUILTIN_MODELS.map((m) => {
            const active = m.key === current.key;
            return (
              <button
                key={m.key}
                onClick={() => setSelected(m.key)}
                className={`group flex items-center gap-4 rounded-2xl border p-3 text-left transition ${
                  active
                    ? "border-[var(--gold)] bg-[var(--gold)]/10"
                    : "border-[var(--line)] bg-[var(--bg-elevated)]/40 hover:border-[var(--gold)]/50"
                }`}
              >
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-lg ${
                    active ? "bg-[var(--gold)]/20" : "bg-white/5"
                  }`}
                >
                  {(m.label || "").slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-black">{m.label}</span>
                    <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-black text-[var(--foreground-dim)]">
                      {licenseTag(m.license)}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-xs text-[var(--foreground-dim)]">
                    {m.category} · {m.credit}
                  </span>
                </span>
                <span
                  className={`shrink-0 text-xs font-black ${
                    active ? "text-[var(--gold)]" : "text-[var(--foreground-dim)]"
                  }`}
                >
                  {active ? "展示中" : "查看"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

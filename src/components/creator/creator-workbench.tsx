"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Wand2, RotateCw, Square, Shuffle } from "lucide-react";
import { crafts, getCraft } from "@/lib/heritage";
import { generatePattern } from "@/lib/pattern-engine";
import { AiCurator } from "@/components/creator/ai-curator";
import { sceneTemplates } from "@/lib/scene-templates";
import type { CraftId } from "@/lib/types";

const INSPIRATIONS = [
  "送给挚友的毕业祝福",
  "城市文旅开幕纪念礼",
  "新春家宴的团圆窗花",
  "洱海边的一场婚礼请柬",
  "江南水乡文创伴手礼",
  "母亲节的一句感恩",
];

export function CreatorWorkbench() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<number | null>(null);
  const variantContainerRef = useRef<HTMLDivElement>(null);

  const [prompt, setPrompt] = useState(searchParams.get("prompt") || "送给朋友的毕业祝福");
  const [craft, setCraft] = useState<CraftId>((searchParams.get("craft") as CraftId) || "miao");
  const [stage, setStage] = useState("等待灵感");
  const [progress, setProgress] = useState(0);
  const [pattern, setPattern] = useState("");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeVariant, setActiveVariant] = useState(0);
  const [showVariants, setShowVariants] = useState(false);
  const [motifIndex, setMotifIndex] = useState(0);
  const [saveError, setSaveError] = useState("");

  const craftData = getCraft(craft);
  const activeMotif = craftData.motifs[motifIndex] ?? craftData.motifs[0];
  const renderStyle = craftData.render;

  // Clear any running generation interval on unmount to avoid leaks/warnings.
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  // Draw main preview on craft/prompt/variant/motif change (when idle)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && !generating) {
      generatePattern(canvas, renderStyle, `${prompt}·${activeMotif.name}`, craftData.palette, showVariants ? 1.0 : 0.3, activeVariant + motifIndex * 7);
    }
  }, [craft, prompt, craftData.palette, generating, activeVariant, showVariants, motifIndex, activeMotif.name, renderStyle]);

  // Draw variant thumbnails after generation completes
  useEffect(() => {
    if (!showVariants) return;
    const container = variantContainerRef.current;
    if (!container) return;
    const canvases = container.querySelectorAll<HTMLCanvasElement>("canvas");
    canvases.forEach((c, i) => {
      generatePattern(c, renderStyle, `${prompt}·${activeMotif.name}`, craftData.palette, 1.0, i + motifIndex * 7);
    });
  }, [showVariants, craft, prompt, craftData.palette, motifIndex, activeMotif.name, renderStyle]);

  function stopGenerate() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGenerating(false);
    setStage("已停止");
  }

  function generate() {
    setGenerating(true);
    setShowVariants(false);
    const steps = ["符号提炼", "铺设色彩", "纹样生长", "文创成案"];
    let index = 0;
    let prog = 0;
    setStage(steps[0]);
    setProgress(0);

    timerRef.current = window.setInterval(() => {
      prog += 0.025;
      setProgress(prog);

      const stageIdx = Math.min(Math.floor(prog * 4), 3);
      if (stageIdx !== index) {
        index = stageIdx;
        setStage(steps[index] ?? "生成完成");
      }

      const canvas = canvasRef.current;
      if (canvas) {
        generatePattern(canvas, renderStyle, `${prompt}·${activeMotif.name}`, craftData.palette, Math.min(1, prog), activeVariant + motifIndex * 7);
      }

      if (prog >= 1) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        timerRef.current = null;
        setStage("生成完成");
        setGenerating(false);
        setShowVariants(true);
        const canvas = canvasRef.current;
        if (canvas) setPattern(canvas.toDataURL("image/png"));
      }
    }, 60);
  }

  function pickVariant(index: number) {
    setActiveVariant(index);
    const canvas = canvasRef.current;
    if (canvas) {
      generatePattern(canvas, renderStyle, `${prompt}·${activeMotif.name}`, craftData.palette, 1.0, index + motifIndex * 7);
      setPattern(canvas.toDataURL("image/png"));
    }
  }

  function shuffleInspiration() {
    const next = INSPIRATIONS[Math.floor(Math.random() * INSPIRATIONS.length)];
    setPrompt(next);
    setShowVariants(false);
  }

  function applyTemplate(t: (typeof sceneTemplates)[number]) {
    setPrompt(t.prompt);
    setCraft(t.craft);
    setMotifIndex(t.motifIndex);
    setShowVariants(false);
  }

  async function save() {
    const canvas = canvasRef.current;
    const image = pattern || canvas?.toDataURL("image/png");
    if (!image) return;
    setSaving(true);
    setSaveError("");
    try {
      const narrativeResult = await fetch("/api/ai/narrative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, craft, craftName: craftData.name, motif: activeMotif.name }),
      })
        .then((response) => response.json())
        .catch(() => null);
      const response = await fetch("/api/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, craft, patternImage: image, narrative: narrativeResult?.narrative }),
      });
      if (!response.ok) throw new Error("save failed");
      const result = (await response.json()) as { url?: string };
      if (!result.url) throw new Error("missing url");
      router.push(result.url);
    } catch {
      setSaveError("提案保存暂时失败，请稍后重试。当前纹样不会丢，可以再次点击生成作品提案页。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-shell py-10">
      <div className="mb-8 flex flex-col gap-3">
        <span className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold)]">
          Create Studio
        </span>
        <h1 className="section-title max-w-4xl">把一句灵感炼成可分享的非遗文创提案</h1>
      </div>

      {/* Scene templates — one-click content entry, strengthens creation flow */}
      <div className="mb-6">
        <div className="mb-3 text-sm font-black text-[var(--foreground-dim)]">从场景模板开始（一键填好主题与工艺）</div>
        <div className="mobile-option-strip flex w-full max-w-full snap-x gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
          {sceneTemplates.map((t) => (
            <button
              key={t.id}
              onClick={() => applyTemplate(t)}
              className="group flex w-[214px] shrink-0 snap-start items-center gap-2 rounded-2xl border border-[var(--line)] bg-white/5 px-3 py-2.5 text-left transition hover:-translate-y-0.5 hover:border-[var(--gold)] hover:bg-white/8 sm:w-auto sm:px-4"
            >
              <span className="text-lg">{t.emoji}</span>
              <span className="min-w-0">
                <span className="block text-sm font-black">{t.label}</span>
                <span className="block truncate text-xs text-[var(--foreground-dim)] sm:whitespace-normal">{t.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[0.85fr_1.15fr_0.8fr]">
        {/* Left panel: Input */}
        <section className="glass-panel min-w-0 rounded-[28px] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-black text-[var(--foreground-dim)]">灵感主题</label>
            <button onClick={shuffleInspiration} className="flex items-center gap-1 text-xs font-bold text-[var(--gold)] hover:underline">
              <Shuffle size={13} /> 换一个灵感
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
              setShowVariants(false);
            }}
            className="mt-3 min-h-28 w-full rounded-2xl border border-[var(--line)] bg-white/8 p-4 text-base font-bold text-[var(--foreground)] outline-none focus:border-[var(--gold)] placeholder:text-[var(--foreground-muted)] sm:min-h-32 sm:text-lg"
            placeholder="输入祝福、场景或主题..."
          />
          <div className="mobile-option-strip mt-5 flex w-full max-w-full snap-x gap-2 overflow-x-auto pb-1 sm:gap-3 lg:grid lg:grid-cols-1 lg:overflow-visible lg:pb-0">
            {crafts.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCraft(item.id);
                  setMotifIndex(0);
                  setShowVariants(false);
                }}
                className={`w-[154px] shrink-0 snap-start rounded-2xl border p-3 text-left transition sm:w-[178px] sm:p-4 lg:w-auto ${
                  craft === item.id ? "border-[var(--gold)] bg-[var(--gold)]/15" : "border-[var(--line)] bg-white/5 hover:bg-white/8"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex shrink-0 gap-1">
                    {item.palette.slice(0, 3).map((c, i) => (
                      <div key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <span className="font-black">{item.name}</span>
                </div>
                <div className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--foreground-dim)] sm:text-sm sm:leading-6">{item.tagline}</div>
              </button>
            ))}
          </div>

          {/* Motif picker — richer content wired into generation */}
          <div className="mt-6">
            <label className="text-sm font-black text-[var(--foreground-dim)]">选择纹样母题</label>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {craftData.motifs.map((motif, i) => (
                <button
                  key={motif.name}
                  onClick={() => {
                    setMotifIndex(i);
                    setShowVariants(false);
                  }}
                  className={`rounded-xl border p-3 text-left text-sm transition ${
                    motifIndex === i ? "border-[var(--gold)] bg-[var(--gold)]/15" : "border-[var(--line)] bg-white/5 hover:bg-white/8"
                  }`}
                >
                  <div className="font-black">{motif.name}</div>
                  <div className="mt-1 line-clamp-1 text-xs text-[var(--foreground-dim)]">{motif.meaning}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Center panel: Canvas */}
        <section className="glass-panel min-w-0 rounded-[32px] p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-sm font-black text-[var(--gold)]">{stage}</div>
                {generating && (
                  <div className="h-4 w-32 overflow-hidden rounded-full bg-[var(--line)]">
                    <div
                      className="h-full rounded-full bg-[var(--gold)] transition-all duration-100"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="text-2xl font-black">{craftData.name}纹样炼成</div>
            </div>
            <div className="flex gap-2">
              {generating ? (
                <button onClick={stopGenerate} className="quiet-button flex w-full items-center justify-center gap-2 px-5 py-3 sm:w-auto">
                  <Square size={16} />
                  停止
                </button>
              ) : (
                <button onClick={generate} className="gold-button flex w-full items-center justify-center gap-2 px-5 py-3 sm:w-auto">
                  <Wand2 size={18} />
                  {showVariants ? "重新炼成" : "开始炼成"}
                </button>
              )}
            </div>
          </div>
          <div className="rounded-[26px] bg-[var(--bg-deep)] p-4 shadow-inner">
            <canvas ref={canvasRef} width={720} height={720} className="aspect-square w-full rounded-[20px]" />
          </div>

          {/* Variant picker */}
          {showVariants && (
            <div className="mt-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-black text-[var(--foreground-dim)]">
                <RotateCw size={14} /> 选择你喜欢的变体
              </div>
              <div ref={variantContainerRef} className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => pickVariant(i)}
                    className={`overflow-hidden rounded-2xl border-2 bg-[var(--bg-deep)] p-1 transition ${
                      activeVariant === i ? "border-[var(--gold)]" : "border-transparent hover:border-[var(--line)]"
                    }`}
                  >
                    <canvas width={240} height={240} className="aspect-square w-full rounded-xl" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right panel: AI + Save */}
        <aside className="glass-panel min-w-0 rounded-[28px] p-4 sm:p-5">
          <div className="flex items-center gap-2 text-sm font-black text-[var(--gold)]">
            <Sparkles size={18} />
            AI 策展人草案
          </div>
          <h2 className="mt-3 text-2xl font-black">{activeMotif.name}</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--foreground-dim)]">{activeMotif.story}</p>
          <div className="mt-5 rounded-2xl bg-white/5 p-4">
            <div className="text-sm font-black">推荐落地</div>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground-dim)]">{craftData.products.join(" / ")}</p>
          </div>
          <div className="mt-5 rounded-2xl bg-white/5 p-4">
            <div className="text-sm font-black">色板</div>
            <div className="mt-2 flex gap-2">
              {craftData.palette.map((c, i) => (
                <div key={i} className="h-8 w-8 rounded-lg shadow-sm" style={{ background: c }} />
              ))}
            </div>
          </div>

          {/* AI 策展人互动问答 */}
          <AiCurator prompt={prompt} craft={craft} motif={activeMotif.name} />

          <button onClick={save} className="gold-button mt-5 w-full px-5 py-4" disabled={saving || generating}>
            {saving ? "正在生成提案..." : "生成作品提案页"}
          </button>
          {saveError && (
            <p className="mt-3 rounded-2xl bg-[var(--cinnabar)]/15 p-3 text-sm font-bold leading-6 text-[var(--cinnabar-soft)]">
              {saveError}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

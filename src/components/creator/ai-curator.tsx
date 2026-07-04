"use client";

import { useState } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import type { CraftId } from "@/lib/types";

const DEFAULT_SUGGESTIONS = [
  "这个纹样适合送给谁？",
  "适合用在什么场景？",
  "配什么产品最好看？",
  "怎么搭配一句祝福文案？",
];

/**
 * AI 策展人互动问答面板。用户可就当前工艺/纹样/主题向 AI 提问，
 * 获得可落地的创作建议。让 AI 在创作过程中"可感知"，服务创作决策。
 */
export function AiCurator({
  prompt,
  craft,
  motif,
}: {
  prompt: string;
  craft: CraftId;
  motif: string;
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [asked, setAsked] = useState("");

  async function ask(q: string) {
    const query = q.trim();
    if (!query || loading) return;
    setLoading(true);
    setAsked(query);
    setAnswer("");
    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, craft, motif, question: query }),
      });
      const data = (await res.json()) as { answer?: string };
      setAnswer(data.answer || "策展人暂时没有想法，换个问题试试？");
    } catch {
      setAnswer("网络有点问题，稍后再问问策展人吧。");
    } finally {
      setLoading(false);
      setQuestion("");
    }
  }

  return (
    <div className="mt-5 rounded-2xl border border-[var(--line)] bg-white/58 p-4">
      <div className="flex items-center gap-2 text-sm font-black text-[var(--gold)]">
        <MessageCircle size={16} />
        问问 AI 策展人
      </div>

      {/* Suggested questions */}
      <div className="mt-3 flex flex-wrap gap-2">
        {DEFAULT_SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            disabled={loading}
            className="rounded-full border border-[var(--line)] bg-white/70 px-3 py-1.5 text-xs font-bold text-[var(--muted)] transition hover:bg-white disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Answer area */}
      {(loading || answer) && (
        <div className="mt-3 rounded-xl bg-[#fdf6e3] p-3">
          {asked && <div className="text-xs font-bold text-[var(--gold)]">Q：{asked}</div>}
          <div className="mt-1 text-sm leading-6 text-[var(--ink)]">
            {loading ? (
              <span className="flex items-center gap-2 text-[var(--muted)]">
                <Loader2 size={14} className="animate-spin" /> 策展人思考中...
              </span>
            ) : (
              answer
            )}
          </div>
        </div>
      )}

      {/* Free input */}
      <div className="mt-3 flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") ask(question);
          }}
          placeholder="也可以自己提问..."
          className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-white/70 px-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
        />
        <button
          onClick={() => ask(question)}
          disabled={loading || !question.trim()}
          className="gold-button flex items-center justify-center px-3 disabled:opacity-50"
          aria-label="提问"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

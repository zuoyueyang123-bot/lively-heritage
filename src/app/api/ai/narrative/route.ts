import { NextResponse } from "next/server";
import { buildNarrative } from "@/lib/artwork-store";
import type { CraftId } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    prompt?: string;
    craft?: CraftId;
    craftName?: string;
    motif?: string;
  };

  const prompt = body.prompt || "一份新的祝福";
  const craft = body.craft || "miao";
  const fallback = buildNarrative(prompt, craft);
  const apiKey = process.env.BAILIAN_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ narrative: fallback, source: "local" });
  }

  try {
    const response = await fetch(process.env.BAILIAN_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.BAILIAN_MODEL || "qwen-plus",
        messages: [
          {
            role: "system",
            content: "你是非遗文创策展人。输出 JSON，字段为 symbol, meaning, scenario, value, slogan，语言精炼可信。",
          },
          {
            role: "user",
            content: `主题：${prompt}\n工艺：${body.craftName || craft}${body.motif ? `\n纹样：${body.motif}` : ""}\n请生成非遗文创提案解释。`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error("bailian failed");
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    return NextResponse.json({ narrative: { ...fallback, ...parsed }, source: "bailian" });
  } catch {
    return NextResponse.json({ narrative: fallback, source: "local-fallback" });
  }
}

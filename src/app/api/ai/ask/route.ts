import { NextResponse } from "next/server";
import { getCraft } from "@/lib/heritage";
import type { CraftId } from "@/lib/types";

/**
 * AI 策展人互动问答：用户在创作时可以就当前工艺/纹样/主题提问，
 * 让 AI 给出"适合送谁、什么场景、如何搭配"等创作建议。
 * 百炼失败时回退到基于知识库的本地建议，保证永不阻塞。
 */

const SUGGESTED_QUESTIONS = [
  "这个纹样适合送给谁？",
  "适合用在什么场景？",
  "配什么产品最好看？",
  "怎么搭配一句祝福文案？",
];

function localAnswer(prompt: string, craftName: string, motif: string, question: string) {
  const craftHint = `${craftName}的「${motif}」`;
  if (question.includes("谁") || question.includes("送")) {
    return `${craftHint}寓意深厚，适合送给珍视的亲友、师长或合作伙伴。若主题是「${prompt}」，可作为毕业、乔迁、答谢等场合的心意之选。`;
  }
  if (question.includes("场景")) {
    return `围绕「${prompt}」，${craftHint}适合用于文旅纪念、节庆礼赠、品牌联名或个人收藏等场景。`;
  }
  if (question.includes("产品") || question.includes("搭配")) {
    return `${craftHint}贴合帆布包、手机壳、陶瓷杯、丝巾与传播海报等载体；纹样的对称结构在方形与圆形产品上表现最佳。`;
  }
  if (question.includes("文案") || question.includes("祝福")) {
    return `可以这样写：「以${craftName}${motif}之意，把「${prompt}」的心意，绣进可以带走的祝福。」`;
  }
  return `${craftHint}承载着独特的文化寓意。结合「${prompt}」，它既能表达心意，也能延展为可分享的文创作品。`;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    prompt?: string;
    craft?: CraftId;
    motif?: string;
    question?: string;
  };

  const prompt = body.prompt || "一份祝福";
  const craft = getCraft(body.craft || "miao");
  const motif = body.motif || craft.motifs[0].name;
  const question = body.question || SUGGESTED_QUESTIONS[0];
  const fallback = localAnswer(prompt, craft.name, motif, question);
  const apiKey = process.env.BAILIAN_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ answer: fallback, source: "local", suggestions: SUGGESTED_QUESTIONS });
  }

  try {
    const response = await fetch(
      process.env.BAILIAN_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: process.env.BAILIAN_MODEL || "qwen-plus",
          messages: [
            {
              role: "system",
              content:
                "你是非遗文创策展人，熟悉中国非遗工艺与纹样寓意。用户正在创作文创作品，请用简洁、可信、有文化温度的中文回答，控制在120字以内，给出可落地的建议。",
            },
            {
              role: "user",
              content: `工艺：${craft.name}\n纹样：${motif}（${craft.motifs.find((m) => m.name === motif)?.meaning || ""}）\n主题：${prompt}\n问题：${question}`,
            },
          ],
          temperature: 0.7,
        }),
      }
    );
    if (!response.ok) throw new Error("bailian failed");
    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content?.trim();
    if (!answer) throw new Error("empty");
    return NextResponse.json({ answer, source: "bailian", suggestions: SUGGESTED_QUESTIONS });
  } catch {
    return NextResponse.json({ answer: fallback, source: "local-fallback", suggestions: SUGGESTED_QUESTIONS });
  }
}

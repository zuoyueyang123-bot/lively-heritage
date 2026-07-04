import type { CraftId } from "./types";

/**
 * 创作场景模板：一键填好"主题 + 工艺 + 母题"，降低创作门槛，
 * 同时为平台提供可直接体验的丰富内容入口（服务"创意生成"主线）。
 */
export type SceneTemplate = {
  id: string;
  label: string;
  emoji: string;
  prompt: string;
  craft: CraftId;
  motifIndex: number;
  desc: string;
};

export const sceneTemplates: SceneTemplate[] = [
  { id: "graduation", label: "毕业祝福", emoji: "🎓", prompt: "送给挚友的毕业祝福", craft: "miao", motifIndex: 0, desc: "苗绣蝶母纹 · 生命蜕变与前程" },
  { id: "spring", label: "新春窗花", emoji: "🧧", prompt: "新春家宴的团圆窗花", craft: "paperCut", motifIndex: 0, desc: "剪纸生命树 · 阖家繁盛" },
  { id: "wedding", label: "婚礼请柬", emoji: "💍", prompt: "洱海边的一场婚礼请柬", craft: "tieDye", motifIndex: 0, desc: "扎染洱海月 · 圆满与陪伴" },
  { id: "city", label: "城市文创", emoji: "🏙️", prompt: "城市文旅开幕纪念礼", craft: "jingtai", motifIndex: 0, desc: "景泰蓝缠枝莲 · 华彩庄重" },
  { id: "jiangnan", label: "江南伴手礼", emoji: "🌊", prompt: "江南水乡文创伴手礼", craft: "bluePrint", motifIndex: 0, desc: "蓝印凤穿牡丹 · 素雅吉祥" },
  { id: "mother", label: "母亲节礼", emoji: "🌷", prompt: "母亲节的一句感恩", craft: "miao", motifIndex: 1, desc: "苗绣龙纹 · 守护与安宁" },
  { id: "national", label: "国礼锦盒", emoji: "🎁", prompt: "赠予贵宾的国礼纪念", craft: "yunjin", motifIndex: 0, desc: "云锦妆花团龙 · 尊贵华彩" },
  { id: "tea", label: "茶器礼盒", emoji: "🍵", prompt: "送给茶友的雅致茶器", craft: "qinghua", motifIndex: 0, desc: "青花缠枝莲 · 清雅隽永" },
];

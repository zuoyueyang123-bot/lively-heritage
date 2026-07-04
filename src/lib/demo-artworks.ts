import { getCraft } from "./heritage";
import type { Artwork, CraftId } from "./types";

export function buildNarrative(prompt: string, craftId: CraftId) {
  const craft = getCraft(craftId);
  const motif = craft.motifs[0];
  return {
    symbol: motif.name,
    meaning: motif.meaning,
    scenario: `${prompt || "当代祝福"}适合延展为${craft.products.slice(0, 3).join("、")}。`,
    value: `同一套${craft.name}纹样可同步生成 3D 贴图、产品 mockup、壁纸、海报和分享页。`,
    slogan: `把「${prompt || "祝福"}」炼成${craft.name}文创作品`,
  };
}

export function createArtwork(input: {
  prompt: string;
  craft: CraftId;
  patternImage: string;
  narrative?: Artwork["narrative"];
}): Artwork {
  const craft = getCraft(input.craft);
  const stamp = Date.now().toString(36);
  const slug = `${input.craft}-${stamp}`;
  return {
    id: crypto.randomUUID(),
    slug,
    title: `${craft.name}文创提案`,
    prompt: input.prompt || "送给朋友的一份祝福",
    craft: input.craft,
    craftName: craft.name,
    palette: craft.palette,
    patternImage: input.patternImage,
    narrative: input.narrative || buildNarrative(input.prompt, input.craft),
    createdAt: new Date().toISOString(),
  };
}

function makeDemo(
  id: string,
  slug: string,
  prompt: string,
  craft: CraftId,
  daysAgo: number
): Artwork {
  const craftData = getCraft(craft);
  return {
    id,
    slug,
    title: `${craftData.name}文创提案`,
    prompt,
    craft,
    craftName: craftData.name,
    palette: craftData.palette,
    patternImage: "",
    narrative: buildNarrative(prompt, craft),
    createdAt: new Date(DEMO_BASE_TIME - daysAgo * 86400000).toISOString(),
  };
}

const DEMO_BASE_TIME = Date.UTC(2026, 6, 3, 8, 0, 0);

export const demoArtworks: Artwork[] = [
  makeDemo("demo-miao", "demo-miao-blessing", "送给挚友的毕业祝福", "miao", 0),
  makeDemo("demo-jingtai", "demo-jingtai-city", "城市文旅开幕纪念礼", "jingtai", 1),
  makeDemo("demo-tiedye", "demo-tiedye-moon", "洱海边的一场婚礼请柬", "tieDye", 2),
  makeDemo("demo-papercut", "demo-papercut-spring", "新春家宴的团圆窗花", "paperCut", 3),
  makeDemo("demo-blueprint", "demo-blueprint-jiangnan", "江南水乡文创伴手礼", "bluePrint", 4),
  makeDemo("demo-miao-festival", "demo-miao-festival", "苗年节庆典主视觉", "miao", 5),
];

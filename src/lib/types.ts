export type CraftId =
  | "miao"
  | "jingtai"
  | "tieDye"
  | "paperCut"
  | "bluePrint"
  | "yunjin"
  | "kesi"
  | "qinghua"
  | "nianhua"
  | "shadowPlay"
  | "thangka";

/** 生成算法家族：新工艺复用最接近的基础算法 */
export type RenderStyle = "miao" | "jingtai" | "tieDye" | "paperCut" | "bluePrint";
export type ShowroomKind =
  | "vase"
  | "hoop"
  | "fabric"
  | "cloisonne"
  | "pouch"
  | "lantern";

export type Inheritor = {
  name: string;
  title: string;
  origin: string;
  story: string;
  honor?: string;
};

export type ProcessStep = {
  step: string;
  detail: string;
};

export type HeritageCraft = {
  id: CraftId;
  name: string;
  pinyin: string;
  origin: string;
  tagline: string;
  level: string;
  status: string;
  history: string;
  palette: string[];
  motifs: { name: string; meaning: string; story: string }[];
  features: string[];
  process: ProcessStep[];
  inheritor: Inheritor;
  products: string[];
  /** 生成算法家族，决定用哪套 Canvas 算法绘制 */
  render: RenderStyle;
  /** 3D 展厅载体类型 */
  showroom: ShowroomKind;
};

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  prompt: string;
  craft: CraftId;
  craftName: string;
  palette: string[];
  patternImage: string;
  narrative: {
    symbol: string;
    meaning: string;
    scenario: string;
    value: string;
    slogan: string;
  };
  createdAt: string;
};

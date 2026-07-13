"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { generatePattern, type CraftAlgorithm } from "@/lib/pattern-engine";

type PatternKind = "miao" | "cloisonne";

type ModelDef = {
  key: string;
  url?: string; // GLB/GLTF 路径（程序化模型不需要）
  label: string;
  category: string;
  license: "CC0" | "CC-BY 3.0" | "程序生成" | "内部使用/混元3D";
  credit: string;
  uvWrap?: boolean;
  noUV?: boolean;
  draco?: boolean;
  realTexture?: boolean;
  procedural?: string; // 程序化几何类型: "bangle" | "disc"
};

// ═══════════════════════════════════════════
// 模型清单
// ═══════════════════════════════════════════
const MODELS: ModelDef[] = [
  // ── 真实非遗文物（CC0 馆藏扫描件，自包含 .glb）──
  {
    key: "cloisonne",
    url: "/models/heritage/cloisonne/cloisonne.glb",
    label: "🏺 景泰蓝·真实馆藏",
    category: "非遗展品",
    license: "CC0",
    credit:
      "18th C Chinese Cloisonne Vase, Minneapolis Institute of Art (CC0)",
    realTexture: true,
  },
  {
    key: "xianglu",
    url: "/models/heritage/xianglu_tc.glb",
    label: "🔥 西汉青铜博山炉·混元生成",
    category: "青铜礼器",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  {
    key: "miao_attire",
    url: "/models/heritage/miao_attire_tc.glb",
    label: "👗 苗族传统盛装·混元生成",
    category: "非遗服饰",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },

  // ── 真·手镯（真实免费可商用 3D 模型，已下载）──
  {
    key: "bracelet",
    url: "/models/products/bracelet_poly.glb",
    label: "⭕ 真·手镯",
    category: "首饰",
    license: "CC0",
    credit: "Pearl Bracelet by Armory_3D (Poly Pizza, CC0)",
  },

  // ── 真实 3D 模型 ──
  {
    key: "silver_bangle",
    url: "/models/products/bracelet_poly.glb",
    label: "⭕ 银手镯·真实模型",
    category: "首饰",
    license: "CC0",
    credit: "Pearl Bracelet by Armory_3D (Poly Pizza, CC0)",
    realTexture: true,
  },
  {
    key: "jade_disc",
    url: "/models/products/jade_disc_tc.glb",
    label: "🧊 玉璧·混元生成",
    category: "非遗器物",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },

  // ── 白模/生活用品（Poly Pizza / Khronos）──
  {
    key: "vase",
    url: "/models/products/vase.glb",
    label: "景泰蓝纹样·白模",
    category: "展品",
    license: "CC-BY 3.0",
    credit: "Vase by Poly Pizza",
  },
  {
    key: "pouch_tc",
    url: "/models/products/pouch_tc.glb",
    label: "🪡 苗绣荷包·混元生成",
    category: "生活用品",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  // {
  //   key: "bag_laptop",
  //   url: "/models/products/bag_laptop.glb",
  //   label: "💼 文创包",
  //   category: "生活用品",
  //   license: "CC-BY 3.0",
  //   credit: "Laptop bag by Poly by Google",
  //   noUV: true,
  // },
  // {
  //   key: "bag_quaternius",
  //   url: "/models/products/bag_quaternius.glb",
  //   label: "🎒 背包",
  //   category: "生活用品",
  //   license: "CC-BY 3.0 / CC0",
  //   credit: "Bag by Quaternius",
  //   noUV: true,
  // },
  // {
  //   key: "backpack",
  //   url: "/models/products/backpack.glb",
  //   label: "文创帆布包",
  //   category: "生活用品",
  //   license: "CC0",
  //   credit: "Backpack by Poly Pizza",
  //   // 当前文件实际是人体角色模型（CharacterArmature），与标签严重不符，已下线
  // },
  {
    key: "mug",
    url: "/models/products/mug.glb",
    label: "陶瓷杯",
    category: "生活用品",
    license: "CC-BY 3.0",
    credit: "Mug by Poly Pizza",
    uvWrap: true,
  },
  {
    key: "ring",
    url: "/models/products/ring.glb",
    label: "戒指(Poly)",
    category: "首饰",
    license: "CC-BY 3.0",
    credit: "Ring by Poly Pizza",
    noUV: true,
  },
  {
    key: "tshirt",
    url: "/models/products/tshirt.glb",
    label: "T恤",
    category: "衣物",
    license: "CC-BY 3.0",
    credit: "T-shirt by Poly Pizza",
    noUV: true,
  },
  // {
  //   key: "shoe",
  //   url: "/models/life/shoe_poly.glb",
  //   label: "绣品载体·鞋",
  //   category: "衣物",
  //   license: "CC-BY 3.0",
  //   credit: "Sneaker by Poly by Google",
  //   noUV: true,
  //   // 当前模型是黑色运动鞋，贴苗绣效果丑，已下线；如需保留鞋类需找更好素材
  // },
  {
    key: "chair",
    url: "/models/life/SheenChair.glb",
    label: "家具·椅",
    category: "生活用品",
    license: "CC0",
    credit: "SheenChair by Khronos",
  },
  {
    key: "dish",
    url: "/models/life/dish_poly.glb",
    label: "餐具盘",
    category: "生活用品",
    license: "CC-BY 3.0",
    credit: "Dish by Poly by Google",
  },
  {
    key: "lantern_hunyuan",
    url: "/models/products/lantern_hunyuan.glb",
    label: "🏮 灯笼·混元生成",
    category: "展品",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  // {
  //   key: "lantern_khronos",
  //   url: "/models/products/lantern_khronos.glb",
  //   label: "🏮 灯笼·真实PBR",
  //   category: "展品",
  //   license: "CC0",
  //   credit: "Lantern by Khronos glTF Sample Models (CC0)",
  //   realTexture: true,
  // },
  // {
  //   key: "lantern",
  //   url: "/models/showroom/lantern_poly.glb",
  //   label: "灯笼",
  //   category: "展品",
  //   license: "CC-BY 3.0",
  //   credit: "Lantern by Poly by Google",
  //   // 当前模型实际是棕榈树，与灯笼不符，已下线
  // },
  {
    key: "winepot_tc",
    url: "/models/products/winepot_tc.glb",
    label: "🍶 酒壶·混元生成",
    category: "生活用品",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  // {
  //   key: "bottle_khronos",
  //   url: "/models/products/bottle_khronos.glb",
  //   label: "🍶 水壶·真实PBR",
  //   category: "生活用品",
  //   license: "CC0",
  //   credit: "WaterBottle by Khronos glTF Sample Models (CC0)",
  //   realTexture: true,
  // },
  // {
  //   key: "bottle_milk",
  //   url: "/models/life/bottle_milk.glb",
  //   label: "🥛 水壶·奶罐",
  //   category: "生活用品",
  //   license: "CC-BY 3.0",
  //   credit: "Jug of milk by Poly by Google",
  //   // 下半部无 UV，贴图显示不全，已换香槟瓶
  // },
  // {
  //   key: "bottle",
  //   url: "/models/life/bottle_poly.glb",
  //   label: "水壶",
  //   category: "生活用品",
  //   license: "CC-BY 3.0",
  //   credit: "Water bottle by Poly by Google",
  // },
];

// ═══════════════════════════════════════════
// 纹样生成：复用 pattern-engine.ts
// ═══════════════════════════════════════════
function makeFinePattern(kind: PatternKind): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const craft: CraftAlgorithm = kind === "cloisonne" ? "jingtai" : "miao";
  const palette =
    kind === "cloisonne"
      ? ["#0e2f6b", "#c8352b", "#e8c66a", "#f3e6c8"]
      : ["#b9362d", "#2f9e8f", "#e8c66a", "#f3e6c8"];
  const prompt = kind === "cloisonne" ? "景泰蓝缠枝纹" : "苗绣几何纹";

  generatePattern(canvas, craft, prompt, palette, 1.0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(kind === "cloisonne" ? 2 : 1, kind === "cloisonne" ? 2 : 1);
  tex.anisotropy = 8;
  return tex;
}

// ═══════════════════════════════════════════
// UV 兜底：为无 TEXCOORD_0 的模型生成 UV
// ═══════════════════════════════════════════
function ensureUV(geo: THREE.BufferGeometry) {
  if (geo.attributes.uv) return;
  const pos = geo.attributes.position;
  if (!pos) return;
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  if (!bb) return;
  const sizeVec = new THREE.Vector3();
  bb.getSize(sizeVec);
  const dims = (["x", "y", "z"] as const)
    .map((k) => ({ k, v: sizeVec[k] }))
    .sort((a, b) => b.v - a.v);
  const [a0, a1] = [dims[0].k, dims[1].k];
  const get = (axis: "x" | "y" | "z", i: number) =>
    axis === "x" ? pos.getX(i) : axis === "y" ? pos.getY(i) : pos.getZ(i);
  const len0 = sizeVec[a0] || 1;
  const len1 = sizeVec[a1] || 1;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (get(a0, i) - bb.min[a0]) / len0;
    uv[i * 2 + 1] = (get(a1, i) - bb.min[a1]) / len1;
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
}

// ═══════════════════════════════════════════
// 错误回退组件
// ═══════════════════════════════════════════
function ErrorFallback({ name }: { name: string }) {
  return (
    <mesh>
      <boxGeometry args={[1, 1.5, 0.1]} />
      <meshStandardMaterial color="#ff3333" transparent opacity={0.5} />
    </mesh>
  );
}

// ═══════════════════════════════════════════
// 错误边界：捕获 GLTF 加载/解析异常，避免整个画布崩溃
// （注意：useGLTF 是挂起式 hook，不能包在 try/catch 里，
//  必须用错误边界来兜底加载失败）
// ═══════════════════════════════════════════
class ModelErrorBoundary extends Component<
  { children: ReactNode; name: string },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error("[webgl-demo] 模型加载失败:", error);
  }
  render() {
    if (this.state.hasError) {
      return <ErrorFallback name={this.props.name} />;
    }
    return this.props.children;
  }
}

// ═══════════════════════════════════════════
// GLB 模型加载器（正确用法：useGLTF 直接挂起，错误由边界捕获）
// ═══════════════════════════════════════════
function GLBModel({ def, pattern }: { def: ModelDef; pattern: PatternKind }) {
  const result = useGLTF(def.url!, def.draco ?? false);
  const scene = result.scene as THREE.Group | THREE.Scene;

  const applyPattern = !def.realTexture;
  const texture = useMemo(
    () => (applyPattern ? makeFinePattern(pattern) : null),
    [pattern, applyPattern],
  );
  useEffect(() => () => texture?.dispose(), [texture]);

  const object = useMemo(() => {
    try {
      const root = scene.clone(true);

      const box = new THREE.Box3().setFromObject(root);
      const sizeVec = new THREE.Vector3();
      box.getSize(sizeVec);
      const maxDim = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) || 1;
      const scale = 2.2 / maxDim;
      const center = new THREE.Vector3();
      box.getCenter(center);

      root.scale.setScalar(scale);
      root.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale,
      );

      root.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh) return;
        ensureUV(mesh.geometry);
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        mats.forEach((mat) => {
          const std = mat as THREE.MeshStandardMaterial;
          const nm = std.clone();
          if (applyPattern) {
            nm.map = texture;
            if (def.uvWrap) {
              texture!.wrapS = THREE.RepeatWrapping;
              texture!.wrapT = THREE.RepeatWrapping;
            }
            if (def.key === "vase") {
              nm.metalness = 0.4;
              nm.roughness = 0.3;
            } else {
              nm.metalness = 0.12;
              nm.roughness = 0.62;
            }
            // 用纹样完全覆盖原始外观：清除会压暗/干扰的贴图
            nm.aoMap = null;
            nm.roughnessMap = null;
            nm.metalnessMap = null;
            nm.normalMap = null;
            nm.normalScale = new THREE.Vector2(1, 1);
            nm.emissiveMap = null;
            nm.emissive = new THREE.Color(0x000000);
            // 若原始底色太暗，自动提亮为白底
            const c = std.color;
            const brightness = (c.r + c.g + c.b) / 3;
            if (brightness < 0.45) {
              nm.color = new THREE.Color(0xffffff);
            }
          }
          mesh.material = nm;
        });
      });
      return root;
    } catch (e) {
      console.error(`[webgl-demo] 处理模型 ${def.key} 出错:`, e);
      return new THREE.Group();
    }
  }, [scene, texture, def]);

  return <primitive object={object} />;
}

// ═══════════════════════════════════════════
// 统一模型选择器
// ═══════════════════════════════════════════
function Model({ def, pattern }: { def: ModelDef; pattern: PatternKind }) {
  return <GLBModel def={def} pattern={pattern} />;
}

function SpinningModel({ def, pattern }: { def: ModelDef; pattern: PatternKind }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current && !def.procedural) {
      ref.current.rotation.y += delta * 0.3;
    }
  });
  return (
    <group ref={ref}>
      <ModelErrorBoundary name={def.label}>
        <Model def={def} pattern={pattern} />
      </ModelErrorBoundary>
    </group>
  );
}

// ═══════════════════════════════════════════
// UI 常量
// ═══════════════════════════════════════════
const btnBase =
  "rounded-full border px-3 py-1.5 text-xs font-bold transition-colors";
const btnIdle = `${btnBase} border-[var(--line)] text-[var(--foreground-dim)] hover:border-[var(--gold)]`;
const btnActive = `${btnBase} border-[var(--gold)] bg-[var(--gold)]/15 text-[var(--gold)]`;

// ═══════════════════════════════════════════
// 主组件
// ═══════════════════════════════════════════
export function WebglDemo() {
  // 默认显示真实景泰蓝馆藏（CC0 自包含 glb，已修复加载）
  const [key, setKey] = useState("cloisonne");
  const [pattern, setPattern] = useState<PatternKind>("cloisonne");
  const def = MODELS.find((m) => m.key === key) ?? MODELS[0];

  return (
    <div className="relative">
      {/* 3D 画布 */}
      <div className="relative h-[520px] overflow-hidden rounded-[28px] border border-[var(--line)] bg-[#101625]">
        <Canvas
          frameloop="always"
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.4, 4.4], fov: 42 }}
          gl={{ antialias: false, powerPreference: "low-power" }}
        >
          <color attach="background" args={["#101625"]} />
          <ambientLight intensity={1.2} />
          <directionalLight position={[3, 4, 4]} intensity={2.4} />
          <directionalLight position={[-4, 1, -2]} intensity={0.6} />
          <Suspense
            fallback={
              <mesh>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="#333" wireframe />
              </mesh>
            }
          >
            <SpinningModel def={def} pattern={pattern} key={key} />
          </Suspense>
          <OrbitControls enablePan={false} minDistance={2} maxDistance={8} />
        </Canvas>
        <div className="pointer-events-none absolute left-5 top-5 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white/80 backdrop-blur">
          {def.procedural
            ? "程序化几何 · 纹样实时贴图"
            : "真实 GLB · 自动归一化 · 纹样实时贴图"}
        </div>
      </div>

      {/* 纹样切换（非真实纹理模型可用） */}
      {!def.realTexture && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-black text-[var(--foreground-dim)]">纹样</span>
          <button
            className={pattern === "cloisonne" ? btnActive : btnIdle}
            onClick={() => setPattern("cloisonne")}
          >
            景泰蓝缠枝
          </button>
          <button
            className={pattern === "miao" ? btnActive : btnIdle}
            onClick={() => setPattern("miao")}
          >
            苗绣几何
          </button>
        </div>
      )}

      {/* 模型选择按钮 */}
      <div className="mt-3 flex flex-wrap gap-2">
        {MODELS.map((m) => (
          <button
            key={m.key}
            className={key === m.key ? btnActive : btnIdle}
            onClick={() => setKey(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 信息面板 */}
      <div className="mt-3 rounded-2xl border border-[var(--line)] bg-white/5 p-4 text-sm">
        {def.procedural ? (
          <div className="font-bold text-[#a78bfa]">
            ◈ 程序化几何体（Torus/Cylinder）：无需下载外部文件，直接在 GPU 上生成。
            可实时切换苗绣/景泰蓝纹样，展示「非遗纹样 + 载体器物」的核心概念。
            后续可替换为同形状的真实扫描件。
          </div>
        ) : def.realTexture ? (
          <div className="font-bold text-[#7fd1a8]">
            ✦ 保留原始 PBR 材质：不叠加生成纹样。包括真实馆藏扫描件与混元3D生成的精模。
          </div>
        ) : def.noUV ? (
          <div className="font-bold text-[#e0b15a]">
            ⚠ 该模型原始无 UV 坐标，已用程序化 UV（按包围盒最大两轴平面/环绕映射）兜底，纹样可显示但接缝可能不完美。
          </div>
        ) : (
          <div className="text-[var(--foreground-dim)]">
            纹样贴图已应用
            {def.uvWrap
              ? "（UV 越界处自动 RepeatWrapping，连续纹样重复自然）"
              : ""}
            。
          </div>
        )}
        <div className="mt-2 text-xs text-[var(--foreground-muted)]">
          来源：{def.credit} · 授权 {def.license}
          {def.license === "CC-BY 3.0"
            ? "（须署名，已在此标注）"
            : def.license === "CC0"
              ? "（可商用免署名）"
              : def.license === "内部使用/混元3D"
                ? "（腾讯混元3D内部生成，本 demo 中可展示）"
                : ""}
          {def.draco ? " · Draco 压缩" : ""}
        </div>
      </div>
    </div>
  );
}

useGLTF.preload("/models/products/vase.glb");
useGLTF.preload("/models/products/bracelet_poly.glb");
useGLTF.preload("/models/heritage/cloisonne/cloisonne.glb");
useGLTF.preload("/models/products/lantern_hunyuan.glb");
useGLTF.preload("/models/products/winepot_tc.glb");
useGLTF.preload("/models/products/pouch_tc.glb");
useGLTF.preload("/models/products/bracelet_poly.glb");
useGLTF.preload("/models/products/jade_disc_tc.glb");
useGLTF.preload("/models/heritage/xianglu_tc.glb");
useGLTF.preload("/models/heritage/miao_attire_tc.glb");

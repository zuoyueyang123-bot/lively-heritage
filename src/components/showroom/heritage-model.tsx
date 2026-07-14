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
import { ShowroomScene } from "@/components/showroom/showroom-scene";

type PatternKind = "miao" | "cloisonne";

export type ModelDef = {
  key: string;
  url?: string; // GLB 路径；真文物/白模都走真实 WebGL
  label: string;
  category: string;
  license: "CC0" | "CC-BY 3.0" | "程序生成" | "内部使用/混元3D";
  credit: string;
  uvWrap?: boolean;
  noUV?: boolean;
  draco?: boolean;
  realTexture?: boolean;
  procedural?: string;
};

// 主平台内置真实 GLB（只挑内部展示要用的，避免 demo 那套大清单）
const BUILTIN: Record<string, ModelDef> = {
  cloisonne: {
    key: "cloisonne",
    url: "/models/heritage/cloisonne/cloisonne.glb",
    label: "景泰蓝·真实馆藏",
    category: "非遗展品",
    license: "CC0",
    credit: "18th C Chinese Cloisonne Vase, Minneapolis Institute of Art (CC0)",
    realTexture: true,
  },
  silver_bangle: {
    key: "silver_bangle",
    url: "/models/products/bracelet_poly.glb",
    label: "银手镯·真实模型",
    category: "首饰",
    license: "CC0",
    credit: "Pearl Bracelet by Armory_3D (Poly Pizza, CC0)",
    realTexture: true,
  },
  lantern: {
    key: "lantern",
    url: "/models/products/lantern_hunyuan.glb",
    label: "灯笼·混元生成",
    category: "展品",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  winepot: {
    key: "winepot",
    url: "/models/products/winepot_tc.glb",
    label: "酒壶·混元生成",
    category: "生活用品",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  pouch: {
    key: "pouch",
    url: "/models/products/pouch_tc.glb",
    label: "苗绣荷包·混元生成",
    category: "生活用品",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  jade_disc: {
    key: "jade_disc",
    url: "/models/products/jade_disc_tc.glb",
    label: "玉璧·混元生成",
    category: "礼器",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  xianglu: {
    key: "xianglu",
    url: "/models/heritage/xianglu_tc.glb",
    label: "西汉青铜博山炉·混元生成",
    category: "青铜礼器",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  miao_attire: {
    key: "miao_attire",
    url: "/models/heritage/miao_attire_tc.glb",
    label: "苗族传统盛装·混元生成",
    category: "非遗服饰",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  qinghua: {
    key: "qinghua",
    url: "/models/heritage/qinghua_tc.glb",
    label: "青花瓷·混元生成",
    category: "陶瓷",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  shadow: {
    key: "shadow",
    url: "/models/heritage/shadow_tc.glb",
    label: "皮影影人·混元生成",
    category: "皮影",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  thangka: {
    key: "thangka",
    url: "/models/heritage/thangka_tc.glb",
    label: "唐卡·混元生成",
    category: "唐卡",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  tiedye: {
    key: "tiedye",
    url: "/models/heritage/tiedye_tc.glb",
    label: "扎染·混元生成",
    category: "扎染",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  blueprint: {
    key: "blueprint",
    url: "/models/heritage/blueprint_tc.glb",
    label: "蓝印花布·混元生成",
    category: "蓝印花布",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  yunjin: {
    key: "yunjin",
    url: "/models/heritage/yunjin_tc.glb",
    label: "南京云锦·混元生成",
    category: "云锦",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },
  nianhua: {
    key: "nianhua",
    url: "/models/heritage/nianhua_tc.glb",
    label: "杨柳青年画·混元生成",
    category: "年画",
    license: "内部使用/混元3D",
    credit: "腾讯混元3D图生3D生成（Hunyuan 3D）",
    realTexture: true,
  },
};

// 供 3D 数字藏品馆 等页面复用，集中展示全部真实 GLB
export const BUILTIN_MODELS = Object.values(BUILTIN);

// variant → 真实 GLB key；无对应真实模型的 variant（绣绷/挂布是平面织物，无免费 3D 源）走 CSS 3D 兜底
const VARIANT_TO_KEY: Record<string, string> = {
  cloisonne: "cloisonne",
  lantern: "lantern",
  winepot: "winepot",
  pouch: "pouch",
  xianglu: "xianglu",
  miao_attire: "miao_attire",
  qinghua: "qinghua",
  shadow: "shadow",
  thangka: "thangka",
  tiedye: "tiedye",
  blueprint: "blueprint",
  yunjin: "yunjin",
  nianhua: "nianhua",
  hoop: "",
  fabric: "",
};

// ── 纹样生成：复用 pattern-engine（与 demo 一致）──
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
  tex.repeat.set(2, 2);
  tex.anisotropy = 8;
  return tex;
}

// ── 纹样纹理 hook：优先用外部生成图(textureUrl，用户作品)，否则程序化生成 ──
function usePatternTexture(
  textureUrl: string | undefined,
  pattern: PatternKind,
  applyPattern: boolean,
): THREE.Texture | null {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    if (!applyPattern) {
      setTex(null);
      return;
    }
    let cancelled = false;
    let created: THREE.Texture | null = null;
    if (textureUrl) {
      new THREE.TextureLoader().load(textureUrl, (t) => {
        if (cancelled) return;
        t.colorSpace = THREE.SRGBColorSpace;
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(2, 2);
        t.anisotropy = 8;
        created = t;
        setTex(t);
      });
    } else {
      const t = makeFinePattern(pattern);
      created = t;
      if (!cancelled) setTex(t);
    }
    return () => {
      cancelled = true;
      created?.dispose();
    };
  }, [textureUrl, pattern, applyPattern]);
  return tex;
}

// ── UV 兜底：为无 TEXCOORD_0 的模型生成 UV ──
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

// ── 错误边界：捕获 GLTF 加载/解析异常，触发外层降级回 CSS 3D ──
// （useGLTF 是挂起式 hook，不能包在 try/catch；必须用错误边界）
class ModelErrorBoundary extends Component<
  { children: ReactNode; name: string; onError?: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.error("[heritage-model] 模型加载失败，降级 CSS 3D:", error);
    this.props.onError?.();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ── GLB 模型加载器（正确用法：useGLTF 直接挂起，错误由边界捕获）──
function GLBModel({
  def,
  textureUrl,
  pattern,
}: {
  def: ModelDef;
  textureUrl?: string;
  pattern: PatternKind;
}) {
  const result = useGLTF(def.url!, def.draco ?? false);
  const scene = result.scene as THREE.Group | THREE.Scene;

  const applyPattern = !def.realTexture;
  const texture = usePatternTexture(textureUrl, pattern, applyPattern);

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
          if (applyPattern && texture) {
            nm.map = texture;
            if (def.uvWrap) {
              texture.wrapS = THREE.RepeatWrapping;
              texture.wrapT = THREE.RepeatWrapping;
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
      console.error(`[heritage-model] 处理模型 ${def.key} 出错:`, e);
      return new THREE.Group();
    }
  }, [scene, texture, def]);

  return <primitive object={object} />;
}

// ── 自转包裹（hero 自动转，详情页可拖）──
function SpinningModel({
  def,
  textureUrl,
  pattern,
  spin,
}: {
  def: ModelDef;
  textureUrl?: string;
  pattern: PatternKind;
  spin: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current && spin) ref.current.rotation.y += delta * 0.3;
  });
  return (
    <group ref={ref}>
      <GLBModel def={def} textureUrl={textureUrl} pattern={pattern} />
    </group>
  );
}

// ═══════════════════════════════════════════
// 公共组件：真 WebGL 3D，失败时降级 CSS 3D
// ═════════════════════════════════════════
export function HeritageModel3D({
  modelKey,
  textureUrl,
  pattern = "cloisonne",
  variant = "vase",
  className = "h-[420px]",
  enableControls = false,
}: {
  modelKey?: string;
  textureUrl?: string;
  pattern?: PatternKind;
  variant?:
    | "vase"
    | "hoop"
    | "fabric"
    | "cloisonne"
    | "lantern"
    | "winepot"
    | "pouch"
    | "bracelet"
  | "xianglu"
  | "miao_attire"
  | "qinghua"
  | "shadow"
  | "thangka"
  | "tiedye"
  | "blueprint"
  | "yunjin"
  | "nianhua";
  className?: string;
  enableControls?: boolean;
}) {
  const resolvedKey = modelKey ?? VARIANT_TO_KEY[variant] ?? "";
  const def = resolvedKey ? BUILTIN[resolvedKey] : undefined;
  const [failed, setFailed] = useState(false);

  // WebGL 支持检测：首帧默认 true 避免 SSR/CSR 结构不一致，
  // 客户端 mount 后再确认；不支持时降级到 CSS 3D。
  const [webglOk, setWebglOk] = useState(true);
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebglOk(
        !!(
          c.getContext("webgl2") ||
          c.getContext("webgl") ||
          c.getContext("experimental-webgl")
        ),
      );
    } catch {
      setWebglOk(false);
    }
  }, []);

  // 降级条件：不支持 WebGL / 无对应真实 GLB / 运行时加载失败
  const useFallback = !webglOk || !def || failed;

  if (useFallback) {
    return (
      <ShowroomScene
        variant={variant}
        textureUrl={textureUrl || undefined}
        className={className}
        showDownload={false}
      />
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[#101625] ${className}`}
    >
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
          <ModelErrorBoundary name={def.label} onError={() => setFailed(true)}>
            <SpinningModel
              def={def}
              textureUrl={textureUrl}
              pattern={pattern}
              spin={!enableControls}
            />
          </ModelErrorBoundary>
        </Suspense>
        {enableControls && (
          <OrbitControls enablePan={false} minDistance={2} maxDistance={8} />
        )}
      </Canvas>
      <div className="pointer-events-none absolute left-5 top-5 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white/80 backdrop-blur">
        {def.realTexture ? "真实馆藏 · CC0" : "真实 GLB · 纹样实时上物"}
      </div>
    </div>
  );
}

// 预加载常用模型，加速首屏
useGLTF.preload("/models/heritage/cloisonne/cloisonne.glb");
useGLTF.preload("/models/products/bracelet_poly.glb");
useGLTF.preload("/models/products/lantern_hunyuan.glb");
useGLTF.preload("/models/products/winepot_tc.glb");
useGLTF.preload("/models/products/pouch_tc.glb");
useGLTF.preload("/models/products/jade_disc_tc.glb");
useGLTF.preload("/models/heritage/xianglu_tc.glb");
useGLTF.preload("/models/heritage/miao_attire_tc.glb");
useGLTF.preload("/models/heritage/nianhua_tc.glb");

# 非遗 3D 模型获取指南

> 更新时间：2026-07-09
> 状态：丑模型已清理；灯笼/酒壶/荷包/玉璧为腾讯混元3D生成精模（酒壶/荷包/玉璧为图生3D，灯笼为文生3D）；银手镯改回复用 Poly Pizza 真实模型 `bracelet_poly.glb`（CC0，货不对板的混元版已弃用）；原程序化几何体（银手镯/玉璧 Torus/Cylinder）已移除；真·苗绣源已确认存在，待导出

## ✅ 已完成（立即可用）

### 1. 真·手镯 (bracelet) — 真实免费可商用 3D 模型
- **来源**：Poly Pizza — "Pearl Bracelet" by Armory_3D（**CC0，免登录直下**）
- **文件**：`public/models/products/bracelet_poly.glb`（168KB，`glTF` 合法）
- **下载方式**：`https://poly.pizza/m/9zb8mXYP6J` → 页面内提取 `static.poly.pizza/...glb` 直链
- **状态**：✅ 已集成到 webgl-demo.tsx（标签「⭕ 真·手镯」），可叠加景泰蓝/苗绣纹样
- **证明**：真实免费可商用「手镯/手环」3D 源确实存在，已落地

### 2. 银手镯 (silver_bangle → bracelet_poly)
- **来源**：复用既有 Poly Pizza 真实手镯模型（「Pearl Bracelet」by Armory_3D，CC0）
- **文件**：`public/models/products/bracelet_poly.glb`（168KB）
- **状态**：✅ 已集成到 webgl-demo.tsx（标签「⭕ 银手镯·真实模型」），替换货不对板的混元生成版（`bracelet_tc.glb` 已弃用删除）
- **说明**：真实免费可商用 3D 源，无需消耗 AI 额度；混元版因"货不对板"弃用

### 3. 玉璧 (jade_disc → jade_disc_tc)
- **来源**：腾讯混元3D专业版（Hunyuan 3D Pro）**图生3D** + PBR
- **参考图**：`.verify/Product_photography__centered__2026-07-09T10-07-46.png`（深色背景+软光+青玉玉璧）
- **文件**：`public/models/products/jade_disc_tc.glb`（4.4MB，已优化；原始 24.8MB 备份为 `jade_disc_tc_src.glb`）
- **状态**：✅ 已集成到 webgl-demo.tsx（标签「🧊 玉璧·混元生成」），替换原程序化 CylinderGeometry
- **优化**：同上

### 4. 景泰蓝花瓶 (cloisonne)
- **来源**：Minneapolis Institute of Art via Sketchfab (CC0)
- **状态**：✅ 已转为自包含 `cloisonne.glb`（11.6MB，纹理内嵌），默认展示
- **修复**：重写加载层，用错误边界（ErrorBoundary）替代 try/catch 包 useGLTF（原写法违反 Hooks 规则导致默认模型崩溃）

### 5. 中式红灯笼 (lantern_hunyuan)
- **来源**：腾讯混元3D（Hunyuan 3D）文生3D + PBR
- **文件**：`public/models/products/lantern_hunyuan.glb`（6.4MB，已优化；原始 43MB 备份为 `lantern_hunyuan_src.glb`）
- **Prompt**：中国传统大红灯笼，圆球红色纸灯身，金色骨架，顶部提手，底部金色流苏，温暖内部烛光，PBR材质，高精度
- **状态**：✅ 已集成到 webgl-demo.tsx（标签「🏮 灯笼·混元生成」）与 heritage-model.tsx（variant="lantern"）
- **优化**：`gltf-transform optimize --compress false --texture-size 1024`（纹理压至 1K，无 Draco/Meshopt 扩展）

### 6. 紫砂壶/酒壶 (winepot_tc)
- **来源**：腾讯混元3D专业版（Hunyuan 3D Pro）**图生3D** + PBR
- **参考图**：`.verify/深色渐变背景_暖色聚光打在居中物体上_一把经典宜兴紫砂提梁壶_*.png`（深色背景+暖光+油润紫砂）
- **文件**：`public/models/products/winepot_tc.glb`（2.9MB，已优化；原始 19.5MB 备份为 `winepot_tc_src.glb`）
- **Prompt**：中国传统紫砂壶酒壶，圆润饱满深棕色陶土壶身，高拱提梁，短弯壶嘴，圆形小钮壶盖，圈足，油润高光，PBR材质，高精度
- **状态**：✅ 已集成到 webgl-demo.tsx（标签「🍶 酒壶·混元生成」）与 heritage-model.tsx（variant="winepot"）
- **优化**：`gltf-transform optimize --compress false --texture-size 1024`（纹理压至 1K，无 Draco/Meshopt 扩展）

### 7. 苗绣荷包/香囊 (pouch_tc)
- **来源**：腾讯混元3D专业版（Hunyuan 3D Pro）**图生3D** + PBR
- **参考图**：`.verify/纯白背景产品参考图_居中正面视角_一个中国传统刺绣香囊荷包_*.png`（白底+中国结+花鸟刺绣+流苏）
- **文件**：`public/models/products/pouch_tc.glb`（5.2MB，已优化；原始 27.3MB 备份为 `pouch_tc_src.glb`）
- **Prompt**：中国传统刺绣荷包香囊，红色锦缎圆形收口小包，顶部中国结挂绳，袋身彩色花鸟刺绣与回纹，底部金色流苏，柔软布料质感，PBR材质，高精度
- **状态**：✅ 已集成到 webgl-demo.tsx（标签「🪡 苗绣荷包·混元生成」）与 heritage-model.tsx（variant="pouch"）
- **优化**：同上

## 🎯 待下载（已确认免费可商用）

### A. Smithsonian CC0 中国文物（最高优先级）

Smithsonian 在 Sketchfab 上开放了数千件 CC0 3D 模型，包含多件中国非遗文物：

| 模型 | 年代 | Sketchfab URL | 说明 |
|------|------|---------------|------|
| **香炉 (xianglu)** | 西汉 ~BCE 2世纪 | https://sketchfab.com/3d-models/lidded-incense-burner-xianglu-6469bce920fc45abbb065eb6915d7ce4 | 金银错青铜，嵌绿松石/玛瑙，150K面 |
| **篦壶 (huo)** | 汉 | https://sketchfab.com/3d-models/lidded-ritual-ewer-huo-5298a9e660df4666b90b2800126fdb67 | 青铜器 |
| **觥 (guang)** | 汉 | https://sketchfab.com/3d-models/lidded-ritual-ewer-guang-c2898500387d40778d26d15d12809608 | 青铜酒器 |
| **方彝 (fangyi)** | 西周 ~BCE 1100 | https://3d.si.edu/object/3d/ritual-wine-container-fangyi-maskstaotie-serpents-and-birds | 兽面纹方彝，CC0 |
| **象形壶 (he)** | 西周 | https://3d.si.edu/object/3d/spouted-vessel-he-form-elephant-masks-taotie-dragons-and-snakes | 象尊，CC0 |

**下载方式**：
1. 打开上述 Sketchfab 页面
2. 点击 "Download 3D Model" 按钮
3. 选择 glTF/GLB 格式
4. 保存到 `feiyi-platform/public/models/heritage/smithsonian/`

### B. 真·苗绣/苗装（真实免费可商用 3D 源已确认存在 ✅）

> 结论：**免费可商用的「真·苗绣/苗装」3D 源确实存在**，已实测找到多个。唯一堵点是格式/账号，不是「不存在」。

#### B1. Meshy AI — Traditional Hmong Attire（**CC0，Hmong=苗**，最佳匹配）
- URL：https://www.meshy.ai/3d-models/Traditional-Hmong-Attire-v2-01961abf-53fd-74a3-a6cf-7fcabc7da742
- 实测：模型页内含 CDN 直链 `api.meshy.ai/misc/cdn-models/.../output/model.meshy`（146,042 顶点 / 292,778 面），授权 CC0（可商用免署名）
- **格式说明**：Meshy 直接分发的 `model.meshy` 是其私有二进制格式（magic=`MESHY.AI`），three.js 不能直接加载
- **转为 GLB 的方法（一键，需免费账号）**：
  1. 注册/登录 Meshy 免费账号
  2. 打开该模型页 → Download → 选 **GLB**
  3. 把下载的 `model.glb` 放到 `public/models/heritage/miao_attire.glb`
  4. 在 webgl-demo.tsx / heritage-model.tsx 添加对应条目即可
- 注：本机已抓取并保存其 `model.meshy` 与页面 JSON 到 `.verify/`（仅作取证，不能直接用）

#### B2. Sketchfab — 真实中国传统绣衣（可下载需免费 Token）
实测 API 可检索到多件真实绣衣 3D 模型（作者开放下载，部分 CC 授权）：
- `66119f1ff3e6400da5970e441a09588e` — **dress_remesh（Hmong/苗 服饰）**
- `0eb4d4a655224f21995c3825a6883f85` — 唐制红金绣襦裙（Tang Dynasty embroidery ruqun）
- `48182a1d5ada4ddeafdb7e97b0930960` — 明代群绣马面裙（Ming embroidery horse skirt）
- 下载 GLB 需 Sketchfab API Token（`GET https://api.sketchfab.com/v3/models/{uid}/download` 返回 glTF 直链）
- 获取 Token：https://sketchfab.com/developers → 免费注册即得

#### B3. 兜底（无需真实扫描件）
- 程序化「玉璧(jade_disc)」+ 苗绣纹样已可演示「纹样 + 载体」
- 真实 T 恤/束身衣(Corset, Khronos CC0) 可贴苗绣纹样当载体
- 混元3D生成的「苗绣荷包(pouch_tc)」已可直接作为苗绣类作品的真实 3D 载体

### C. Poly Pizza 手镯/首饰（免登录直下，已落地 bracelet）

- 真实手镯已下载：`bracelet_poly.glb`（见上方「✅ 已完成 1」）
- 更多：`https://poly.pizza/search/bracelet` 搜 bracelet/bangle，CC0/CC-BY 3.0，低多边形 <500KB

### D. Cults3D 手镯 STL（可转 GLB）

| 模型 | 授权 | URL |
|------|------|-----|
| Bangle (sybu) | CC BY | https://cults3d.com/en/3d-model/jewelry/bangle-sybu |
| Stylish Bangle | Free | https://cults3d.com/en/3d-model/jewelry/stylish-bangle |
| Chunky Bangle | Free | https://cults3d.com/en/3d-model/jewelry/chunky-bangle |

STL 转 GLB: 用 Blender 导入 STL → Export as GLB

## 🔧 下载后的集成步骤

1. 将 GLB 文件放入 `feiyi-platform/public/models/products/` 或 `heritage/`
2. 在 `webgl-demo.tsx` 的 `MODELS` 数组中添加新条目
3. 在 `heritage-model.tsx` 的 `BUILTIN` / `VARIANT_TO_KEY` 中注册（如用于作品详情页）
4. 设置 `realTexture: true` 保留文物/精模原始贴图；设置 `draco: true` 若使用 Draco 压缩
5. 运行 `npx tsc --noEmit` 验证无类型错误
6. 刷新 `http://localhost:3300/demo-3d` 查看

## 📊 当前模型清单

```
📁 public/models/
├── heritage/
│   ├── cloisonne/          ✅ CC0 景泰蓝花瓶 (Minneapolis Institute of Art)
│   │   ├── cloisonne.glb   ✅ 自包含 GLB（纹理内嵌，11.6MB，默认展示）
│   │   ├── scene.gltf      (原始 Sketchfab 外链导出，备用)
│   │   ├── scene.bin       (1.8MB 网格数据)
│   │   └── textures/       (7MB 珐琅贴图 JPEG)
│   └── smithsonian/        📥 待下载: xianglu, huo, guang, fangyi
├── products/
│   ├── bracelet_poly.glb   ✅ 真·手镯 (Poly Pizza, CC0)
│   ├── lantern_hunyuan.glb   ✅ 中式红灯笼 (腾讯混元3D, 6.4MB)
│   ├── winepot_tc.glb        ✅ 紫砂壶/酒壶 (腾讯混元3D Pro 图生3D, 2.9MB)
│   ├── pouch_tc.glb          ✅ 苗绣荷包 (腾讯混元3D Pro 图生3D, 5.2MB)
│   ├── vase.glb            ⚠️ Poly Pizza 白模花瓶
│   ├── mug.glb             ⚠️ Poly Pizza 陶瓷杯
│   ├── ring.glb            ⚠️ Poly Pizza 戒指
│   ├── tshirt.glb          ⚠️ Poly Pizza T恤
│   └── *_tc_src.glb / *_hunyuan_src.glb   混元3D 原始高分辨率备份（可删）
└── life/
    ├── dish_poly.glb       ✅ 轻量盘
    └── ...

已删除/下线的丑模型：backpack.glb（内容为人形）、shoe_poly.glb（丑黑靴）、
lantern_poly.glb（实为棕榈树）、bottle_poly.glb（丑塑料水瓶）、bottle_milk.glb（UV不全）、
bag_laptop.glb（笔记本包，被 pouch_tc 替代）、bottle_champagne.glb（香槟瓶，被 winepot_tc 替代）、
lantern_khronos.glb / bottle_khronos.glb（主题不符的 Khronos 占位模型）
```

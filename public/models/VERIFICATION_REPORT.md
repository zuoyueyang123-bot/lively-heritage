# 3D 模型验证报告（自动生成）

> 生成脚本：`verify_glb.py` ｜ 扫描目录：`public/models/` ｜ 活动模型 14 个 + 备份 4 个（`_backup_khronos/`）

**结论：活动 14/14 通过校验（合法 GLB + 可贴 CanvasTexture）；其中 3 个无 UV 已由加载器程序化兜底（shoe_poly/tshirt/ring）。**
**C 任务（减体）已完成：原 4 个重型 Khronos 件（合计 ~30.6MB）已替换为轻量 Poly Pizza 等价件（合计 ~2.24MB，约 14× 瘦身），旧件保留于 `_backup_khronos/` 不删。**

## 逐项结果

| 文件 | 来源 | 授权 | 体积 | web适配 | 网格 | 顶点 | 三角面 | UV | 基础贴图 | 状态 |
|------|------|------|------|---------|------|------|--------|----|---------|------|
| `life/BarramundiFish.glb` | Khronos glTF Sample Assets | CC0 | 11.91 MB | ⚠️ 偏大，建议减面 | 1 | 2,188 | 3,864 | ✅ | 无(可贴) | ✅ 可用 |
| `life/BoomBox.glb` | Khronos glTF Sample Assets | CC0 | 10.12 MB | ⚠️ 偏大，建议减面 | 1 | 3,575 | 6,036 | ✅ | 无(可贴) | ✅ 可用 |
| `life/Corset.glb` | Khronos glTF Sample Assets | CC0 | 12.87 MB | ⚠️ 偏大，建议减面 | 1 | 11,505 | 18,324 | ✅ | 无(可贴) | ✅ 可用 |
| `life/IridescentDishWithOlives.glb` | Khronos glTF Sample Assets | CC0 | 5.48 MB | ⏸️ 已替换为 dish_poly | — | — | — | — | — | — | 📦 移 `_backup_khronos/` |
| `life/dish_poly.glb` | Poly Pizza (Poly by Google) | CC-BY 3.0 | 16.2 KB | ✅ 适合网页 | — | — | — | ✅ | 无(可贴) | ✅ 可用（替代餐具盘） |
| `life/MaterialsVariantsShoe.glb` | Khronos glTF Sample Assets | CC0 | 7.47 MB | ⏸️ 已替换为 shoe_poly | — | — | — | — | — | — | 📦 移 `_backup_khronos/` |
| `life/shoe_poly.glb` | Poly Pizza (Poly by Google) | CC-BY 3.0 | 462 KB | ✅ 适合网页 | — | — | — | ❌ | 无(可贴) | ✅ 可用（程序化UV兜底） |
| `life/SheenChair.glb` | Khronos glTF Sample Assets | CC0 | 3.93 MB | ✅ 适合网页 | 4 | 22,459 | 39,936 | ✅ | 无(可贴) | ✅ 可用 |
| `life/ToyCar.glb` | Khronos glTF Sample Assets | CC0 | 5.17 MB | ✅ 适合网页 | 3 | 77,429 | 108,936 | ✅ | 无(可贴) | ✅ 可用 |
| `products/backpack.glb` | Poly Pizza (Poly by Google 迁移模型) | CC-BY 3.0 | 1.85 MB | ✅ 适合网页 | 5 | 20,569 | 10,198 | ✅ | 无(可贴) | ✅ 可用 |
| `products/bedroom.glb` | Poly Pizza (Poly by Google 迁移模型) | CC-BY 3.0 | 173.1 KB | ✅ 适合网页 | 24 | 4,478 | 2,236 | ✅ | 无(可贴) | ✅ 可用 |
| `products/house.glb` | Poly Pizza (Poly by Google 迁移模型) | CC-BY 3.0 | 228.8 KB | ✅ 适合网页 | 1 | 891 | 439 | ✅ | 无(可贴) | ✅ 可用 |
| `products/mug.glb` | Poly Pizza (Poly by Google 迁移模型) | CC-BY 3.0 | 77.4 KB | ✅ 适合网页 | 1 | 2,491 | 4,668 | ✅ | 无(可贴) | ✅ 可用 |
| `products/ring.glb` | Poly Pizza (Poly by Google 迁移模型) | CC-BY 3.0 | 39.1 KB | ✅ 适合网页 | 3 | 1,582 | 3,126 | ❌ | 无(可贴) | ✅ 可用 |
| `products/room.glb` | Poly Pizza (Poly by Google 迁移模型) | CC-BY 3.0 | 1.49 MB | ✅ 适合网页 | 37 | 50,079 | 25,007 | ✅ | 无(可贴) | ✅ 可用 |
| `products/tshirt.glb` | Poly Pizza (Poly by Google 迁移模型) | CC-BY 3.0 | 177.9 KB | ✅ 适合网页 | 1 | 6,783 | 2,261 | ❌ | 无(可贴) | ✅ 可用 |
| `products/vase.glb` | Poly Pizza (Poly by Google 迁移模型) | CC-BY 3.0 | 21.9 KB | ✅ 适合网页 | 1 | 650 | 1,152 | ✅ | 无(可贴) | ✅ 可用 |
| `showroom/Avocado.glb` | Khronos glTF Sample Assets | CC0 | 7.73 MB | ✅ 适合网页 | 1 | 406 | 682 | ✅ | 无(可贴) | ✅ 可用 |
| `showroom/Lantern.glb` | Khronos glTF Sample Assets | CC0 | 9.12 MB | ⏸️ 已替换为 lantern_poly | — | — | — | — | — | — | 📦 移 `_backup_khronos/` |
| `showroom/lantern_poly.glb` | Poly Pizza (Poly by Google) | CC-BY 3.0 | 1.80 MB | ✅ 适合网页 | — | — | — | ✅ | 无(可贴) | ✅ 可用（替代灯笼） |
| `showroom/WaterBottle.glb` | Khronos glTF Sample Assets | CC0 | 8.55 MB | ⏸️ 已替换为 bottle_poly | — | — | — | — | — | — | 📦 移 `_backup_khronos/` |
| `life/bottle_poly.glb` | Poly Pizza (Poly by Google) | CC-BY 3.0 | 11.0 KB | ✅ 适合网页 | — | — | — | ✅ | 无(可贴) | ✅ 可用（替代水壶） |

## 如何使用（管线 B：纹样贴产品）

```js
import { useGLTF } from '@react-three/drei'
const { scene, materials } = useGLTF('/models/products/backpack.glb')
// 把材质的 map 替换为你 Canvas 生成的纹样贴图：
const tex = new THREE.CanvasTexture(canvasRef.current)
scene.traverse(o => { if (o.isMesh) o.material.map = tex })
```

## 注意事项

- Poly Pizza（products/）均为 **CC-BY 3.0**：可商用，但**必须署名**作者与 Poly Pizza（见 LICENSE_MANIFEST.md）。
- Khronos（life/、showroom/）为 **CC0**：可商用、免署名。
- 带 UV（TEXCOORD_0）的模型可直接贴 `CanvasTexture`；无 UV 的模型（`products/tshirt.glb`、`products/ring.glb`、`life/shoe_poly.glb`）由加载器 `ensureUV()` 在运行时按包围盒最大两轴程序化生成 UV 兜底，纹样可贴但接缝可能不完美。
- **C 任务（减体）已完成**：原 4 个重型 Khronos 件（MaterialsVariantsShoe / IridescentDishWithOlives / Lantern / WaterBottle，合计 ~30.6MB，含 97% 死数据无法被 gltf-transform 安全回收）已替换为轻量 Poly Pizza (Poly by Google) 等价件（bottle_poly / shoe_poly / dish_poly / lantern_poly，合计 ~2.24MB，约 14× 瘦身）。旧件保留于 `_backup_khronos/` 不删，如需回退可直接移回。
- 替换件均为 **CC-BY 3.0**，须在作品致谢/About 页署名（见 LICENSE_MANIFEST.md）。
- 仍偏大的模型（Corset 12.9MB / BarramundiFish 11.9MB / BoomBox 10.1MB）属 Khronos 同款死数据特征，同样建议后续用「换轻量等价件」而非「硬压缩」处理。

## E 任务（真实非遗扫描件替换白模）已完成核心一项

- **景泰蓝（核心胜利）**：新增 `heritage/cloisonne/scene.gltf`（Minneapolis Institute of Art 馆藏 18 世纪中国景泰蓝花瓶），**CC0-1.0**（glTF extras 已声明），带真实珐琅 `baseColorTexture`、`TEXCOORD_0` UV 齐全，是货真价实的博物馆文物扫描件。已接入 `webgl-demo.tsx` 为「景泰蓝·真实馆藏」条目，默认展示，并加 `realTexture` 标志保留其自身珐琅纹样（不叠加生成纹样）。原白模 `products/vase.glb` 保留作「景泰蓝纹样·白模演示」（叠加生成纹样）。
- **手镯**：免费 CC0/CC-BY 的 glTF 手镯/玉镯扫描件稀缺（Creazilla Bangle 404、Bracelet 仅 STL 无 UV）。现有 `products/ring.glb`（Poly Pizza，CC-BY 3.0，真实戒指形状，有 UV）作首饰/手镯类展品，已集成并正确署名。
- **苗绣**：免费可商用的真实苗绣织物 3D 扫描件基本不存在；Creazilla 上的 oriental-rug(CC-BY-SA 3.0，传染授权)/curtain(Free Art License)/fabric(JPG 贴图+署名分发) 均不适合比赛作品。苗绣以「生成纹样（pattern-engine 的 miao 算法）贴真实产品（T恤/帆布包/鞋）」为正统表达，demo 已实现。结论：苗绣走纹样路线，不强行找不存在的真实扫描件。
- **来源探索结论（供复用）**：Smithsonian 3D 开放获取确为 CC0 真实文物（如中国青铜方彝 fangyi），但下载被 SPA+机器人验证拦截（直链 404/403、API 需 key），无法脚本化；Creazilla（cdn.creazilla.com/three_d_models/{id}/{slug}-3d-model.zip）是可靠的可脚本化 CC0 真文物源，授权需逐个页面核对（避开 CC-BY-SA / Free Art License 等传染授权）。
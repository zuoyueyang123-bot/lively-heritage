# 非遗有灵 · 3D 模型补充诊断报告（INSPECT_REPORT）

> 生成时间：2026-07-08
> 目的：在 VERIFICATION_REPORT 之外，补充检查"能不能真用、用得好不好"的隐藏维度
> 方法：逐字节解析 GLB JSON chunk，读取 extensionsUsed / accessor.min-max / 包围盒

## 一、诊断原始数据（maxDim = 包围盒最长边，单位由模型自身坐标系决定）

| 文件 | 压缩扩展 | 包围盒最长边 | UV 超出 [0,1] | 备注 |
|------|---------|------------|--------------|------|
| backpack.glb | 无 | 0.017 | 0 | Poly Pizza |
| BoomBox.glb | 无 | 0.020 | 0 | Khronos |
| Corset.glb | 无 | 0.058 | 0 | Khronos |
| Avocado.glb | 无 | 0.063 | 0 | Khronos |
| WaterBottle.glb | 无 | 0.260 | 0 | Khronos |
| SheenChair.glb | 无 | 0.827 | 0 | Khronos |
| BarramundiFish.glb | 无 | 0.643 | 0 | Khronos |
| IridescentDishWithOlives.glb | 无 | 0.459 | 0 | Khronos |
| MaterialsVariantsShoe.glb | 无 | 2.000 | 0 | Khronos |
| house.glb | 无 | 1.464 | 0 | Poly Pizza (Poly by Google) |
| Lantern.glb | 无 | 25.664 | 0 | Khronos |
| vase.glb | 无 | 79.946 | 0 | Poly Pizza |
| ring.glb | 无 | 139.516 | 0 | Poly Pizza |
| mug.glb | 无 | 244.728 | 1 | x 到 1.02（杯口接缝处轻微重复）|
| room.glb | 无 | 77.452 | 1 | y 仅用到 0~0.46（纹样被纵向压扁一半）|
| ToyCar.glb | 无 | 739.623 | 0 | Khronos（厘米制，7.4 米）|
| bedroom.glb | 无 | 112912.625 | 4 | 多处 UV 越界 -0.49~1.02（贴图会镜像/重复）|
| tshirt.glb | 无 | 352916.520 | 0 | 无 UV + 尺度异常（需归一化）|

## 二、问题分级

### P0 — 不解决就没法用
1. **坐标系/单位完全不统一（最严重，VERIFICATION 未覆盖）**
   - Khronos 用米制（0.02~2.0 正常物体尺寸）；Poly Pizza 这批几乎都是别的单位：
     tshirt=352916、bedroom=112912、mug=244、vase=79、room=77、ring=139、ToyCar=739。
   - 直接丢进同一 R3F 场景 → tshirt 会比房间大 3000 倍，相机根本框不住。
   - **修复**：加载时按包围盒最长边归一化到统一尺寸（如 1.5 单位），或在场景里对每个模型单独设 scale。

### P1 — 影响观感 / 合规
2. **UV 超出 [0,1] → 贴图会重复或压扁**
   - bedroom（4 处，x 到 -0.49~1.02）、mug（1 处，x 到 1.02）、room（1 处，y 仅 0~0.46）。
   - 苗绣/景泰蓝这类连续纹样贴上去会在这些面 tiling 或纵向压扁，接缝难看。
   - **修复**：Blender 重映射 UV 到 [0,1]，或给 CanvasTexture 设 RepeatWrapping 并接受重复（连续纹样重复反而自然）。
3. **真实非遗器物仍是"白模模拟"，不是真实扫描（概念级 gap）**
   - 景泰蓝 = 白花瓶、手镯 = 白戒指、苗绣 = Canvas 生成。免费来源里几乎找不到真实非遗器物 3D 扫描。
   - 需确认：是否接受"通用模型 + 纹样贴图"的呈现方式（建议接受，否则要 Smithsonian/Sketchfab 手动找真实扫描）。
4. **CC-BY 署名合规细节（Poly Pizza 这批是 CC-BY 3.0）**
   - 仅放 About 页可能不够：规范要求"合理署名 + 不暗示作者为你的作品背书 + 保留版权声明"。
   - 比赛作品署名位置要显眼（如作品页脚 / 致谢区）。

### P2 — 工程整洁 / 可持续
5. **材质缺金属度/织物感**：白模默认塑料质感，景泰蓝需金属高光、苗绣需织物法线。需在 R3F 里调 material.metalness/roughness 或加 envMap。
6. **抓取方式脆弱**：靠 Poly by Google 用户页内联 JSON 挖 id，页面结构一变即失效，且 Bracelet 未挖到。不可作长期方案。
7. **无关模型 + 临时文件**：Avocado/BarramundiFish 与非遗场景无关可清理；`.verify/` 内一堆临时 html/json 应清掉（保留 harvest.py / inspect_glb.py / verify_glb.py）。

## 三、结论
- 18/18 合法、16/18 有 UV、0/18 有压缩 → **基础可用性 OK**。
- 但**直接进场景前必须做两件事**：① 按包围盒归一化尺度（P0）；② 处理 bedroom/mug/room 的 UV 越界（P1）。
- 真实非遗器物是概念级取舍，需你拍板。

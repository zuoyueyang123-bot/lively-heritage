# Meshy.ai 生成 Prompt（免费版 · 网页端手搓）

> 使用方式：登录 meshy.ai → 左侧 **Create → Text to 3D** → 把下方英文 prompt 粘进输入框 →
> 参数按"推荐设置"勾选 → 生成后从 4 个预览里挑最像的 → **Download → GLB** → 把文件发我。
>
> 免费版限制：每月 100 积分、最多下载 10 个模型、生成物需 CC BY 4.0 署名（页面底部加"3D by Meshy.ai"即可）。
> 省积分技巧：先用 **Preview（低面数快速预览）** 看形态对不对，满意再下标准版；别反复重试同一句话。

---

## 1. 中式大红灯笼

**推荐设置**
- Mode: Text to 3D
- Quality: Standard（Preview 先看形态）
- PBR / Texture: 开（保留红色纸感）
- 面数：默认即可（网页端不可调，导出后我在项目里控制）

**Prompt（直接复制）**
```
Traditional Chinese red festival lantern, spherical paper lantern body in glossy vermilion red, golden vertical ribs and a golden top cap, a short golden hanging loop on top, golden tassels hanging from the bottom, warm glowing interior light suggested by slightly translucent paper, smooth handcrafted surface, single centered object, plain background, clean topology, PBR materials, 3D game asset style
```

**挑选要点**：要"圆球纸灯身 + 金骨架 + 底部流苏"，不要变成西式街灯/棱形灯。如果出成方灯或提灯，换 seed 重生成。

---

## 2. 紫砂壶 / 酒壶

**推荐设置**
- Mode: Text to 3D
- Quality: Standard
- PBR / Texture: 开（保留陶土哑光质感）
- 面数：默认

**Prompt（直接复制）**
```
Traditional Chinese Yixing clay wine pot, round plump dark-brown ceramic body with subtle natural clay grain, short upward-curving spout, an arched loop handle over the lid, a small round knob on the lid, a stable circular foot ring at the base, matte unglazed pottery finish, single centered object, plain background, clean quad topology, PBR materials, high detail
```

**挑选要点**：要"圆润壶身 + 拱形提梁 + 小圆钮盖 + 圈足"。不要出成现代咖啡壶/茶壶带把手。深棕哑光陶土感最佳。

---

## 3. 苗绣荷包 / 香囊

**推荐设置**
- Mode: Text to 3D
- Quality: Standard
- PBR / Texture: 开（保留绣线彩色）
- 面数：默认

**Prompt（直接复制）**
```
Traditional Chinese Miao ethnic embroidered sachet pouch, small diamond-shaped soft fabric bag, colorful geometric Miao embroidery patterns in red, blue, green and gold thread, a braided hanging cord at the top, golden tassels at the bottom, soft cloth material with visible stitched seams, single centered object, plain background, clean topology, PBR materials
```

**挑选要点**：要"菱形小布包 + 彩色几何绣纹 + 顶部挂绳 + 底部流苏"。不要出成现代钱包/方包。绣纹越密越像苗绣。

---

## 收到 GLB 后我会做什么
1. 丢进 `public/models/products/`，headless Chrome 截图给你看真实渲染效果
2. 灯笼/酒壶保留原始 PBR；荷包若要贴咱自己的苗绣纹样我再处理
3. 替换掉现在 demo 里对应的丑模型（程序化灯笼、Khronos 水壶占位、笔记本包）
4. 同步更新 LICENSE_MANIFEST.md（标注 Meshy 来源 + CC BY 4.0 署名要求）

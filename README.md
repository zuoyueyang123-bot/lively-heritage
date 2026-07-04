# 非遗有灵 · Lively Heritage

非遗文创提案生成平台。用户输入一句灵感，选择非遗工艺与纹样母题，即可生成纹样、3D 实时贴图、产品 mockup、AI 文化解读、可分享作品页与导出海报。

当前支持 11 种工艺：苗绣、景泰蓝、扎染、剪纸、蓝印花布、南京云锦、缂丝、青花瓷、杨柳青年画、皮影、唐卡。

## 技术栈

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4
- React Three Fiber / Three.js
- Supabase Postgres + Storage
- 阿里云百炼 / DashScope compatible chat API

## Getting Started

安装依赖后运行：

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 环境变量

复制 `.env.example` 为 `.env.local`，填写：

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=patterns
BAILIAN_API_KEY=
BAILIAN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
BAILIAN_MODEL=qwen-plus
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

没有 Supabase 变量时，项目会回退到本地 `.data/artworks.json`，方便开发预览。

## 验证

```bash
npm run lint
npm run build
```

## Vercel 部署

1. 将项目推送到 GitHub。
2. 在 Vercel Import Project，Root Directory 选择 `feiyi-platform`。
3. 在 Environment Variables 配置 `.env.local` 同名变量。
4. 上线后将 `NEXT_PUBLIC_SITE_URL` 改为 Vercel 公网地址，例如 `https://xxx.vercel.app`。
5. 重新部署一次，确保作品页 metadata 与分享图使用公网地址。

更完整的赛事部署清单见项目根目录的《非遗有灵_Vercel部署清单.md》。

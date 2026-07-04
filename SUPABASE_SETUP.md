# Supabase 与环境变量接入说明

当前平台支持双模式：

- 没有 Supabase 环境变量：使用本地 `.data/artworks.json`，方便开发。
- 配置 Supabase 环境变量：自动切换到 Supabase Postgres + Storage。

## 1. 创建表

在 Supabase SQL Editor 执行：

```sql
-- 复制并执行仓库根目录的 supabase-schema.sql
```

文件位置：

```text
supabase-schema.sql
```

## 2. 创建 Storage bucket

创建 bucket：

```text
patterns
```

建议设置为 public bucket，因为作品分享页需要公开读取图片。

## 3. 配置环境变量

复制：

```text
.env.example -> .env.local
```

填入：

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=patterns
```

百炼可选：

```text
BAILIAN_API_KEY=
BAILIAN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
BAILIAN_MODEL=qwen-plus
```

部署后补充：

```text
NEXT_PUBLIC_SITE_URL=https://你的域名.vercel.app
```

注意：

- `SUPABASE_SERVICE_ROLE_KEY` 和 `BAILIAN_API_KEY` 只能放服务端环境变量，不要写入前端代码，不要提交到仓库。
- `.env.local` 已被 `.gitignore` 忽略，部署时需要在 Vercel 后台重新配置同名变量。
- `NEXT_PUBLIC_SITE_URL` 用于 metadata 与分享图 URL，本地可以是 `http://localhost:3000`，上线必须改成公网地址。

## 4. 验证

```bash
npm run lint
npm run build
npm run dev
```

打开 `/create` 生成作品，保存后：

- `/work/[slug]` 能打开
- `/gallery` 能看到作品
- Supabase `artworks` 表有记录
- Storage `patterns/{id}/pattern.png` 有图片

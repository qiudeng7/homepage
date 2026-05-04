# AGENTS.md

## 项目概述

Nuxt 4 个人博客，使用 `@nuxt/ui` v4 + Tailwind CSS v4，部署目标 Cloudflare Pages。

## 包管理器

```bash
pnpm
```

## 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建（Nitro + Vite）
pnpm generate     # 静态站点生成
pnpm deploy       # 部署到 Cloudflare（wrangler deploy）
pnpm postinstall  # nuxt prepare（安装依赖后自动执行）
```

## 核心架构

### Content → Nuxt Content v3 集合

文章通过 `@nuxt/content` v3 管理，走数据库查询而非静态文件直接读取：

```typescript
// 列表页
const { data: posts } = await useAsyncData('blog-list', () =>
  queryCollection('blog').order('date', 'DESC').all()
)

// 详情页
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('blog').path(route.path).first()
)
```

内容位置：`content/blog/*.md`
Schema 定义：`content.config.ts` 使用 zod 校验 frontmatter

### 数据库

- 生产环境：Cloudflare D1（SQLite）
- 本地开发：D1 本地模拟或 SQLite 文件
- 配置见 `nuxt.config.ts` 中 `hub.db` 和 `content.database`

### 目录边界

```
content/blog/     # Markdown 文章源（Nuxt Content 集合）
app/              # Nuxt 应用代码
├── pages/        # 路由页面
├── components/   # Vue 组件
├── composables/  # 组合式函数
└── assets/       # CSS 等静态资源
server/           # Nitro 服务端代码
```

## 技术栈版本

- Nuxt: `^4.4.4`
- @nuxt/ui: `^4.7.1`（v4，不是 v3）
- @nuxt/content: `^3.5.1`（v3，使用数据库集合）
- Tailwind CSS: `^4.2.4`
- @nuxthub/core: `^0.10.7`（D1 数据库等 Cloudflare 资源绑定）

## 已知限制

- **无测试框架**：没有 Vitest、Jest 或 Playwright 配置
- **无 Lint/Format**：没有 ESLint、Prettier、Stylelint 配置
- **无 CI/CD**：`.github/workflows` 不存在
- **无类型检查脚本**：`package.json` 中没有 `typecheck` 命令
- `tsconfig.json` 仅 extends `.nuxt/tsconfig.json`，不要手动维护

## 内容管理

- 文章放在 `content/blog/` 目录
- Frontmatter 必须包含 `title`（string）和 `date`（ISO 日期），可选 `description`、`tags`
- 当前唯一示例：`content/blog/demo.md`
- 新增/修改文章后自动热更新，无需重启 dev server

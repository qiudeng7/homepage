# AGENTS.md

## 项目概述

Nuxt 4 个人博客，使用 `@nuxt/ui` v4 + Tailwind CSS v4。文章源文件放在 `public/content/*.md`，作为静态资源通过 CDN 边缘缓存。

## 包管理器

```bash
pnpm
```

## 开发命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建（Nitro + Vite）
pnpm generate     # 静态站点生成
pnpm postinstall  # nuxt prepare（安装依赖后自动执行）
```

## 核心架构

### Content → 静态资源

文章放在 `public/content/` 下作为纯静态 Markdown 文件。由于 SSR 时 `$fetch` 走 Nitro 内部调用，使用完整 URL 确保服务端也能正确获取：

```typescript
const { origin } = useRequestURL()
const { data: rawMarkdown } = await useFetch(`${origin}/content/demo.md`, {
  responseType: 'text',
  default: () => ''
})
```

部署到 Cloudflare Pages 时，静态资源自动走 CDN 边缘缓存，无需服务端 API 层。

### 目录边界

```
public/content/   # Markdown 文章源（静态资源，CDN 缓存）
app/              # Nuxt 应用代码
├── pages/        # 路由页面
├── components/   # Vue 组件
├── composables/  # 组合式函数
└── assets/       # CSS 等静态资源
server/           # Nitro 服务端代码（目前无内容相关 API）
```

## 技术栈版本

- Nuxt: `^4.4.4`
- @nuxt/ui: `^4.7.1`（v4，不是 v3）
- Tailwind CSS: `^4.2.4`
- @nuxtjs/mdc: `^0.16.1`（Markdown 渲染组件 `<MDC>`）

## 已知限制

- **无测试框架**：没有 Vitest、Jest 或 Playwright 配置
- **无 Lint/Format**：没有 ESLint、Prettier、Stylelint 配置
- **无 CI/CD**：`.github/workflows` 不存在
- **无类型检查脚本**：`package.json` 中没有 `typecheck` 命令
- `tsconfig.json` 仅 extends `.nuxt/tsconfig.json`，不要手动维护

## 内容管理

- 文章放在 `public/content/` 目录，`.md` 后缀去掉后即为 slug
- 当前唯一示例：`public/content/demo.md`
- 新增文章后无需重启 dev server（纯静态资源）

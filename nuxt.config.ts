import { readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'

// ── Rollup 虚拟模块 ID 约定 ────────────────────────────────
// Rollup 用 \0 前缀标记"虚拟模块"，避免与真实文件冲突。
// 对外暴露的 import ID 是 'virtual:content-map'（无 \0），
// 内部 resolve 后转为 '\0virtual:content-map'。
const VIRTUAL_ID = '\0virtual:content-map'
const RESOLVED_ID = 'virtual:content-map'

/**
 * Nitro Rollup 插件：构建时将 content/ 目录的 .md 文件打包为虚拟模块
 *
 * 为什么需要这个插件？
 *   Nuxt 的 server/ 目录由 Nitro 用 Rollup 独立打包（不是 Vite）。
 *   Rollup 不认识 import.meta.glob，也不支持 ?raw import。
 *   这个插件在 Nitro 构建阶段介入，把 markdown 内容"编织"进 server bundle，
 *   部署到 Cloudflare Pages 后无需文件系统读取。
 *
 * 工作流程：
 *   1. server/utils/content.ts 里写：import contentMap from 'virtual:content-map'
 *   2. Rollup 遇到这个 import，调用 resolveId('virtual:content-map')
 *   3. 插件返回 VIRTUAL_ID，告诉 Rollup"我来处理这个模块"
 *   4. Rollup 调用 load(VIRTUAL_ID) 获取模块源码
 *   5. 插件读取 content/*.md，生成 export default { slug: "markdown文本" }
 *   6. 最终 markdown 内容成为 JS 字符串字面量，打包进 .output/server/
 */
const contentBundlePlugin = () => ({
  name: 'content-bundle',

  /**
   * resolveId: 拦截模块路径解析
   *
   * @param id - import 语句里的路径，如 'virtual:content-map'
   * @returns 匹配时返回 VIRTUAL_ID（带 \0 前缀），不匹配返回 null
   *
   * 这里同时检查两种写法：
   *   - 用户代码里的 'virtual:content-map'
   *   - Rollup 内部已经加了 \0 的 '\0virtual:content-map'
   */
  resolveId(id: string) {
    if (id === RESOLVED_ID || id === VIRTUAL_ID) return VIRTUAL_ID
    return null
  },

  /**
   * load: 生成虚拟模块的源码内容
   *
   * @param id - 经过 resolveId 后的模块 ID
   * @returns 匹配时返回生成的 JS 代码字符串，不匹配返回 null
   *
   * 只有 id === VIRTUAL_ID 时才处理，其他模块交给 Rollup 默认逻辑。
   */
  load(id: string) {
    if (id !== VIRTUAL_ID) return null

    // 读取 content/ 目录下的所有 .md 文件
    const contentDir = resolve(process.cwd(), 'content')
    const files = readdirSync(contentDir).filter(f => f.endsWith('.md'))

    // 构建 { slug: markdown原始文本 } 的映射对象
    const map: Record<string, string> = {}
    for (const file of files) {
      // 去掉 .md 后缀作为 slug，如 "demo.md" → "demo"
      const slug = file.replace(/\.md$/, '')
      map[slug] = readFileSync(resolve(contentDir, file), 'utf-8')
    }

    // 生成模块源码：export default { "demo": "# 示例文章..." }
    // JSON.stringify 会自动转义引号、换行等，确保生成的 JS 合法
    return `export default ${JSON.stringify(map)}`
  }
})

export default defineNuxtConfig({
  modules: ['@nuxtjs/mdc'],
  nitro: {
    rollupConfig: {
      // 把自定义插件注入 Nitro 的 Rollup 构建流程
      plugins: [contentBundlePlugin()]
    }
  },
  devtools: { enabled: true }
})

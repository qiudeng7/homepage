import { readFileSync } from 'node:fs'
import { siteConfig as baseSiteConfig, type SiteConfig } from './config'

function loadSiteConfig(): SiteConfig {
  try {
    const md = readFileSync('content/config.md', 'utf-8')
    const match = md.match(/```json\s*\n([\s\S]*?)\n\s*```/)
    if (!match) throw new Error('未找到 JSON 代码块')
    const mdConfig = JSON.parse(match[1])
    return { ...baseSiteConfig, ...mdConfig }
  } catch {
    return baseSiteConfig
  }
}

const siteConfig = loadSiteConfig()

export default defineNuxtConfig({
  compatibilityDate: '2026-05-04',
  modules: ['@nuxt/ui', '@nuxt/content', '@nuxthub/core'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
  nitro: {
    preset: 'cloudflare_module',
  },
  runtimeConfig: {
    public: {
      ...siteConfig,
    }
  },

  hub: {
    db: {
      dialect: 'sqlite',
      driver: 'd1',
    }
  },

  content: {
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
    // 允许 nuxt content 解析到第六级标题
    markdown: {
      toc: {
        depth: 6,
        searchDepth: 6,
      },
    },
  },
  devtools: { enabled: true },
  
  // 避免开发时期warning
  sourcemap: false,
  vite: {
    optimizeDeps: {
      exclude: ['@nuxtjs/mdc']
    }
  }
})
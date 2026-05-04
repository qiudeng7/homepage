import { siteConfig } from './config'

export default defineNuxtConfig({
  compatibilityDate: '2026-05-04',
  modules: ['@nuxt/ui', '@nuxt/content', '@nuxthub/core'],
  css: ['~/assets/css/main.css'],
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
  },
  sourcemap: false,
  devtools: { enabled: true }
})
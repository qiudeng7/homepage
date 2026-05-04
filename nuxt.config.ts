export default defineNuxtConfig({
  compatibilityDate: '2026-05-04',
  modules: ['@nuxt/ui', '@nuxt/content', '@nuxthub/core'],
  css: ['~/assets/css/main.css'],
  nitro: {
    preset: 'cloudflare_module',
  },
  runtimeConfig: {
    public: {
      authorName: '秋灯',
      githubId: '85886906',
      githubUsername: 'qiudeng7',
      avatarSize: '256',
      motto: '长恨此身非我有，何时忘却营营',
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

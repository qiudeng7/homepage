export default defineNuxtConfig({
  compatibilityDate: '2026-05-04',
  modules: ['@nuxt/ui', '@nuxt/content'],
  css: ['~/assets/css/main.css'],
  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      wrangler: {
        d1_databases: [
          {
            binding: 'DB',
            database_name: 'blog-db',
            database_id: '6f1f964e-e4c5-43ea-93dc-ac242d93a9c2'
          }
        ]
      }
    }
  },
  runtimeConfig: {
    public: {
      authorName: '秋灯',
      githubId: '85886906',
      avatarSize: '256',
      motto: '长恨此身非我有，何时忘却营营',
    }
  },
  sourcemap: false,
  devtools: { enabled: true }
})

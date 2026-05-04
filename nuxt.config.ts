export default defineNuxtConfig({
  compatibilityDate: '2026-05-04',
  modules: ['@nuxt/ui', '@nuxtjs/mdc'],
  css: ['~/assets/css/main.css'],
  nitro: {
    preset: 'cloudflare-pages'
  },
  devtools: { enabled: true }
})

export default defineNuxtConfig({
  modules: ['@nuxtjs/mdc'],
  mdc: {
    // 默认开启 Prose 组件
    // 可以通过组件的 :prose="false" 属性关闭
  },
  devtools: { enabled: true }
})
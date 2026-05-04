import { readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'

const VIRTUAL_ID = '\0virtual:content-map'
const RESOLVED_ID = 'virtual:content-map'

const contentBundlePlugin = () => ({
  name: 'content-bundle',
  resolveId(id: string) {
    if (id === RESOLVED_ID || id === VIRTUAL_ID) return VIRTUAL_ID
    return null
  },
  load(id: string) {
    if (id !== VIRTUAL_ID) return null
    const contentDir = resolve(process.cwd(), 'content')
    const files = readdirSync(contentDir).filter(f => f.endsWith('.md'))
    const map: Record<string, string> = {}
    for (const file of files) {
      map[file.replace(/\.md$/, '')] = readFileSync(resolve(contentDir, file), 'utf-8')
    }
    return `export default ${JSON.stringify(map)}`
  }
})

export default defineNuxtConfig({
  modules: ['@nuxtjs/mdc'],
  nitro: {
    rollupConfig: {
      plugins: [contentBundlePlugin()]
    }
  },
  devtools: { enabled: true }
})

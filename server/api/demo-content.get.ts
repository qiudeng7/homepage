import { readFileSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(() => {
  const filePath = resolve('./content/demo.md')
  const content = readFileSync(filePath, 'utf-8')
  return content
})

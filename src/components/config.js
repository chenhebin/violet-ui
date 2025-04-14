// config.js
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const getComponentEntries = () => {
  const componentsDir = path.resolve(__dirname, '../src/components') // ✅ 确保指向组件目录
  const entries = {}

  fs.readdirSync(componentsDir).forEach((dir) => {
    const fullPath = path.join(componentsDir, dir)
    const entryFile = path.join(fullPath, 'index.tsx') // ✅ 改为 index.tsx
    if (fs.statSync(fullPath).isDirectory() && fs.existsSync(entryFile)) {
      entries[`components/${dir}`] = entryFile // ✅ 路径保留前缀（方便输出结构）
    }
  })

  return entries
}
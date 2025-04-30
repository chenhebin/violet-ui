// config.js
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const getComponentOutput = (format) => {
  // 获取组件目录下的所有组件
  const componentsDir = path.resolve(__dirname, '../components') // ✅ 确保指向组件目录
  // 读取组件目录下的所有子目录，返回每个子目录的路径
  const comList = fs.readdirSync(componentsDir).filter((dir) => {
    const fullPath = path.join(componentsDir, dir)
    return fs.statSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, `${dir}.tsx`)) // ✅ 检查 index.tsx 是否存在
  }).map((dir) => `src/components/${dir}/index.ts`)
  return comList
}
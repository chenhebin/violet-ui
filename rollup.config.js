import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

import serve from 'rollup-plugin-serve'
import postcss from 'rollup-plugin-postcss'
import { cleandir } from 'rollup-plugin-cleandir'
import livereload from 'rollup-plugin-livereload'

import { config } from 'dotenv'
import { fileURLToPath } from 'url';
import autoprefixer from 'autoprefixer'
import path from 'path'; // 修改导入方式

import { getComponentOutput } from './src/components/config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // 使用 path 的方法
// 根据环境加载对应的配置文件
config({
    path: path.resolve(
        __dirname,
        `.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`
    )
})
// 判断是否为生产环境
const isProduction = process.env.NODE_ENV === 'production'

// 基础配置
const basePlugins = [
    replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        preventAssignment: true
    }),
    babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        exclude: 'node_modules/**'
    }),
    resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
    commonjs(),
    // ...(isProduction ? [] : [cleandir('dist')]) // 仅开发环境使用cleandir
]

// 开发环境插件 - fn避免重复调用（如果是对象，isProduction ? 1 : devConfig这个判断的时候就会执行serve，需要用方法返回来避免调用）
const getDevPlugins = () => {
    return [
        // 开发模式的时候，本地需要解析css，所以需要这个插件，生产环境不需要（使用gulp进行打包）
        postcss({
            modules: false, // 禁用 CSS Modules
            extract: true, // 提取为单独文件
            minimize: false, // 生产环境压缩
            plugins: [
                autoprefixer()
            ]
        }),
        serve({
            open: true,
            contentBase: [
                path.resolve(__dirname),
                path.resolve(__dirname, 'dist'),
                path.resolve(__dirname, 'public')
            ],
            port: 3000,
            host: 'localhost'
        }),
        livereload({
            watch: 'dist'
        })
    ]
}
const productionPlugins = [
    typescript({
        tsconfig: './tsconfig.json', // 主配置，用于 JS 构建
        declaration: false,          // 禁止 Rollup 插件生成类型
    })
]

const resultConfig = {
    input: [
        'src/main.tsx',
        ...getComponentOutput() // 直接使用函数返回的数组，不需要额外的解构赋值
    ],
    output: [
        {
            dir: 'dist/esm',
            format: 'esm',
            preserveModules: true, // 保留模块结构
            preserveModulesRoot: 'src' // 保留模块的根目录
        },
        {
            dir: 'dist/cjs',
            format: 'cjs',
            preserveModules: true, // 保留模块结构
            preserveModulesRoot: 'src' // 保留模块的根目录
        }
    ],
    plugins: [
        ...basePlugins,
        ...(isProduction ? productionPlugins : getDevPlugins())
    ],
    // 不这样设置：打包结果会把 .pnpm 的软链接结构直接保留到了输出目录里，会产生virtual目录和node_modules目录
    external: isProduction ? ((id) =>
        /^react/.test(id) ||
        /^react-dom/.test(id) ||
        /\.css$/.test(id)  // 新增：排除所有CSS文件
    ) : []
}
export default resultConfig
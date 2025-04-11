import babel from '@rollup/plugin-babel'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

import serve from 'rollup-plugin-serve'
import postcss from 'rollup-plugin-postcss'
import { cleandir } from 'rollup-plugin-cleandir'
import livereload from 'rollup-plugin-livereload'

import cssnano from 'cssnano'
import { config } from 'dotenv'
import { fileURLToPath } from 'url';
import autoprefixer from 'autoprefixer'
import path from 'path'; // 修改导入方式

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
const baseConfig = {
    input: 'src/main.tsx',
    output: {
        file: 'dist/bundle.js',
        format: 'esm',
        sourcemap: true
    },
    plugins: [
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            preventAssignment: true
        }),
        postcss({
            modules: false,
            extract: 'bundle.css',
            minimize: isProduction, // 仅在生产环境压缩
            plugins: [
                autoprefixer(),  // 使用导入的模块
                ...(isProduction ? [cssnano()] : []) // 生产环境才启用压缩
            ]
        }),
        babel({
            babelHelpers: 'bundled',
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            exclude: 'node_modules/**'
        }),
        resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
        commonjs(),
        cleandir('dist')
    ]
}

// 开发环境配置
const devConfig = {
    plugins: [
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

// 生产环境配置
const prodConfig = {
    plugins: [
        // 可添加生产环境专用插件
    ]
}

export default isProduction ? 
    { ...baseConfig, plugins: [...baseConfig.plugins, ...prodConfig.plugins] } :
    { ...baseConfig, plugins: [...baseConfig.plugins, ...devConfig.plugins] }
import path from 'path'

import json from '@rollup/plugin-json'
import ts from 'rollup-plugin-typescript2'
import resolvePlugins from '@rollup/plugin-node-resolve'

// 因为是 esm module 所以 __dirname 获取方式改变
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const require = createRequire(import.meta.url)

// 获取 build.js 运行命令的变量

console.log('__', process.env.TARGET)

console.log('__', process.env.FORMATS)

console.log('__', process.env.SOURCEMAP)

if (!process.env.TARGET) {
  throw new Error('TARGET must be set in environment variable')
}

// 获取 packages 目录
const packagesDir = path.resolve(__dirname, 'packages')

// 获取 要打包的目录
const packageDir = path.resolve(packagesDir, process.env.TARGET)

// 获取 package.json 文件
const resolve = p => path.resolve(packageDir, p)
const pkg = require(resolve('package.json'))

// 获取 package.json 文件中自定义的属性 buildOptions
const packageOptions = pkg.buildOptions || {}

// 获取 要打包的文件名
const name = packageOptions.filename || path.basename(packageDir)

// 打包类型映射
const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: 'es'
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs'
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife'
  }
}
// formats 获取优先级
// 1、环境变量
// 2、package.json 自定义设置
// 3、默认

const defaultFormats = ['esm-bundler', 'cjs']
const packageFormats = packageOptions.formats
const inlineFormats = process.env.FORMATS && process.env.FORMATS.split(',')

const theFormats = inlineFormats || packageFormats || defaultFormats

// 循环处理不同的formats对应结果
const packageConfigs = theFormats.map(format => createConfig(format, outputConfigs[format]))

// 处理 format 返回对于配置
function createConfig(format, output) {
  // 全局模式 设置 name
  const isGlobalBuild = /global/.test(format)

  if (isGlobalBuild) {
    output.name = packageOptions.name
  }

  // 是否生成 sourcemap
  output.sourcemap = !!process.env.SOURCEMAP

  // 最终 rollup 配置
  return {
    input: resolve('src/index.ts'),
    output,
    plugins: [
      json(),
      ts({
        tsconfig: path.resolve(__dirname, 'tsconfig.json')
      }),
      resolvePlugins()
    ]
  }
}

export default packageConfigs

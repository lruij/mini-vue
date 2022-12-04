const path = require('path')
const fs = require('fs-extra')
const execa = require('execa')

const { targets } = require('./utils')

// 执行打包
runParallel(targets, build)

// 循环目标 依次打包
async function runParallel(targets, iteratorFn) {
  const ret = []
  for (const item of targets) {
    const p = iteratorFn(item)
    ret.push(p)
  }
  return Promise.all(ret)
}

// 打包
async function build(target) {

  console.log('target', target)

  const pkgDir = path.resolve(`packages/${target}`)

  // 移除 dist
  await fs.remove(`${pkgDir}/dist`)

  // 第一参数 是命令
  // 第二个参数 是rollup 运行时的执行的参数
  //          -c 采用配置文件
  //          --environment 设置环境变量
  //          `TARGET:${target}` 环境变量 里面设置的对象。在rollup 配置文件执行时，可以获取到
  // 第三个参数 execa 执行的参数  stdio: 'inherit' 子进程打包的信息 共享给父进程
  await execa('rollup',
    [
      '-c', '--environment', `TARGET:${target}`,
    ],
    {stdio: 'inherit'}
  )
}

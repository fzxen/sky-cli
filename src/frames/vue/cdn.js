const { absolute } = require('./utils')
const fs = require('fs')
/**
 ** CDN
 */

const mode = process.env.NODE_ENV

// 获取所有依赖及其版本号
const getModulesVersion = () => {
  const mvs = {}
  const data = fs.readFileSync(absolute('./package.json')).toString()
  const json = JSON.parse(data)
  const dependencies = json.dependencies

  for (const m in dependencies) {
    if (Object.prototype.hasOwnProperty.call(dependencies, m)) {
      mvs[m] = /\d+\.\d+\.\d+$/g.exec(dependencies[m])[0]
    }
  }

  return mvs
}

// 处理externalConfig，并返回externals
exports.getExternalModules = (config, orign) => {
  const externals = {} // 结果
  const dependencieModules = getModulesVersion() // 获取全部的模块和版本号
  config.forEach(item => {
    // 遍历配置
    if (item.name in dependencieModules) {
      const version = dependencieModules[item.name]
      // 拼接css 和 js 完整链接
      item.css =
        item.css &&
        [orign, item.alias || item.name, version, item.css[mode]].join('/')
      item.js =
        item.js &&
        [orign, item.alias || item.name, version, item.js[mode]].join('/')
      externals[item.name] = item.scope // 为打包时准备
    } else {
      throw new Error('相关依赖未安装，请先执行npm install ' + item.name)
    }
  })
  return externals
}

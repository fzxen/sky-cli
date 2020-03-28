/**
 ** CDN
 */

// cdn镜像源
const cdnBaseHttp = 'https://cdn.bootcss.com'

// external配置
exports.getExternalConfig = () => {
  return [
    {
      name: 'vue',
      scope: 'Vue',
      js: { development: 'vue.js', production: 'vue.min.js' },
    },
    {
      name: 'vue-router',
      scope: 'VueRouter',
      js: { development: 'vue-router.js', production: 'vue-router.min.js' },
    },
    {
      name: 'vuex',
      scope: 'Vuex',
      js: { development: 'vuex.js', production: 'vuex.min.js' },
    },
    {
      name: 'axios',
      scope: 'axios',
      js: { development: 'axios.js', production: 'axios.min.js' },
    },
    // {
    //   name: 'iview',
    //   scope: 'iview',
    //   js: { development: 'iview.js', production: 'iview.min.js' },
    //   css: {
    //     development: 'styles/iview.css',
    //     production: 'styles/iview.css',
    //   },
    // },
    {
      name: 'lodash',
      alias: 'lodash.js',
      scope: '_',
      js: { development: 'lodash.js', production: 'lodash.min.js' },
    },
    // {
    //   name: 'xlsx',
    //   scope: 'XLSX',
    //   js: { development: 'xlsx.full.min.js', production: 'xlsx.full.min.js' },
    // },
    {
      name: 'blueimp-md5',
      scope: 'md5',
      js: { development: 'js/md5.js', production: 'js/md5.min.js' },
    },
    {
      name: 'echarts',
      scope: 'echarts',
      js: { development: 'echarts.js', production: 'echarts.min.js' },
    },
  ]
}

// 获取所有依赖及其版本号
const getModulesVersion = () => {
  const mvs = {}
  const regexp = /^npm_package_.{0,3}dependencies_/gi
  for (const m in process.env) {
    // 从node内置参数中读取，也可直接import 项目文件进来
    if (regexp.test(m)) {
      // 匹配模块
      // 获取到模块版本号
      mvs[m.replace(regexp, '').replace(/_/g, '-')] = process.env[m].replace(
        /(~|\^)/g,
        ''
      )
    }
  }
  return mvs
}

// 处理externalConfig，并返回externals
exports.getExternalModules = (config, mode) => {
  const externals = {} // 结果
  const dependencieModules = getModulesVersion() // 获取全部的模块和版本号
  config.forEach(item => {
    // 遍历配置
    if (item.name in dependencieModules) {
      const version = dependencieModules[item.name]
      // 拼接css 和 js 完整链接
      item.css =
        item.css &&
        [cdnBaseHttp, item.alias || item.name, version, item.css[mode]].join(
          '/'
        )
      item.js =
        item.js &&
        [cdnBaseHttp, item.alias || item.name, version, item.js[mode]].join('/')
      externals[item.name] = item.scope // 为打包时准备
    } else {
      throw new Error('相关依赖未安装，请先执行npm install ' + item.name)
    }
  })
  return externals
}

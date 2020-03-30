import fs from 'fs'
import WebpackMerge from 'webpack-merge'
import WebpackChain from 'webpack-chain'

export const isFoldExist = async name => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(name)) reject(new Error(`${name} has existed`))
    else resolve()
  })
}

export const isNone = obj => obj === undefined || obj === null

export const getCreateQuestions = ({ name }) => {
  return [
    {
      type: 'list',
      name: 'frame',
      message: 'please choose this project template',
      choices: ['vue', 'react'],
    },
    {
      type: 'input',
      name: 'name',
      message: 'Please enter the project name: ',
      default: name,
      validate(value) {
        if (!value) return 'you must provide the name'

        return true
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'Please enter the project description: ',
      validate(value) {
        if (!value) return 'you must provide the description'

        return true
      },
    },
    {
      type: 'input',
      name: 'author',
      message: 'Please enter the author name: ',
      default: 'fanzhongxu',
      validate(value) {
        if (!value) return 'you must provide the author'

        return true
      },
    },
  ]
}

export const gitSources = {
  vue: {
    url: 'direct:https://gitee.com/zxffan/templates.git#vue-spa',
  },
  react: {
    url: '',
  },
  electron: {
    url: '',
  },
}

export const updateJsonFile = (path, obj) => {
  return new Promise(resolve => {
    if (fs.existsSync(path)) {
      const data = fs.readFileSync(path).toString()
      const json = JSON.parse(data)
      Object.assign(json, obj)
      fs.writeFileSync(path, JSON.stringify(json, null, '\t'))
      resolve()
    }
  })
}

export const getType = target =>
  Object.prototype.toString.call(target).match(/\s(\w*)]$/)[1]
export const isBaseType = target =>
  ['number', 'string', 'boolean', 'undefined', 'null'].indexOf(
    getType(target)
  ) >= 0

// * init
export const getInitQuestions = () => {
  return [
    {
      type: 'confirm',
      message: 'Do you need initialize a git repository',
      name: 'git',
      default: false,
    },
  ]
}

// * dev & build
export const getCliConfig = (path, options = {}) => {
  const defaultCliConfig = {
    /**
     * * property: configureWebpack
     * * type: object | function
     * * 这会直接merge到最终webpack配置
     */
    configureWebpack: {}, // 这会直接merge到最终webpack配置

    /**
     * * property: chainWebpack
     * * type: function
     * * 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
     */
    chainWebpack: config => {},

    /**
     * * property: devServer
     * * type: object
     * * 会传递给webpack-dev-server
     */
    devServer: {},

    /**
     * * property: css
     * * type: object
     * * 与css相关的配置
     */
    css: {
      loaderOption: {
        scss: {
          prependData: [],
        },
        less: {
          prependData: [],
        },
      },
    },
    /**
     * * property: analysis
     * * type: boolean
     * * 若为tru， 打包时会启用BundleAnalyzerPlugin
     */
    analysis: false,
  }

  function getConfig() {
    const genConfig = require(path)
    const cliConfig = require(`${process.cwd()}/cli.config.js`)
    const { configureWebpack, chainWebpack, devServer, ...args } = WebpackMerge(
      defaultCliConfig,
      cliConfig
    )

    const chainConfig = new WebpackChain()
    chainWebpack(chainConfig)

    return WebpackMerge(
      genConfig(Object.assign(args, options)),
      configureWebpack,
      chainConfig.toConfig(),
      {
        devServer,
      }
    )
  }

  return getConfig()
}

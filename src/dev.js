import ora from 'ora'
import Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import WebpackMerge from 'webpack-merge'
import WebpackChain from 'webpack-chain'

// import { isNone } from './util'

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
}

function getConfig() {
  let config = require('../src/frames/vue/webpack.dev')
  const cliConfig = require(`${process.cwd()}/cli.config.js`)
  const { configureWebpack, chainWebpack, devServer } =
    cliConfig || defaultCliConfig

  const chainConfig = new WebpackChain()
  chainWebpack(chainConfig)

  config = WebpackMerge(config, configureWebpack, chainConfig.toConfig(), {
    devServer,
  })

  return config
}

export default port => {
  const loading = ora()
  loading.start('app is starting...')

  // set enviroment
  process.env.NODE_ENV = 'development'

  const config = getConfig()

  const compiler = Webpack(config)
  compiler.hooks.done.tap('buildTip', stats => {
    loading.succeed(
      `compile successfully!
      please open  http://localhost:${port}`
    )
  })
  compiler.hooks.failed.tap('buildTip', err => {
    loading.fail(err)
  })

  port = config.devServer.port || port
  const host = config.devServer.host || 'localhost'
  new WebpackDevServer(compiler, config.devServer || {}).listen(port, host)
}

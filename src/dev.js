import ora from 'ora'
import Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { getCliConfig } from './util'

export default port => {
  const loading = ora()
  loading.start('app is starting...')

  // set enviroment
  process.env.NODE_ENV = 'development'

  const config = getCliConfig('../src/frames/vue/webpack.dev')

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

  port = port || config.devServer.port
  const host = config.devServer.host || 'localhost'
  new WebpackDevServer(compiler, config.devServer || {}).listen(port, host)
}

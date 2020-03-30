import ora from 'ora'
import Webpack from 'webpack'

import { getCliConfig } from '../util'

module.exports = ({ analysis }) => {
  const loading = ora()
  loading.start('app is building...')

  // set enviroment
  process.env.NODE_ENV = 'production'

  const config = getCliConfig('../frames/vue/webpack.prod', { analysis })

  const compiler = Webpack(config)

  compiler.hooks.done.tap('buildTip', stats => {
    loading.succeed('build successfully!')
  })
  compiler.hooks.failed.tap('buildTip', err => {
    loading.fail(err)
  })

  compiler.run()
}

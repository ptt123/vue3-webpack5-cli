// 开发环境
const WebpackConfig = require('./webpack.config.js')
const { merge } = require('webpack-merge')

module.exports = merge(WebpackConfig, {
  mode: 'development',
  // devtool: 'eval-cheap-module-source-map',
  devServer: {
    compress: true,
    host: 'localhost',
    port: 8889,
    open: true,
    hot: true,
    client: {
      logging: 'error',
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    },
    proxy: {},
  },
})

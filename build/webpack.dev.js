// 开发环境
const WebpackConfig = require('./webpack.config.js')
const { merge } = require('webpack-merge')

module.exports = merge(WebpackConfig, {
  mode: 'development',
  // devtool: 'eval-cheap-module-source-map',
  devServer: {
    port: 8889,
    static: '../dist',
    hot: true,
  },
})

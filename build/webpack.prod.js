// 生产环境
const path = require('path')
const WebpackConfig = require('./webpack.config.js')
const { merge } = require('webpack-merge')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(WebpackConfig, {
  mode: 'production',
  // devtool: 'nosources-source-map', // 这里我们生产环境就不生成source map了，会增加代码体积。而且启用还会影响构建和重新构建的速度。
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false, // terserOptions.format.comments 选项指定是否保留注释
          },
          compress: {
            // 生产环境去除console
            drop_console: true,
            // 生产环境去除debugger
            drop_debugger: true,
          },
        },
        extractComments: false, // 是否将注释剥离到单独的文件中
        parallel: true, // 使用多进程并发运行以提高构建速度
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    // 处理静态文件夹static，复制到打包的static文件夹
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'),
          to: path.resolve(__dirname, '../dist/static'),
        },
      ],
    }),
  ],
})

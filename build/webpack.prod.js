// 生产环境
const path = require('path')
const WebpackConfig = require('./webpack.config.js')
const { merge } = require('webpack-merge')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin') // 压缩资源with Content-Encoding gzip/deflate/br
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const config = merge(WebpackConfig, {
  mode: 'production',
  // devtool: 'nosources-source-map', // 这里我们生产环境就不生成source map了，会增加代码体积。而且启用还会影响构建和重新构建的速度。
  optimization: {
    runtimeChunk: 'single', // 提取入口chunk中的boilerplate（boilerplate 指 webpack 运行时的引导代码），比如runtime，manifest
    moduleIds: 'deterministic',
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
    // 公共代码抽离
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial', // only package third parties that are initially dependent
        },
        antdv: {
          name: 'chunk-ant-design-vue', // split ant-design-vue into a single package
          priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          test: /[\\/]node_modules[\\/]_?ant-design-vue(.*)/, // in order to adapt to cnpm
        },
        commons: {
          name: 'chunk-commons',
          test: path.join(__dirname, 'src/components'), // can customize your rules
          minChunks: 3, // 被引用3次就提取出来
          priority: 5,
          reuseExistingChunk: true, // 表示是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
        },
      },
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
    new CompressionPlugin({
      test: /\.(js|css|html)?$/i, // 压缩文件格式
      algorithm: 'gzip', // 压缩算法：gzip
      // 只有大小大于该值的资源会被处理。单位是 bytes。默认值是 0。
      threshold: 10240, // 大于10K的才会被压缩
    }),
  ],
})

if (process.env.IS_REPORT === 'true') {
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerPort: 9999,
    }),
  )
}
module.exports = (env) => {
  if (env.goal === 'report') {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerPort: 9999,
      }),
    )
  }
  return config
}

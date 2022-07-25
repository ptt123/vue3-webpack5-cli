module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        moduels: false, // 关闭模块导入导出语句的转译,使得对ESM进行tree shaking
        // 处理polyfill
        useBuiltIns: 'usage', // useBuiltIns默认为false，如果我们使用默认值或者entry值，又需要polyfill,则需要在入口文件引入import 'core-js/stable' import 'regenerator-runtime/runtime'
        corejs: {
          // 需要安装core-js
          version: 3.23,
          proposals: true,
        },
      },
    ],
    [
      '@babel/preset-typescript',
      {
        allExtensions: true, // 支持所有文件扩展名，否则在vue文件中使用ts会报错
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime', // 这里只使用其移除内联复用的辅助函数的特性，减小打包体积
      {
        corejs: false,
      },
    ],
  ],
}

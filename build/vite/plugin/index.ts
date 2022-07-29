import type { Plugin, PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import windiCSS from 'vite-plugin-windicss'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteCompression from 'vite-plugin-compression'

export function createVitePlugins(isBuild: boolean) {
  const vitePlugins: (Plugin | Plugin[] | PluginOption[])[] = [
    // 提供 Vue 3 单文件组件支持
    vue(),
    // vite 可以使用 jsx/tsx 语法
    vueJsx(),
    // name 可以写在 script 标签上
    vueSetupExtend(),
    createHtmlPlugin({
      minify: true,
      entry: 'src/main.ts',
      template: '/index.html',
      inject: {
        data: {
          title: 'vite app',
          isVite: true,
        },
      },
    }),
  ]
  // vite-plugin-windicss
  vitePlugins.push(windiCSS())
  if (isBuild) {
    // gzip compress
    vitePlugins.push(
      viteCompression({
        threshold: 10240, // 大于10K的才会被压缩
        algorithm: 'gzip', // 压缩算法：gzip
        ext: '.gz', // 文件扩展名
        deleteOriginFile: false, // 是否删除源文件
      }),
    )
  }
  return vitePlugins
}

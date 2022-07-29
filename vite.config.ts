// vite.config.ts
import { defineConfig, UserConfig, ConfigEnv } from 'vite'
import { resolve } from 'path'
import { createVitePlugins } from './build/vite/plugin'

export default defineConfig(({ command }: ConfigEnv): UserConfig => {
  const isBuild = command === 'build'
  return {
    root: './',
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
      extensions: ['.ts', '.tsx', '.js'],
    },
    // global css
    css: {
      postcss: './postcss.config.js',
      preprocessorOptions: {
        // 预处理器选项
        scss: {
          additionalData: `@import "@/assets/var.less";@import "@/assets/base.less"`,
        },
      },
    },
    // 开发服务器配置
    server: {
      host: true, // true表示监听所有地址，包括局域网和公网地址
      port: 3000,
      open: true,
    },
    // 构建配置
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      minify: 'terser',
      terserOptions: {
        format: {
          comments: false, // terserOptions.format.comments 选项指定是否保留注释
        },
        compress: {
          keep_infinity: true,
          // 生产环境去除console
          drop_console: true,
          // 生产环境去除debugger
          drop_debugger: true,
        },
      },
      chunkSizeWarningLimit: 2000,
    },
    // plugins
    plugins: createVitePlugins(isBuild),
  }
})

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  //配置代理
  server: {
    port: 3001,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        changeOrigin: true,
        target: "http://localhost:8080",
        rewrite: (path) => path.replace(/^\/api/,""), //发送请求是去掉/api
      }
    }
  }
})

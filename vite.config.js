import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // 需導入 Node.js 的 path 模組

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // 將 '@' 映射到項目的 src 目錄
      '@': path.resolve(__dirname, './src')
    }
  }
})

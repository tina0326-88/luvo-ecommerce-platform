import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path"; // 需導入 Node.js 的 path 模組

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // 讓專案裡所有 "@/xxx" 的 import 路徑對應到 src 目錄，
    // 對照先前所有元件、store、router 檔案裡用到的 @/ 寫法
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});

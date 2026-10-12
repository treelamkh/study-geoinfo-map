import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 加入這一行，告訴 Vite 打包時靜態資源的相對根路徑
  base: '/study-geoinfo-map/'
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 监听所有 IPv4 地址
    allowedHosts: ['11534iq8fo748.vicp.fun'], // 允许特定的内网穿透域名访问
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8090',
        changeOrigin: true,
      }
    }
  }
})
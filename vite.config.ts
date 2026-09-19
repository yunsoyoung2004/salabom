import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/hira': {
        target: 'https://apis.data.go.kr/B551182',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hira/, ''),
      },
      '/api/tour': {
        target: 'https://apis.data.go.kr/B551011',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tour/, ''),
      },
      '/api/weather': {
        target: 'https://apis.data.go.kr/1360000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/weather/, ''),
      },
      '/api/housing': {
        target: 'https://apis.data.go.kr/1613000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/housing/, ''),
      },
      '/api/pharmacy': {
        target: 'https://apis.data.go.kr/B552657',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/pharmacy/, ''),
      },
      '/api/standard': {
        target: 'https://api.data.go.kr/openapi',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/standard/, ''),
      },
    },
  },
})

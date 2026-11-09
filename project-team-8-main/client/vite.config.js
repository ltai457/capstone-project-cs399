import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
          target: env.API_PROXY_TARGET || 'https://localhost:8080',
          changeOrigin: true,
          secure: false, // Local ASP.NET development certificate only.
        },
      },
    },
    build: { outDir: '../wwwroot/app', emptyOutDir: true },
    base: '/app/',
  }
})

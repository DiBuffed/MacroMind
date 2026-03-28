import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        landing: resolve(rootDir, 'index.html'),
        app: resolve(rootDir, 'app.html'),
      },
    },
  },
  server: {
    host: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8791',
        changeOrigin: true,
      },
    },
  },
})

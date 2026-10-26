import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const apiProxy = {
  '/api': {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
    xfwd: true,
  },
  '/app': {
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    ws: true,
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
    proxy: apiProxy,
  },
  preview: {
    host: true,
    allowedHosts: true,
    proxy: apiProxy,
  },
  optimizeDeps: {
    include: [
      "@tiptap/core",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "@tiptap/extensions",
    ],
  },
})

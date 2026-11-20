import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    // In development the contact form calls the local Java service. The Java
    // service treats a foreign Origin as cross-site, so the dev proxy presents
    // the request as same-origin; production calls the service directly and is
    // listed in its ALLOWED_ORIGINS instead.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('origin', 'http://127.0.0.1:8080')
          })
        },
      },
    },
    // Extra preview hostnames are supplied per process, never hardcoded here.
    allowedHosts: (process.env.VITE_ALLOWED_HOSTS || '')
      .split(',')
      .map((host) => host.trim())
      .filter(Boolean),
  },
})

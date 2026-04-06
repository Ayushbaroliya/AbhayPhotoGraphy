import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['mongoose', 'jsonwebtoken', 'bcryptjs', 'cloudinary', 'dotenv', 'cors']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    },
    watch: {
      ignored: ['**/api/**']
    }
  }
})

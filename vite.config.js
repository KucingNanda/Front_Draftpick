import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500, // Menaikkan batas peringatan menjadi 1.5MB
    rollupOptions: {
      output: {
        manualChunks: {
          // Memisahkan library besar agar file tidak menumpuk di satu tempat
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['sweetalert2', 'lucide-react']
        }
      }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'  // ⭐ Ganti ke SWC
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),        // Sekarang pakai SWC
    tailwindcss(),
  ],
  base: './',
})
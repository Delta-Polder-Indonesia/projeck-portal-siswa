import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // <-- Kembalikan ke swc
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/projeck-portal-siswa/', // Jalur GitHub Pages yang sudah benar
})
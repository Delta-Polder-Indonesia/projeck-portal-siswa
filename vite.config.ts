import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/projeck-portal-siswa/',  // ✅ Sesuaikan dengan nama repo
  build: {
    rollupOptions: {
      output: {
        // Memecah library dari node_modules menjadi chunk terpisah agar tidak menumpuk di satu file besar
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    // Menaikkan batas peringatan ukuran chunk menjadi 1500 kB (1.5 MB) sebagai antisipasi
    chunkSizeWarningLimit: 1500
  }
})
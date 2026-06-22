import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
// Hapus import viteSingleFile jika sudah tidak digunakan

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Hapus viteSingleFile() dari sini
  ],
  // Ubah base sesuai nama repositori GitHub Pages Anda
  base: '/projeck-portal-siswa/', 
  build: {
    // Kembalikan ke default agar CSS dan JS terpisah dengan benar
    cssCodeSplit: true, 
    target: 'esnext'
  }
})
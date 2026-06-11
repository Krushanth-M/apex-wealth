import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.BUILD_FOR_PAGES === 'true' ? '/apex-wealth/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})

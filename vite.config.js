import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/pump-dashboard/',
  plugins: [
    react(),
    tailwindcss(), // <-- Add the plugin
  ],
  build: {
    outDir: 'dist',   // default build folder
  },
})
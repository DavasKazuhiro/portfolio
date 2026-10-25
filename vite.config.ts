/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  // Caminhos relativos: o build funciona em GitHub Pages (subpasta) ou Vercel (raiz).
  base: './',
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    // O chunk do Phaser tem ~1,4 MB (~360 KB gzip) e é esperado.
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        // Phaser é grande e muda pouco: chunk separado para cache.
        manualChunks: (id) => (id.includes('node_modules/phaser') ? 'phaser' : undefined),
      },
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
})

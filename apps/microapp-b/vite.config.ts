import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'microapp-b',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/mount.tsx',
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
  preview: { port: 5002 },
})

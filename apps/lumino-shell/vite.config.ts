import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'lumino-shell',
      filename: 'remoteEntry.js',
      exposes: {
        './Shell': './src/mount.tsx',
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
  preview: { port: 5003 },
})

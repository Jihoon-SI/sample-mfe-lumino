import { defineConfig } from 'vite'

// preview 전용 설정 — 빌드 없음, vite preview로 정적 파일 서빙
export default defineConfig({
  build: { outDir: '.' },
  preview: { port: 5000, cors: true },
})

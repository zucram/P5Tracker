import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'
import { fileURLToPath } from 'node:url'

// Get git branch name
let branchName = 'unknown'
try {
  branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
} catch (e) {
  console.warn('Could not determine git branch name')
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __BRANCH__: JSON.stringify(branchName)
  },
  build: {
    rollupOptions: {
      input: {
        home: fileURLToPath(new URL('./index.html', import.meta.url)),
        royal: fileURLToPath(new URL('./p5/index.html', import.meta.url)),
        reload: fileURLToPath(new URL('./p3/index.html', import.meta.url)),
        legacyReload: fileURLToPath(new URL('./games/persona-3-reload/index.html', import.meta.url)),
        legacyGames: fileURLToPath(new URL('./games/index.html', import.meta.url))
      }
    }
  },
  base: '/P5Tracker/', // REQUIRED: Must match your GitHub repository name
  server: {
    host: true,
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project URL: https://<user>.github.io/<repo>/
// In CI, GITHUB_REPOSITORY is "owner/repo" — use repo name so base always matches the GitHub repo.
const repoFromEnv = process.env.GITHUB_REPOSITORY?.split('/').pop()
const basePath =
  process.env.CI && repoFromEnv ? `/${repoFromEnv}/` : '/'

export default defineConfig({
  base: basePath,
  plugins: [react()],
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
  },
})

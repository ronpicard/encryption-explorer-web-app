import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project URL: https://<user>.github.io/<repo>/
// If you rename the repo, update this path to match (leading + trailing slash).
const repoName = 'encryption-explorer-web-app'

export default defineConfig({
  base: process.env.CI ? `/${repoName}/` : '/',
  plugins: [react()],
})

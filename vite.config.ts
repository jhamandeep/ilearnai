import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { newsPlugin } from './server/news-plugin.mjs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), newsPlugin()],
})

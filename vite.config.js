import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        // Shared libraries in a few long-cached files instead of hundreds of tiny ones
        // (lucide would otherwise emit one file per icon once pages are split)
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/ },
            { name: 'icons', test: /node_modules[\\/]lucide-react[\\/]/ },
          ],
        },
      },
    },
  },
  server: {
    // Same-origin API in development: run the FastAPI app on 127.0.0.1:8000
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
})

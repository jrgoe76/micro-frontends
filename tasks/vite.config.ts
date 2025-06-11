import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'tasks',
      filename: 'remoteEntry.js',
      exposes: {
        // Expose our Tasks component
        './Tasks': './src/Tasks.tsx'
      },
      shared: {
        // Share React and React-DOM with the host
        'react': '^19.1.0',
        'react-dom': '^19.1.0'
      }
    })
  ],
  server: {
    port: 5081,
    host: true
  },
  preview: {
    port: 5081,
    host: true
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})

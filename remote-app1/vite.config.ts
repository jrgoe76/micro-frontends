import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'remote-app1',
      filename: 'remoteEntry.js',
      exposes: {
        // Expose our Task Manager component
        './TaskManager': './src/TaskManager.tsx'
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

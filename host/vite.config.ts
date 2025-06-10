import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'micro-frontend-host',
      remotes: {
        // Remote micro-frontend - consistent port 5081 for both dev and prod
        'remote-app1': 'http://localhost:5081/assets/remoteEntry.js',
      },
      shared: {
        // Share React and React-DOM between host and remotes
        'react': '^19.1.0',
        'react-dom': '^19.1.0'
      }
    })
  ],
  server: {
    port: 5080,
    host: true
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})

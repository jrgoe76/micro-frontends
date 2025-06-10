import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TaskManager from './TaskManager.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="standalone-app">
      <header className="standalone-header">
        <h1>🌐 Remote Micro-Frontend</h1>
        <p>
          This is a standalone micro-frontend application that can run independently
          or be consumed via Module Federation by a host application.
        </p>
        <div className="standalone-badge">
          Standalone Mode - Port 5081
        </div>
      </header>

      <main className="standalone-content">
        <TaskManager />
      </main>

      <footer className="standalone-footer">
        <p>🚀 Built with React 19.1 + TypeScript + Vite</p>
        <p>⚡ Module Federation Ready</p>
      </footer>
    </div>
  </StrictMode>,
)

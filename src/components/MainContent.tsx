import React from 'react';
import type { AppId, MicroFrontendApp } from '../types/index.ts';
import './MainContent.css';

interface MainContentProps {
  activeApp: AppId;
}

const MainContent: React.FC<MainContentProps> = ({ activeApp }) => {
  // This is placeholder content for our micro-frontend apps
  // In a real implementation, this would dynamically load the actual micro-frontend
  const apps: Record<AppId, MicroFrontendApp> = {
    app1: {
      id: 'app1',
      name: 'Application One',
      description: 'This is a placeholder for Micro-Frontend Application 1. In a real implementation, this would be dynamically loaded from a separate application bundle.',
      isActive: activeApp === 'app1'
    },
    app2: {
      id: 'app2',
      name: 'Application Two',
      description: 'This is a placeholder for Micro-Frontend Application 2. In a real implementation, this would be dynamically loaded from a separate application bundle.',
      isActive: activeApp === 'app2'
    }
  };

  const currentApp = apps[activeApp];

  return (
    <main className="main-content">
      <div className="app-container">
        <div className="app-header">
          <h1>{currentApp.name}</h1>
          <div className="app-badge">Micro-Frontend</div>
        </div>
        
        <div className="app-content">
          <p>{currentApp.description}</p>
          
          {/* Placeholder UI elements to simulate app content */}
          <div className="placeholder-ui">
            <div className="placeholder-card">
              <div className="placeholder-header"></div>
              <div className="placeholder-body"></div>
            </div>
            <div className="placeholder-card">
              <div className="placeholder-header"></div>
              <div className="placeholder-body"></div>
            </div>
            <div className="placeholder-card">
              <div className="placeholder-header"></div>
              <div className="placeholder-body"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;

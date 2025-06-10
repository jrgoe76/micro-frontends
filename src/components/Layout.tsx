import React, { useState } from 'react';
import type { AppId } from '../types/index.ts';
import Navigation from './Navigation';
import MainContent from './MainContent';
import './Layout.css';

const Layout: React.FC = () => {
  // State to manage which micro-frontend app is currently active
  const [activeApp, setActiveApp] = useState<AppId>('app1');

  const handleAppChange = (appId: AppId) => {
    setActiveApp(appId);
    console.log(`Switching to ${appId}`); // For debugging
  };

  return (
    <div className="layout">
      <Navigation 
        activeApp={activeApp} 
        onAppChange={handleAppChange} 
      />
      <MainContent activeApp={activeApp} />
    </div>
  );
};

export default Layout;

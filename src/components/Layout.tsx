import React, { useState, useMemo, useEffect } from 'react';
import type { AppId, MicroFrontendLoader } from '../types/index.ts';
import Navigation from './Navigation';
import { useMicroFrontendCache } from '../hooks/useMicroFrontendCache';
import './Layout.css';

const Layout: React.FC = () => {
  // State to manage which micro-frontend app is currently active
  const [activeApp, setActiveApp] = useState<AppId>('app1');

  // Memoize the loader functions to prevent recreation on every render
  const microFrontendLoaders = useMemo<Record<AppId, MicroFrontendLoader>>(() => ({
    app1: () => import('../micro-frontends/App1/index.tsx'),
    app2: () => import('../micro-frontends/App2/index.tsx')
  }), []); // Empty dependency array since these imports never change

  // Use our caching hook for micro-frontend management
  const {
    loadComponent,
    getCachedComponent,
    isLoading,
    clearCache
  } = useMicroFrontendCache();

  // Load the current app if not already cached
  useEffect(() => {
    const cachedComponent = getCachedComponent(activeApp);

    // Only load if not already cached or if there was an error
    if (!cachedComponent || (!cachedComponent.isLoaded && !cachedComponent.error)) {
      const loader = microFrontendLoaders[activeApp];
      loadComponent(activeApp, loader);
    }
  }, [activeApp, loadComponent, getCachedComponent, microFrontendLoaders]);

  const handleAppChange = (appId: AppId) => {
    setActiveApp(appId);
    console.log(`Switching to ${appId}`); // For debugging
  };

  // Get cached component data for current app
  const cachedComponent = getCachedComponent(activeApp);
  const isCurrentAppLoading = isLoading(activeApp);

  return (
    <div className="layout">
      <Navigation
        activeApp={activeApp}
        onAppChange={handleAppChange}
      />

      <main className="main-content">
        {/* Loading state for current app */}
        {isCurrentAppLoading && (
          <div className="app-container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <h2>Loading Micro-Frontend...</h2>
              <p>Dynamically importing {activeApp.toUpperCase()} module</p>
            </div>
          </div>
        )}

        {/* Error state for current app */}
        {cachedComponent?.error && (
          <div className="app-container">
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h2>Failed to Load Micro-Frontend</h2>
              <p className="error-message">{cachedComponent.error}</p>
              <button
                onClick={() => {
                  clearCache(activeApp);
                  // Trigger reload by forcing useEffect to run again
                  const loader = microFrontendLoaders[activeApp];
                  loadComponent(activeApp, loader);
                }}
                className="retry-button"
              >
                Retry Loading
              </button>
            </div>
          </div>
        )}

        {/* Success state - render cached components with conditional visibility */}
        {!isCurrentAppLoading && !cachedComponent?.error && (
          <div className="dynamic-app-container">
            <div className="dynamic-app-header">
              <div className="dynamic-badge">
                🚀 Dynamically Loaded: {activeApp.toUpperCase()}
                {cachedComponent?.isLoaded && ' (State Preserved)'}
              </div>
            </div>

            {/* Render App1 - hidden when not active but keeps state */}
            <div style={{ display: activeApp === 'app1' ? 'block' : 'none' }}>
              {(() => {
                const app1Cache = getCachedComponent('app1');
                if (app1Cache?.isLoaded && app1Cache.component) {
                  const App1Component = app1Cache.component;
                  return <App1Component />;
                }
                return null;
              })()}
            </div>

            {/* Render App2 - hidden when not active but keeps state */}
            <div style={{ display: activeApp === 'app2' ? 'block' : 'none' }}>
              {(() => {
                const app2Cache = getCachedComponent('app2');
                if (app2Cache?.isLoaded && app2Cache.component) {
                  const App2Component = app2Cache.component;
                  return <App2Component />;
                }
                return null;
              })()}
            </div>

            {/* Fallback if no component is loaded */}
            {!cachedComponent?.isLoaded && (
              <div className="fallback-container">
                <h2>No Content Available</h2>
                <p>Unable to load the requested micro-frontend.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Layout;

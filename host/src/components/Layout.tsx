import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { AppId, MicroFrontendLoader } from '../types/index.ts';
import Navigation from './Navigation';
import FederationFallback from './FederationFallback';
import { useMicroFrontendCache } from '../hooks/useMicroFrontendCache';
import './Layout.css';

const Layout: React.FC = () => {
  // State to manage which micro-frontend app is currently active
  const [activeApp, setActiveApp] = useState<AppId>('tasks');

  // Memoize the loader functions to prevent recreation on every render
  const microFrontendLoaders = useMemo<Record<AppId, MicroFrontendLoader>>(() => ({
    // Use Module Federation for Tasks (federated remote component)
    tasks: () => {
      console.log('🌐 Attempting to load tasks/Tasks via Module Federation...');
      return import('tasks/Tasks')
        .then((module) => {
          console.log('✅ Module Federation successful for Tasks:', module);
          return module;
        })
        .catch((error) => {
          // Let the error propagate to show FederationFallback
          console.error('❌ Module Federation failed for Tasks:', error);
          throw error; // Re-throw to trigger error state
        });
    },
    // Keep Contacts as local dynamic import for comparison
    contacts: () => {
      console.log('📦 Loading Contacts via local dynamic import...');
      return import('../features/contacts/Contacts.tsx');
    }
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

    // Only load if not already cached and not in error state and not currently loading
    if (!cachedComponent || (!cachedComponent.isLoaded && !cachedComponent.error)) {
      console.log(`📋 Loading ${activeApp} - not cached or in error state`);
      const loader = microFrontendLoaders[activeApp];
      loadComponent(activeApp, loader);
    } else if (cachedComponent.isLoaded) {
      console.log(`✅ ${activeApp} already cached and loaded`);
    } else if (cachedComponent.error) {
      console.log(`❌ ${activeApp} in error state: ${cachedComponent.error}`);
    }
  }, [activeApp, getCachedComponent, loadComponent, microFrontendLoaders]); // Include all dependencies

  const handleAppChange = (appId: AppId) => {
    setActiveApp(appId);
    console.log(`Switching to ${appId}`); // For debugging
  };

  // Create a stable retry function
  const handleRetry = useCallback(async (appId: AppId) => {
    console.log(`🔄 Retrying to load ${appId}...`);

    try {
      // Clear the cache first
      clearCache(appId);

      // Force a small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 50));

      // Get the loader and attempt to load
      const loader = microFrontendLoaders[appId];
      await loadComponent(appId, loader);

      console.log(`✅ Retry successful for ${appId}`);
    } catch (error) {
      console.error(`❌ Retry failed for ${appId}:`, error);
    }
  }, [clearCache, loadComponent, microFrontendLoaders]);

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
          <>
            {activeApp === 'tasks' ? (
              // Use FederationFallback for Tasks (Module Federation failures)
              <FederationFallback
                appName="Federated Task Manager"
                error={cachedComponent.error}
                onRetry={() => handleRetry(activeApp)}
              />
            ) : (
              // Use generic error for other apps
              <div className="app-container">
                <div className="error-container">
                  <div className="error-icon">⚠️</div>
                  <h2>Failed to Load Micro-Frontend</h2>
                  <p className="error-message">{cachedComponent.error}</p>
                  <button
                    onClick={() => handleRetry(activeApp)}
                    className="retry-button"
                  >
                    Retry Loading
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Render components with state preservation - always render loaded components */}
        <div className="micro-frontend-container">
          {/* Show header only when not loading and not in error */}
          {!isCurrentAppLoading && !cachedComponent?.error && (
            <div className="dynamic-app-header">
              <div className="dynamic-badge">
                {activeApp === 'tasks' ? '🌐 Module Federation' : '📦 Dynamic Import'}: {activeApp.toUpperCase()}
                {cachedComponent?.isLoaded && ' (State Preserved)'}
              </div>
            </div>
          )}

          {/* Tasks - always render if loaded to preserve state */}
          {(() => {
            const tasksCache = getCachedComponent('tasks');
            if (tasksCache?.isLoaded && tasksCache.component) {
              const TasksComponent = tasksCache.component;
              const shouldShow = activeApp === 'tasks' && !tasksCache.error && !isLoading('tasks');
              return (
                <div
                  key="tasks-container"
                  style={{
                    display: shouldShow ? 'block' : 'none'
                  }}
                >
                  <TasksComponent />
                </div>
              );
            }
            return null;
          })()}

          {/* Contacts - always render if loaded to preserve state */}
          {(() => {
            const contactsCache = getCachedComponent('contacts');
            if (contactsCache?.isLoaded && contactsCache.component) {
              const ContactsComponent = contactsCache.component;
              const shouldShow = activeApp === 'contacts' && !contactsCache.error && !isLoading('contacts');
              return (
                <div
                  key="contacts-container"
                  style={{
                    display: shouldShow ? 'block' : 'none'
                  }}
                >
                  <ContactsComponent />
                </div>
              );
            }
            return null;
          })()}

          {/* Show fallback only when current app is not loaded and not loading and not in error */}
          {!isCurrentAppLoading && !cachedComponent?.error && !cachedComponent?.isLoaded && (
            <div className="fallback-container">
              <h2>No Content Available</h2>
              <p>Unable to load the requested micro-frontend.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;

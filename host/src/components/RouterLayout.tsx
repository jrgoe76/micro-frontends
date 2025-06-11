import React, { useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import type { AppId, MicroFrontendLoader } from '../types/index.ts';
import Navigation from './Navigation';
import FederationFallback from './FederationFallback';
import EnhancedLoader from './EnhancedLoader';
import SkeletonLoader from './SkeletonLoader';
import { useMicroFrontendCache } from '../hooks/useMicroFrontendCache';
import { useLoadingStates } from '../hooks/useLoadingStates';
import './Layout.css';

const RouterLayout: React.FC = () => {
  const { appId } = useParams<{ appId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active app from URL, default to app1 for root path
  const activeApp: AppId = useMemo(() => {
    if (location.pathname === '/' || location.pathname === '/app1' || appId === 'app1') {
      return 'app1';
    } else if (location.pathname === '/users' || appId === 'users') {
      return 'users';
    }
    // Default to app1 for any unrecognized routes
    return 'app1';
  }, [location.pathname, appId]);

  // Memoize the loader functions to prevent recreation on every render
  const microFrontendLoaders = useMemo<Record<AppId, MicroFrontendLoader>>(() => ({
    // Use Module Federation for App1 (federated remote component)
    app1: () => {
      console.log('🌐 Attempting to load remote-app1/TaskManager via Module Federation...');
      return import('remote-app1/TaskManager')
        .then((module) => {
          console.log('✅ Module Federation successful for App1:', module);
          return module;
        })
        .catch((error) => {
          // Let the error propagate to show FederationFallback
          console.error('❌ Module Federation failed for App1:', error);
          throw error; // Re-throw to trigger error state
        });
    },
    // Keep Users as local dynamic import for comparison
    users: () => {
      console.log('📦 Loading Users via local dynamic import...');
      return import('../micro-frontends/Users/index.tsx');
    }
  }), []); // Empty dependency array since these imports never change

  // Use our caching hook for micro-frontend management
  const {
    loadComponent,
    getCachedComponent,
    isLoading,
    clearCache
  } = useMicroFrontendCache();

  // Use enhanced loading states
  const {
    startLoading,
    completeLoading,
    timeoutLoading,
    isInPhase,
    getLoadingMetrics
  } = useLoadingStates();

  // Load the current app if not already cached
  useEffect(() => {
    const cachedComponent = getCachedComponent(activeApp);

    // Only load if not already cached and not in error state and not currently loading
    if (!cachedComponent || (!cachedComponent.isLoaded && !cachedComponent.error)) {
      console.log(`📋 Loading ${activeApp} - not cached or in error state`);

      // Start enhanced loading sequence
      startLoading(activeApp);

      const loader = microFrontendLoaders[activeApp];
      loadComponent(activeApp, loader)
        .then(() => {
          console.log(`✅ ${activeApp} loading completed`);
          completeLoading(activeApp);
        })
        .catch((error) => {
          console.error(`❌ ${activeApp} loading failed:`, error);
          // Error handling is managed by the cache hook
        });
    } else if (cachedComponent.isLoaded) {
      console.log(`✅ ${activeApp} already cached and loaded`);
      completeLoading(activeApp);
    } else if (cachedComponent.error) {
      console.log(`❌ ${activeApp} in error state: ${cachedComponent.error}`);
    }
  }, [activeApp, getCachedComponent, loadComponent, microFrontendLoaders, startLoading, completeLoading]);

  // Handle app navigation via React Router
  const handleAppChange = useCallback((appId: AppId) => {
    console.log(`🧭 Navigating to ${appId} via React Router`);
    if (appId === 'app1') {
      navigate('/app1');
    } else if (appId === 'users') {
      navigate('/users');
    }
  }, [navigate]);

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
        {/* Enhanced loading states for current app */}
        {isCurrentAppLoading && (
          <>
            {isInPhase(activeApp, 'enhanced') && (
              <EnhancedLoader
                appId={activeApp}
                appName={activeApp === 'app1' ? 'Federated Task Manager' : 'User Management System'}
                loadingType={activeApp === 'app1' ? 'federation' : 'local'}
                onTimeout={() => timeoutLoading(activeApp)}
              />
            )}

            {isInPhase(activeApp, 'skeleton') && (
              <SkeletonLoader
                appId={activeApp}
                appName={activeApp === 'app1' ? 'Federated Task Manager' : 'User Management System'}
              />
            )}

            {/* Fallback to basic loading if not in enhanced phases */}
            {!isInPhase(activeApp, 'enhanced') && !isInPhase(activeApp, 'skeleton') && (
              <div className="app-container">
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <h2>Loading Micro-Frontend...</h2>
                  <p>Dynamically importing {activeApp.toUpperCase()} module</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Timeout state for current app */}
        {isInPhase(activeApp, 'timeout') && (
          <div className="app-container">
            <div className="error-container">
              <div className="error-icon">⏰</div>
              <h2>Loading Timeout</h2>
              <p className="error-message">
                The micro-frontend took too long to load. This might be due to network issues or the remote service being unavailable.
              </p>
              <button
                onClick={() => handleRetry(activeApp)}
                className="retry-button"
              >
                🔄 Retry Loading
              </button>
              <div className="timeout-metrics">
                <p><strong>Loading Time:</strong> {getLoadingMetrics(activeApp)?.totalTime ? (getLoadingMetrics(activeApp)!.totalTime / 1000).toFixed(1) : '0'}s</p>
                <p><strong>Type:</strong> {activeApp === 'app1' ? 'Module Federation' : 'Local Dynamic Import'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error state for current app */}
        {cachedComponent?.error && !isInPhase(activeApp, 'timeout') && (
          <>
            {activeApp === 'app1' ? (
              // Use FederationFallback for App1 (Module Federation failures)
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
                {activeApp === 'app1' ? '🌐 Module Federation' : '📦 Dynamic Import'}: {activeApp.toUpperCase()}
                {cachedComponent?.isLoaded && ' (State Preserved)'}
                <span className="route-indicator">📍 Route: {location.pathname}</span>
              </div>
            </div>
          )}

          {/* App1 - always render if loaded to preserve state */}
          {(() => {
            const app1Cache = getCachedComponent('app1');
            if (app1Cache?.isLoaded && app1Cache.component) {
              const App1Component = app1Cache.component;
              const shouldShow = activeApp === 'app1' && !app1Cache.error && !isLoading('app1');
              return (
                <div
                  key="app1-container"
                  style={{
                    display: shouldShow ? 'block' : 'none'
                  }}
                >
                  <App1Component />
                </div>
              );
            }
            return null;
          })()}

          {/* Users - always render if loaded to preserve state */}
          {(() => {
            const usersCache = getCachedComponent('users');
            if (usersCache?.isLoaded && usersCache.component) {
              const UsersComponent = usersCache.component;
              const shouldShow = activeApp === 'users' && !usersCache.error && !isLoading('users');
              return (
                <div
                  key="users-container"
                  style={{
                    display: shouldShow ? 'block' : 'none'
                  }}
                >
                  <UsersComponent />
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

export default RouterLayout;

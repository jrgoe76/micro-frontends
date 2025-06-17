import { useState, useCallback } from 'react';
import type { AppId, ComponentCache, CachedComponent, MicroFrontendLoader } from '../types/index.ts';

/**
 * Hook for managing cached micro-frontend components with state persistence
 * 
 * This hook ensures that once a micro-frontend is loaded, it stays in memory
 * and preserves its internal state when switching between different apps.
 */
export const useMicroFrontendCache = () => {
  // Cache to store loaded components
  const [componentCache, setComponentCache] = useState<ComponentCache>({});
  
  // Track loading states for each app
  const [loadingStates, setLoadingStates] = useState<Record<AppId, boolean>>({
    tasks: false,
    contacts: false
  });

  /**
   * Load a micro-frontend component and cache it
   */
  const loadComponent = useCallback(async (
    appId: AppId,
    loader: MicroFrontendLoader
  ): Promise<void> => {
    console.log(`🔄 Loading micro-frontend ${appId}...`);

    // Check if already loaded to prevent duplicate loading
    const currentCache = componentCache[appId];
    if (currentCache?.isLoaded) {
      console.log(`✅ ${appId} already loaded, skipping`);
      return;
    }

    // Set loading state
    setLoadingStates(prev => ({ ...prev, [appId]: true }));

    try {
      // Perform dynamic import
      const module = await loader();

      // Cache the component
      setComponentCache(prev => ({
        ...prev,
        [appId]: {
          component: module.default,
          isLoaded: true,
          error: null
        }
      }));

      console.log(`✅ Micro-frontend ${appId} loaded and cached`);
    } catch (error) {
      console.error(`❌ Failed to load micro-frontend ${appId}:`, error);

      // Cache the error state
      setComponentCache(prev => ({
        ...prev,
        [appId]: {
          component: null as any, // Will be handled by error state
          isLoaded: false,
          error: error instanceof Error ? error.message : 'Failed to load micro-frontend'
        }
      }));
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({ ...prev, [appId]: false }));
    }
  }, [componentCache]);

  /**
   * Get cached component for an app
   */
  const getCachedComponent = useCallback((appId: AppId): CachedComponent | null => {
    return componentCache[appId] || null;
  }, [componentCache]);

  /**
   * Check if an app is currently loading
   */
  const isLoading = useCallback((appId: AppId): boolean => {
    return loadingStates[appId] || false;
  }, [loadingStates]);

  /**
   * Clear cache for a specific app (useful for error recovery)
   */
  const clearCache = useCallback((appId: AppId) => {
    setComponentCache(prev => {
      const newCache = { ...prev };
      delete newCache[appId];
      return newCache;
    });
    setLoadingStates(prev => ({ ...prev, [appId]: false }));
    console.log(`🗑️ Cache cleared for ${appId}`);
  }, []);

  /**
   * Get cache statistics for debugging
   */
  const getCacheStats = useCallback(() => {
    const stats = {
      totalCached: Object.keys(componentCache).length,
      loadedApps: Object.entries(componentCache)
        .filter(([, cached]) => cached.isLoaded)
        .map(([appId]) => appId),
      failedApps: Object.entries(componentCache)
        .filter(([, cached]) => cached.error)
        .map(([appId]) => appId)
    };
    
    console.log('📊 Cache Stats:', stats);
    return stats;
  }, [componentCache]);

  return {
    loadComponent,
    getCachedComponent,
    isLoading,
    clearCache,
    getCacheStats,
    // Expose cache for debugging
    componentCache
  };
};

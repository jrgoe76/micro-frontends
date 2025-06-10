import { useState, useEffect } from 'react';
import type { LoadingState, MicroFrontendLoader } from '../types/index.ts';

/**
 * Custom hook for dynamically importing micro-frontend components
 * 
 * @param importFunc - Function that returns a dynamic import promise
 * @param shouldLoad - Whether the component should be loaded
 * @returns Loading state with component, loading status, and error
 */
export const useDynamicImport = (
  importFunc: MicroFrontendLoader | null,
  shouldLoad: boolean = true
): LoadingState => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
    component: null
  });

  useEffect(() => {
    // Reset state when importFunc changes
    setState({
      isLoading: false,
      error: null,
      component: null
    });

    // Don't load if we shouldn't or if no import function provided
    if (!shouldLoad || !importFunc) {
      return;
    }

    // Set loading state
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    // Perform dynamic import
    importFunc()
      .then((module) => {
        setState({
          isLoading: false,
          error: null,
          component: module.default
        });
      })
      .catch((error) => {
        console.error('Failed to load micro-frontend:', error);
        setState({
          isLoading: false,
          error: error.message || 'Failed to load micro-frontend',
          component: null
        });
      });
  }, [importFunc, shouldLoad]);

  return state;
};

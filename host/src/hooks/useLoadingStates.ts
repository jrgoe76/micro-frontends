import { useState, useEffect, useCallback } from 'react';
import type { AppId } from '../types/index.ts';

export type LoadingPhase = 'initial' | 'enhanced' | 'skeleton' | 'complete' | 'error' | 'timeout';

interface LoadingState {
  phase: LoadingPhase;
  startTime: number;
  elapsedTime: number;
  hasTimedOut: boolean;
}

interface LoadingMetrics {
  totalTime: number;
  phase: LoadingPhase;
  appId: AppId;
  loadingType: 'federation' | 'local';
}

interface UseLoadingStatesReturn {
  loadingStates: Record<AppId, LoadingState>;
  setLoadingPhase: (appId: AppId, phase: LoadingPhase) => void;
  startLoading: (appId: AppId) => void;
  completeLoading: (appId: AppId) => void;
  timeoutLoading: (appId: AppId) => void;
  getLoadingMetrics: (appId: AppId) => LoadingMetrics | null;
  isInPhase: (appId: AppId, phase: LoadingPhase) => boolean;
}

const LOADING_TIMEOUTS = {
  enhanced: 8000,    // 8 seconds for enhanced loading
  skeleton: 15000,   // 15 seconds total timeout
  federation: 20000, // 20 seconds for federation
  local: 10000       // 10 seconds for local loading
};

export const useLoadingStates = (): UseLoadingStatesReturn => {
  const [loadingStates, setLoadingStates] = useState<Record<AppId, LoadingState>>({} as Record<AppId, LoadingState>);

  // Update elapsed time for all loading states
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStates(prevStates => {
        const updatedStates = { ...prevStates };
        let hasUpdates = false;

        Object.keys(updatedStates).forEach(appId => {
          const state = updatedStates[appId as AppId];
          if (state && state.phase !== 'complete' && state.phase !== 'error' && state.phase !== 'timeout') {
            const newElapsedTime = Date.now() - state.startTime;
            if (newElapsedTime !== state.elapsedTime) {
              updatedStates[appId as AppId] = {
                ...state,
                elapsedTime: newElapsedTime
              };
              hasUpdates = true;
            }
          }
        });

        return hasUpdates ? updatedStates : prevStates;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Handle timeouts
  useEffect(() => {
    const timeouts: Record<string, ReturnType<typeof setTimeout>> = {};

    Object.entries(loadingStates).forEach(([appId, state]) => {
      if (state && state.phase !== 'complete' && state.phase !== 'error' && state.phase !== 'timeout') {
        const timeoutKey = `${appId}-${state.phase}`;
        
        // Clear existing timeout
        if (timeouts[timeoutKey]) {
          clearTimeout(timeouts[timeoutKey]);
        }

        // Set phase-specific timeout
        let timeoutDuration = LOADING_TIMEOUTS.skeleton; // Default
        
        if (state.phase === 'enhanced') {
          timeoutDuration = LOADING_TIMEOUTS.enhanced;
        } else if (state.phase === 'skeleton') {
          timeoutDuration = LOADING_TIMEOUTS.skeleton;
        }

        timeouts[timeoutKey] = setTimeout(() => {
          setLoadingStates(prevStates => ({
            ...prevStates,
            [appId]: {
              ...prevStates[appId as AppId],
              phase: 'timeout' as LoadingPhase,
              hasTimedOut: true
            }
          }));
        }, timeoutDuration);
      }
    });

    return () => {
      Object.values(timeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [loadingStates]);

  const setLoadingPhase = useCallback((appId: AppId, phase: LoadingPhase) => {
    setLoadingStates(prevStates => {
      const currentState = prevStates[appId];
      const startTime = currentState?.startTime || Date.now();
      
      return {
        ...prevStates,
        [appId]: {
          phase,
          startTime,
          elapsedTime: Date.now() - startTime,
          hasTimedOut: false
        }
      };
    });
  }, []);

  const startLoading = useCallback((appId: AppId) => {
    const startTime = Date.now();
    setLoadingStates(prevStates => ({
      ...prevStates,
      [appId]: {
        phase: 'initial',
        startTime,
        elapsedTime: 0,
        hasTimedOut: false
      }
    }));

    // Automatically progress to enhanced loading after a short delay
    setTimeout(() => {
      setLoadingStates(prevStates => {
        const currentState = prevStates[appId];
        if (currentState && currentState.phase === 'initial') {
          return {
            ...prevStates,
            [appId]: {
              ...currentState,
              phase: 'enhanced',
              elapsedTime: Date.now() - currentState.startTime
            }
          };
        }
        return prevStates;
      });
    }, 500);

    // Progress to skeleton loading after enhanced phase
    setTimeout(() => {
      setLoadingStates(prevStates => {
        const currentState = prevStates[appId];
        if (currentState && currentState.phase === 'enhanced') {
          return {
            ...prevStates,
            [appId]: {
              ...currentState,
              phase: 'skeleton',
              elapsedTime: Date.now() - currentState.startTime
            }
          };
        }
        return prevStates;
      });
    }, 3000); // Show enhanced loader for 3 seconds
  }, []);

  const completeLoading = useCallback((appId: AppId) => {
    setLoadingStates(prevStates => {
      const currentState = prevStates[appId];
      if (currentState) {
        return {
          ...prevStates,
          [appId]: {
            ...currentState,
            phase: 'complete',
            elapsedTime: Date.now() - currentState.startTime
          }
        };
      }
      return prevStates;
    });
  }, []);

  const timeoutLoading = useCallback((appId: AppId) => {
    setLoadingStates(prevStates => {
      const currentState = prevStates[appId];
      if (currentState) {
        return {
          ...prevStates,
          [appId]: {
            ...currentState,
            phase: 'timeout',
            hasTimedOut: true,
            elapsedTime: Date.now() - currentState.startTime
          }
        };
      }
      return prevStates;
    });
  }, []);

  const getLoadingMetrics = useCallback((appId: AppId): LoadingMetrics | null => {
    const state = loadingStates[appId];
    if (!state) return null;

    return {
      totalTime: state.elapsedTime,
      phase: state.phase,
      appId,
      loadingType: appId === 'app1' ? 'federation' : 'local'
    };
  }, [loadingStates]);

  const isInPhase = useCallback((appId: AppId, phase: LoadingPhase): boolean => {
    const state = loadingStates[appId];
    return state?.phase === phase;
  }, [loadingStates]);

  return {
    loadingStates,
    setLoadingPhase,
    startLoading,
    completeLoading,
    timeoutLoading,
    getLoadingMetrics,
    isInPhase
  };
};

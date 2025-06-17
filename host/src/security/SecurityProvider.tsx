import React, { useEffect, useState, useCallback } from 'react';

import type { AuthenticationState, SecurityContext } from './';
import { SecurityService, securityContext } from './';
import { keycloakConfig, keycloakInitOptions } from '../config/keycloak';
import { testKeycloakConnectivity, logKeycloakDiagnostics } from '../utils/keycloakTest';

// Singleton instance of SecurityService to prevent multiple initializations
let securityServiceInstance: SecurityService | null = null;

const getSecurityService = (): SecurityService => {
  if (!securityServiceInstance) {
    securityServiceInstance = new SecurityService(keycloakConfig);
  }
  return securityServiceInstance;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  // Initialize SecurityService using singleton
  const [securityService] = useState(() => getSecurityService());
  
  // Authentication state
  const [authState, setAuthState] = useState<AuthenticationState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    tokens: null,
    error: null
  });

  // Update auth state from SecurityService
  const updateAuthState = useCallback(() => {
    if (!securityService.isInitialized()) {
      console.log('🔐 SecurityService not initialized yet, skipping state update');
      return;
    }

    const isAuthenticated = securityService.isAuthenticated();
    const user = securityService.getUser();
    const tokens = securityService.getTokens();

    console.log('🔄 Updating auth state:', { isAuthenticated, user: user?.username });

    setAuthState(prev => ({
      ...prev,
      isAuthenticated,
      user,
      tokens,
      isLoading: false,
      error: null
    }));
  }, [securityService]);

  // Initialize SecurityService
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount

    const initSecurity = async () => {
      try {
        console.log('🔐 Initializing SecurityService...');

        // Log diagnostics for troubleshooting
        logKeycloakDiagnostics(keycloakConfig.url, keycloakConfig.realm, keycloakConfig.clientId);

        // Test connectivity first
        const connectivityTest = await testKeycloakConnectivity(keycloakConfig.url, keycloakConfig.realm);
        if (!connectivityTest.isReachable) {
          throw new Error(`Keycloak server unreachable: ${connectivityTest.error}`);
        }
        if (!connectivityTest.corsConfigured) {
          console.warn('⚠️ CORS may not be configured properly:', connectivityTest.error);
        }

        if (isMounted) {
          setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
        }

        await securityService.init(keycloakInitOptions);
        
        // Set up event listeners
        securityService.onEvent('onAuthSuccess', () => {
          console.log('✅ Authentication successful');
          if (isMounted) {
            updateAuthState();
          }
        });

        securityService.onEvent('onAuthError', (error) => {
          console.error('❌ Authentication error:', error);
          if (isMounted) {
            setAuthState(prev => ({
              ...prev,
              isLoading: false,
              error: 'Authentication failed'
            }));
          }
        });

        securityService.onEvent('onAuthLogout', () => {
          console.log('👋 User logged out');
          if (isMounted) {
            setAuthState({
              isAuthenticated: false,
              isLoading: false,
              user: null,
              tokens: null,
              error: null
            });
          }
        });

        securityService.onEvent('onTokenExpired', async () => {
          console.log('⏰ Token expired, attempting refresh...');
          const refreshed = await securityService.refreshToken();
          if (refreshed && isMounted) {
            updateAuthState();
          } else {
            console.log('❌ Token refresh failed, logging out...');
            await securityService.logout();
          }
        });

        // Initial state update
        if (isMounted) {
          updateAuthState();
          console.log('✅ SecurityService initialized successfully');
        }

      } catch (error) {
        console.error('❌ SecurityService initialization failed:', error);
        if (isMounted) {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Initialization failed'
          }));
        }
      }
    };

    initSecurity();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [securityService, updateAuthState]);

  // Set up automatic token refresh
  useEffect(() => {
    if (!authState.isAuthenticated) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const refreshed = await securityService.refreshToken();
        if (refreshed) {
          updateAuthState();
        }
      } catch (error) {
        console.error('Token refresh error:', error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [authState.isAuthenticated, securityService, updateAuthState]);

  // Authentication methods
  const login = useCallback(async () => {
    try {
      await securityService.login();
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
    }
  }, [securityService]);

  const logout = useCallback(async () => {
    try {
      await securityService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Logout failed'
      }));
    }
  }, [securityService]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshed = await securityService.refreshToken();
      if (refreshed) {
        updateAuthState();
      }
      return refreshed;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }, [securityService, updateAuthState]);

  const hasRole = useCallback((role: string): boolean => {
    return securityService.hasRole(role);
  }, [securityService]);

  const hasAnyRole = useCallback((roles: string[]): boolean => {
    return securityService.hasAnyRole(roles);
  }, [securityService]);

  // Context value
  const contextValue: SecurityContext = {
    ...authState,
    login,
    logout,
    refreshToken,
    hasRole,
    hasAnyRole
  };

  return (
    <securityContext.Provider value={contextValue}>
      {children}
    </securityContext.Provider>
  );
};

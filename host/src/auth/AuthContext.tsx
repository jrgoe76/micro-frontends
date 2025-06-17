import React, { createContext, useEffect, useState, useCallback } from 'react';
import { KeycloakWrapper } from './KeycloakWrapper';
import { keycloakConfig, keycloakInitOptions } from '../config/keycloak';
import { testKeycloakConnectivity, logKeycloakDiagnostics } from '../utils/keycloakTest';
import type { AuthenticationState } from '../security/AuthenticationState';
import type { SecurityContext } from '../security/SecurityContext';

// Singleton instance of KeycloakWrapper to prevent multiple initializations
let keycloakWrapperInstance: KeycloakWrapper | null = null;

const getKeycloakWrapper = (): KeycloakWrapper => {
  if (!keycloakWrapperInstance) {
    keycloakWrapperInstance = new KeycloakWrapper(keycloakConfig);
  }
  return keycloakWrapperInstance;
};

// Create the authentication context
const AuthContext = createContext<SecurityContext | null>(null);

// Export the context for use in the useAuth hook
export { AuthContext };

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Initialize Keycloak wrapper using singleton
  const [keycloakWrapper] = useState(() => getKeycloakWrapper());
  
  // Authentication state
  const [authState, setAuthState] = useState<AuthenticationState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    tokens: null,
    error: null
  });

  // Update auth state from Keycloak
  const updateAuthState = useCallback(() => {
    if (!keycloakWrapper.isInitialized()) {
      console.log('🔐 Keycloak not initialized yet, skipping state update');
      return;
    }

    const isAuthenticated = keycloakWrapper.isAuthenticated();
    const user = keycloakWrapper.getUser();
    const tokens = keycloakWrapper.getTokens();

    console.log('🔄 Updating auth state:', { isAuthenticated, user: user?.username });

    setAuthState(prev => ({
      ...prev,
      isAuthenticated,
      user,
      tokens,
      isLoading: false,
      error: null
    }));
  }, [keycloakWrapper]);

  // Initialize Keycloak
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmount

    const initKeycloak = async () => {
      try {
        console.log('🔐 Initializing Keycloak...');

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

        await keycloakWrapper.init(keycloakInitOptions);
        
        // Set up event listeners
        keycloakWrapper.onEvent('onAuthSuccess', () => {
          console.log('✅ Authentication successful');
          if (isMounted) {
            updateAuthState();
          }
        });

        keycloakWrapper.onEvent('onAuthError', (error) => {
          console.error('❌ Authentication error:', error);
          if (isMounted) {
            setAuthState(prev => ({
              ...prev,
              isLoading: false,
              error: 'Authentication failed'
            }));
          }
        });

        keycloakWrapper.onEvent('onAuthLogout', () => {
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

        keycloakWrapper.onEvent('onTokenExpired', async () => {
          console.log('⏰ Token expired, attempting refresh...');
          const refreshed = await keycloakWrapper.refreshToken();
          if (refreshed && isMounted) {
            updateAuthState();
          } else {
            console.log('❌ Token refresh failed, logging out...');
            await keycloakWrapper.logout();
          }
        });

        // Initial state update
        if (isMounted) {
          updateAuthState();
          console.log('✅ Keycloak initialized successfully');
        }

      } catch (error) {
        console.error('❌ Keycloak initialization failed:', error);
        if (isMounted) {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Initialization failed'
          }));
        }
      }
    };

    initKeycloak();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [keycloakWrapper, updateAuthState]);

  // Set up automatic token refresh
  useEffect(() => {
    if (!authState.isAuthenticated) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const refreshed = await keycloakWrapper.refreshToken();
        if (refreshed) {
          updateAuthState();
        }
      } catch (error) {
        console.error('Token refresh error:', error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [authState.isAuthenticated, keycloakWrapper, updateAuthState]);

  // Authentication methods
  const login = useCallback(async () => {
    try {
      await keycloakWrapper.login();
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
    }
  }, [keycloakWrapper]);

  const logout = useCallback(async () => {
    try {
      await keycloakWrapper.logout();
    } catch (error) {
      console.error('Logout error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Logout failed'
      }));
    }
  }, [keycloakWrapper]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshed = await keycloakWrapper.refreshToken();
      if (refreshed) {
        updateAuthState();
      }
      return refreshed;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }, [keycloakWrapper, updateAuthState]);

  const hasRole = useCallback((role: string): boolean => {
    return keycloakWrapper.hasRole(role);
  }, [keycloakWrapper]);

  const hasAnyRole = useCallback((roles: string[]): boolean => {
    return keycloakWrapper.hasAnyRole(roles);
  }, [keycloakWrapper]);

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
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

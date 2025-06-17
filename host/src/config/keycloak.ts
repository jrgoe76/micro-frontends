import type { IdPConfig } from '../security/IdPConfig';

// Keycloak configuration
// In a real application, these values should come from environment variables
export const keycloakConfig: IdPConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'master',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'micro-frontends-client'
};

// Development mode flag - set to true to disable Keycloak for testing
export const isDevelopmentMode = import.meta.env.VITE_DISABLE_KEYCLOAK === 'true' || import.meta.env.DEV;

// Keycloak initialization options
export const keycloakInitOptions = {
  onLoad: 'check-sso' as const,
  silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
  checkLoginIframe: false,
  pkceMethod: 'S256' as const,
  // Additional CORS-friendly options
  enableLogging: true,
  messageReceiveTimeout: 10000,
  // Redirect URIs for CORS
  redirectUri: window.location.origin + '/tasks'
};

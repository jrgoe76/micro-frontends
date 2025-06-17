import Keycloak from 'keycloak-js';
import type { User } from './User';
import type { TokenBag } from './TokenBag';
import type { IdPConfig } from './IdPConfig';

// Interface for parsed Keycloak token
interface ParsedToken {
  sub?: string;
  preferred_username?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  exp?: number;
  realm_access?: {
    roles?: string[];
  };
  resource_access?: {
    [key: string]: {
      roles?: string[];
    };
  };
}

/**
 * SecurityService - Custom TypeScript wrapper around keycloak-js
 * Provides type-safe methods and handles common authentication operations
 */
export class SecurityService {
  private keycloak: Keycloak;
  private initialized = false;
  private initializationPromise: Promise<boolean> | null = null;

  constructor(config: IdPConfig) {
    this.keycloak = new Keycloak({
      url: config.url,
      realm: config.realm,
      clientId: config.clientId
    });
  }

  /**
   * Initialize Keycloak with the provided options
   */
  async init(initOptions: Keycloak.KeycloakInitOptions = {}): Promise<boolean> {
    // If already initialized, return the previous result
    if (this.initialized) {
      console.log('🔐 SecurityService already initialized, returning authenticated state');
      return this.keycloak.authenticated || false;
    }

    // If initialization is in progress, wait for it
    if (this.initializationPromise) {
      console.log('🔐 SecurityService initialization in progress, waiting...');
      return this.initializationPromise;
    }

    // Start new initialization
    console.log('🔐 Starting SecurityService initialization...');
    this.initializationPromise = this.performInitialization(initOptions);

    try {
      const result = await this.initializationPromise;
      this.initialized = true;
      return result;
    } catch (error) {
      // Reset promise on error so it can be retried
      this.initializationPromise = null;
      throw error;
    }
  }

  /**
   * Perform the actual Keycloak initialization
   */
  private async performInitialization(initOptions: Keycloak.KeycloakInitOptions): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        ...initOptions
      });

      console.log('✅ SecurityService initialization successful, authenticated:', authenticated);
      return authenticated;
    } catch (error) {
      console.error('❌ Failed to initialize SecurityService:', error);

      // Check if it's a network/connection error
      if (error instanceof Error) {
        if (error.message.includes('Network Error') ||
            error.message.includes('Failed to fetch') ||
            error.message.includes('ECONNREFUSED')) {
          throw new Error('Unable to connect to Keycloak server. Please ensure Keycloak is running and accessible.');
        }

        // Check for CORS errors
        if (error.message.includes('CORS') ||
            error.message.includes('Access-Control-Allow-Origin') ||
            error.message.includes('Cross-Origin')) {
          throw new Error('CORS error: Please configure Keycloak client with Web Origins: http://localhost:5080. See KEYCLOAK_SETUP.md for details.');
        }
      }

      throw new Error(`SecurityService initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if SecurityService is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.keycloak.authenticated || false;
  }

  /**
   * Get current user information
   */
  getUser(): User | null {
    if (!this.isAuthenticated() || !this.keycloak.tokenParsed) {
      return null;
    }

    const tokenParsed = this.keycloak.tokenParsed as ParsedToken;
    return {
      id: tokenParsed.sub || '',
      username: tokenParsed.preferred_username || '',
      email: tokenParsed.email,
      firstName: tokenParsed.given_name,
      lastName: tokenParsed.family_name,
      roles: this.getRoles()
    };
  }

  /**
   * Get current tokens
   */
  getTokens(): TokenBag | null {
    if (!this.isAuthenticated()) {
      return null;
    }

    return {
      token: this.keycloak.token || '',
      refreshToken: this.keycloak.refreshToken || '',
      idToken: this.keycloak.idToken || ''
    };
  }

  /**
   * Get user roles
   */
  getRoles(): string[] {
    if (!this.keycloak.tokenParsed) {
      return [];
    }

    const tokenParsed = this.keycloak.tokenParsed as ParsedToken;
    const realmRoles = tokenParsed.realm_access?.roles || [];
    const clientId = this.keycloak.clientId || '';
    const clientRoles = tokenParsed.resource_access?.[clientId]?.roles || [];
    
    return [...realmRoles, ...clientRoles];
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role) || this.keycloak.hasResourceRole(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Login user
   */
  async login(): Promise<void> {
    try {
      await this.keycloak.login({
        redirectUri: window.location.origin + '/tasks'
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.keycloak.logout({
        redirectUri: window.location.origin
      });
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Logout failed');
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshed = await this.keycloak.updateToken(30);
      return refreshed;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  /**
   * Get the raw Keycloak instance (for advanced usage)
   */
  getKeycloakInstance(): Keycloak {
    return this.keycloak;
  }

  /**
   * Add event listener
   */
  onEvent(event: string, callback: (event?: unknown) => void): void {
    switch (event) {
      case 'onReady':
        this.keycloak.onReady = callback;
        break;
      case 'onAuthSuccess':
        this.keycloak.onAuthSuccess = callback;
        break;
      case 'onAuthError':
        this.keycloak.onAuthError = callback;
        break;
      case 'onAuthRefreshSuccess':
        this.keycloak.onAuthRefreshSuccess = callback;
        break;
      case 'onAuthRefreshError':
        this.keycloak.onAuthRefreshError = callback;
        break;
      case 'onAuthLogout':
        this.keycloak.onAuthLogout = callback;
        break;
      case 'onTokenExpired':
        this.keycloak.onTokenExpired = callback;
        break;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    return this.keycloak.isTokenExpired();
  }

  /**
   * Get time until token expires (in seconds)
   */
  getTokenTimeLeft(): number {
    if (!this.keycloak.tokenParsed) {
      return 0;
    }
    
    const tokenParsed = this.keycloak.tokenParsed as ParsedToken;
    const now = Math.ceil(Date.now() / 1000);
    return (tokenParsed.exp || 0) - now;
  }
}

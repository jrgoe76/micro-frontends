// Types for our micro-frontends application

export type AppId = 'tasks' | 'users';

export interface MicroFrontendApp {
  id: AppId;
  name: string;
  description: string;
  isActive: boolean;
}

export interface NavigationItem {
  id: AppId;
  label: string;
  path: string;
}

// Types for dynamic module loading
export interface DynamicModule {
  default: React.ComponentType;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  component: React.ComponentType | null;
}

export interface CachedComponent {
  component: React.ComponentType;
  isLoaded: boolean;
  error: string | null;
}

export interface ComponentCache {
  [key: string]: CachedComponent;
}

export type MicroFrontendLoader = () => Promise<DynamicModule>;

// Authentication types
export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
  idToken: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  tokens: AuthTokens | null;
  error: string | null;
}

export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

export interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

// Types for Module Federation
export interface FederatedModule {
  default: React.ComponentType;
}

export type FederatedLoader = () => Promise<FederatedModule>;

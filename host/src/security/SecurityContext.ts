import type { AuthenticationState } from './AuthenticationState';

/**
 * SecurityContext interface representing the security context with authentication state and methods
 */
export interface SecurityContext extends AuthenticationState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

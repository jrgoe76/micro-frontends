import type { User } from './User';
import type { TokenBag } from './TokenBag';

/**
 * AuthenticationState interface representing the current authentication state
 */
export interface AuthenticationState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  tokens: TokenBag | null;
  error: string | null;
}

import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import type { SecurityContext } from '../security';

/**
 * Custom hook to use the authentication context
 *
 * @returns SecurityContext - The security context containing auth state and methods
 * @throws Error if used outside of AuthProvider
 */
export const useAuth = (): SecurityContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

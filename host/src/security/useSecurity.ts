import { useContext } from 'react';
import type { SecurityContext } from './SecurityContext';
import { securityContext } from './SecurityContext';

/**
 * Custom hook to use the authentication context
 *
 * @returns SecurityContext - The security context containing auth state and methods
 * @throws Error if used outside of AuthProvider
 */
export const useSecurity = (): SecurityContext => {
  const context = useContext(securityContext);
  
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }

  return context;
};

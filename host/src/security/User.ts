/**
 * User interface representing an authenticated user in the system
 */
export interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

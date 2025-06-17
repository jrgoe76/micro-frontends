/**
 * TokenBag interface representing authentication tokens
 */
export interface TokenBag {
  token: string;
  refreshToken: string;
  idToken: string;
}

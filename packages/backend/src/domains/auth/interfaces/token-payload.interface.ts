export interface TokenPayload {
  sub: string; // User ID
  iat?: number; // Issued at
  exp?: number; // Expires at
}
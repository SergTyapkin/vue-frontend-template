// Shared session contract; no runtime imports.
declare module '#auth-utils' {
  interface User {
    sub: string;
    name?: string;
    roles: string[];
    permissions: string[];
  }
  interface SecureSessionData {
    oidc?: { verifier: string; state: string; nonce: string; returnTo: string; expiresAt: number };
  }
}
export {};

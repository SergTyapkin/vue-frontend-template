import * as oidc from 'openid-client';
import site from '../../../site.config';
import { safeReturnTo } from '../../../features/auth/access';
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);
  const transaction = session.secure?.oidc;
  if (!transaction || transaction.expiresAt < Date.now())
    throw createError({ statusCode: 400, statusMessage: 'Expired authentication transaction' });
  // Build the callback from the configured public origin, never an untrusted Host header.
  const current = new URL(getRequestURL(event).search, new URL('/auth/callback', site.url));
  const tokens = await oidc.authorizationCodeGrant(await oidcConfiguration(), current, {
    pkceCodeVerifier: transaction.verifier,
    expectedState: transaction.state,
    expectedNonce: transaction.nonce,
    idTokenExpected: true,
  });
  const claims = tokens.claims();
  if (!claims?.sub) throw createError({ statusCode: 401, statusMessage: 'Missing subject' });
  await replaceUserSession(event, {
    user: {
      sub: claims.sub,
      name: typeof claims.name === 'string' ? claims.name : undefined,
      roles: [],
      permissions: [],
    },
  });
  return sendRedirect(event, safeReturnTo(transaction.returnTo));
});

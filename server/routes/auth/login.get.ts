import * as oidc from 'openid-client';
import site from '../../../site.config';
import { safeReturnTo } from '../../../features/auth/access';
export default defineEventHandler(async (event) => {
  const config = await oidcConfiguration();
  const verifier = oidc.randomPKCECodeVerifier();
  const state = oidc.randomState();
  const nonce = oidc.randomNonce();
  const returnTo = safeReturnTo(getQuery(event).returnTo);
  await setUserSession(event, {
    secure: { oidc: { verifier, state, nonce, returnTo, expiresAt: Date.now() + 600_000 } },
  });
  const url = oidc.buildAuthorizationUrl(config, {
    redirect_uri: new URL('/auth/callback', site.url).href,
    scope: site.auth.scopes.join(' '),
    code_challenge: await oidc.calculatePKCECodeChallenge(verifier),
    code_challenge_method: 'S256',
    state,
    nonce,
  });
  return sendRedirect(event, url.href);
});

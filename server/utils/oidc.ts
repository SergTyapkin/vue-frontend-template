import * as oidc from 'openid-client';
import site from '../../site.config';
export async function oidcConfiguration() {
  if (!site.auth.enabled || !site.auth.issuer || !site.auth.clientId)
    throw createError({ statusCode: 503, statusMessage: 'SSO is not configured' });
  return oidc.discovery(
    new URL(site.auth.issuer),
    site.auth.clientId,
    useRuntimeConfig().oidcClientSecret || undefined,
  );
}

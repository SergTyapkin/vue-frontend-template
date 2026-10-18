import site from '../site.config';
export const offlineCachePrefix = 'forma-offline-';
export const offlineResources = [...new Set([...site.pwa.resources, ...site.pwa.publicPages])];
export function isSafePublicPath(path: string) {
  return (
    path.startsWith('/') &&
    !path.startsWith('//') &&
    !/[?#\\]/.test(path) &&
    !/^\/(api|auth)(\/|$)/.test(path)
  );
}
export function isPublicResponse(response: Response, html = false) {
  const policy = response.headers.get('cache-control') ?? '';
  return (
    response.ok &&
    !response.redirected &&
    !response.headers.has('set-cookie') &&
    !/private|no-store/i.test(policy) &&
    (!html || /\bpublic\b/i.test(policy))
  );
}

export default defineEventHandler((event) => {
  const upstream = useRuntimeConfig(event).apiUpstream;
  if (!upstream)
    throw createError({
      statusCode: 503,
      statusMessage: 'API upstream is not configured',
      data: { code: 'UPSTREAM_UNAVAILABLE' },
    });
  // Fixed configured origin; user input can never choose a proxy host.
  const path = getRequestURL(event).pathname.replace(/^\/api\/v1/, '');
  const target = new URL(`${upstream.replace(/\/$/, '')}/api/v1${path}`);
  target.search = getRequestURL(event).search;
  return proxyRequest(event, target.href, { headers: { host: target.host } });
});

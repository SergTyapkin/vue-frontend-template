import site from '../../site.config';
export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname;
  if (
    !site.auth.enabled &&
    (path.startsWith('/api/_auth/') || path.startsWith('/auth/') || path === '/api/auth/logout')
  )
    throw createError({ statusCode: 404, statusMessage: 'SSO is disabled' });
});

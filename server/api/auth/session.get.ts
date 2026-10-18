import site from '../../../site.config';
export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store');
  if (!site.auth.enabled) return { user: null };
  const session = await getUserSession(event);
  return { user: session.user ?? null };
});

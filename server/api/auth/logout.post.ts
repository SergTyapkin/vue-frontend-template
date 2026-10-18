export default defineEventHandler(async (event) => {
  if (
    getHeader(event, 'origin') !==
    new URL((await import('../../../site.config')).default.url).origin
  )
    throw createError({ statusCode: 403 });
  await clearUserSession(event);
  return { ok: true };
});

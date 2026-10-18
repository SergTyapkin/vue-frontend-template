import site from '../../site.config';
import { useAuthStore } from '../../features/auth/store';
import { hasPermissions } from '../../features/auth/access';
export default defineNuxtRouteMiddleware((to) => {
  if (!to.meta.auth) return;
  if (import.meta.server) useResponseHeader('Cache-Control').value = 'private, no-store';
  if (!site.auth.enabled)
    return abortNavigation(
      createError({ statusCode: 403, statusMessage: 'Authentication is disabled' }),
    );
  const auth = useAuthStore();
  if (auth.status === 'error')
    return abortNavigation(
      createError({ statusCode: 503, statusMessage: 'Session service unavailable' }),
    );
  if (!auth.authenticated)
    return navigateTo(`/auth/login?returnTo=${encodeURIComponent(to.fullPath)}`, {
      external: true,
    });
  if (!hasPermissions(auth.user?.permissions ?? [], (to.meta.permissions as string[]) ?? []))
    return abortNavigation(createError({ statusCode: 403, statusMessage: 'Permission denied' }));
});

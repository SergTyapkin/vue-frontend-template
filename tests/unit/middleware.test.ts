import { beforeEach, it, expect, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '../../features/auth/store';
vi.mock('../../site.config', () => ({ default: { auth: { enabled: true } } }));
const navigate = vi.fn((value: unknown) => value);
const abort = vi.fn((value: unknown) => value);
beforeEach(() => {
  setActivePinia(createPinia());
  vi.stubGlobal('defineNuxtRouteMiddleware', (handler: unknown) => handler);
  vi.stubGlobal('navigateTo', navigate);
  vi.stubGlobal('abortNavigation', abort);
  vi.stubGlobal('createError', (value: unknown) => value);
  vi.clearAllMocks();
});
it('leaves public routes alone and preserves the protected return path', async () => {
  const middleware = (await import('../../app/middleware/auth.global')).default;
  middleware({ meta: {}, fullPath: '/' } as never, {} as never);
  expect(navigate).not.toHaveBeenCalled();
  middleware({ meta: { auth: true }, fullPath: '/private?sort=asc' } as never, {} as never);
  expect(navigate).toHaveBeenCalledWith('/auth/login?returnTo=%2Fprivate%3Fsort%3Dasc', {
    external: true,
  });
});
it('returns forbidden for missing permissions and unavailable for bootstrap failure', async () => {
  const middleware = (await import('../../app/middleware/auth.global')).default;
  const auth = useAuthStore();
  auth.user = { sub: 'a', roles: [], permissions: [] };
  middleware({ meta: { auth: true, permissions: ['write'] } } as never, {} as never);
  expect(abort).toHaveBeenLastCalledWith(expect.objectContaining({ statusCode: 403 }));
  auth.status = 'error';
  middleware({ meta: { auth: true } } as never, {} as never);
  expect(abort).toHaveBeenLastCalledWith(expect.objectContaining({ statusCode: 503 }));
});

import { it, expect } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { safeReturnTo, hasPermissions } from '../../features/auth/access';
import { useAuthStore } from '../../features/auth/store';
it('rejects external and ambiguous login redirects', () => {
  for (const path of ['//evil.test', 'https://evil.test', '/\\evil.test', '/\nredirect'])
    expect(safeReturnTo(path)).toBe('/');
  expect(safeReturnTo('/private?q=1')).toBe('/private?q=1');
});
it('requires all permissions', () => {
  expect(hasPermissions(['read'], ['read', 'write'])).toBe(false);
});
it('isolates auth stores between SSR requests', () => {
  setActivePinia(createPinia());
  const first = useAuthStore();
  first.user = { sub: 'a', roles: [], permissions: [] };
  setActivePinia(createPinia());
  expect(useAuthStore().user).toBeNull();
});

import site from '../../site.config';
import { useAuthStore, type SessionUser } from '../../features/auth/store';
export default defineNuxtPlugin(async () => {
  const auth = useAuthStore();
  if (!site.auth.enabled) {
    auth.reset();
    return;
  }
  auth.status = 'loading';
  const requestFetch = useRequestFetch();
  const { data, error } = await useAsyncData('bootstrap-session', () =>
    requestFetch<{ user: SessionUser | null }>('/api/auth/session'),
  );
  auth.user = data.value?.user ?? null;
  auth.status = error.value ? 'error' : 'ready';
});

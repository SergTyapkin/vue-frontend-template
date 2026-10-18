import { createApiClient } from '../../shared/api/client/create-client';
import { useAuthStore } from '../../features/auth/store';
export default defineNuxtPlugin((app) => {
  const requestFetch = useRequestFetch();
  const auth = useAuthStore(app.$pinia);
  const api = createApiClient({
    // Server uses Nitro's local fetch; cookies are scoped to this incoming request.
    baseUrl: import.meta.server ? 'http://nuxt.internal/api/v1' : '/api/v1',
    fetch: import.meta.server
      ? async (input, init) => {
          const request = input instanceof Request ? input : new Request(input, init);
          const url = new URL(request.url);
          const response = await requestFetch.raw(url.pathname + url.search, {
            method: request.method as
              'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD',
            headers: request.headers,
            body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text(),
            signal: request.signal,
            responseType: 'arrayBuffer',
            ignoreResponseError: true,
          });
          return new Response(
            [204, 205, 304].includes(response.status) ? null : (response._data as ArrayBuffer),
            {
              status: response.status,
              headers: response.headers,
            },
          );
        }
      : undefined,
    onUnauthorized: () => auth.reset(),
  });
  return { provide: { api } };
});

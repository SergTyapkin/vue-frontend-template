import createClient from 'openapi-fetch';
import type { paths } from '../generated/schema';
import { ApiError } from './errors';

export function createApiClient(
  options: {
    baseUrl?: string;
    fetch?: typeof fetch;
    timeoutMs?: number;
    onUnauthorized?: () => void;
  } = {},
) {
  const transport = options.fetch ?? globalThis.fetch;
  const client = createClient<paths>({
    baseUrl: options.baseUrl ?? '/api/v1',
    credentials: 'same-origin',
    fetch: async (request) => {
      const signal = AbortSignal.any([
        request.signal,
        AbortSignal.timeout(options.timeoutMs ?? 15_000),
      ]);
      // Retry only safe reads, once. Mutations are never replayed.
      for (let attempt = 0; ; attempt++) {
        const response = await transport(new Request(request.clone(), { signal }));
        if (
          attempt === 0 &&
          request.method === 'GET' &&
          [502, 503, 504].includes(response.status)
        ) {
          await response.body?.cancel();
          continue;
        }
        return response;
      }
    },
  });
  client.use({
    async onResponse({ response }) {
      if (!response.ok) {
        if (response.status === 401) options.onUnauthorized?.();
        const detail: unknown = await response
          .clone()
          .json()
          .catch(() => null);
        throw new ApiError(
          response.status,
          detail,
          response.headers.get('x-request-id') ?? undefined,
        );
      }
    },
  });
  return client;
}
export type ApiClient = ReturnType<typeof createApiClient>;

// @vitest-environment node
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse, delay } from 'msw';
import { mockServer } from '../../mocks/server';
import { createApiClient } from '../../shared/api/client/create-client';
beforeAll(() => mockServer.listen({ onUnhandledFrame: 'error' }));
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());
describe('OpenAPI transport', () => {
  it('supports caller cancellation and transport timeouts', async () => {
    mockServer.use(
      http.get('*/api/v1/health', async () => {
        await delay(100);
        return HttpResponse.json({ status: 'ok' });
      }),
    );
    await expect(
      createApiClient({ baseUrl: 'http://localhost/api/v1', timeoutMs: 10 }).GET('/health'),
    ).rejects.toMatchObject({ name: 'TimeoutError' });
    const controller = new AbortController();
    controller.abort();
    await expect(
      createApiClient({ baseUrl: 'http://localhost/api/v1' }).GET('/health', {
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({ name: 'AbortError' });
  });
  it('returns typed infrastructure data', async () => {
    const api = createApiClient({ baseUrl: 'http://localhost/api/v1' });
    expect((await api.GET('/health')).data?.status).toBe('ok');
  });
  it('invalidates auth on 401', async () => {
    mockServer.use(http.get('*/api/v1/health', () => new HttpResponse(null, { status: 401 })));
    const unauthorized = vi.fn();
    await expect(
      createApiClient({ baseUrl: 'http://localhost/api/v1', onUnauthorized: unauthorized }).GET(
        '/health',
      ),
    ).rejects.toMatchObject({ status: 401 });
    expect(unauthorized).toHaveBeenCalledOnce();
  });
  it('retries safe reads once', async () => {
    let count = 0;
    mockServer.use(
      http.get('*/api/v1/health', () =>
        ++count === 1
          ? new HttpResponse(null, { status: 503 })
          : HttpResponse.json({ status: 'ok' }),
      ),
    );
    await createApiClient({ baseUrl: 'http://localhost/api/v1' }).GET('/health');
    expect(count).toBe(2);
  });
});

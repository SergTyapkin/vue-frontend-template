import { http, HttpResponse, delay } from 'msw';
export const handlers = [
  http.get('*/api/v1/health', async () => {
    await delay(40);
    return HttpResponse.json({ status: 'ok' as const });
  }),
];
export const unavailableHandler = http.get('*/api/v1/health', () =>
  HttpResponse.json({ detail: 'Unavailable' }, { status: 503 }),
);

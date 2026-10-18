import { randomUUID } from 'node:crypto';
export default defineEventHandler((event) => {
  const id = randomUUID();
  event.context.requestId = id;
  setHeader(event, 'X-Request-Id', id);
  setHeader(event, 'X-Content-Type-Options', 'nosniff');
  setHeader(event, 'Referrer-Policy', 'strict-origin-when-cross-origin');
});

import { describe, it, expect, vi } from 'vitest';
import { downloadResources, type OfflineEvent } from '../../pwa/offline/download';
describe('offline resource preparation', () => {
  it('counts resources only after a successful cache write', async () => {
    const events: OfflineEvent[] = [];
    const cache = { put: vi.fn().mockResolvedValue(undefined) };
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response('asset'));
    const result = await downloadResources(['/a.js', '/b.css'], cache, fetcher, (event) =>
      events.push(event),
    );
    expect(result).toMatchObject({ status: 'ready', percent: 100, completed: 2 });
    expect(events.map((event) => event.type)).toEqual([
      'start',
      'progress',
      'progress',
      'complete',
    ]);
    expect(events[1]?.state.percent).toBe(50);
  });
  it('does not report failed/private/auth responses as offline ready', async () => {
    const cache = { put: vi.fn().mockRejectedValue(new Error('quota')) };
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('private', { headers: { 'cache-control': 'private' } }));
    const result = await downloadResources(
      ['/a', '/auth/session', '//evil.test'],
      cache,
      fetcher,
      vi.fn(),
    );
    expect(result).toMatchObject({ status: 'error', completed: 0, percent: 0 });
    expect(result.errors).toHaveLength(3);
    expect(cache.put).not.toHaveBeenCalled();
  });
  it('handles quota failure and empty lists', async () => {
    const cache = { put: vi.fn().mockRejectedValue(new Error('quota')) };
    const result = await downloadResources(
      ['/a.js'],
      cache,
      vi.fn<typeof fetch>().mockResolvedValue(new Response('asset')),
      vi.fn(),
    );
    expect(result.status).toBe('error');
    expect((await downloadResources([], cache, fetch, vi.fn())).percent).toBe(100);
  });
});

/// <reference lib="webworker" />
import { clientsClaim, setCacheNameDetails } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute, matchPrecache } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import site from '../../site.config';
import { offlineCachePrefix, offlineResources, isPublicResponse } from '../policy';
import { downloadResources, emptyDownloadState } from '../offline/download';
declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: { url: string; revision: string | null }[];
};
setCacheNameDetails({ prefix: 'forma-static' });
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest);
cleanupOutdatedCaches();
clientsClaim();
// Build-specific cache name changes whenever the precache manifest changes.
const version = manifest
  .map((entry) => entry.revision ?? entry.url)
  .join('')
  .split('')
  .reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0)
  .toString(36);
const cacheName = `${offlineCachePrefix}${version}`;
let activeDownload: Promise<unknown> | undefined;
const notify = async (message: unknown) => {
  for (const client of await self.clients.matchAll()) client.postMessage(message);
};
self.addEventListener('activate', (event) =>
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys())
        if (key.startsWith(offlineCachePrefix) && key !== cacheName) await caches.delete(key);
      await notify({ type: 'new-version', state: emptyDownloadState() });
    })(),
  ),
);
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    void self.skipWaiting();
    return;
  }
  if (!site.pwa.offline) return;
  if (event.data?.type === 'OFFLINE_DOWNLOAD') {
    activeDownload ??= caches
      .open(cacheName)
      .then((cache) =>
        downloadResources(offlineResources, cache, fetch, (message) => {
          void notify(message);
        }),
      )
      .finally(() => {
        activeDownload = undefined;
      });
    event.waitUntil(activeDownload);
  }
  if (event.data?.type === 'OFFLINE_CLEAR')
    event.waitUntil(
      (async () => {
        await activeDownload;
        await caches.delete(cacheName);
        await notify({ type: 'cleared', state: emptyDownloadState() });
      })(),
    );
  if (event.data?.type === 'OFFLINE_STATUS')
    event.waitUntil(
      (async () => {
        const cache = await caches.open(cacheName);
        const completed = (
          await Promise.all(offlineResources.map((resource) => cache.match(resource)))
        ).filter(Boolean).length;
        const ready = completed === offlineResources.length;
        event.source?.postMessage({
          type: ready ? 'complete' : 'progress',
          state: {
            ...emptyDownloadState(),
            status: ready ? 'ready' : 'idle',
            completed,
            total: offlineResources.length,
            percent: offlineResources.length
              ? Math.floor((completed / offlineResources.length) * 100)
              : 100,
          },
        });
      })(),
    );
});
if (site.pwa.offline) {
  registerRoute(
    ({ request, url }) =>
      url.origin === self.location.origin &&
      request.destination === 'image' &&
      url.pathname.startsWith('/branding/'),
    new CacheFirst({
      cacheName: 'forma-branding',
      plugins: [new ExpirationPlugin({ maxEntries: 12, maxAgeSeconds: 604800 })],
    }),
  );
  for (const policy of site.pwa.publicApi)
    registerRoute(
      ({ request, url }) =>
        request.method === 'GET' &&
        url.origin === self.location.origin &&
        url.pathname === policy.path,
      new NetworkFirst({
        cacheName: `forma-public-api-${encodeURIComponent(policy.path)}`,
        plugins: [
          new ExpirationPlugin({ maxAgeSeconds: policy.ttlSeconds, maxEntries: 20 }),
          {
            cacheWillUpdate: async ({ response }) =>
              isPublicResponse(response) &&
              /\bpublic\b/i.test(response.headers.get('cache-control') ?? '')
                ? response
                : null,
          },
        ],
      }),
    );
  registerRoute(
    ({ request, url }) =>
      request.mode === 'navigate' &&
      url.origin === self.location.origin &&
      !/^\/(api|auth)(\/|$)/.test(url.pathname),
    async ({ request, url }) => {
      try {
        return await fetch(request);
      } catch {
        const cache = await caches.open(cacheName);
        return (
          (site.pwa.publicPages.includes(url.pathname)
            ? await cache.match(url.pathname)
            : undefined) ??
          (await matchPrecache('/offline.html')) ??
          new Response('Offline', { status: 503 })
        );
      }
    },
  );
}

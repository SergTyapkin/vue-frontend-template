import { reactive } from 'vue';
import site from '../../site.config';
import { emptyDownloadState, type OfflineEvent } from '../../pwa/offline/download';
export default defineNuxtPlugin((app) => {
  const state = reactive({
    download: emptyDownloadState(),
    reachable: true,
    supported: 'serviceWorker' in navigator && site.pwa.enabled,
    checking: false,
  });
  const listeners = new Set<(event: OfflineEvent) => void>();
  let alive = true;
  const command = async (type: string) => {
    if (!state.supported) return;
    const registration = await navigator.serviceWorker.ready;
    (navigator.serviceWorker.controller ?? registration.active)?.postMessage({ type });
  };
  const check = async () => {
    if (state.checking) return;
    state.checking = true;
    try {
      const serverRendered = app.payload.serverRendered;
      // A static SPA has no Nitro endpoint. A fresh query bypasses SW precache.
      const probe = serverRendered
        ? '/api/health'
        : `${site.branding.logo}?connectivity=${Date.now()}`;
      const response = await fetch(probe, {
        cache: 'no-store',
        signal: AbortSignal.timeout(5000),
      });
      state.reachable =
        response.ok &&
        (serverRendered
          ? (await response.json()).status === 'ok'
          : response.headers.get('content-type')?.startsWith('image/') === true);
    } catch {
      state.reachable = false;
    } finally {
      state.checking = false;
    }
  };
  const onMessage = (event: MessageEvent<OfflineEvent>) => {
    if (
      !event.data?.state ||
      !['start', 'progress', 'complete', 'error', 'new-version', 'cleared'].includes(
        event.data.type,
      )
    )
      return;
    state.download = event.data.state;
    for (const listener of listeners) listener(event.data);
  };
  const onController = () => {
    void command('OFFLINE_STATUS');
  };
  if (state.supported) {
    navigator.serviceWorker.addEventListener('message', onMessage);
    navigator.serviceWorker.addEventListener('controllerchange', onController);
  }
  window.addEventListener('online', check);
  window.addEventListener('offline', check);
  const timer = window.setInterval(() => {
    if (alive && document.visibilityState === 'visible') void check();
  }, 30_000);
  app.hook('app:mounted', () => {
    void check();
    void command('OFFLINE_STATUS');
  });
  app.vueApp.onUnmount(() => {
    alive = false;
    clearInterval(timer);
    window.removeEventListener('online', check);
    window.removeEventListener('offline', check);
    navigator.serviceWorker?.removeEventListener('message', onMessage);
    navigator.serviceWorker?.removeEventListener('controllerchange', onController);
  });
  return {
    provide: {
      offline: {
        state,
        download: () => command('OFFLINE_DOWNLOAD'),
        clear: () => command('OFFLINE_CLEAR'),
        check,
        subscribe: (listener: (event: OfflineEvent) => void) => {
          listeners.add(listener);
          return () => listeners.delete(listener);
        },
      },
    },
  };
});

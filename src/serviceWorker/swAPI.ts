const DEFAULT_SW_FILE_PATH = 'sw.js';
const DEFAULT_SCOPE = '.';
const DEFAULT_REGISTER_SW_OVERWRITING = true; // Регистрировать ли новую версию Service Worker'а если ещё активна старая

type CallbackEach = (data: { current: string; total: number; progress: number }) => void;
type CallbackError = (errUrl: string) => void;
type CallbackIsUrlCached = (result: boolean) => void;


// Типы PostMessage для общения приложения с service worker'ом
const PostMessagesNames = {
  cacheUrls: 'CACHE_URLS',
  isUrlsCached: 'IS_URLS_CACHED',
  clearCache: 'CLEAR_CACHE',

  swCacheProgress: 'SW_CACHE_PROGRESS',
  swAllUrlsCached: 'SW_ALL_URLS_CACHED',
  swUrlsCachingError: 'SW_URLS_CACHING_ERROR',
  swIsUrlsCachedResponse: 'SW_IS_URLS_CACHED',
  swCacheCleared: 'SW_CACHE_CLEARED',
};

let uid = 0;
const PostMessage = (type: string, payload: any) => ({
  type: type,
  payload: payload,
  uid: String(uid++),
});

// ------------ INTERNAL -------------

let SW: ServiceWorker | null;

async function register(
  swFilePath = DEFAULT_SW_FILE_PATH,
  scope = DEFAULT_SCOPE,
  swOverwriting = DEFAULT_REGISTER_SW_OVERWRITING,
): Promise<void> {
  if (navigator.serviceWorker) {
    await (async () => {
      try {
        if (swOverwriting || !navigator.serviceWorker.controller) {
          const regPromise = navigator.serviceWorker.register(swFilePath, { scope: scope });
          console.log('SW registration...');
          const reg = await regPromise;
          console.log('SW registration success. Scopes: ' + reg.scope);
          reg.onupdatefound = onServiceWorkerUpdated;
          SW = reg.active || reg.waiting || reg.installing;
          await onServiceWorkerStateChangedSW(SW);
        } else {
          console.log('SW has already been installed and swOverwriting=false');
          await onServiceWorkerStateChangedSW();
        }
      } catch (error) {
        console.error('SW installation failed. Error: ' + error);
      }
    })();
  } else {
    console.error('SW registration error. Browser not supports Service Workers');
  }
}

function onServiceWorkerUpdated(e: Event) {
  const eTarget = e.target as ServiceWorkerRegistration;
  const sw = eTarget.active || eTarget.waiting || eTarget.installing;
  if (!sw) {
    console.error('Unknown error when registering ServiceWorker');
    return;
  }
  sw.onstatechange = onServiceWorkerStateChanged;
  onServiceWorkerStateChangedSW(sw);
}

function onServiceWorkerStateChanged(e: Event) {
  onServiceWorkerStateChangedSW(e.target as ServiceWorker);
}

// ------ MESSAGES HANDLING ---------
const SWMessagesHandlers: { [key: string]: { [key: string]: CallbackEach | CallbackError | CallbackIsUrlCached } } = {};

function handleSWMessage(e: MessageEvent) {
  // console.log('MESSAGE', e.data.type, e.data.uid, e.data.payload);
  const type = Object.keys(SWMessagesHandlers).find(key => key === e.data.type);
  if (!type) {
    return;
  }
  const callbacks = SWMessagesHandlers[type as keyof typeof SWMessagesHandlers];
  const callback = callbacks[e.data.uid as string];
  if (callback) {
    callback(e.data.payload as never);
  }
}

function setMessageEventListenerOnSW(messageType: keyof typeof SWMessagesHandlers, uid: string, callback?: CallbackEach | CallbackError | CallbackIsUrlCached) {
  if (!callback) {
    return;
  }
  if (SWMessagesHandlers[messageType]) {
    SWMessagesHandlers[messageType][uid] = callback;
    return;
  }
  SWMessagesHandlers[messageType] = { [uid]: callback };
}

function removeMessageEventListenerOnSW(messageType: keyof typeof SWMessagesHandlers, uid: string) {
  if (SWMessagesHandlers[messageType]) {
    delete SWMessagesHandlers[messageType][uid];
  }
}

// ------ MESSAGES HANDLING ---------

async function onServiceWorkerStateChangedSW(_sw = navigator.serviceWorker.controller) {
  if (!_sw) {
    return;
  }
  SW = _sw;
  await (_sw as unknown as { ready: Promise<void> }).ready;
  navigator.serviceWorker.onmessage = handleSWMessage;

  console.log('SW state:', SW.state);
  if (SW.state === 'installed') {
    if (navigator.serviceWorker.controller) {
      console.log('SW has already been installed before');
    } else {
      console.log('SW new instance installed');
    }
  } else if (SW.state === 'activated') {
    SW.postMessage(
      PostMessage(PostMessagesNames.cacheUrls, [
        location.href,
        ...performance
          .getEntriesByType('resource')
          .map(({ name }) => name)
          .filter(url => new URL(url).pathname.startsWith((SW as unknown as { scope: string }).scope)),
      ]),
    );
  }
}

// ------------ API -------------
async function cacheUrls(
  urls: string[],
  callbackEach?: CallbackEach,
): Promise<string[] | string | null> {
  if (!SW) {
    console.error("SW: Error. Can't cache urls because SW is not initialized yet");
    return null;
  }
  await (SW as unknown as { ready: Promise<void> }).ready;
  console.log('Send to ServiceWorker caching urls...');
  if (SW.state !== 'activated') {
    console.error("SW: Error. Can't cache urls because SW is not activated yet. SW state:", SW.state);
    return null;
  }

  const postMessageToSend = PostMessage(PostMessagesNames.cacheUrls, urls);
  return new Promise((resolve, reject) => {
    setMessageEventListenerOnSW(
      PostMessagesNames.swCacheProgress,
      postMessageToSend.uid,
      callbackEach ? (data: { current: string; total: number; progress: number }) => {
        callbackEach({
          current: data.current,
          progress: data.progress,
          total: data.total,
        });
      } : undefined,
    );
    setMessageEventListenerOnSW(PostMessagesNames.swAllUrlsCached, postMessageToSend.uid, () => {
      resolve(urls);
      removeMessageEventListenerOnSW(PostMessagesNames.swCacheProgress, postMessageToSend.uid);
      removeMessageEventListenerOnSW(PostMessagesNames.swAllUrlsCached, postMessageToSend.uid);
    });
    setMessageEventListenerOnSW(PostMessagesNames.swUrlsCachingError, postMessageToSend.uid, (errorUrl: string) => {
      reject(errorUrl);
      removeMessageEventListenerOnSW(PostMessagesNames.swCacheProgress, postMessageToSend.uid);
      removeMessageEventListenerOnSW(PostMessagesNames.swAllUrlsCached, postMessageToSend.uid);
    });

    SW?.postMessage(postMessageToSend);
  });
}

async function isFilesCached(urls: string[]): Promise<boolean | null> {
  if (!SW) {
    console.error("SW: Error. Can't cache urls because SW is not initialized yet");
    return null;
  }
  await (SW as unknown as { ready: Promise<void> }).ready;

  const postMessageToSend = PostMessage(PostMessagesNames.isUrlsCached, urls);
  return new Promise(resolve => {
    setMessageEventListenerOnSW(
      PostMessagesNames.swIsUrlsCachedResponse,
      postMessageToSend.uid,
      (boolValue: boolean) => {
        resolve(boolValue);
        removeMessageEventListenerOnSW(PostMessagesNames.swIsUrlsCachedResponse, postMessageToSend.uid);
      },
    );
    SW?.postMessage(postMessageToSend);
  });
}

async function clearCache(): Promise<void> {
  if (!SW) {
    console.error("SW: Error. Can't cache urls because SW is not initialized yet");
    return;
  }
  await (SW as unknown as { ready: Promise<void> }).ready;

  const postMessageToSend = PostMessage(PostMessagesNames.clearCache, null);
  return new Promise(resolve => {
    setMessageEventListenerOnSW(PostMessagesNames.swCacheCleared, postMessageToSend.uid, () => {
      resolve();
      removeMessageEventListenerOnSW(PostMessagesNames.swCacheCleared, postMessageToSend.uid);
    });
    SW?.postMessage(postMessageToSend);
  });
}

// ------------ EXPORTS -------------
export default { cacheUrls, isFilesCached, clearCache, register };

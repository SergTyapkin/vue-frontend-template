import swAPI from '~/serviceWorker/swAPI';
import routes from '~/routes';

export function getRequestFoo<APIFoo extends (...args: any) => any, Fallback>(
  popupsError: (title: string, desc: string) => any,
) {
  return async (
    context: { loading: boolean },
    apiRequest: APIFoo,
    args: Parameters<APIFoo>,
    errorText: string,
    callback?: (data: Awaited<ReturnType<APIFoo>>['data'], status: number) => any,
    toFallbackValue?: Fallback,
    errorCallbacks?: {[key: number]: () => any},
  ) => {
    context.loading = true;
    try {
      const { status, ok, data } = await apiRequest(...<[]>args);
      context.loading = false;
      if (!ok) {
        const errCallback = errorCallbacks?.[status];
        if (errCallback) {
          errCallback();
          return toFallbackValue;
        }
        if (toFallbackValue) {
          return toFallbackValue;
        }
        popupsError(`Ошибка ${status}`, errorText);
        throw new Error(`Ошибка ${status} при запросе на API. ${errorText}`);
      }
      callback?.(data, status);
      return data;
    } catch (err) {
      context.loading = false;
      console.error('Error while executing $request:', err);
    }
  }
}

export function getCookie(name: string) {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(
  name: string,
  value: string,
  options: { path?: string; expires?: Date | string; 'max-age'?: number; [key: string]: any } = {},
) {
  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options,
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

  for (const optionKey in options) {
    updatedCookie += '; ' + optionKey;
    const optionValue = options[optionKey as keyof typeof options];
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
  setCookie(name, '', {
    'max-age': -1,
  });
}

export function detectBrowser() {
  let result = 'Other';
  if (navigator.userAgent.indexOf('YaBrowser') !== -1) {
    result = 'Yandex Browser';
  } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
    result = 'Mozilla Firefox';
  } else if (navigator.userAgent.indexOf('MSIE') !== -1) {
    result = 'Internet Exploder';
  } else if (navigator.userAgent.indexOf('Edge') !== -1) {
    result = 'Microsoft Edge';
  } else if (navigator.userAgent.indexOf('Safari') !== -1) {
    result = 'Safari';
  } else if (navigator.userAgent.indexOf('Opera') !== -1) {
    result = 'Opera';
  } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
    result = 'Google Chrome';
  }
  return result;
}

export function detectOS() {
  if (window.navigator.userAgent.indexOf('Windows NT 11.0') !== -1) return 'Windows 11';
  if (window.navigator.userAgent.indexOf('Windows NT 10.0') !== -1) return 'Windows 10';
  if (window.navigator.userAgent.indexOf('Windows NT 6.3') !== -1) return 'Windows 8.1';
  if (window.navigator.userAgent.indexOf('Windows NT 6.2') !== -1) return 'Windows 8';
  if (window.navigator.userAgent.indexOf('Windows NT 6.1') !== -1) return 'Windows 7';
  if (window.navigator.userAgent.indexOf('Windows NT 6.0') !== -1) return 'Windows Vista';
  if (window.navigator.userAgent.indexOf('Windows NT 5.1') !== -1) return 'Windows XP';
  if (window.navigator.userAgent.indexOf('Windows NT 5.0') !== -1) return 'Windows 2000';
  if (window.navigator.userAgent.indexOf('Mac') !== -1) return 'Mac'; // Macintosh, MacIntel, MacPPC, Mac68K
  if (window.navigator.userAgent.indexOf('iP') !== -1) return 'iOS'; // iPad, iPhone, iPod
  if (window.navigator.userAgent.indexOf('Android') !== -1) return 'Android';
  if (window.navigator.userAgent.indexOf('X11') !== -1) return 'UNIX';
  if (window.navigator.userAgent.indexOf('Linux') !== -1) return 'Linux';
  return 'Unknown OS';
}

export function deepClone<T>(obj: T): T {
  const ret = (obj instanceof Array ? [] : {}) as T;
  for (const key in obj) {
    if (obj[key] === undefined) {
      continue;
    }
    let val = obj[key];
    if (val && typeof (val) == 'object') {
      val = deepClone(val);
    }
    ret[key] = val;
  }
  return ret;
}

export async function saveAllAssetsByServiceWorker(
  callbackEach?: (data: {current: string, progress: number, total: number}) => void,
  callbackFinish?: () => void,
  callbackError?: (errUrl: string | null) => void,
) {
  let allCachableResources: string[] = [];
  try {
    const module = await import(`${'/assetsList.js'}`);
    allCachableResources = module.default; // list of all cachable resources urls
    console.log('Imported assetsList.js:', allCachableResources );
  } catch {
    console.warn('Cannot find assetsList.js. Nothing to cache. Maybe we are in develompent mode' )
  }

  async function saveAllSite() {
    try {
      await swAPI.cacheUrls(allCachableResources, callbackEach);
      if (callbackFinish) {
        callbackFinish();
      }
    } catch (errUrl) {
      if (callbackError) {
        callbackError(errUrl as unknown as string | null);
      }
    }
  }

  async function saveAllIfNotSaved() {
    if (await swAPI.isFilesCached(allCachableResources)) {
      if (callbackFinish) {
        callbackFinish();
      }
      return;
    }
    await saveAllSite();
  }

  async function setOverrideResourceRegexps() {
    const word = '[\\w-~!*\'()<>"{}|^`]+';
    const baseUrl = `(http(s)?://${word}(\\.${word})+)`;
    const anyEnding = `([?/].*)?`;
    const regexps = {} as {[key: string]: string};
    Object.keys(routes).forEach(route => {
      if (route.includes('pathMatch')) {
        return;
      }
      route = route.replace(/:\w+/, word);
      regexps[`^${baseUrl}${route}${anyEnding}$`] = '$1/index.html';
    });
    console.log("Send to SW override caching regexps:", regexps);
    await swAPI.setResourceMappingRegexps(regexps);
  }

  await setOverrideResourceRegexps();
  await saveAllIfNotSaved();
}

export async function setDisableCachingUrlsByServiceWorker(paths: string[]) {
  const word = '[\\w-~!*\'()<>"{}|^`]+';
  const baseUrl = `(http(s)?://${word}(\\.${word})+)`;
  const regexps = paths.map(path => `^${baseUrl}${path}$`);
  console.log("Send to SW disable caching regexps:", regexps);
  return await swAPI.setDisableCachingRegexps(regexps)
}

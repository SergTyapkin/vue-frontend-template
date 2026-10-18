import { isPublicResponse, isSafePublicPath } from '../policy';
export type OfflineDownloadState = {
  status: 'idle' | 'downloading' | 'ready' | 'error';
  percent: number;
  completed: number;
  total: number;
  errors: string[];
};
export type OfflineEvent = {
  type: 'start' | 'progress' | 'complete' | 'error' | 'new-version' | 'cleared';
  state: OfflineDownloadState;
};
export const emptyDownloadState = (): OfflineDownloadState => ({
  status: 'idle',
  percent: 0,
  completed: 0,
  total: 0,
  errors: [],
});
export async function downloadResources(
  resources: readonly string[],
  cache: Pick<Cache, 'put'>,
  fetcher: typeof fetch,
  emit: (event: OfflineEvent) => void,
) {
  const state: OfflineDownloadState = {
    ...emptyDownloadState(),
    status: 'downloading',
    total: resources.length,
  };
  const publish = (type: OfflineEvent['type']) =>
    emit({ type, state: { ...state, errors: [...state.errors] } });
  publish('start');
  for (const resource of resources) {
    try {
      if (!isSafePublicPath(resource)) throw new Error('Resource is not public');
      const response = await fetcher(resource, {
        credentials: 'omit',
        cache: 'reload',
        redirect: 'error',
      });
      if (
        !isPublicResponse(
          response,
          response.headers.get('content-type')?.includes('text/html') &&
            !resource.endsWith('offline.html'),
        )
      )
        throw new Error('Unsafe response');
      await cache.put(resource, response);
      state.completed++;
    } catch {
      state.errors.push(resource);
    }
    state.percent = state.total ? Math.floor((state.completed / state.total) * 100) : 100;
    publish('progress');
  }
  state.status = state.errors.length ? 'error' : 'ready';
  if (!state.total) state.percent = 100;
  publish(state.errors.length ? 'error' : 'complete');
  return state;
}

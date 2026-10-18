import { QueryClient, dehydrate, hydrate, type DehydratedState } from '@tanstack/query-core';
export default defineNuxtPlugin((app) => {
  const query = new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, retry: false, gcTime: import.meta.server ? Infinity : 300_000 },
    },
  });
  if (import.meta.client && app.payload.queryState)
    hydrate(query, app.payload.queryState as DehydratedState);
  if (import.meta.server)
    app.hook('app:rendered', () => {
      app.payload.queryState = dehydrate(query);
      query.clear();
    });
  return { provide: { query } };
});

import { QueryObserver, type QueryKey } from '@tanstack/query-core';
import { defineComponent, markRaw, type Raw } from 'vue';
import type { NuxtApp } from '#app';
/** Options API mixin. Query cache is owned by the current Nuxt request/app. */
export function resourceOptions<T>(options: {
  key: QueryKey;
  load: (app: NuxtApp, signal: AbortSignal) => Promise<T>;
}) {
  return defineComponent({
    data() {
      return {
        resource: {
          data: undefined as T | undefined,
          isLoading: true,
          isFetching: false,
          error: null as Error | null,
        },
        resourceObserver: null as Raw<QueryObserver<T>> | null,
        resourceUnsubscribe: null as (() => void) | null,
      };
    },
    created() {
      const app = this.$nuxt;
      const observer = markRaw(
        new QueryObserver<T>(app.$query, {
          queryKey: options.key,
          queryFn: ({ signal }) => options.load(app, signal),
        }),
      );
      this.resourceObserver = observer;
      const update = () => {
        const result = observer.getCurrentResult();
        Object.assign(this.resource, {
          data: result.data,
          isLoading: result.isLoading,
          isFetching: result.isFetching,
          error: result.error,
        });
      };
      this.resourceUnsubscribe = observer.subscribe(update);
      update();
    },
    async serverPrefetch() {
      await this.resourceObserver?.refetch();
    },
    beforeUnmount() {
      this.disposeResource();
    },
    methods: {
      refreshResource() {
        return this.resourceObserver?.refetch();
      },
      async clearResource() {
        await this.$nuxt.$query.cancelQueries({ queryKey: options.key });
        this.$nuxt.$query.removeQueries({ queryKey: options.key });
        Object.assign(this.resource, {
          data: undefined,
          error: null,
          isLoading: false,
          isFetching: false,
        });
      },
      disposeResource() {
        this.resourceUnsubscribe?.();
        this.resourceObserver?.destroy();
      },
    },
  });
}

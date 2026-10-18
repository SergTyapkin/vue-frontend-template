// QueryClient is owned by each individual Nuxt app/request.
import type { QueryClient } from '@tanstack/query-core';
declare module '#app' {
  interface NuxtApp {
    $query: QueryClient;
  }
}
declare module 'vue' {
  interface ComponentCustomProperties {
    $query: QueryClient;
  }
}
export {};

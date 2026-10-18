import { defineStore } from 'pinia';
export type SessionUser = { sub: string; name?: string; roles: string[]; permissions: string[] };
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as SessionUser | null,
    status: 'idle' as 'idle' | 'loading' | 'ready' | 'error',
  }),
  getters: { authenticated: (state) => Boolean(state.user) },
  actions: {
    reset() {
      this.user = null;
      this.status = 'ready';
    },
    can(permission: string) {
      return this.user?.permissions.includes(permission) ?? false;
    },
  },
});

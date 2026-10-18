import { defineStore } from 'pinia';
export const useUiStore = defineStore('ui', {
  state: () => ({ compact: false, sidebarOpen: false }),
});

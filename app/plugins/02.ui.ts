import { shallowReactive } from 'vue';
import { uiServicesKey, type UiServices } from '../../shared/ui/services';
export default defineNuxtPlugin((app) => {
  const ui = shallowReactive({} as UiServices);
  app.vueApp.provide(uiServicesKey, ui);
  return { provide: { ui } };
});

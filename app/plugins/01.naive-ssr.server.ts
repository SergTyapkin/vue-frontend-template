import { setup } from '@css-render/vue3-ssr';
export default defineNuxtPlugin((app) => {
  const { collect } = setup(app.vueApp);
  app.hook('app:rendered', () => {
    if (app.ssrContext) {
      const styles = [...collect().matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)].map(
        ([, attributes, innerHTML]) => ({
          innerHTML,
          'cssr-id': attributes?.match(/cssr-id="([^"]+)"/)?.[1],
        }),
      );
      app.ssrContext.head.push({ style: styles });
    }
  });
});

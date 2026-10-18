export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();
  if (!import.meta.dev || !config.public.mocks) return;
  if (import.meta.server) {
    const { mockServer } = await import('../../mocks/server');
    mockServer.listen({ onUnhandledFrame: 'bypass' });
  } else {
    const { setupWorker } = await import('msw/browser');
    const { handlers } = await import('../../mocks/handlers');
    await setupWorker(...handlers).start({ onUnhandledFrame: 'bypass' });
  }
});

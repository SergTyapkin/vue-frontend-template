export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('error', (error, context) => {
    console.log(
      JSON.stringify({
        level: 'error',
        message: error.message,
        requestId: context.event?.context.requestId,
        path: context.event ? getRequestURL(context.event).pathname : undefined,
      }),
    );
  });
});

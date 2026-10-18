export default defineEventHandler(() => ({
  status: 'ok',
  version: useRuntimeConfig().public.buildVersion,
  gitSha: useRuntimeConfig().public.gitSha,
}));

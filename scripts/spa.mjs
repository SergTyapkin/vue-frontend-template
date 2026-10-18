import { spawnSync } from 'node:child_process';
// One-off static build; the persistent setting remains site.rendering.ssr.
const result = spawnSync(process.execPath, ['node_modules/nuxt/bin/nuxt.mjs', 'generate'], {
  stdio: 'inherit',
  env: { ...process.env, TEMPLATE_RENDER_MODE: 'spa' },
});
process.exit(result.status ?? 1);

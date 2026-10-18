import { constants } from 'node:fs';
import { copyFile, mkdir, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import site from '../site.config.ts';

if (
  !site.name ||
  !URL.canParse(site.url) ||
  !site.i18n.locales.some((l) => l.code === site.i18n.defaultLocale)
)
  throw new Error('Invalid site.config.ts');
await copyFile('.env.example', '.env.local', constants.COPYFILE_EXCL).catch((error) => {
  if (error.code !== 'EEXIST') throw error;
});
for (const directory of ['.cache', '.data', 'public/fonts'])
  await mkdir(directory, { recursive: true });
for (const subset of ['latin', 'cyrillic'])
  await copyFile(
    `node_modules/@fontsource-variable/inter/files/inter-${subset}-wght-normal.woff2`,
    `public/fonts/inter-${subset}.woff2`,
  );
await copyFile('node_modules/@fontsource-variable/inter/LICENSE', 'public/fonts/LICENSE');
await copyFile(
  new URL(import.meta.resolve('msw/mockServiceWorker.js')),
  'public/mockServiceWorker.js',
);
for (const asset of [
  site.branding.logo,
  site.branding.favicon,
  site.branding.ogImage,
  ...site.pwa.icons.map((i) => i.src),
])
  await access(`public${asset}`);
if (!process.env.CI && !process.env.LEFTHOOK) {
  const result = spawnSync(process.execPath, ['node_modules/lefthook/bin/index.js', 'install'], {
    stdio: 'inherit',
  });
  if (result.status !== 0)
    console.warn('Hooks unavailable. Run pnpm exec lefthook install inside a Git checkout.');
}
console.log('Project initialized. Existing .env.local preserved.');

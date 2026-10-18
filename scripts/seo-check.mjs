import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { parse } from '@vue/compiler-sfc';
import site from '../site.config.ts';
const files = process.argv.slice(2);
const targets = files.length
  ? files
  : spawnSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '*.vue'], {
      encoding: 'utf8',
    })
      .stdout.trim()
      .split(/\r?\n/)
      .filter(Boolean);
const errors = [];
if (!site.name || !site.description[site.i18n.defaultLocale])
  errors.push('Site title/description missing');
if (!URL.canParse(site.url) || !/^https?:/.test(site.url))
  errors.push('Canonical origin must be an absolute HTTP(S) URL');
for (const file of targets) {
  if (!file.endsWith('.vue')) continue;
  let source;
  try {
    source = await readFile(file, 'utf8');
  } catch {
    continue;
  }
  const template = parse(source).descriptor.template?.content ?? '';
  if (/auth:\s*true/.test(source) && !/sitemap:\s*false/.test(source))
    errors.push(`${file}: private routes require sitemap: false`);
  for (const image of template.matchAll(/<(?:img|AppImage|NuxtImg)\b[^>]*>/g))
    if (!/(?:\s|:)alt\s*=/.test(image[0])) errors.push(`${file}: image requires alt`);
  if (/definePageMeta\(\{[^}]*auth:\s*true[^}]*public:\s*true/s.test(source))
    errors.push(`${file}: route cannot be public and authenticated`);
  if (file.replaceAll('\\', '/').includes('app/pages/') && !source.includes('definePageMeta'))
    errors.push(`${file}: explicitly mark public/auth route metadata`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`SEO static checks passed (${targets.length} files).`);

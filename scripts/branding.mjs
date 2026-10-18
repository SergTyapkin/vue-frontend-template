import sharp from 'sharp';
import site from '../site.config.ts';
const source = `public${site.branding.logo}`;
for (const [target, width, height] of [
  [site.branding.favicon, 64, 64],
  ...site.pwa.icons.map((i) => [i.src, ...i.sizes.split('x').map(Number)]),
  [site.branding.ogImage, 1200, 630],
]) {
  await sharp(source)
    .resize(width, height, { fit: 'contain', background: site.branding.backgroundColor })
    .png()
    .toFile(`public${target}`);
}
console.log('Branding assets generated from', source);

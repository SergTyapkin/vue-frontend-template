import site from '../../site.config';
const kebab = (value: string) => value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
export default defineNuxtPlugin(() => {
  const palette = (colors: Record<string, string>) =>
    Object.entries(colors)
      .map(([key, value]) => `--color-${kebab(key)}:${value}`)
      .join(';');
  useHead({
    style: [
      {
        key: 'project-tokens',
        innerHTML: `:root{${palette(site.appearance.colors.light)};--font-family-body:${site.appearance.fonts.body},sans-serif;--font-family-heading:${site.appearance.fonts.heading},sans-serif;--font-size-base:${site.appearance.fonts.size};--line-height-normal:${site.appearance.fonts.lineHeight}}.dark{${palette(site.appearance.colors.dark)}}`,
      },
    ],
  });
});

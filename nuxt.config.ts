import site from './site.config';
import { fileURLToPath } from 'node:url';
import type { FontFamilyManualOverride, FontFamilyProviderOverride } from '@nuxt/fonts';
const stylusOptions = {
  define: {
    projectFontBody: site.appearance.fonts.body,
    projectFontHeading: site.appearance.fonts.heading,
  },
};

export default defineNuxtConfig({
  compatibilityDate: '2026-10-18',
  ssr: process.env.TEMPLATE_RENDER_MODE === 'spa' ? false : site.rendering.ssr,
  devtools: { enabled: false },
  auth: { loadStrategy: 'none' },
  // Nuxt's cross-runtime directory is externalized by Nitro and must never contain SFCs.
  dir: { shared: 'shared/runtime' },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@vite-pwa/nuxt',
    'nuxt-auth-utils',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],
  alias: {
    '@shared': fileURLToPath(new URL('./shared', import.meta.url)),
    '@features': fileURLToPath(new URL('./features', import.meta.url)),
    '@mocks': fileURLToPath(new URL('./mocks', import.meta.url)),
  },
  components: [
    { path: '~/components', pathPrefix: false },
    { path: '~~/shared/ui', pathPrefix: false, extensions: ['vue'] },
  ],
  css: ['~/assets/styles/main.styl'],
  typescript: { strict: true },
  runtimeConfig: {
    apiUpstream: '',
    oidcClientSecret: '',
    session: { password: '' },
    public: {
      buildVersion: process.env.npm_package_version || '1.0.0',
      gitSha: process.env.GIT_SHA || 'local',
      mocks: site.features.mocks,
    },
  },
  app: {
    head: {
      title: site.name,
      link: [{ rel: 'icon', href: site.branding.favicon }],
      meta: [{ name: 'theme-color', content: site.branding.themeColor }],
    },
  },
  colorMode: {
    preference: site.appearance.theme,
    fallback: 'light',
    classSuffix: '',
    storage: 'cookie',
  },
  i18n: {
    locales: site.i18n.locales,
    defaultLocale: site.i18n.defaultLocale,
    strategy: site.i18n.prefixes ? 'prefix_except_default' : 'no_prefix',
    detectBrowserLanguage: site.i18n.detectBrowserLanguage
      ? { useCookie: true, cookieKey: 'locale', redirectOn: 'root' }
      : false,
    vueI18n: './i18n.config.ts',
  },
  fonts: {
    provider: 'local',
    processCSSVariables: false,
    defaults: { weights: [400, 500, 600, 700], styles: ['normal'], subsets: ['latin', 'cyrillic'] },
    families: [...new Set([site.appearance.fonts.body, site.appearance.fonts.heading])].flatMap<
      FontFamilyManualOverride | FontFamilyProviderOverride
    >((name) =>
      name === 'Inter'
        ? ['latin', 'cyrillic'].map((subset) => ({
            name,
            global: true,
            preload: subset === 'latin',
            display: 'swap' as const,
            weight: '100 900',
            style: 'normal' as const,
            src: new URL(`./public/fonts/inter-${subset}.woff2`, import.meta.url).href,
            unicodeRange:
              subset === 'latin'
                ? 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
                : 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116',
          }))
        : [{ name, provider: 'local', global: true, preload: true, display: 'swap' as const }],
    ),
  },
  icon: {
    serverBundle: { collections: ['lucide', 'tabler', 'mdi'] },
    clientBundle: { scan: true },
  },
  image: { format: ['avif', 'webp'], domains: [] },
  site: {
    url: site.url,
    name: site.name,
    description: site.description[site.i18n.defaultLocale],
    defaultLocale: site.i18n.defaultLocale,
    indexable: site.seo.indexable,
  },
  sitemap: {
    enabled: site.seo.sitemap,
    exclude: ['/auth/**', '/api/**', '/offline', '/offline.html'],
    sources: ['/api/__sitemap__/urls'],
  },
  robots: { enabled: site.seo.robots, disallow: ['/api/', '/auth/'] },
  routeRules: {
    '/api/**': { headers: { 'Cache-Control': 'no-store' } },
    '/auth/**': { headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } },
    ...site.rendering.routeRules,
  },
  nitro: {
    compressPublicAssets: true,
    preset: process.env.TEMPLATE_RENDER_MODE === 'spa' ? 'static' : 'node-server',
    output: { dir: process.env.TEMPLATE_RENDER_MODE === 'spa' ? '.output-spa' : '.output' },
  },
  postcss: { plugins: { autoprefixer: {} } },
  vite: {
    ssr: { noExternal: ['naive-ui', '@css-render/vue3-ssr', 'vueuc'] },
    css: {
      preprocessorOptions: {
        styl: stylusOptions,
        stylus: stylusOptions,
      },
    },
  },
  pwa: {
    disable: !site.pwa.enabled,
    strategies: 'injectManifest',
    srcDir: fileURLToPath(new URL('./pwa/sw', import.meta.url)),
    filename: 'sw.ts',
    registerType: site.pwa.updatePolicy,
    injectManifest: {
      // Nuxt PWA strips .html by default; preserve the static fallback's actual URL.
      manifestTransforms: [async (entries) => ({ manifest: entries, warnings: [] })],
      globPatterns: ['**/*.{js,css,woff2,png,svg,ico}', 'offline.html'],
      globIgnores: ['**/mockServiceWorker.js'],
      maximumFileSizeToCacheInBytes: 4_000_000,
    },
    manifest: {
      name: site.name,
      short_name: site.shortName,
      description: site.description[site.i18n.defaultLocale],
      lang: site.i18n.defaultLocale,
      start_url: '/',
      display: 'standalone',
      theme_color: site.branding.themeColor,
      background_color: site.branding.backgroundColor,
      icons: site.pwa.icons,
    },
    client: { registerPlugin: true, periodicSyncForUpdates: 3600 },
    devOptions: { enabled: false },
  },
});

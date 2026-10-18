import site from '../../site.config';
export default defineNuxtPlugin((app) => {
  const route = useRoute();
  const locale = () => app.$i18n.locale.value as 'ru' | 'en';
  useHead(() => ({
    htmlAttrs: { lang: locale() },
    title: site.name,
    link: [{ rel: 'canonical', href: new URL(route.path, site.url).href }],
  }));
  useSeoMeta({
    description: () => site.description[locale()],
    ogTitle: site.name,
    ogDescription: () => site.description[locale()],
    ogImage: new URL(site.branding.ogImage, site.url).href,
    ogUrl: () => new URL(route.path, site.url).href,
    ogType: 'website',
    ogLocale: () => locale(),
    twitterCard: site.seo.twitterCard,
    robots: () => (!site.seo.indexable || route.meta.auth ? 'noindex, nofollow' : 'index, follow'),
  });
});

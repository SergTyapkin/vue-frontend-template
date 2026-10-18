import site from '../site.config';
export default defineI18nConfig(() => ({ legacy: false, fallbackLocale: site.i18n.defaultLocale }));

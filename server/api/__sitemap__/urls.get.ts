import site from '../../../site.config';
// Additional entries must be explicitly public. Nuxt pages are discovered by the module.
export default defineEventHandler(() => site.pwa.publicPages.map((loc) => ({ loc })));

# Engineering rules

- Application Vue SFCs use `<script lang="ts">`, `defineComponent()` and Options API. No script setup or setup method. Composition API belongs only in integration plugins, infrastructure TS components and utilities.
- Import `definePageMeta` from `@shared/lib/page-meta` in normal Options API page scripts. Nuxt statically extracts the macro; the safe no-op avoids calling the setup-only runtime warning helper.
- Scoped Stylus is the default for component styles. Reuse semantic CSS tokens. Only reset, typography and tokens are global. Respect reduced motion, keyboard access and semantic HTML.
- `app` owns Nuxt routing and integration; `features/<name>` owns a feature; `shared` must not depend on features or app. Never import another feature's internals; introduce an explicit public export if needed. Avoid cycles.
- `site.config.ts` is the only public project configuration. Environment overrides and secrets belong in runtimeConfig. Never put secrets in public runtime settings.
- Use strict TypeScript. Generate API declarations with `pnpm api:generate`; never manually edit `shared/api/generated`. FastAPI OpenAPI is the source of truth. JSON/TS use camelCase, ISO 8601 dates include timezone.
- Options components access providers through `this.$ui`, API through `this.$api`, server resources through `resourceOptions`. No global mutable user state or query clients. Do not copy server entities to Pinia.
- Never use browser APIs during SSR. Request cookies may be forwarded only to the controlled same-origin BFF. Do not trust forwarded headers unless the infrastructure strips and validates them.
- Auth is external OIDC. Do not introduce local accounts, passwords or localStorage tokens. Private routes must declare auth metadata; the backend must enforce authorization independently.
- Cache only explicitly approved public resources. Private HTML, authentication and arbitrary API responses must not enter offline caches. Readiness means successful writes of the explicit resource list, not SW installation.
- New infrastructure behavior requires focused tests. Run lint, typecheck, tests and build for significant changes. Test SSR hydration with Playwright. Do not add business demo entities to the template.
- Hooks must stay fast: no full typecheck/build/test suite in pre-commit/pre-push. Never push without authorization. Never introduce deployment automation here.

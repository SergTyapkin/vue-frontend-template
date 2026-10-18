# Development notes

## Validation

Use Zod schemas, vee-validate Form/Field components and Naive UI inputs. Async submit
handlers let vee-validate maintain isSubmitting; use errors/meta for touched/dirty and
field validation, disable submit while sending. Server 422 detail maps via fieldErrors.
No runtime model duplication: schemas validate input, OpenAPI types describe API.

## Tests and hooks

Unit tests use MSW with explicit handlers; production requests are never automatically mocked.
Enable site.features.mocks only deliberately. Init prepares the official MSW browser worker;
rerun `pnpm project:init` after a worker version update. MSW worker is excluded from PWA precache.
SSR mocks do not include auth or user-specific fixtures. Never change handlers per user request.

Lefthook delegates pre-commit to lint-staged. It hides unstaged portions of partially staged
files and restores them afterward. Commands are read-only: auto-fixes are explicit through
pnpm lint:fix. Independent file groups run in parallel; related tests can take longer
when a shared dependency changes. Hooks never run full build/typecheck/e2e/Lighthouse.
Pre-push checks tracked secret signatures/artifacts; CI Gitleaks scans history more broadly.
Measure actual hooks with `Measure-Command { pnpm exec lefthook run pre-commit }`
or a system timer. CI timings are not a promise of local latency.

Run `pnpm check`, then `pnpm test:e2e` after building. CI audits high vulnerabilities,
verifies generated API drift, SSR browser hydration and SPA output. Lighthouse checks SEO,
accessibility and CLS; LCP/TBT are warnings until a product-specific performance budget is set.
INP requires field interaction telemetry; do not confuse Lighthouse TBT with real INP.

## Optional security workflows

AI review is opt-in via ENABLE_AI_REVIEW repository variable and OPENAI_API_KEY.
It is manually dispatched with a PR number, reads only the diff, runs no PR code, has
no production secrets and writes a workflow summary. Review requires API billing if enabled.
Normal tests and local workflows have no dependency on AI service availability.
ZAP baseline is separately gated by ENABLE_STAGING_ZAP, exact STAGING_ORIGIN and the
staging-security environment. Configure environment reviewers before enabling.
Never set the allowed origin to production.

## Dependencies

Use pnpm with frozen lockfile in CI. Dependabot groups Nuxt updates and updates Actions.
The stable registry release of vee-validate remains 4.15.1 at implementation time;
v5 is beta. Upgrade after a stable v5 and rerun form integration tests.
stylelint-stylus 1.0.0 declares support only through Stylelint 16; keep that compatibility
boundary until the plugin supports 17. Do not format Stylus through Prettier.
TypeScript 5.9 is retained because openapi-typescript requires the 5.x compiler API
and typescript-eslint does not yet support TypeScript 7. Node declarations match Node 24.
Font files originate in @fontsource-variable/inter (OFL) and are copied to ignored public/fonts
at init. Preserve the upstream license when redistributing fonts in a downstream product.

# Architecture

Public settings flow from site.config → Nuxt config, app config, theme, i18n, SEO and SW.
These are build-time settings: changing them requires restarting development/rebuilding.
Nuxt's `dir.shared` points to `shared/runtime`: Nuxt externalizes that directory into
Nitro, so it contains only cross-runtime types/utilities. Feature-first `shared/ui` and
other application helpers stay outside that special directory and are compiled by Vite.
Nuxt runtimeConfig supports environment-specific backend/secret values without rebuilding.
No secret may use NUXT_PUBLIC_* or be imported into application code.

## SSR and data ownership

Each request creates its own Pinia, UI service holder and QueryClient. Query observers
are created by Options API mixins and awaited by serverPrefetch; successful queries
are dehydrated into Nuxt payload, then restored before client component creation.
This avoids the hydration GET. Stale queries can refetch after the configured 60 seconds;
navigation, keys, refresh and invalidation remain TanStack responsibilities.
Call dispose on unmount; last observer removal aborts unused in-flight queries.
Never serialize secrets or token responses in resources. Keys must include filters,
sorting, page, locale and any other response-dependent inputs.
Bootstrap session uses Nuxt useAsyncData inside a plugin, including payload hydration.

## UI and theme

Naive CSS is collected per SSR Vue application. Provider services are injected from
a small TS integration component into a request-local object; SFCs remain Options API.
Color mode uses an early bootstrap script and cookie. Until client mount, providers
render their stable fallback to avoid mismatched server/client component markup.
Tokens use html.light/dark and update independently before app hydration.
Theme and locale preferences belong to their Nuxt modules, avoiding a duplicate Pinia
source of truth; Pinia owns auth claims and local interface preferences.

## SSO boundary

OIDC discovery and token validation use openid-client, Authorization Code + PKCE,
state/nonce, short-lived transaction and fixed callback origin. nuxt-auth-utils stores
encrypted, HttpOnly session cookies; configure a strong shared key across instances.
Keep claims small to stay below browser cookie limits. No in-memory session singleton.
The starter deliberately does not persist upstream access/refresh tokens: extending
the BFF to call a protected FastAPI requires a server-only token/session adapter with
expiry, revocation and refresh locking. Prefer a central session service for this.
Do not forward the Nuxt session cookie to third-party identity providers.
Map trusted roles/permissions in callback; do not trust client-supplied claims.
Logout clears local session; provider end-session and revocation are provider-specific.
Multi-tab concurrent login uses one transaction cookie; newest transaction wins.
Use HTTPS and accurate site.url in production. Reverse proxy must strip spoofed forwarded
headers; configure trusted proxy behavior in infrastructure, never trust every proxy here.

## PWA boundary

Workbox owns versioned static precache and outdated cache cleanup. Nuxt PWA's default
HTML URL normalization is overridden to preserve the physical offline.html URL. The separate
explicit resource cache has a manifest-derived version, actual write progress,
failures, queryable readiness and clear events. Static assets are not user data.
No arbitrary cross-origin cache. Public API runtime cache requires an exact path,
explicit public response header and TTL. Never authorize sensitive paths in config.
Public HTML is opt-in, fetched without cookies and requires Cache-Control: public.
Do not cache personalized SSR HTML even when it has a public URL.
Offline fallback is a small bilingual document. Reachability probes /api/health;
server failures are observed even if navigator.onLine remains true.
An explicit resource list prepares precisely that list, not every possible navigation.
For full offline routes include public HTML plus data/dependencies; verify in browser.
Static SPA builds probe a fresh branding asset URL instead of a nonexistent Nitro endpoint.

## Rendering and scaling

Nitro node-server output supports a future multi-stage container without embedded Nginx.
Environment-specific upstream, buildVersion, gitSha and shared session key support
multiple instances. No deployment, SSH, certificate or proxy lifecycle is included.
Use relative API URLs. Health returns build identity; request IDs accompany responses.
Public hybrid routes can use rendering.routeRules. Private routes must never be prerendered.
Sitemap discovers public Nuxt pages; mark private ones sitemap:false and auth:true.
Dynamic pages require explicit known params in sitemap sources. Do not add private URLs.

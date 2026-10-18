# Forma · Nuxt product template

Минималистичная основа коммерческого веб-приложения: Nuxt 4, Vue 3, TypeScript,
Options API, Stylus, Naive UI. SSR включён. Без бизнес-сущностей и обязательного backend.

## Быстрый старт

Node.js 24.15+ LTS (также 22.22.3+), pnpm 10, Git. Точный диапазон — в package.json.

```sh
corepack enable
pnpm install
pnpm dev
```

Install создаёт отсутствующий `.env.local`, локальные шрифты и рабочие каталоги,
устанавливает Lefthook и подготавливает Nuxt. Повторный запуск сохраняет настройки.
При отключённых lifecycle scripts выполните `pnpm project:init`.

## Новый продукт

1. Измените **`site.config.ts`**: название, описание, домен, темы, языки, SEO, PWA, SSO.
2. Замените `public/branding/logo.svg`, выполните `pnpm branding:generate`.
3. Добавляйте страницы и компоненты.

Значения в site.config публичны и применяются при сборке. Секреты и адрес backend
передаются через runtime env: `NUXT_API_UPSTREAM`, `NUXT_SESSION_PASSWORD`,
`NUXT_OIDC_CLIENT_SECRET`. Production запускается с переменными окружения,
а не с автоматически загружаемым `.env.local`.

## Команды

| Команда                             | Назначение                             |
| ----------------------------------- | -------------------------------------- |
| `pnpm dev`                          | Локальная разработка                   |
| `pnpm project:init`                 | Повторная подготовка, без сборки       |
| `pnpm typecheck`                    | Nuxt / vue-tsc                         |
| `pnpm lint` / `pnpm lint:fix`       | ESLint, Stylelint, Prettier, SEO       |
| `pnpm test` / `pnpm test:coverage`  | Инфраструктурные unit-тесты            |
| `pnpm test:related path/to/file.ts` | Связанные тесты                        |
| `pnpm test:e2e`                     | Playwright против SSR build            |
| `pnpm build` / `pnpm start`         | Nitro Node server                      |
| `pnpm build:spa`                    | Статический SPA в `.output-spa/public` |
| `pnpm build:analyze`                | Анализ bundle                          |
| `pnpm api:generate`                 | OpenAPI → типы                         |
| `pnpm branding:generate`            | Иконки и OG из логотипа                |
| `pnpm check`                        | lint + typecheck + unit + SSR build    |

Перед первым e2e: `pnpm exec playwright install chromium`, затем `pnpm build`.
В CI дополнительно выполняются браузерные тесты, Lighthouse, audit и secret scan.

## Структура

```text
app/          Nuxt pages, providers, plugins, middleware
features/     Независимые функциональные модули (сейчас только auth integration)
shared/       UI, API client/generated types, validation, styles
server/       Nitro BFF, health, OIDC endpoints
i18n/         Lazy ru/en dictionaries
mocks/        Явно включаемые MSW handlers
pwa/          Workbox, cache policy, offline download engine
scripts/      Кроссплатформенная подготовка и проверки
tests/        Unit и браузерные тесты
```

## Страница и feature

Добавьте `app/pages/about.vue`:

```vue
<script lang="ts">
import { defineComponent } from 'vue';
import { definePageMeta } from '@shared/lib/page-meta';
definePageMeta({ public: true });
export default defineComponent({ name: 'AboutPage' });
</script>
<template>
  <AppContainer><AppHeading as="h1">О проекте</AppHeading></AppContainer>
</template>
```

SEO страницы переопределяется через инфраструктурный page mixin/plugin с `useSeoMeta`
или Options-компонент `<Head><Title>…</Title><Meta name="description" content="…" /></Head>`.
Для приватной страницы: `definePageMeta({ auth: true, sitemap: false, permissions: ['read:reports'] })`.
Такие страницы должны исключаться из sitemap через `sitemap: false` в page metadata.

Feature хранит компоненты, store и публичный entrypoint в `features/<name>/`.
`shared` не импортирует `features` и `app`. Серверные сущности не дублируются в Pinia.
Для локального состояния доступны `mapState`, `mapWritableState`, `mapActions`.

## API и SSR-ресурсы

Укажите `NUXT_API_UPSTREAM=https://backend.example` — BFF проксирует `/api/v1/*`.
Локальный `/api/v1/health` работает без backend. Реальный OpenAPI FastAPI:

```sh
OPENAPI_SOURCE=https://backend.example/openapi.json pnpm api:generate
```

В PowerShell: `$env:OPENAPI_SOURCE = 'https://backend.example/openapi.json'`.
После генерации вызывайте `this.$api.GET('/path', { params: { query: { ... } }, signal })`.
POST/PATCH/DELETE типизируются тем же контрактом. `ApiError` содержит status/detail/requestId.
GET повторяется один раз только при 502/503/504; мутации не повторяются.

Для SSR добавьте в `mixins` результат `resourceOptions({ key: ['health'],
load: async (app, signal) => (await app.$api.GET('/health', { signal })).data! })`.
Доступны `resource.data/isLoading/isFetching/error`, `refreshResource()`,
`clearResource()`, `disposeResource()`, `this.$query.invalidateQueries(...)`.
QueryClient создаётся на каждый Nuxt запрос; SSR payload гидратирует клиентский cache.
Ключ ресурса должен включать все параметры, влияющие на ответ. Подробнее — docs.

## Компоненты и формы

SFC используют `defineComponent()`, Options API и scoped `lang="stylus"`.
Примитивы `AppButton/Card/Container/Stack/Grid/Section/Heading/Text/EmptyState/Image/Modal/Icon`
задают интерфейс и оформление; остальные Naive UI компоненты импортируйте напрямую.
Уведомления/диалоги: `this.$ui.message.success('Готово')`, `this.$ui.dialog.warning(...)`.

Для формы импортируйте `Form`, `Field` из vee-validate и `formSchema` из shared/validation.
В `data()` создайте `schema: formSchema(z.object({ email: z.email() }))`.
Используйте `<Form :validation-schema="schema" v-slot="{ meta, isSubmitting, setErrors }">`
и `<Field name="email" v-slot="{ field, errorMessage, meta }">` с Naive NInput:
`:value="field.value" @update:value="field.onChange" @blur="field.onBlur"`.
Submit handler возвращает Promise; серверные ошибки передаются в `setErrors(fieldErrors(error.detail))`.
Zod async refinements поддерживаются. Постоянной демонстрационной формы нет.

## Оформление, языки, медиа

Тема system/light/dark сохраняется cookie и синхронизируется с ОС, Naive UI и CSS tokens.
Палитра, шрифты и разрешения переключателей находятся в site.config.
Inter latin/cyrillic self-hosted; `@nuxt/fonts` строит оптимизированные определения.
Иной локальный шрифт положите в `public/fonts`, измените семейство в site.config.
Переводы ru/en загружаются лениво. `i18n.prefixes` включает языковые URL.
Одна локаль автоматически скрывает переключатель.

Иконки: `<AppIcon name="lucide:plus" />`, также доступны `tabler:*`, `mdi:*`.
Изображения: `<AppImage src="/images/photo.jpg" alt="Описание" :width="800" :height="600" />`.
Для LCP задайте `priority`; sizes/srcset и остальные NuxtImg props передаются напрямую.
SVG остаются SVG. Будущие пользовательские загрузки обрабатывает backend/CDN.

## SSR, SPA, SSO, offline

SSR выдаёт готовый HTML и требует Node/Nitro runtime: `.output/server/index.mjs`.
SPA выбирается `rendering.ssr: false`; `pnpm build:spa` создаёт статическую версию.
Статическому хостингу нужны fallback на index.html и внешний backend для `/api`/`/auth`.
Nitro BFF/OIDC/health доступны только при работающем Nitro server.
Route rules позволяют позже добавить prerender/hybrid. Деплой здесь не реализован.

SSO выключен. Для включения задайте auth.enabled/issuer/clientId/scopes и домен сайта,
зарегистрируйте `/auth/callback` у OIDC provider, задайте session password и client secret.
Используется Code + PKCE, state и nonce; токены не передаются в клиентский JS.
Базовый adapter возвращает только sub/name; роли/permissions требуют доверенного mapping.
Backend независимо проверяет доступ. Подробнее об ограничениях — docs/architecture.md.

PWA хранит только статические assets и явно разрешённые публичные ресурсы.
Список `pwa.resources/publicPages/publicApi` централизован в site.config.
Публичный HTML/API обязан иметь `Cache-Control: public`; приватный HTML не кэшируется.
`this.$offline.download()/clear()/subscribe()` управляют загрузкой с реальным прогрессом.
Precache сам по себе не означает готовность выбранного offline-набора.
Изменение SW предлагает обновление. Работа SW проверяется production build на localhost/HTTPS.

## Совместимость и развитие

vee-validate 5 опубликован только как beta; выбран стабильный 4 с Zod adapter.
Stylelint 16 выбран из-за peer support stylelint-stylus (17 пока не поддерживается).
TypeScript 5.9 совместим с openapi-typescript и typescript-eslint; 7 пока несовместим.
Прочие прямые зависимости закреплены точными версиями, транзитивные — pnpm-lock.yaml.
Подробности: [архитектура](docs/architecture.md), [разработка](docs/development.md), [AGENTS](AGENTS.md).

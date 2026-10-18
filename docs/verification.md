# Проверка модернизации · 2026-10-18

Окружение: Windows, Node.js 24.15.0, pnpm 10.33.2, Chromium Playwright 1.64.1.

| Проверка                         | Результат                                                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile` | Установка и postinstall успешны                                                                                   |
| Идемпотентность init             | SHA-256 существующего `.env.local` не изменился                                                                   |
| `pnpm api:generate`              | Повторный запуск дал идентичные декларации                                                                        |
| `pnpm check`                     | lint, SEO-check, typecheck, 19 unit/integration тестов и SSR build успешны                                        |
| `pnpm test:e2e`                  | 4 production browser теста успешны                                                                                |
| SSR и hydration                  | HTML содержит страницу; повторного GET при hydration ресурса нет; mismatch warnings не обнаружены                 |
| Темы и локализация               | Сохранение после reload, system light/dark, ru/en, lazy messages проверены                                        |
| Шрифты и иконки                  | Локальный Inter загружается, Lucide отображается, включая мобильный переключатель                                 |
| SEO                              | title, canonical, OG, robots, sitemap, manifest и 404 проверены                                                   |
| PWA                              | SW активируется; download 100%, clear, повторная загрузка и offline fallback проверены                            |
| Связность                        | UI реагирует на отказ health endpoint при navigator.onLine=true и на восстановление                               |
| SPA                              | Static build в `.output-spa/public`; пустая HTML-оболочка, client render, язык и connectivity без Nitro проверены |
| Архитектурный lint               | Временный TS import cycle был корректно отклонён правилом no-cycle                                                |
| Hooks                            | Частичная индексация сохранена; pre-commit всей миграции 12,99 с; pre-push 2,07 с                                 |
| Lighthouse                       | Performance 90, Accessibility 100, Best Practices 100, SEO 100; LCP 2,8 с, TBT 170 мс, CLS 0                      |
| Git                              | Push и commit не выполнялись; индекс оставлен без staged-изменений                                                |

Локальный Lighthouse использует эмуляцию мобильного устройства; это отдельное измерение,
а не гарантия результатов на любом хостинге. LCP превышает предварительный бюджет 2,5 с; CI выводит предупреждение. До включения compression результат performance
был 67; обычный pre-commit одного TS-файла занимал около 9 с. INP требует реальных
взаимодействий и field telemetry: Lighthouse TBT не является измерением INP.

Реальный OIDC provider/FastAPI не подключался. PKCE/state/nonce реализованы, но внешние
login/callback не проверялись. Provider-specific claims mapping и end-session зависят
от выбранного SSO. Для FastAPI с bearer-токенами требуется серверный adapter их хранения
и refresh; начальная интеграция не сохраняет access/refresh tokens. Стартовая страница
работает без этих сервисов.
GitHub Actions, AI review и ZAP локально не исполнялись; необходимые секреты/стенд не настроены.

Audit не зелёный: **2 high и 2 moderate** транзитивных находки. Исправленных upstream-версий
для high нет; audit gate в CI оставлен включённым. Подробности и пути — [security-audit.md](security-audit.md).
Стандартная сборка также выводит upstream deprecation warnings, не связанные с hydration.

# Dependency audit · 2026-10-18

After replacing Lighthouse CI with Lighthouse 13.5, `pnpm audit --audit-level=high`
reports **2 high, 2 moderate** findings (no critical). The high advisories have no
published patched version in the registry at this date:

| Package          | Dependency path                     | Advisory                                                                 |
| ---------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| node-forge 1.4.0 | Nuxt → Nitro → listhen → node-forge | [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv) |
| braces 3.0.3     | Stylelint → micromatch → braces     | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) |

No audit exception or fabricated override is installed. CI deliberately keeps the audit
gate enabled and will fail until upstream fixes are available or a downstream owner
makes an explicit, reviewed policy decision. These paths belong to development/build
tooling: the application does not use node-forge verification or user-controlled glob
patterns. This reduces reachability; it does not mean the dependency is fixed.

Dependabot is configured to surface updates. Re-run audit after dependency changes;
do not treat this dated report as a permanent security assessment.

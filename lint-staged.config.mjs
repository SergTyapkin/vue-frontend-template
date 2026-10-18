export default {
  '*.{ts,js,mjs,vue}': 'node scripts/check-staged-code.mjs',
  '*.{vue,styl}': 'stylelint',
  '*.{ts,js,mjs,json,md,yml,yaml,html}': 'prettier --check',
  '*.vue': 'node scripts/seo-check.mjs',
};

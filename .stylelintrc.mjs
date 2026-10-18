export default {
  extends: ['stylelint-stylus/standard'],
  overrides: [
    { files: ['**/*.vue'], customSyntax: 'postcss-html' },
    { files: ['**/*.styl'], customSyntax: 'postcss-styl' },
  ],
  rules: {
    'selector-class-pattern': '^[a-z][a-z0-9-]*$',
    'declaration-no-important': true,
    'selector-max-id': 0,
  },
};

import { spawn } from 'node:child_process';
const files = process.argv.slice(2);
if (!files.length) process.exit(0);
const run = (args) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, args, { stdio: 'inherit' });
    child.on('error', () => resolve(1));
    child.on('exit', (code) => resolve(code ?? 1));
  });
const codes = await Promise.all([
  run([
    'node_modules/eslint/bin/eslint.js',
    '--cache',
    '--cache-location',
    '.cache/eslint',
    ...files,
  ]),
  run(['node_modules/vitest/vitest.mjs', 'related', '--run', '--passWithNoTests', ...files]),
]);
process.exit(codes.some((code) => code !== 0) ? 1 : 0);

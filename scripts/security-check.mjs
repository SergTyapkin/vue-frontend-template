import { spawnSync } from 'node:child_process';
const files = spawnSync('git', ['ls-files', '--cached'], { encoding: 'utf8' })
  .stdout.trim()
  .split(/\r?\n/);
const forbidden = files.filter(
  (file) =>
    /(^|\/)(\.env(\..+)?|node_modules\/|\.output(?:-spa)?\/|dist\/|id_rsa$)/.test(file) &&
    !file.endsWith('.env.example'),
);
const diff = spawnSync(
  'git',
  [
    'grep',
    '--cached',
    '-l',
    '-I',
    '-E',
    '(-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16})',
    '--',
    ':!pnpm-lock.yaml',
    ':!scripts/security-check.mjs',
  ],
  { encoding: 'utf8' },
);
if (forbidden.length || diff.status === 0) {
  console.error('Possible secret or forbidden artifact:', forbidden.join(', '), diff.stdout);
  process.exit(1);
}
if (diff.status > 1) throw new Error(diff.stderr);
console.log('Tracked secret/artifact check passed.');

import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';
const server = spawn(process.execPath, ['.output/server/index.mjs'], {
  env: { ...process.env, PORT: '3100', HOST: 'localhost' },
  stdio: 'inherit',
});
let browser;
try {
  for (let attempt = 0; ; attempt++) {
    try {
      if ((await fetch('http://localhost:3100/api/health')).ok) break;
    } catch {
      /* wait for startup */
    }
    if (attempt > 100) throw new Error('Nitro startup timed out');
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  browser = await chromium.launch({ args: ['--remote-debugging-port=9223'] });
  const result = await lighthouse('http://localhost:3100/', {
    port: 9223,
    output: ['html', 'json'],
    onlyCategories: ['performance', 'accessibility', 'seo', 'best-practices'],
  });
  await mkdir('.lighthouseci', { recursive: true });
  await writeFile('.lighthouseci/report.html', result.report[0]);
  await writeFile('.lighthouseci/report.json', result.report[1]);
  for (const [name, category] of Object.entries(result.lhr.categories))
    console.log(`${name}: ${category.score}`);
  for (const [metric, budget] of [
    ['largest-contentful-paint', 2500],
    ['total-blocking-time', 300],
  ]) {
    const audit = result.lhr.audits[metric];
    console.log(`${metric}: ${audit.displayValue}`);
    if (audit.numericValue > budget)
      console.warn(`Performance budget warning: ${metric} exceeds ${budget} ms`);
  }
  console.log(
    `cumulative-layout-shift: ${result.lhr.audits['cumulative-layout-shift'].displayValue}`,
  );
  if (
    result.lhr.categories.seo.score < 0.9 ||
    result.lhr.categories.accessibility.score < 0.9 ||
    result.lhr.audits['cumulative-layout-shift'].numericValue > 0.1
  )
    process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill();
}

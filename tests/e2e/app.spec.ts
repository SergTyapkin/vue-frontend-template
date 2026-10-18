import { test, expect } from '@playwright/test';
test('SSR, hydration, preferences, SEO and public runtime', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (/hydration|mismatch/i.test(message.text())) errors.push(message.text());
  });
  const html = await (await request.get('/')).text();
  expect(html).toContain('<h1');
  expect(html).toContain('og:image');
  expect(html).toContain('canonical');
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByTestId('theme-switch').locator('.iconify')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.locator('body').evaluate((node) => getComputedStyle(node).fontFamily),
  ).toContain('Inter');
  expect(
    await page.evaluate(() =>
      [...document.fonts].some((font) => font.family.includes('Inter') && font.status === 'loaded'),
    ),
  ).toBeTruthy();
  await expect(page.locator('.iconify').first()).toBeVisible();
  await page.screenshot({ path: '.cache/home-desktop.png', fullPage: true });
  await page.getByTestId('cookie-notice').getByRole('button').click();
  await page.getByTestId('locale-switch').selectOption('en');
  await expect(page.locator('h1')).toContainText('Good things');
  await page.getByTestId('theme-switch').click();
  await page.getByTestId('theme-switch').click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('h1')).toContainText('Good things');
  expect((await request.get('/api/health')).ok()).toBeTruthy();
  expect((await request.get('/manifest.webmanifest')).ok()).toBeTruthy();
  expect((await request.get('/sitemap.xml')).ok()).toBeTruthy();
  expect((await request.get('/robots.txt')).ok()).toBeTruthy();
  expect((await request.get('/missing-page')).status()).toBe(404);
  await page.waitForFunction(
    () => 'serviceWorker' in navigator && Boolean(navigator.serviceWorker.controller),
  );
  await page.locator('details summary').click();
  await page.getByRole('button', { name: 'Save offline resources', exact: true }).click();
  await expect(page.locator('progress')).toHaveAttribute('value', '100');
  await page.getByRole('button', { name: 'Clear offline copy', exact: true }).click();
  await expect(page.locator('progress')).toHaveAttribute('value', '0');
  await page.getByRole('button', { name: 'Save offline resources', exact: true }).click();
  await expect(page.locator('progress')).toHaveAttribute('value', '100');
  await page.context().setOffline(true);
  await page.reload();
  await expect(page.locator('h1')).toContainText('офлайн');
  await page.context().setOffline(false);
  expect(errors).toEqual([]);
});

test('cookie notice persists acknowledgement after reload', async ({ page }) => {
  await page.goto('/');
  const notice = page.getByTestId('cookie-notice');
  await expect(notice).toBeVisible();
  await expect(notice.locator('.iconify')).toBeVisible();
  await expect(notice.getByRole('button')).toHaveCount(1);
  await page.getByTestId('locale-switch').selectOption('ru');
  await expect(notice).toContainText(
    'Продолжая использование сайта, вы соглашаетесь на использование cookies.',
  );
  await notice.getByRole('button', { name: 'Хорошо', exact: true }).click();
  await expect(notice).toBeHidden();
  await page.reload();
  await expect(page.locator('h1')).toBeVisible();
  await expect(notice).toHaveCount(0);
});
test('fits a narrow screen', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.getByTestId('theme-switch').locator('.iconify')).toBeVisible();
  const notice = page.getByTestId('cookie-notice');
  await expect(notice).toBeVisible();
  const bounds = await notice.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(375);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(812);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBeTruthy();
  await page.screenshot({ path: '.cache/home-mobile.png', fullPage: true });
  await page.screenshot({ path: '.cache/cookie-mobile.png' });
});
test('tracks system theme without hydration warnings', async ({ page }) => {
  const warnings: string[] = [];
  page.on('console', (message) => {
    if (/hydration|mismatch/i.test(message.text())) warnings.push(message.text());
  });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.screenshot({ path: '.cache/home-dark.png', fullPage: true });
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveClass(/light/);
  expect(warnings).toEqual([]);
});
test('detects a failed server while the network is online and recovers', async ({ page }) => {
  await page.route('**/api/health', (route) =>
    route.fulfill({ status: 503, json: { status: 'unavailable' } }),
  );
  await page.goto('/');
  expect(await page.evaluate(() => navigator.onLine)).toBe(true);
  await expect(page.locator('.connection [role="status"]')).toContainText(
    /server is unavailable|Сервер недоступен/i,
  );
  await page.unroute('**/api/health');
  await page.evaluate(() => window.dispatchEvent(new Event('online')));
  await expect(page.locator('.connection [role="status"]')).toHaveCount(0);
});

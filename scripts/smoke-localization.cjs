#!/usr/bin/env node
/* Optional local-browser smoke test. Requires a local ECHO HTTP server and Playwright Core.
   Example:
   ECHO_TEST_URL=http://127.0.0.1:8765 \
   ECHO_PLAYWRIGHT_MODULE=/path/to/playwright-core \
   ECHO_CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
   node scripts/smoke-localization.cjs
*/
'use strict';
const assert = require('node:assert/strict');
const modulePath = process.env.ECHO_PLAYWRIGHT_MODULE || 'playwright-core';
const { chromium } = require(modulePath);
const base = process.env.ECHO_TEST_URL || 'http://127.0.0.1:8765';
assert.ok(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base), 'Local test URL only');

(async () => {
  const launch = { headless: true };
  if (process.env.ECHO_CHROME) launch.executablePath = process.env.ECHO_CHROME;
  const browser = await chromium.launch(launch);
  let checks = 0;
  try {
    for (const language of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await context.newPage();
      const pageErrors = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      await page.addInitScript(lang => localStorage.setItem('echo_language', lang), language);

      await page.goto(base + '/engineering.html', { waitUntil: 'load' });
      assert.equal(await page.locator('html').getAttribute('lang'), language);
      assert.equal(await page.locator('[data-language-choice] button').count(), 2);

      await page.evaluate(() => chooseGameMode('engineer'));
      await page.locator('#chapter-select').waitFor({ state: 'visible' });
      assert.equal(await page.locator('.cs-card').count(), 10);
      assert.equal(await page.locator('.cs-card:visible').count(), 10);

      const state = await page.evaluate(() => ({
        missing: [...ECHO_I18N.missing],
        cjk: document.body.innerText.split('\n').filter(line => /[\u3400-\u9fff]/.test(line) && line.trim() !== '繁體中文'),
        scrollWidth: document.documentElement.scrollWidth,
        viewport: innerWidth
      }));
      assert.deepEqual(state.missing, [], language + ': missing translations');
      if (language === 'en') assert.deepEqual(state.cjk, [], 'English chapter-select CJK leakage');
      assert.ok(state.scrollWidth <= state.viewport + 1, language + ': horizontal overflow');
      assert.deepEqual(pageErrors, [], language + ': JavaScript errors');

      if (language === 'en') {
        for (const doc of ['news', 'ptt', 'threads']) {
          await page.evaluate(name => openLB('doc', 'img/docs/' + name + '.jpg', ECHO_I18N.t('ECHO 附件')), doc);
          await page.waitForTimeout(20);
          assert.equal(await page.locator('.english-evidence-reader:visible').count(), 1, doc + ': English evidence reader');
        }
      }
      checks += 1;
      await context.close();
    }
    console.log(`PASS: ${checks} bilingual mobile browser smoke states; language, engineering chapters, CJK leakage, evidence readers, JS errors and overflow.`);
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

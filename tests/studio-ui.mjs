import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', error => errors.push(error.message));

async function home() {
  await page.locator('.app-nav .studio-home-nav').click();
  await page.locator('#studio-home').waitFor({ state: 'visible' });
}
async function launch(family, expectedLayout, expectedTitle) {
  await home();
  const card = page.locator('.studio-game-card[data-family="' + family + '"]');
  await card.locator('[data-studio-play]').click();
  await page.locator(expectedLayout).waitFor({ state: 'visible' });
  assert.match(await page.locator('#game-heading').innerText(), expectedTitle);
  assert.equal(await page.locator('#studio-home').isVisible(), false);
  assert.equal(await page.locator('#game-view').isVisible(), true);
}

try {
  await page.goto('http://127.0.0.1:8765/', { waitUntil: 'domcontentloaded' });
  await page.locator('#studio-home').waitFor({ state: 'visible', timeout: 30000 });
  assert.equal(await page.locator('.studio-game-card').count(), 7);
  assert.equal(await page.locator('.studio-game-card:visible').count(), 7);
  // The new icon set may not contain any dangling SVG references.
  const icons = await page.evaluate(() => [...document.querySelectorAll('#studio-home use, .studio-home-nav use')]
    .map(u => u.getAttribute('href')).filter(id => !document.getElementById(id.slice(1))));
  assert.deepEqual(icons, []);
  assert.ok(await page.locator('#game-select option').count() >= 16, 'Official variants remain available');

  // Search and favorites are real interactions, not nonfunctional decoration.
  await page.locator('#studio-search-games').fill('Locus');
  assert.equal(await page.locator('.studio-game-card:visible').count(), 1);
  await page.locator('#studio-search-games').fill('');
  await page.locator('[data-studio-fav="qwixx"]').click();
  await page.locator('[data-studio-filter="favorites"]').click();
  assert.equal(await page.locator('.studio-game-card:visible').count(), 1);
  assert.equal(await page.locator('.studio-game-card[data-family="qwixx"]').isVisible(), true);
  await page.locator('[data-studio-filter="all"]').click();

  await launch('clever', '#clever-game-layout', /Clever/);
  assert.ok(await page.locator('#clever-sheet .clever-section').count() >= 5, 'Clever zones preserved');
  await launch('qwixx', '#classic-game-layout', /Qwixx/);
  await launch('kok', '#kok-game-layout', /Keer op Keer|Klaar voor nog een keer/);
  await launch('railroad', '#classic-game-layout', /Railroad Ink/);
  await launch('knister', '#classic-game-layout', /Knister/);
  await launch('sixto', '#classic-game-layout', /Sixto/);
  await launch('locus', '#locus-game-layout', /Locus/);

  await home();
  const variant = page.locator('[data-studio-variant="clever"]');
  assert.ok(await variant.locator('option').count() >= 8, 'All four Clever editions and challenge variants');
  await variant.selectOption('clever3c');
  await page.locator('[data-studio-play="clever"]').click();
  assert.equal(await page.locator('#game-select').inputValue(), 'clever3c');
  await page.locator('#clever-game-layout').waitFor({ state: 'visible' });

  // Classic score sheets hide two editor tabs; the library must still reach both tools.
  await launch('qwixx', '#classic-game-layout', /Qwixx/);
  await home();
  await page.locator('[data-studio-view="editor"]').click();
  await page.locator('#editor-view').waitFor({ state: 'visible' });
  await home();
  await page.locator('[data-studio-view="generator"]').click();
  await page.locator('#generator-view').waitFor({ state: 'visible' });
  await home();
  await page.locator('[data-studio-view="printstudio"]').click();
  await page.locator('#printstudio-view').waitFor({ state: 'visible' });

  // Online and standard help dialogs must still be reachable.
  await home();
  await page.locator('#studio-home [data-studio-action="online"]').first().click();
  await page.locator('#online-dialog[open]').waitFor({ state: 'visible' });
  await page.locator('#online-dialog [data-close]').first().click();
  await home();
  await page.locator('#studio-home [data-studio-action="help"]').click();
  await page.locator('#help-dialog[open]').waitFor({ state: 'visible' });
  await page.locator('#help-dialog [data-close]').first().click();

  // Mobile: library should not force document-level horizontal scrolling.
  await page.setViewportSize({ width: 390, height: 844 });
  await home();
  assert.equal(await page.locator('.studio-game-card:visible').count(), 7);
  const dimensions = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth, width: document.documentElement.clientWidth
  }));
  assert.ok(dimensions.scroll <= dimensions.width + 3, 'Mobile library has no horizontal overflow: '+JSON.stringify(dimensions));
  assert.deepEqual(errors, [], 'No uncaught browser errors');
  console.log('PASS: 7 families, variants, icons, filters, favorites, all original tool views, online, help and mobile layout.');
} finally {
  await browser.close();
}
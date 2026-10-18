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

  // Geijkte Clever-afmetingen op desktop; alle officiële bonusiconen behouden.
  const cleverDesktop = await page.evaluate(() => {
    const layout = document.getElementById('clever-game-layout');
    const sidebar = layout.querySelector('.side-stack');
    const firstZone = layout.querySelector('.clever-section');
    const width = el => Math.round(el.getBoundingClientRect().width);
    return {
      right: width(sidebar),
      left: width(layout.querySelector('.clever-sheet-card')),
      zoneCount: layout.querySelectorAll('.clever-section').length,
      originalImages: layout.querySelectorAll('.clever-literal-icon').length,
      originalImageSourcesPresent: [...layout.querySelectorAll('.clever-literal-icon')].every(img => Boolean(img.getAttribute('src'))),
      firstZone: firstZone && width(firstZone),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  assert.ok(cleverDesktop.right >= 284 && cleverDesktop.right <= 300, 'Compact sidebar: '+JSON.stringify(cleverDesktop));
  assert.ok(cleverDesktop.left > cleverDesktop.right * 2, 'Main score sheet dominates');
  assert.ok(cleverDesktop.zoneCount >= 5 && cleverDesktop.originalImages >= 3 && cleverDesktop.originalImageSourcesPresent, 'Original scoring icons kept');
  assert.ok(cleverDesktop.overflow <= 3, 'Desktop no horizontal scroll: '+JSON.stringify(cleverDesktop));
  // Actiebalk gebruikt originele afbeeldingen maar nooit de grote 100px varianten.
  const roll = page.locator('[data-action="clever-roll"]');
  if(await roll.isVisible()) await roll.click();
  const actionIconSizes = await page.locator('#clever-dice .clever-action-btn > .clever-literal-icon').evaluateAll(images =>
    images.map(image => Math.round(image.getBoundingClientRect().width)));
  assert.ok(actionIconSizes.length >= 2, 'Reroll/extra original action icons exist');
  assert.ok(actionIconSizes.every(w => w >= 14 && w <= 22), 'Action icons are restrained: '+JSON.stringify(actionIconSizes));

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


  // Clever op een tablet én smalle telefoon: geen verdwenen scorevakken.
  await page.setViewportSize({ width: 820, height: 900 });
  await home();
  await page.locator('.studio-game-card[data-family="clever"] [data-studio-play]').click();
  assert.equal(await page.locator('#clever-game-layout .clever-section').count() >= 5, true);
  const tablet = await page.evaluate(() => ({
    direction: getComputedStyle(document.getElementById('clever-game-layout')).flexDirection,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }));
  assert.equal(tablet.direction, 'column');
  assert.ok(tablet.overflow <= 3, 'Tablet without document overflow: '+JSON.stringify(tablet));
  await page.setViewportSize({ width: 390, height: 844 });
  const narrow = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    firstZone: document.querySelector('#clever-game-layout .clever-section')?.getBoundingClientRect().width,
    diceAvailable: !!document.querySelector('#clever-dice')
  }));
  assert.ok(narrow.overflow <= 3, 'Mobile Clever without document overflow: '+JSON.stringify(narrow));
  assert.ok(narrow.firstZone > 280 && narrow.diceAvailable, 'Clever remains playable on mobile');
  await home();

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
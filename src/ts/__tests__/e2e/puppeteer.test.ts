import puppeteer, { Browser, Page } from 'puppeteer';

describe('Credit Card Validation (Puppeteer)', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
    await page.goto('http://localhost:3000'); // единый порт
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Ввод валидного номера карты — должна подсветиться система', async () => {
    await page.type('#credit-card-number', '4111111111111111'); // VISA
    await page.click('#submitform');
    await page.waitForSelector('.card.visa.active', { timeout: 1000 });
    const isActive = await page.$eval('.card.visa.active', el =>
      el.classList.contains('active')
    );
    expect(isActive).toBe(true);
  });

  test('Ввод невалидного номера карты — активных систем нет', async () => {
    await page.evaluate(() => {
      (document.querySelector('#credit-card-number') as HTMLInputElement).value = '';
    });
    await page.type('#credit-card-number', '1234567890123456');
    await page.click('#submitform');
    const hasActive = await page.$$eval('.card.active', cards => cards.length > 0);
    expect(hasActive).toBe(false);
  });
});

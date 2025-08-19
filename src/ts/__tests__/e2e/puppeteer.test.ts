import puppeteer, { Browser, Page } from "puppeteer";

describe("Credit Card Validation (Puppeteer)", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // чтобы браузер был виден
      slowMo: 50,
    });
    page = await browser.newPage();
    await page.goto("http://localhost:3000"); // порт локального сервера
  });

  afterAll(async () => {
    await browser.close();
  });

  const cards = [
    { type: "visa", number: "4111111111111111" },
    { type: "master-card", number: "5500000000000004" },
    { type: "mir", number: "2200000000000004" },
    { type: "union-pay", number: "6200000000000005" },
  ];

  for (const card of cards) {
    test(`Ввод валидного номера карты ${card.type} — подсветка активна`, async () => {
      // очищаем поле перед вводом
      await page.evaluate(() => {
        (
          document.querySelector("#credit-card-number") as HTMLInputElement
        ).value = "";
      });
      await page.type("#credit-card-number", card.number);
      await page.click("#submitform");

      await page.waitForSelector(`.card.${card.type}.active`, {
        timeout: 1000,
      });
      const isActive = await page.$eval(`.card.${card.type}`, (el) =>
        el.classList.contains("active"),
      );
      expect(isActive).toBe(true);
    });
  }

  test("Ввод невалидного номера карты — активных систем нет", async () => {
    await page.evaluate(() => {
      (
        document.querySelector("#credit-card-number") as HTMLInputElement
      ).value = "";
    });
    await page.type("#credit-card-number", "1234567890123456");
    await page.click("#submitform");

    const hasActive = await page.$$eval(
      ".card.active",
      (cards) => cards.length > 0,
    );
    expect(hasActive).toBe(false);
  });
});

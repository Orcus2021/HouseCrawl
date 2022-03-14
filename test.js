const puppeteer = require("puppeteer");

const chromeOptions = {
  headless: false,
  args: ["--start-maximized"],
};

let result = [];
let initArr = [];
let initTitle = [];
let id = 0;

// Start crawl
scrawl("https://zh-tw.facebook.com/");
async function scrawl(url) {
  const browser = await puppeteer.launch(chromeOptions);
  const context = browser.defaultBrowserContext();
  context.overridePermissions("https://www.facebook.com", [
    "geolocation",
    "notifications",
  ]);
  const page = await browser.newPage();

  await page.goto(url);
  await page.setViewport({
    width: 1200,
    height: 800,
  });
  await page.click("#email");
  await page.type("#email", "kenboy200@yahoo.com.tw");
  await page.click("#pass");
  await page.type("#pass", "qazWSX7945613");
  await page.click("button[name=login]");
  await page.waitForNavigation();
  await page.goto("https://www.facebook.com/groups/1489972747957521");

  // await page.waitForSelector("#jsc_c_1b").then(() => {
  //   console.log("got it");
  // });
  for (let i = 0; i < 5; i++) {
    await autoScroll();
    await page.waitForTimeout(2000);
    await page.click("div[role=button]");
    await page.waitForTimeout(2000);
  }
  async function autoScroll() {
    await page.evaluate(() => {
      let distance = 800;
      window.scrollBy(0, distance);
    });
  }

  const distant = await page.$$eval(
    "div[ data-ad-comet-preview=message]",
    (links) => links.map((link) => link.textContent)
  );
  console.log(distant);

  // async function autoScroll(page) {
  //   await page.evaluate(async () => {
  //     await new Promise((resolve, reject) => {
  //       let totalHeight = 0;
  //       let distance = 100;
  //       let timer = setInterval(() => {
  //         let scrollHeight = document.body.scrollHeight;
  //         window.scrollBy(0, distance);
  //         totalHeight += distance;

  //         if (totalHeight >= scrollHeight) {
  //           clearInterval(timer);
  //           resolve();
  //         }
  //       }, 100);
  //     });
  //   });
  // }

  // await page
  //   .waitForSelector(
  //     "body > div.container.obj-search-list.obj-search-rent.clearfix > div > div.content-main > div:nth-child(4) > div > div.obj-item.clearfix > div.obj-info"
  //   )
  //   .then(() => {
  //     console.log("got it");
  //   });
  // const distant = await page.$$eval("div.obj-info > div > p", (links) =>
  //   links.map((link) => link.textContent)
  // );

  // try {
  //   await getData();
  //   return "success";
  // } catch (error) {
  //   return error;
  // }
}

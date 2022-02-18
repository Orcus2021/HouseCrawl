const puppeteer = require("puppeteer");
const fetch = require("node-fetch");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let result = [];

  const sentData = async (d) => {
    const response = await fetch(
      "https://crawl-e3835-default-rtdb.asia-southeast1.firebasedatabase.app/house.json",
      {
        method: "POST",
        body: JSON.stringify(d),
      }
    );
    if (!response.ok) {
      throw new Error("Sent data failed");
    }
  };

  async function getDetail() {
    let url = `https://rent.591.com.tw/rent-detail-12041326.html`;
    await page.goto(url);
    await page
      .waitForSelector(
        "#positionRound > div.surround-list > div:nth-child(1) > a > p > span"
      )
      .then(() => {
        console.log("got it");
      });

    const pattern = await page.$eval(
      "#houseInfo > div.house-pattern > span:nth-child(1)",
      (el) => el.textContent
    );
    const floor = await page.$eval(
      "#houseInfo > div.house-pattern > span:nth-child(5)",
      (el) => el.textContent
    );
    const type = await page.$eval(
      "#houseInfo > div.house-pattern > span:nth-child(7)",
      (el) => el.textContent
    );
    const distant = await page.$eval(
      "#positionRound > div.surround-list > div:nth-child(1) > a > p > span",
      (el) => el.textContent
    );
    let adjust = distant.trim();
    let arr = { pattern, floor, type, adjust };

    await sentData(arr);

    console.log(pattern);
    console.log(floor);
    console.log(type);
    console.log(distant);

    // const linkList = await page.$$("#houseInfo > div.house-pattern > span");
    // for (let data of linkList) {
    //   const pattern = await page.evaluate(
    //     (el) =>
    //       el.querySelector("#houseInfo > div.house-pattern > span:nth-child(1)")
    //         .textContent,
    //     data
    //   );
    //   const title = await page.evaluate(
    //     (el) =>
    //       el.querySelector("a > div.rent-item-right > div.item-title")
    //         .textContent,
    //     data
    //   );
    //   console.log(pattern);
    // }
  }

  getDetail();
})();

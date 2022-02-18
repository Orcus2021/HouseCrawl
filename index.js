const puppeteer = require("puppeteer");
const fetch = require("node-fetch");

(async () => {
  // Start crawl
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  let result = [];
  let initArr = [];
  let id = 0;
  // Get initData
  const getInitData = async () => {
    let url =
      "https://crawl-e3835-default-rtdb.asia-southeast1.firebasedatabase.app/";
    const response = await fetch(url + "house.json");

    if (!response.ok) {
      throw new Error("Get data failed.");
    }
    const data = await response.json();
    return data;
  };

  //  Get Detail

  async function getDetail(url, index) {
    let counter = 0;
    try {
      await page.goto(url);
      await page
        .waitForSelector("#houseInfo > div.house-pattern > span:nth-child(1)")
        .then(() => {
          counter++;
          console.log(counter);
          console.log("detail-got it");
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
      const price = await page.$eval(
        "#houseInfo > div.house-price > span > b",
        (el) => el.textContent
      );
      result[index].pattern = pattern;
      result[index].floor = floor;
      result[index].type = type;
      result[index].distant = distant.trim();
      result[index].price = price;
      result[index].state = "standby";
      result[index].comment = "";
    } catch (error) {
      console.log(error);
    }
  }

  // Sent Data to Firebase

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
  // Start crawl get Data
  async function getData(n) {
    let houseUrl = `https://rent.591.com.tw/?region=1&section=3,5,7,1,4&kind=1&rentprice=1,45000&showMore=1&multiNotice=not_cover&searchtype=1&multiFloor=2_6,6_12,12_&multiRoom=3,4&other=newPost&firstRow=${n}&totalRows=204`;
    await page.goto(houseUrl);
    await page
      .waitForSelector(
        "#rent-list-app > div > div.list-container-content > div > section.vue-list-rent-content > div > section:nth-child(1) > a > div.rent-item-right > div.item-title"
      )
      .then(() => {
        console.log("got it");
      });
    const linkList = await page.$$(".vue-list-rent-item");
    for (let data of linkList) {
      const a = await page.evaluate(
        (el) => el.querySelector("a").getAttribute("href"),
        data
      );
      let title = await page.evaluate(
        (el) =>
          el.querySelector("a > div.rent-item-right > div.item-title")
            .textContent,
        data
      );
      title = title.trim();
      let link = initArr.find((d) => d === a);
      if (link) {
        return;
      } else {
        id = id + 1;
        result.push({ id, title, link: a });
      }
    }
    for (let j = 0; j < result.length; j++) {
      let detailUrl = result[j].link;
      await getDetail(detailUrl, j);
      await sentData(result[j]);
      await page.waitForTimeout(2000);
    }
    result = [];
  }

  const getAllData = async (total) => {
    console.log("start");

    await getInitData().then((res) => {
      for (const key in res) {
        initArr.push(res[key].link);
      }
    });
    id = initArr.length;

    for (let i = 0; i <= total; i += 30) {
      await getData(i);

      await page.waitForTimeout(5000);
    }

    console.log(result);
    console.log("End");
  };

  try {
    await getAllData(204);
  } catch (error) {}
})();

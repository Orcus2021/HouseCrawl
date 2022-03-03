const puppeteer = require("puppeteer");
const fetch = require("node-fetch");
let result = [];
let initArr = [];
let initTitle = [];
let id = 0;
let amount = 0;

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

// Start crawl
async function scrawl() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  //  Get Detail

  async function getDetail(url, index) {
    try {
      await page.goto(url);
      await page
        .waitForSelector("#houseInfo > div.house-pattern > span:nth-child(1)")
        .then(() => {
          console.log("detail-got it");
          console.log(amount);
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
    amount++;
  }

  // Start crawl get Data
  async function getData(n) {
    let houseUrl = `https://rent.591.com.tw/?region=1&section=3,5,7,1,4&kind=1&rentprice=1,42000&showMore=1&multiNotice=not_cover&searchtype=1&multiFloor=2_6,6_12,12_&multiRoom=3,4&other=newPost&firstRow=${n}&totalRows=146`;

    await page.goto(houseUrl);
    await page
      .waitForSelector(
        "#rent-list-app > div > div.list-container-content > div > section.vue-list-rent-content > div > section:nth-child(1) > a > div.rent-item-right > div.item-title"
      )
      .then(() => {
        console.log("got it");
      });
    const linkList = await page.$$(".vue-list-rent-item");
    // 逐一加入result
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
      let linkResult = initArr.find((d) => d === a);
      let titleResult = initTitle.find((d) => d === title);

      if (linkResult || titleResult) {
        console.log("repeat");
      } else {
        id = id + 1;
        result.push({ id, title, link: a });
        console.log(a);
      }
    }
    //Filter 1衛 開放式
    for (let j = 0; j < result.length; j++) {
      let detailUrl = result[j].link;
      await getDetail(detailUrl, j);

      let result1 = result[j].pattern.includes("1衛");
      let result2 = result[j].pattern.includes("開放式");

      if (!result1 && !result2) {
        await sentData(result[j]);
        await page.waitForTimeout(2000);
      } else if (result1 || result2) {
        console.log("Failed pattern");
      }
    }

    result = [];
  }

  // get All house Data
  const getAllData = async (total) => {
    console.log("start");

    await getInitData().then((res) => {
      for (const key in res) {
        initArr.push(res[key].link);
        initTitle.push(res[key].title);
      }
    });
    id = initArr.length;

    for (let i = 0; i <= total; i += 30) {
      await getData(i);

      await page.waitForTimeout(3000);
    }

    console.log("End");
  };

  try {
    await getAllData(146);
  } catch (error) {
    console.log(error);
  }
}
scrawl();

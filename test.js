const puppeteer = require("puppeteer");
// const admin = require("firebase-admin");
// const { getDatabase } = require("firebase-admin/database");

// const dotenv = require("dotenv");
// dotenv.config();

// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//     client_email: process.env.FIREBASE_CLIENT_EMAIL,
//   }),
//   databaseURL:
//     "https://crawl-e3835-default-rtdb.asia-southeast1.firebasedatabase.app",
// });
// const db = admin.database();
// const getDb = getDatabase();
const chromeOptions = {
  headless: true,
  // defaultViewport: null,
  // args: ["--incognito", "--no-sandbox", "--single-process", "--no-zygote"],
};

let result = [];
let initArr = [];
let initTitle = [];
let id = 0;
// let amount = 0;

// Get initData
// const getInitData = async () => {
//   console.log("getting data");
//   let ref = db.ref("house");
//   let initData;
//   await ref.once("value", function (data) {
//     initData = data.val();
//   });

//   console.log("already get data ");
//   return initData;
// };

// Sent Data to Firebase

// const sentData = async (d) => {
//   const ref = getDb.ref("house").push();
//   await ref.set(d, (err) => {
//     if (err) {
//       throw new Error(err);
//     }
//   });
// };

// Start crawl
scrawl(
  "https://www.rakuya.com.tw/search/rent_search/index?display=list&con=eJw9jbEOAiEQRP9lawrAUxM_g9ZY3AFGDLoEuOI0_rs7JNpM8t5OZt-0xFCZH3Q6044UTXRR5FPfIDQgpFbyLEw5tS6Va2auOFsBNHi5p2eAccBSk48gzFmtx0qLc_U32DEupm8leg6j6Yx0nYVe298ewa9UfmxkSklOI_cjD0gjLz5fJZo3pQ&tab=def&sort=11&ds=&page=1"
);
async function scrawl(url) {
  let initUrl = url;
  // let pageIndex = 0;
  // let crawlUrl = "";
  const browser = await puppeteer.launch(chromeOptions);
  const page = await browser.newPage();
  //init process url

  // let urlArr = initUrl.split("&");
  // let total = urlArr[urlArr.length - 1].split("=");
  // for (let i = 0; i < urlArr.length - 2; i++) {
  //   crawlUrl = crawlUrl + urlArr[i] + "&";
  // }
  // pageIndex = total[1];

  //  Get Detail

  // async function getDetail(url, index) {
  //   try {
  //     await page.goto(url);
  //     await page
  //       .waitForSelector("#houseInfo > div.house-pattern > span:nth-child(1)")
  //       .then(() => {
  //         console.log("detail-got it");
  //         console.log(amount);
  //       });

  //     const pattern = await page.$eval(
  //       "#houseInfo > div.house-pattern > span:nth-child(1)",
  //       (el) => el.textContent
  //     );
  //     const floor = await page.$eval(
  //       "#houseInfo > div.house-pattern > span:nth-child(5)",
  //       (el) => el.textContent
  //     );
  //     const type = await page.$eval(
  //       "#houseInfo > div.house-pattern > span:nth-child(7)",
  //       (el) => el.textContent
  //     );
  //     const distant = await page.$eval(
  //       "#positionRound > div.surround-list > div:nth-child(1) > a > p > span",
  //       (el) => el.textContent
  //     );
  //     const price = await page.$eval(
  //       "#houseInfo > div.house-price > span > b",
  //       (el) => el.textContent
  //     );

  //     result[index].pattern = pattern;
  //     result[index].floor = floor;
  //     result[index].type = type;
  //     result[index].distant = distant.trim();
  //     result[index].price = price;
  //     result[index].state = "standby";
  //     result[index].comment = "";
  //   } catch (error) {
  //     throw new Error(err);
  //   }
  //   amount++;
  // }

  // Start crawl get Data
  async function getRakuyaData(n) {
    let rakuyaUrlArr = url.split("page=");
    let maxPage = rakuyaUrlArr[1];
    let rakuyaUrl = rakuyaUrlArr[0] + "page=" + n;
    await page.goto(url);
    await page
      .waitForSelector(
        "body > div.container.obj-search-list.obj-search-rent.clearfix > div > div.content-main > div:nth-child(4) > div > div.obj-item.clearfix > div.obj-info"
      )
      .then(() => {
        console.log("got it");
      });
    const title = await page.$$eval("div.obj-info > div >h6 > a", (links) =>
      links.map((link) => {
        let title = link.textContent;
        let titleArr = title.split("）");
        title = titleArr[1];
        return title;
      })
    );
    const distant = await page.$$eval("div.obj-info > div > p", (links) =>
      links.map((link) => link.textContent)
    );
    const linkList = await page.$$eval("div.obj-info > div >h6 > a", (links) =>
      links.map((link) => link.href)
    );
    const price = await page.$$eval(
      "div.obj-info > ul.obj-data.clearfix >li.obj-price > span",
      (links) => links.map((link) => link.textContent)
    );
    const type = await page.$$eval(
      "div.obj-info > ul.obj-data.clearfix >li:nth-child(2) > span:nth-child(1)",
      (links) => links.map((link) => link.textContent)
    );
    const pattern = await page.$$eval(
      "div.obj-info > ul.obj-data.clearfix >li:nth-child(2) > span:nth-child(2)",
      (links) => links.map((link) => link.textContent)
    );
    const floor = await page.$$eval(
      "div.obj-info > ul.obj-data.clearfix >li:nth-child(3) > span:nth-child(2)",
      (links) => links.map((link) => link.textContent)
    );
    console.log(title);
    // 逐一加入result
    for (let i = 0; i < title.length; i++) {
      let result1 = pattern[i].includes("1衛");
      let linkResult = initArr.find((d) => d === linkList[i]);
      let titleResult = initTitle.find((d) => d === title[i]);
      if (linkResult || titleResult || result1) {
        console.log("repeat");
      } else {
        id = id + 1;
        let resultObj = {
          id,
          title: title[i],
          distant: distant[i],
          link: linkList[i],
          price: price[i],
          type: type[i],
          pattern: pattern[i],
          floor: floor[i],
          comment: "",
          state: "standby",
        };
        await sentData(resultObj);
      }
    }
  }

  // get All house Data
  // const getAllData = async (total) => {
  //   console.log("start");

  //   await getInitData()
  //     .then((res) => {
  //       for (const key in res) {
  //         initArr.push(res[key].link);
  //         initTitle.push(res[key].title);
  //       }
  //     })
  //     .catch((err) => {
  //       throw new Error(err);
  //     });
  //   id = initArr.length;

  //   for (let i = 0; i <= total; i += 30) {
  //     await getData(i).catch((err) => {
  //       throw new Error(err);
  //     });

  //     await page.waitForTimeout(3000);
  //   }

  //   console.log("End");
  // };

  try {
    await getData();
    // await getAllData(pageIndex);
    // initArr = [];
    // initTitle = [];
    // amount = 0;
    return "success";
  } catch (error) {
    return error;
  }
}

// module.exports = scrawl;

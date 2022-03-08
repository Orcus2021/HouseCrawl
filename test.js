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

// let result = [];
// let initArr = [];
// let initTitle = [];
// let id = 0;
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
  async function getData() {
    // let url = crawlUrl + "firstRow=" + n + "&" + urlArr[urlArr.length - 1];
    await page.goto(initUrl);
    await page
      .waitForSelector(
        "body > div.container.obj-search-list.obj-search-rent.clearfix > div > div.content-main > div:nth-child(4) > div > div.obj-item.clearfix > div.obj-info"
      )
      .then(() => {
        console.log("got it");
      });
    const title = await page.$$eval("div.obj-info > div >h6 > a", (links) =>
      links.map((link) => link.textContent)
    );
    const linkList = await page.$$eval("div.obj-info > div >h6 > a", (links) =>
      links.map((link) => link.href)
    );
    console.log(title, linkList);
    // 逐一加入result
    // for (let data of linkList) {
    //   console.log("detail");
    //   // const pattern = await page.$eval(
    //   //   "div.obj-title > a",
    //   //   (el) => el.textContent,
    //   //   data
    //   // );

    //   const a = await page.evaluate(
    //     (el) => el.querySelector("div.obj-title > a").getAttribute("href"),
    //     data
    //   );
    //   // let title = await page.evaluate(
    //   //   (el) => el.querySelector("div.obj-title > a").textContent,
    //   //   data
    //   // );
    //   console.log(a);

    //   // title = title.trim();
    //   // let linkResult = initArr.find((d) => d === a);
    //   // let titleResult = initTitle.find((d) => d === title);

    //   // if (linkResult || titleResult) {
    //   //   console.log("repeat");
    //   // } else {
    //   //   id = id + 1;
    //   //   result.push({ id, title, link: a });
    //   //   console.log(a);
    //   // }
    // }
    //Filter 1衛 開放式
    // for (let j = 0; j < result.length; j++) {
    //   let detailUrl = result[j].link;
    //   await getDetail(detailUrl, j);

    //   let result1 = result[j].pattern.includes("1衛");
    //   let result2 = result[j].pattern.includes("開放式");

    //   if (!result1 && !result2) {
    //     await sentData(result[j]);
    //     await page.waitForTimeout(2000);
    //   } else if (result1 || result2) {
    //     console.log("Failed pattern");
    //   }
    // }

    // result = [];
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
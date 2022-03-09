import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./User.module.css";
import axios from "axios";

const User = (props) => {
  const [dataState, setDataState] = useState("");
  const [urlTotal, setUrlTotal] = useState("");
  const [rukuyaPage, setRukuyaPage] = useState("");
  const navigate = useNavigate();
  const herokuUrl = "https://housecrawler.herokuapp.com";
  const rent591List =
    "https://rent.591.com.tw/?region=1&section=3,5,7,1,4&kind=1&rentprice=1,42000&showMore=1&multiNotice=not_cover&searchtype=1&multiFloor=2_6,6_12,12_&multiRoom=3,4&other=newPost&firstRow=0&totalRows=136";
  const rukuyaList =
    "https://www.rakuya.com.tw/search/rent_search/index?display=list&con=eJw9jbEOAiEQRP9lawrAUxM_g9ZY3AFGDLoEuOI0_rs7JNpM8t5OZt-0xFCZH3Q6044UTXRR5FPfIDQgpFbyLEw5tS6Va2auOFsBNHi5p2eAccBSk48gzFmtx0qLc_U32DEupm8leg6j6Yx0nYVe298ewa9UfmxkSklOI_cjD0gjLz5fJZo3pQ&tab=def&sort=11&ds=&page=1";

  useEffect(() => {
    if (!props.token) {
      navigate("/login");
      return;
    }
  }, [props.token, navigate]);
  //sent to backend
  const sentData = async (data) => {
    const res = axios.post(herokuUrl + "/api/user", {
      rent591Url: data.rent591Url,
      rukuyaUrl: data.rukuyaUrl,
    });
    return res;
  };

  const searchDataHandler = () => {
    let rent591Url = `https://rent.591.com.tw/?region=1&section=3,5,7,1,4&kind=1&rentprice=1,42000&showMore=1&multiNotice=not_cover&searchtype=1&multiFloor=2_6,6_12,12_&multiRoom=3,4&other=newPost&firstRow=0&totalRows=${urlTotal}`;
    let rukuyaUrl = `https://www.rakuya.com.tw/search/rent_search/index?display=list&con=eJw9jbEOAiEQRP9lawrAUxM_g9ZY3AFGDLoEuOI0_rs7JNpM8t5OZt-0xFCZH3Q6044UTXRR5FPfIDQgpFbyLEw5tS6Va2auOFsBNHi5p2eAccBSk48gzFmtx0qLc_U32DEupm8leg6j6Yx0nYVe298ewa9UfmxkSklOI_cjD0gjLz5fJZo3pQ&tab=def&sort=11&ds=&page=${rukuyaPage}`;
    let urlObj = {
      rent591Url,
      rukuyaUrl,
    };

    sentData(urlObj)
      .then((res) => {
        if (res.data.message) {
          setDataState(res.data.message);
        }
      })
      .catch((err) => {
        if (err) {
          setDataState(err);
        }
      });
  };
  // set url handler
  const setURlHandler = (e) => {
    setUrlTotal(e.target.value);
  };
  const setPageHandler = (e) => {
    setRukuyaPage(e.target.value);
  };
  const copyUrlHandler = (list) => {
    navigator.clipboard
      .writeText(list)
      .then(() => console.log("Copy success!"));
  };
  return (
    <div className={classes.user_container}>
      <div className={classes.user_title}>
        <h2>Your Account</h2>
        <p>Logout</p>
      </div>
      <div className={classes.user_main}>
        <div className={classes.user_function}>
          <p>照片</p>
          <p>function</p>
        </div>
        <div className={classes.user_content}>
          <div className={classes.user_info}>
            <div className={classes.user_infoItem}>
              <p>name</p>
              <p>change name</p>
            </div>
            <div className={classes.user_infoItem}>
              <p>email</p>
              <p>change email</p>
            </div>
            <div className={classes.user_infoItem}>
              <p>password</p>
              <p>change password</p>
            </div>

            <p>total profit:$100000</p>
          </div>
          <div className={classes.user_line}>
            <div className="lineItem"></div>
            <label htmlFor="">Notify Function:</label>
            <input type="radio" name="line" />
            <input type="radio" name="line" />
            <div className={classes.line_token}>
              <p>Token:*********************</p>
              <p>change token</p>
            </div>
          </div>

          <div className={classes.user_urlCopy}>
            <p>591租屋網網址</p>
            <button onClick={copyUrlHandler.bind(this, rent591List)}>
              Copy
            </button>
            <p>樂屋網網址</p>
            <button onClick={copyUrlHandler.bind(this, rukuyaList)}>
              Copy
            </button>
          </div>
          <div className={classes.user_search}>
            <label htmlFor="">Total Raws:</label>
            <input type="text" onChange={setURlHandler} value={urlTotal} />
            <label htmlFor="">Total Pages:</label>
            <input type="text" onChange={setPageHandler} value={rukuyaPage} />
            <button onClick={searchDataHandler}>send</button>
            <p>{dataState}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;

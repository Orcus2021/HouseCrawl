import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./User.module.css";
import axios from "axios";
import useGetData from "../useCustomize/useGetData";

const User = (props) => {
  const { token, onLogout, onUpdate } = props;
  const [dataState, setDataState] = useState("");
  const [urlTotal, setUrlTotal] = useState("");
  const [rukuyaPage, setRukuyaPage] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.uid;
  const herokuUrl = process.env.REACT_APP_HEROKU;
  const { onceData: userData } = useGetData(`/rentData/${userId}`);
  const {
    accountLevel,
    email,
    expire,

    lineNotify,
    lineToken,
    totalBalance,
  } = userData;

  const [notify, setNotify] = useState(false);
  useEffect(() => {
    if (lineNotify) {
      setNotify(lineNotify);
    }
  }, [lineNotify]);
  const rent591List =
    "https://rent.591.com.tw/?region=1&section=3,5,7,1,4&kind=1&rentprice=1,42000&showMore=1&multiNotice=not_cover&searchtype=1&multiFloor=2_6,6_12,12_&multiRoom=3,4&other=newPost&firstRow=0&totalRows=136";
  const rukuyaList =
    "https://www.rakuya.com.tw/search/rent_search/index?display=list&con=eJw9jbEOAiEQRP9lawrAUxM_g9ZY3AFGDLoEuOI0_rs7JNpM8t5OZt-0xFCZH3Q6044UTXRR5FPfIDQgpFbyLEw5tS6Va2auOFsBNHi5p2eAccBSk48gzFmtx0qLc_U32DEupm8leg6j6Yx0nYVe298ewa9UfmxkSklOI_cjD0gjLz5fJZo3pQ&tab=def&sort=11&ds=&page=1";

  //sent to backend to scrawler
  const sentData = async (data) => {
    const res = axios.post(herokuUrl + "/api/user", {
      rent591Url: data.rent591Url,
      rukuyaUrl: data.rukuyaUrl,
    });
    return res;
  };

  const searchDataHandler = () => {
    setDataState("Waiting....");
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
  const notifyHandler = (e) => {
    let useNotify = e.target.checked;
    console.log(e.target.checked);
    let url = `/rentData/${userId}`;
    if (e.target.checked) {
      onUpdate({ lineNotify: useNotify }, url);
    } else {
      onUpdate({ lineNotify: useNotify }, url);
    }
    setNotify((pre) => e.target.checked);
  };
  return (
    <div className={classes.user_container}>
      <div className={classes.user_title}>
        <h2>Your Account</h2>
        <p>Logout</p>
      </div>
      <div className={classes.user_main}>
        <div className={classes.user_function}>
          <div className={classes.plan}>
            <i className="ri-bookmark-3-line"></i>
            <p>{accountLevel}</p>
            <p>${totalBalance}</p>
            <p>{expire}</p>
          </div>

          <p>Setting</p>
          <p>Function</p>
        </div>
        <div className={classes.user_content}>
          <div className={classes.user_info}>
            <div className={classes.user_mail}>
              <p>{email}</p>
              <p>Change Email</p>
            </div>
            <div className={classes.user_password}>
              <p>
                Password:<span>**********</span>
              </p>
              <p>Change Password</p>
            </div>
          </div>
          <div className={classes.user_line}>
            <div className={classes.lineItem}>
              <label htmlFor="line">Line Notify</label>
              <input
                type="checkbox"
                id="line"
                name="line"
                checked={notify}
                onChange={notifyHandler}
              />
            </div>

            <div className={classes.line_token}>
              <p>Token:******</p>
              <p>Change Token</p>
            </div>
          </div>

          <div className={classes.user_urlCopy}>
            <div className={classes.copyItem}>
              <p>591租屋網網址</p>
              <button onClick={copyUrlHandler.bind(this, rent591List)}>
                Copy
              </button>
            </div>
            <div className={classes.copyItem}>
              <p>樂屋網網址</p>
              <button onClick={copyUrlHandler.bind(this, rukuyaList)}>
                Copy
              </button>
            </div>
          </div>
          <div className={classes.user_search}>
            <div>
              <label htmlFor="">Total Raws:</label>
              <input type="text" onChange={setURlHandler} value={urlTotal} />
            </div>
            <div>
              <label htmlFor="">Total Pages:</label>
              <input type="text" onChange={setPageHandler} value={rukuyaPage} />
            </div>

            <button onClick={searchDataHandler}>Crawler</button>
            <p>{dataState}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;

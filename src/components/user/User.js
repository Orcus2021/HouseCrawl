import React, { useState } from "react";
import classes from "./User.module.css";
import axios from "axios";

const User = () => {
  const [dataState, setDataState] = useState("");
  const [urlTotal, setUrlTotal] = useState("");

  const sentData = async (data) => {
    setDataState("Loading...");
    const res = await axios
      .post("http://localhost:4000/api/user", {
        url: data,
      })
      .catch((err) => {
        setDataState(err);
      });
    if (res.data.message) {
      setDataState(res.data.message);
    }
  };

  const searchDataHandler = () => {
    let url = `https://rent.591.com.tw/?region=1&section=3,5,7,1,4&kind=1&rentprice=1,42000&showMore=1&multiNotice=not_cover&searchtype=1&multiFloor=2_6,6_12,12_&multiRoom=3,4&other=newPost&firstRow=0&totalRows=${urlTotal}`;
    sentData(url);
  };

  const setURlHandler = (e) => {
    setUrlTotal(e.target.value);
  };
  const copyUrlHandler = () => {
    const list =
      "https://rent.591.com.tw/?region=1&section=3,5,7,1,4&kind=1&rentprice=1,42000&showMore=1&multiNotice=not_cover&searchtype=1&multiFloor=2_6,6_12,12_&multiRoom=3,4&other=newPost&firstRow=0&totalRows=136";
    navigator.clipboard
      .writeText(list)
      .then(() => console.log("Copy success!"));
  };
  return (
    <div className={classes.user_container}>
      <div className="user_title">
        <h2>Your Account</h2>
        <p>Logout</p>
      </div>
      <div className="user_main">
        <div className="user_function">
          <p>照片</p>
          <p>function</p>
        </div>
        <div className="user_content">
          <div className="user_urlCopy">
            <p>591租屋網網址</p>
            <button onClick={copyUrlHandler}>Copy</button>
          </div>
          <div className="user_search">
            <label htmlFor="">Total:</label>
            <input type="text" onChange={setURlHandler} value={urlTotal} />
            <button onClick={searchDataHandler}>send</button>
            <p>{dataState}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;

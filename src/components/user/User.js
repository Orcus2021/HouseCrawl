import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./User.module.css";
import axios from "axios";
import useGetData from "../Hook/useGetData";
import Modal from "../Layout/Modal";
import EditMenu from "./EditMenu";

const User = (props) => {
  const { token, onLogout, onUpdate } = props;
  const [dataState, setDataState] = useState("");
  const [urlTotal, setUrlTotal] = useState("");
  const [rent591Price, setRent591Price] = useState(42000);
  const [rukuyaPage, setRukuyaPage] = useState("");
  const [editShow, setEditShow] = useState(false);
  const [itemType, setItemType] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const userId = params.uid;
  const herokuUrl = process.env.REACT_APP_HEROKU;
  const { onceData: userData } = useGetData(`/rentData/${userId}`, "aDoc");
  const { accountLevel, email, expire, lineNotify } = userData;
  const { allData: totalBalance } = useGetData(
    `/rentData/${userId}/houseInfo`,
    "allDocs"
  );

  const [notify, setNotify] = useState(false);
  useEffect(() => {
    if (lineNotify) {
      setNotify(lineNotify);
    }
  }, [lineNotify]);
  const rent591List =
    "https://rent.591.com.tw/?region=1&section=3,5,7,1,4&kind=1&rentprice=1,42000&showMore=1&multiNotice=not_cover&searchtype=1&multiFloor=2_6,6_12,12_&multiRoom=3,4&other=newPost&firstRow=0&totalRows=136";
  const rukuyaList =
    "https://www.rakuya.com.tw/search/rent_search/index?display=list&con=eJw9jUEOwiAQRe8yaxZQaU08BisT46IFjGPQIUAX1Xh3Z4i6-cl_8_LnBUsMhegOhxPsQAGcFXhsm3QtJWDNaeYOCWtj45KIipyHr07LDR9BiJOaC_oojc920Lqv1DgXfxXax5m0LUdPoZvOsOtkz1mJkeNoxFrrX9oznIQ9Mf-Y4XXFaXuOPSdJw1_fHwBQOv0&tab=def&sort=11&ds=&page=1";
  useEffect(() => {
    let initToken = localStorage.getItem("houseListToken");
    if (!token && !initToken) {
      navigate("/login");
    }
  }, [token, navigate]);
  //sent to backend to scrawler
  const sentData = async (data) => {
    const res = axios.post("http://localhost:8080" + "/api/user", {
      rent591Url: data.rent591Url,
      rukuyaUrl: data.rukuyaUrl,
    });
    return res;
  };

  const searchDataHandler = () => {
    setDataState("Waiting....");
    let rent591Url = `https://rent.591.com.tw/?region=1&section=3,5,7,1,4&kind=1&rentprice=1,${rent591Price}&showMore=1&multiNotice=not_cover&searchtype=1&multiFloor=2_6,6_12,12_&multiRoom=3,4&other=newPost&firstRow=0&totalRows=${urlTotal}`;
    let rukuyaUrl = `https://www.rakuya.com.tw/search/rent_search/index?display=list&con=eJw9jUEOwiAQRe8yaxZQaU08BisT46IFjGPQIUAX1Xh3Z4i6-cl_8_LnBUsMhegOhxPsQAGcFXhsm3QtJWDNaeYOCWtj45KIipyHr07LDR9BiJOaC_oojc920Lqv1DgXfxXax5m0LUdPoZvOsOtkz1mJkeNoxFrrX9oznIQ9Mf-Y4XXFaXuOPSdJw1_fHwBQOv0&tab=def&sort=11&ds=&page=${rukuyaPage}`;
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
  const setPriceHandler = (e) => {
    setRent591Price(e.target.value);
  };
  const setPageHandler = (e) => {
    setRukuyaPage(e.target.value);
  };
  const copyUrlHandler = (list) => {
    navigator.clipboard
      .writeText(list)
      .then(() => console.log("Copy success!"));
  };
  //-----
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

  const logoutHandler = () => {
    onLogout();
  };
  const editMenuHandler = () => {
    setEditShow((pre) => !pre);
  };
  const mailChangeHandler = () => {
    setItemType("mail");
    setEditShow((pre) => !pre);
  };
  const passwordChangeHandler = () => {
    setItemType("password");
    setEditShow((pre) => !pre);
  };
  const tokenChangeHandler = () => {
    setItemType("lineToken");
    setEditShow((pre) => !pre);
  };

  const updateInfoHandler = (d) => {
    let url = `/rentData/${userId}`;
    let updateObj = {};
    if (itemType === "lineToken") {
      updateObj = { lineToken: d };
    }
    onUpdate(updateObj, url);
  };
  let test = totalBalance.reduce((sum, el) => {
    return sum + el.balance;
  }, 0);

  return (
    <Fragment>
      <div className={classes.user_container}>
        <div className={classes.user_title}>
          <h2>Your Account</h2>
          <p onClick={logoutHandler}>
            Logout<i className="ri-logout-box-r-line"></i>
          </p>
        </div>
        <div className={classes.user_main}>
          <div className={classes.user_function}>
            <div className={classes.plan}>
              <i className="ri-bookmark-3-line"></i>
              <p>{accountLevel}</p>
              <p>${test}</p>
              <p>{expire}</p>
            </div>

            <p>Setting</p>
            <p>Function</p>
          </div>
          <div className={classes.user_content}>
            <div className={classes.user_info}>
              <div className={classes.user_mail}>
                <p>{email}</p>
                <p onClick={mailChangeHandler}>Change Email</p>
              </div>
              <div className={classes.user_password}>
                <p>
                  Password:<span>**********</span>
                </p>
                <p onClick={passwordChangeHandler}>Change Password</p>
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
                <p>Token:**********</p>
                <p onClick={tokenChangeHandler}>Change Token</p>
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
                <label htmlFor="">591Price:</label>
                <input
                  type="text"
                  onChange={setPriceHandler}
                  value={rent591Price}
                />
              </div>
              <div>
                <label htmlFor="">Total Pages:</label>
                <input
                  type="text"
                  onChange={setPageHandler}
                  value={rukuyaPage}
                />
              </div>

              <button onClick={searchDataHandler}>Crawler</button>
              <p>{dataState}</p>
            </div>
          </div>
        </div>
      </div>
      {editShow && (
        <Modal onClose={editMenuHandler}>
          <EditMenu
            onClose={editMenuHandler}
            type={itemType}
            onUpdate={updateInfoHandler}
          />
        </Modal>
      )}
    </Fragment>
  );
};

export default User;

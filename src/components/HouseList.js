import React, { useEffect, useState } from "react";
import ListItem from "./ListItem";
import classes from "./HouseList.module.css";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, child, get, update } from "firebase/database";

let initData = [];
function HouseList(props) {
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [waitShow, setWaitShow] = useState(false);
  const [seeShow, setSeeShow] = useState(false);
  const [askShow, setAskShow] = useState(false);
  const db = getDatabase(props.firebaseApp);
  let waitClass = "";
  let seeClass = "";
  let askClass = "";
  let backCircle = "";
  useEffect(() => {
    if (!props.token) {
      navigate("/login");
      return;
    }
  }, [props.token, navigate]);
  useEffect(() => {
    let isMounted = true;
    const dbRef = ref(db);
    const getDate = async () => {
      if (isMounted) {
        await get(child(dbRef, "house"))
          .then((snapshot) => {
            if (snapshot.exists()) {
              initData = [];
              let val = snapshot.val();

              for (const key in val) {
                let dataObj = {
                  keyId: key,
                  id: val[key].id,
                  title: val[key].title,
                  pattern: val[key].pattern,
                  floor: val[key].floor,
                  type: val[key].type,
                  distant: val[key].distant,
                  price: val[key].price,
                  state: val[key].state,
                  link: val[key].link,
                  comment: val[key].comment,
                };

                initData.push(dataObj);
              }

              let initArr = initData.filter((d) => {
                return d.state !== "delete";
              });

              setListData(initArr);
            } else {
              console.log("No data available");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    };
    getDate();

    return () => {
      isMounted = false;
    };
  }, [db]);

  const sentStateData = async (id, data) => {
    const updates = {};
    updates[`/house/${id}/state`] = data;
    update(ref(db), updates);
  };
  const sentCommentData = async (id, data) => {
    const updates = {};
    updates[`/house/${id}/comment`] = data;
    update(ref(db), updates);
  };

  const sentCommentHandler = (id, data) => {
    sentCommentData(id, data).catch((error) => {
      console.log(error);
    });
  };

  const sentItemHandler = (id, data) => {
    sentStateData(id, data).catch((error) => {
      console.log(error);
    });
  };
  const filter = (condition) => {
    let data = initData;
    let arr = data.filter((d) => {
      return d.state === condition;
    });
    setListData(arr);
  };

  const updateDataHandler = (id, data) => {
    let updateData = initData;
    let updateDataIndex = updateData.findIndex((d) => {
      return d.keyId === id;
    });
    updateData[updateDataIndex].state = data;
    updateData = updateData.filter((d) => {
      return d.state !== "delete";
    });

    setListData(updateData);
  };

  const seeHandler = () => {
    setSeeShow(true);
    setAskShow(false);
    setWaitShow(false);
    filter("save");
  };
  const askHandler = () => {
    setSeeShow(false);
    setAskShow(true);
    setWaitShow(false);
    filter("standby");
  };
  const waitHandler = () => {
    setSeeShow(false);
    setAskShow(false);
    setWaitShow(true);
    filter("wait");
  };

  if (waitShow) {
    waitClass = classes.btnActive;
  } else if (seeShow) {
    seeClass = classes.btnActive;
  } else if (askShow) {
    askClass = classes.btnActive;
  }
  if (waitShow || seeShow || askShow) {
    backCircle = <div className={classes.indicator}></div>;
  }
  return (
    <div className={classes.container}>
      <h1>House List</h1>
      <div className={classes.content}>
        <div className={classes.btns}>
          <div className={waitClass}>
            <button className={classes.wait} onClick={waitHandler}>
              <i className="ri-money-dollar-circle-line"></i>
              <span>發財</span>
            </button>
          </div>
          <div className={seeClass}>
            <button className={classes.see} onClick={seeHandler}>
              <i className="ri-map-pin-line"></i>
              <span>待看</span>
            </button>
          </div>
          <div className={askClass}>
            <button className={classes.ask} onClick={askHandler}>
              <i className="ri-phone-line"></i>
              <span>待問</span>
            </button>
          </div>
          {backCircle}
        </div>
      </div>

      <div className={classes.list}>
        {listData.length > 0 ? (
          listData.map((d) => {
            return (
              <ListItem
                key={d.keyId}
                id={d.id}
                title={d.title}
                pattern={d.pattern}
                floor={d.floor}
                type={d.type}
                distant={d.distant}
                price={d.price}
                link={d.link}
                comment={d.comment}
                state={d.state}
                onSent={sentItemHandler.bind(this, d.keyId)}
                onComment={sentCommentHandler.bind(this, d.keyId)}
                onUpdate={updateDataHandler.bind(this, d.keyId)}
              />
            );
          })
        ) : (
          <h2>沒有物件，繼續努力</h2>
        )}
      </div>
    </div>
  );
}

export default HouseList;

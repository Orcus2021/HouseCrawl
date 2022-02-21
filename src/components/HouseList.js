import React, { useEffect, useState } from "react";
import ListItem from "./ListItem";
import classes from "./HouseList.module.css";
import { useNavigate } from "react-router-dom";

let url =
  "https://crawl-e3835-default-rtdb.asia-southeast1.firebasedatabase.app/";
let initData = [];

function HouseList(props) {
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);

  useEffect(() => {
    if (!props.token) {
      navigate("/");
      return;
    }
    const getData = async () => {
      const response = await fetch(url + "house.json");

      if (!response.ok) {
        throw new Error("Get data failed.");
      }
      const data = await response.json();
      return data;
    };

    getData().then((res) => {
      for (const key in res) {
        let dataObj = {
          keyId: key,
          id: res[key].id,
          title: res[key].title,
          pattern: res[key].pattern,
          floor: res[key].floor,
          type: res[key].type,
          distant: res[key].distant,
          price: res[key].price,
          state: res[key].state,
          link: res[key].link,
          comment: res[key].comment,
        };
        initData.push(dataObj);
      }

      let initArr = initData.filter((d) => {
        return d.state !== "delete";
      });

      setListData(initArr);
    });
  }, [props.token, navigate]);

  const sentData = async (id, data) => {
    const response = await fetch(`${url}house/${id}.json`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Fetch is failed");
    }
  };

  const sentItemHandler = (id, data) => {
    sentData(id, data).catch((error) => {
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
    filter("save");
  };
  const askHandler = () => {
    filter("standby");
  };
  const waitHandler = () => {
    filter("wait");
  };

  return (
    <div className={classes.container}>
      <h1>House List</h1>
      <div className={classes.btns}>
        <span>Filter :</span>
        <button className={classes.wait} onClick={waitHandler}>
          發財
        </button>
        <button className={classes.see} onClick={seeHandler}>
          待看
        </button>
        <button className={classes.ask} onClick={askHandler}>
          待問
        </button>
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
                onUpdate={updateDataHandler.bind(this, d.keyId)}
              />
            );
          })
        ) : (
          <h1>沒有物件，繼續努力</h1>
        )}
      </div>
    </div>
  );
}

export default HouseList;

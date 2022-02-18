import React, { useEffect, useState } from "react";
import ListItem from "./ListItem";
import classes from "./HouseList.module.css";
let url =
  "https://crawl-e3835-default-rtdb.asia-southeast1.firebasedatabase.app/";
function HouseList() {
  const [listData, setListData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch(url + "house.json");

      if (!response.ok) {
        throw new Error("Get data failed.");
      }
      const data = await response.json();
      return data;
    };

    getData().then((res) => {
      let arr = [];
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
        arr.push(dataObj);
      }
      arr = arr.filter((d) => {
        return d.state !== "delete";
      });
      setListData(arr);
    });
  }, []);
  const sentData = async (id, data) => {
    const response = await fetch(url + "house/" + `${id}.json`, {
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

  return (
    <div className={classes.container}>
      <h1>House List</h1>

      <div className={classes.list}>
        {listData.map((d) => {
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
            />
          );
        })}
      </div>
    </div>
  );
}

export default HouseList;

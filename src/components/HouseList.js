import React, { useEffect, useState } from "react";
import ListItem from "./ListItem";
import classes from "./HouseList.module.css";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, child, get, update } from "firebase/database";

let initData = [];
function HouseList(props) {
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);

  // useEffect(() => {
  //   if (!props.token) {
  //     navigate("/");
  //     return;
  //   }

  //   const dbRef = ref(getDatabase(props.firebaseApp));
  //   const getDate = async () => {
  //     await get(child(dbRef, "house"))
  //       .then((snapshot) => {
  //         if (snapshot.exists()) {
  //           initData = [];
  //           let val = snapshot.val();

  //           for (const key in val) {
  //             let dataObj = {
  //               keyId: key,
  //               id: val[key].id,
  //               title: val[key].title,
  //               pattern: val[key].pattern,
  //               floor: val[key].floor,
  //               type: val[key].type,
  //               distant: val[key].distant,
  //               price: val[key].price,
  //               state: val[key].state,
  //               link: val[key].link,
  //               comment: val[key].comment,
  //             };

  //             initData.push(dataObj);
  //           }

  //           let initArr = initData.filter((d) => {
  //             return d.state !== "delete";
  //           });

  //           setListData(initArr);
  //         } else {
  //           console.log("No data available");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   };
  //   getDate();
  // }, [props.token, navigate, props.firebaseApp]);

  const sentStateData = async (id, data) => {
    const updates = {};
    updates[`/house/${id}/state`] = data;
    update(ref(getDatabase(props.firebaseApp)), updates);
  };
  const sentCommentData = async (id, data) => {
    const updates = {};
    updates[`/house/${id}/comment`] = data;
    update(ref(getDatabase(props.firebaseApp)), updates);
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
                onComment={sentCommentHandler.bind(this, d.keyId)}
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

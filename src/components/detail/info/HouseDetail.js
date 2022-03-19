import React, { useState, useEffect, useCallback } from "react";
import classes from "./HouseDetail.module.css";
import AccountRecord from "../balance/AccountRecord";
import EditBalance from "../balance/EditBalance";
import Tenant from "../tenant/Tenant";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  getDocs,
} from "firebase/firestore";
import Modal from "../../Layout/Modal";
import DetailCreate from "../info/DetailCreate";

let changeArr = [];
const HouseDetail = (props) => {
  const { firebaseApp, onAdd, onUpdate, onDelete } = props;
  const db = getFirestore(firebaseApp);
  const params = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState({});
  const [recordData, setRecordData] = useState([]);
  const [editInfo, setEditInfo] = useState(false);

  let lastScrollY = 0;
  let keyId = params.id;
  let userId = params.uid;
  let newBalance = detail.balance;
  let searchArr = [];
  useEffect(() => {
    if (!props.token) {
      navigate("/login");
      return;
    }
  }, [props.token, navigate]);
  const scrollScreen = () => {
    lastScrollY = window.scrollY;
  };
  useEffect(() => {
    window.addEventListener("scroll", scrollScreen);
    scrollScreen();
    return () => {
      window.removeEventListener("scroll", scrollScreen);
    };
  });

  // sort/date translate function
  const sortCallBack = (a, b) => {
    let dateArr1 = a.recordDate.split("-");
    let dateArr2 = b.recordDate.split("-");
    let d1 = new Date(dateArr1[0], dateArr1[1], dateArr1[2]).getTime();
    let d2 = new Date(dateArr2[0], dateArr2[1], dateArr2[2]).getTime();
    return d2 - d1;
  };

  const milToDateTranslate = (d) => {
    if (typeof d === "object") {
      let year = new Date(d.recordDate).getFullYear();
      let month = new Date(d.recordDate).getMonth();
      let day = new Date(d.recordDate).getDate();
      d.recordDate = `${year}-${month + 1}-${day}`;
      return d;
    } else {
      console.log("Error Type");
    }
  };

  // processing firestore data
  const getInfoDataChange = useCallback(async () => {
    await onSnapshot(
      doc(db, `/rentData/${userId}/houseInfo/${keyId}`),
      (doc) => {
        setDetail(doc.data());
      }
    );
  }, [db, keyId, userId]);
  const getBalanceCollChange = useCallback(async () => {
    await onSnapshot(
      collection(db, `/rentData/${userId}/houseInfo/${keyId}/balance`),
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let singleData = milToDateTranslate(doc.data());
          singleData.keyId = doc.id;
          changeArr.push(singleData);
        });
        changeArr.sort(sortCallBack);

        setRecordData(changeArr);
        changeArr = [];
      }
    );
  }, [db, keyId, userId]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getInfoDataChange();
      getBalanceCollChange();
    }
    return () => {
      isMounted = false;
    };
  }, [getInfoDataChange, getBalanceCollChange]);

  const queryRecordData = async (
    q,
    categoryAll,
    categoryIncome,
    categoryExpense
  ) => {
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      let searchSingleData = milToDateTranslate(doc.data());

      searchSingleData.keyId = doc.id;
      if (categoryAll) {
        searchArr.push(searchSingleData);
      } else if (categoryIncome && searchSingleData.amount > 0) {
        searchArr.push(searchSingleData);
      } else if (categoryExpense && searchSingleData.amount < 0) {
        searchArr.push(searchSingleData);
      }
    });
    searchArr.sort(sortCallBack);

    setRecordData(searchArr);
    searchArr = [];
  };

  const deleteHandler = (id, deleteAmount) => {
    let url = `/rentData/${userId}/houseInfo/${keyId}/balance/${id}`;
    newBalance -= deleteAmount;
    onUpdate({ balance: newBalance }, `/rentData/${userId}/houseInfo/${keyId}`);
    onDelete(url);
  };
  // edit Info
  const editInfoHandler = () => {
    setEditInfo((pre) => {
      return !pre;
    });
  };
  const updateEditInfoHandler = (data) => {
    onUpdate(data, `/rentData/${userId}/houseInfo/${keyId}`);
  };
  const delInfoHandler = () => {
    if (window.confirm("你確定刪除嗎?")) {
      onDelete(`/rentData/${userId}/houseInfo/${keyId}`);
      navigate(`/${userId}/houseInfo`);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.topBar}>
        <div className={classes.houseInfo}>
          <div>
            <h2>Information Detail</h2>
          </div>

          <div className={classes.name}>
            <label>Name:</label>
            <p className={classes.nameValue}>{detail.name}</p>
          </div>
          <div className={classes.address}>
            <label>Address:</label>
            <p className={classes.addressValue}>{detail.address}</p>
          </div>
          <div className={classes.rent}>
            <label>Rent:</label>
            <p className={classes.rentValue}>
              ${detail.rent}
              <span>-{detail.payDate}th/month</span>
            </p>
          </div>
          <div className={classes.fee}>
            <label>Fee:</label>
            <p className={classes.feeValue}>
              ${detail.fee}
              <span>-{detail.feeDate}th/month</span>
            </p>
          </div>
          <div className={classes.accountNumber}>
            <label>Account:</label>
            <p className={classes.accountNumberValue}>{detail.accountNumber}</p>
          </div>

          <div className={classes.endDate}>
            <label>End Date:</label>
            <p className={classes.endDateValue}>{detail.endDate}</p>
          </div>
          <div className={classes.infoBalance}>
            <label>Balance:</label>
            <p className={classes.balanceValue}>${detail.balance}</p>
          </div>
          <div className={classes.comment}>
            <label>Comment:</label>
            <p className={classes.commentValue}>{detail.comment}</p>
          </div>
          <div className={classes.infoBtns}>
            <button className={classes.infoEditBtn} onClick={editInfoHandler}>
              Edit
            </button>
            <button className={classes.infoDelBtn} onClick={delInfoHandler}>
              Delete
            </button>
          </div>
        </div>
        <Tenant userId={userId} houseId={keyId} />
      </div>

      <div className={classes.balanceList}>
        <EditBalance
          onAdd={onAdd}
          onUpdate={onUpdate}
          onQuery={queryRecordData}
          newBalance={newBalance}
          keyId={keyId}
          userId={userId}
          db={db}
          lastScrollY={lastScrollY}
        />
        <div className={classes.list}>
          <h2>Account Record</h2>
          {recordData.map((d) => {
            return (
              <AccountRecord
                key={d.keyId}
                recordData={d}
                onDelete={deleteHandler.bind(this, d.keyId)}
              />
            );
          })}
        </div>
      </div>
      {editInfo ? (
        <Modal style={{ width: "500px" }} onClose={editInfoHandler}>
          <DetailCreate
            editDetailInfo={detail}
            keyId={keyId}
            onClose={editInfoHandler}
            onUpdate={updateEditInfoHandler}
            token={props.token}
          />
        </Modal>
      ) : (
        ""
      )}
    </div>
  );
};

export default HouseDetail;

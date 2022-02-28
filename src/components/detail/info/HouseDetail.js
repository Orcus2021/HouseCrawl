import React, { useState, useEffect } from "react";
import classes from "./HouseDetail.module.css";
import AccountRecord from "../balance/AccountRecord";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Modal from "../../Layout/Modal";
import DetailCreate from "../info/DetailCreate";

let tody = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate()
).getTime();
let week = tody - 1000 * 60 * 60 * 24 * 6;
let month = tody - 1000 * 60 * 60 * 24 * 29;

const HouseDetail = (props) => {
  const { firebaseApp, onAdd, onUpdate, onDelete } = props;
  const db = getFirestore(firebaseApp);
  const params = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState({});
  const [recordData, setRecordData] = useState([]);
  const [recordDate, setRecordDate] = useState("");
  const [amount, setAmount] = useState("");
  const [recordItem, setItem] = useState("");
  const [incomeValue, setIncomeValue] = useState(true);
  const [expenseValue, setExpenseValue] = useState(false);
  const [categoryAll, setCategoryAll] = useState(true);
  const [categoryIncome, setCategoryIncome] = useState(false);
  const [categoryExpense, setCategoryExpense] = useState(false);
  const [periodWeek, setPeriodWeek] = useState(true);
  const [periodMonth, setPeriodMonth] = useState(false);
  const [periodCustomize, setPeriodCustomize] = useState(false);
  const [cusBefore, setCusBefore] = useState("");
  const [cusAfter, setCusAfter] = useState("");
  const [editInfo, setEditInfo] = useState(false);
  useEffect(() => {
    if (!props.token) {
      navigate("/");
      return;
    }
  }, [props.token, navigate]);

  let keyId = params.id;
  let changeArr = [];
  let newBalance = detail.balance;
  let searchArr = [];

  useEffect(async () => {
    await getInfoDataChange();
    await getBalanceCollChange();
  }, []);
  // sort/date translate function
  const sortCallBack = (a, b) => {
    let dateArr1 = a.recordDate.split("-");
    let dateArr2 = b.recordDate.split("-");
    let d1 = new Date(dateArr1[0], dateArr1[1], dateArr1[2]).getTime();
    let d2 = new Date(dateArr2[0], dateArr2[1], dateArr2[2]).getTime();
    return d2 - d1;
  };
  const dateToMilTranslate = (d) => {
    if (!typeof d === "string") {
      return "Invalid date";
    } else if (typeof d === "string") {
      let dateArr = d.split("-");
      let dateMilliseconds = new Date(
        dateArr[0],
        dateArr[1] - 1,
        dateArr[2]
      ).getTime();
      return dateMilliseconds;
    }
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
  const getInfoDataChange = async () => {
    await onSnapshot(doc(db, `/rentData/${keyId}`), (doc) => {
      setDetail(doc.data());
    });
  };
  const getBalanceCollChange = async () => {
    await onSnapshot(
      collection(db, `/rentData/${keyId}/balance`),
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
  };
  const queryRecordData = async (q) => {
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
  // filter recordData
  const filterDataHandler = () => {
    const ref = collection(db, `/rentData/${keyId}/balance`);
    const q7 = query(ref, where("recordDate", ">=", week));
    const q30 = query(ref, where("recordDate", ">=", month));
    const qCus = query(
      ref,
      where("recordDate", ">=", dateToMilTranslate(cusBefore)),
      where("recordDate", "<=", dateToMilTranslate(cusAfter))
    );
    if (periodWeek) {
      queryRecordData(q7);
    } else if (periodMonth) {
      queryRecordData(q30);
    } else if (periodCustomize) {
      queryRecordData(qCus);
    }
  };

  //input Handler
  const recordDateHandler = (e) => {
    setRecordDate(e.target.value);
  };
  const amountHandler = (e) => {
    let data = +e.target.value;
    setAmount(data);
  };
  const itemHandler = (e) => {
    setItem(e.target.value);
  };
  const cusBeforeHandler = (e) => {
    setCusBefore(e.target.value);
  };
  const cusAfterHandler = (e) => {
    setCusAfter(e.target.value);
  };
  //select income/expenses Handler
  const incomeHandler = () => {
    setIncomeValue(true);
    setExpenseValue(false);
  };
  const expenseHandler = () => {
    setIncomeValue(false);
    setExpenseValue(true);
  };

  // sent/delete balance data Handler
  const addBalanceDataHandler = () => {
    let dateMilliseconds = dateToMilTranslate(recordDate);
    let dataObj = {
      recordDate: dateMilliseconds,
      amount,
      recordItem,
    };
    if (
      recordDate.trim().length > 0 &&
      amount > 0 &&
      recordItem.trim().length > 0
    ) {
      if (expenseValue) {
        dataObj.amount = dataObj.amount * -1;

        newBalance += dataObj.amount;
        onAdd(dataObj, `rentData/${keyId}/balance`);

        onUpdate({ balance: newBalance }, `rentData/${keyId}`);
      } else {
        newBalance += dataObj.amount;
        onAdd(dataObj, `rentData/${keyId}/balance`);

        onUpdate({ balance: newBalance }, `rentData/${keyId}`);
      }
    } else {
      alert("請輸入正確日期、金額、名稱");
    }
  };

  const deleteHandler = (id, deleteAmount) => {
    let url = `/rentData/${keyId}/balance/${id}`;
    newBalance -= deleteAmount;
    onUpdate({ balance: newBalance }, `rentData/${keyId}`);
    onDelete(url);
  };
  // edit Info
  const editInfoHandler = () => {
    setEditInfo((pre) => {
      return !pre;
    });
  };
  const updateEditInfoHandler = (data) => {
    onUpdate(data, `rentData/${keyId}`);
  };
  const delInfoHandler = () => {
    if (window.confirm("你確定刪除嗎?")) {
      onDelete(`rentData/${keyId}`);
      navigate("/houseInfo");
    }
  };

  // category Handler
  const categoryAllHandler = () => {
    setCategoryAll(true);
    setCategoryIncome(false);
    setCategoryExpense(false);
  };
  const categoryIncomeHandler = () => {
    setCategoryAll(false);
    setCategoryIncome(true);
    setCategoryExpense(false);
  };
  const categoryExpenseHandler = () => {
    setCategoryAll(false);
    setCategoryIncome(false);
    setCategoryExpense(true);
  };

  // period Handler
  const periodWeekHandler = () => {
    setPeriodWeek(true);
    setPeriodMonth(false);
    setPeriodCustomize(false);
  };
  const periodMonthHandler = () => {
    setPeriodWeek(false);
    setPeriodMonth(true);
    setPeriodCustomize(false);
  };
  const periodCustomizeHandler = () => {
    setPeriodWeek(false);
    setPeriodMonth(false);
    setPeriodCustomize(true);
  };

  return (
    <div className={classes.container}>
      <div className={classes.topBar}>
        <div className={classes.houseInfo}>
          <div>
            <h2>INFORMATION</h2>
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
        <div className={classes.balanceContent}>
          <div className={classes.editBalance}>
            <h2>EDIT</h2>
            <div className={classes.editContent}>
              <div className={classes.select}>
                <label className={classes.label} onClick={incomeHandler}>
                  <input type="radio" name="editType" checked={incomeValue} />
                  <div className={classes.box}>
                    <span>Income</span>
                  </div>
                </label>
                <label className={classes.label} onClick={expenseHandler}>
                  <input type="radio" name="editType" checked={expenseValue} />
                  <div className={classes.box}>
                    <span>Expense</span>
                  </div>
                </label>
              </div>
              <div className={classes.editInput}>
                <div className={classes.date}>
                  <input
                    type="date"
                    onChange={recordDateHandler}
                    value={recordDate}
                  />
                </div>
                <div className={classes.inputRight}>
                  <div className={classes.item}>
                    <input
                      type="text"
                      placeholder="Name"
                      onChange={itemHandler}
                      value={recordItem}
                    />
                  </div>
                  <div className={classes.amount}>
                    <input
                      type="number"
                      placeholder="Amount"
                      onChange={amountHandler}
                      value={amount}
                    />
                  </div>
                  <div className={classes.btn}>
                    <button onClick={addBalanceDataHandler}>Add</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.filterBalance}>
            <div className={classes.balanceHead}>
              <h2>FILTER</h2>
            </div>
            <div className={classes.category}>
              <p>交易類型</p>
              <div className={classes.filterOption}>
                <label className={classes.label} onClick={categoryAllHandler}>
                  <input type="radio" name="mode" checked={categoryAll} />
                  <div className={classes.box}>
                    <span>All</span>
                  </div>
                </label>
                <label
                  className={classes.label}
                  onClick={categoryIncomeHandler}
                >
                  <input type="radio" name="mode" checked={categoryIncome} />
                  <div className={classes.box}>
                    <span>Income</span>
                  </div>
                </label>
                <label
                  className={classes.label}
                  onClick={categoryExpenseHandler}
                >
                  <input type="radio" name="mode" checked={categoryExpense} />
                  <div className={classes.box}>
                    <span>Expense</span>
                  </div>
                </label>
              </div>
              <p>期間</p>
              <div className={classes.filterOption}>
                <label className={classes.label} onClick={periodWeekHandler}>
                  <input type="radio" name="period" checked={periodWeek} />
                  <div className={classes.box}>
                    <span>7Days</span>
                  </div>
                </label>
                <label className={classes.label} onClick={periodMonthHandler}>
                  <input type="radio" name="period" checked={periodMonth} />
                  <div className={classes.box}>
                    <span>30Days</span>
                  </div>
                </label>
                <label
                  className={classes.label}
                  onClick={periodCustomizeHandler}
                >
                  <input type="radio" name="period" checked={periodCustomize} />
                  <div className={classes.box}>
                    <span>Customize</span>
                  </div>
                </label>
              </div>
              {periodCustomize ? (
                <div className={classes.customize}>
                  <input
                    type="date"
                    className={classes.before}
                    value={cusBefore}
                    onChange={cusBeforeHandler}
                  />

                  <input
                    type="date"
                    className={classes.after}
                    value={cusAfter}
                    onChange={cusAfterHandler}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <button className={classes.searchBtn} onClick={filterDataHandler}>
            Search
          </button>
        </div>
      </div>

      <div className={classes.balanceList}>
        <h2>Account Record</h2>
        <div className={classes.list}>
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
        <Modal onClose={editInfoHandler}>
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

import React, { useState } from "react";
import classes from "./EditBalance.module.css";
import { collection, query, where } from "firebase/firestore";
let left = 0;
let top = 0;

let tody = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate()
).getTime();
let week = tody - 1000 * 60 * 60 * 24 * 6;
let month = tody - 1000 * 60 * 60 * 24 * 29;
let initYear = new Date().getFullYear();
let initMonth = `${new Date().getMonth() + 1}`;
let initDay = `${new Date().getDate()}`;
let initDate;
if (initMonth.length === 1) {
  initMonth = "0" + initMonth;
}
if (initDay.length === 1) {
  initDay = "0" + initDay;
}
initDate = `${initYear}-${initMonth}-${initDay}`;
// let lastScrollY = 0;
const EditBalance = (props) => {
  const {
    onAdd,
    onUpdate,
    onQuery,
    newBalance,
    keyId,
    userId,
    db,
    lastScrollY,
  } = props;
  let initBalance = newBalance;
  const [recordDate, setRecordDate] = useState(initDate);
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
  const [cusBefore, setCusBefore] = useState(initDate);
  const [cusAfter, setCusAfter] = useState(initDate);

  const [showRipple, setShowRipple] = useState(false);

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

  // filter recordData

  const filterDataHandler = (e) => {
    //ripple effect
    let x = e.clientX - e.target.offsetLeft;
    let y = e.clientY - e.target.offsetTop + lastScrollY;

    left = x + "px";
    top = y + "px";

    setShowRipple(true);

    //select search condition
    const ref = collection(
      db,
      `/rentData/${userId}/houseInfo/${keyId}/balance`
    );
    const q7 = query(ref, where("recordDate", ">=", week));
    const q30 = query(ref, where("recordDate", ">=", month));
    const qCus = query(
      ref,
      where("recordDate", ">=", dateToMilTranslate(cusBefore)),
      where("recordDate", "<=", dateToMilTranslate(cusAfter))
    );
    if (periodWeek) {
      onQuery(q7, categoryAll, categoryIncome, categoryExpense);
    } else if (periodMonth) {
      onQuery(q30, categoryAll, categoryIncome, categoryExpense);
    } else if (periodCustomize) {
      if (dateToMilTranslate(cusBefore) < dateToMilTranslate(cusAfter)) {
        onQuery(qCus, categoryAll, categoryIncome, categoryExpense);
      } else {
        alert("查詢區間所選擇的結束日需晚於開始日期");
      }
    }
    setTimeout(() => {
      setShowRipple(false);
    }, 300);
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

        initBalance += dataObj.amount;

        onAdd(dataObj, `/rentData/${userId}/houseInfo/${keyId}/balance`);

        onUpdate(
          { balance: initBalance },
          `/rentData/${userId}/houseInfo/${keyId}`
        );
      } else {
        initBalance += dataObj.amount;

        onAdd(dataObj, `/rentData/${userId}/houseInfo/${keyId}/balance`);

        onUpdate(
          { balance: initBalance },
          `/rentData/${userId}/houseInfo/${keyId}`
        );
      }
    } else {
      alert("請輸入正確日期、金額、名稱");
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
    <div className={classes.balanceContent}>
      <div className={classes.editBalance}>
        <h2>BALANCE EDIT</h2>
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
            <label className={classes.label} onClick={categoryIncomeHandler}>
              <input type="radio" name="mode" checked={categoryIncome} />
              <div className={classes.box}>
                <span>Income</span>
              </div>
            </label>
            <label className={classes.label} onClick={categoryExpenseHandler}>
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
            <label className={classes.label} onClick={periodCustomizeHandler}>
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
                placeholder="請輸入日期"
              />

              <input
                type="date"
                className={classes.after}
                value={cusAfter}
                onChange={cusAfterHandler}
                placeholder="請輸入日期"
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <button className={classes.searchBtn} onClick={filterDataHandler}>
        Search
        {showRipple && <span style={{ left: `${left}`, top: `${top}` }}></span>}
      </button>
    </div>
  );
};

export default EditBalance;

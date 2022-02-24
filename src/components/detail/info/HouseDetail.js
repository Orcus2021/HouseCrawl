import React from "react";
import classes from "./HouseDetail.module.css";

const HouseDetail = () => {
  return (
    <div className={classes.container}>
      <div className={classes.houseInfo}>
        <p className={classes.name}>Name:</p>
        <p className={classes.nameValue}>name</p>
        <p className={classes.address}>Address:</p>
        <p className={classes.addressValue}>address</p>
        <p className={classes.rent}>Rent:</p>
        <p className={classes.rentValue}>
          $30000<span>1th/month</span>
        </p>
        <p className={classes.endDate}>End Date:</p>
        <p className={classes.endDateValue}>2020-12-12</p>
        <p className={classes.balance}>Balance:</p>
        <p className={classes.balanceValue}>0</p>
        <p className={classes.comment}>Comment:</p>
        <p className={classes.commentValue}>adsfasdfasdfasdf</p>
        <button>Edit</button>
      </div>
      <div className={classes.balance}>
        <div className={classes.editBalance}>
          <div className={classes.select}>
            <select>
              <option value={classes.income}>Income</option>
              <option value={classes.expenses}>Expenses</option>
            </select>
          </div>
          <div className={classes.amount}>
            <input type="number" placeholder="Amount" />
          </div>
          <div className={classes.item}>
            <input type="text" placeholder="Item" />
          </div>
          <div className={classes.btn}>
            <button>Confirm</button>
          </div>
        </div>
        <div className={classes.filterBalance}>
          <div className="topBar">
            <h1>Filter</h1>
            <button>Confirm</button>
          </div>

          <div className={classes.category}>
            <p>交易類型</p>
            <div className={classes.option}>
              <label className={classes.label}>
                <input type="radio" name="mode" value="all" />
                <div className={classes.box}>
                  <span>All</span>
                </div>
              </label>
              <label className={classes.label}>
                <input type="radio" name="mode" value="income" />
                <div className={classes.box}>
                  <span>Income</span>
                </div>
              </label>
              <label className={classes.label}>
                <input type="radio" name="mode" value="expenses" />
                <div className={classes.box}>
                  <span>Expenses</span>
                </div>
              </label>
            </div>
            <p>期間</p>
            <div className={classes.option}>
              <label className={classes.label}>
                <input type="radio" name="period" value="week" />
                <div className={classes.box}>
                  <span>7Days</span>
                </div>
              </label>
              <label className={classes.label}>
                <input type="radio" name="period" value="month" />
                <div className={classes.box}>
                  <span>30Days</span>
                </div>
              </label>
              <label className={classes.label}>
                <input type="radio" name="period" value="month" />
                <div className={classes.box}>
                  <span>自訂</span>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="balanceList"></div>
      </div>
    </div>
  );
};

export default HouseDetail;

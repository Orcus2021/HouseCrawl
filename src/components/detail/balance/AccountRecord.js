import React from "react";
import classes from "./AccountRecord.module.css";

const AccountRecord = (props) => {
  const { amount, recordDate, recordItem } = props.recordData;
  const deleteRecordHandler = () => {
    props.onDelete(amount);
  };
  return (
    <div className={classes.recordContent}>
      <p className={classes.date}>{recordDate}</p>
      <p className={classes.item}>{recordItem}</p>
      <p className={classes.amount}>{amount}</p>

      <div className={classes.btns}>
        <button onClick={deleteRecordHandler}>Delete</button>
      </div>
    </div>
  );
};

export default AccountRecord;

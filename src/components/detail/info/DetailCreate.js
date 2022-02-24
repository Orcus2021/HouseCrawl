import React, { useState } from "react";
import classes from "./DetailCreate.module.css";

const HouseDetail = (props) => {
  const { onAdd } = props;
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [payDate, setPayDate] = useState("");
  const [rent, setRent] = useState("");
  const [endDate, setEndDate] = useState("");
  const [comment, setComment] = useState("");
  const nameHandler = (e) => {
    setName(e.target.value);
  };
  const addressHandler = (e) => {
    setAddress(e.target.value);
  };
  const payDateHandler = (e) => {
    setPayDate(e.target.value);
  };
  const rentHandler = (e) => {
    setRent(e.target.value);
  };
  const endDateHandler = (e) => {
    setEndDate(e.target.value);
  };
  const commentHandler = (e) => {
    setComment(e.target.value);
  };
  let detailObj = {
    name,
    address,
    payDate,
    rent,
    endDate,
    comment,
    balance: 0,
  };
  const addDateHandler = (e) => {
    e.preventDefault();
    onAdd(detailObj);
  };

  return (
    <div className={classes.createContent}>
      <h2>HouseDetail</h2>
      <form className={classes.form}>
        <div className={classes.name}>
          <label htmlFor="">Name</label>
          <input type="text" value={name} onChange={nameHandler} />
        </div>

        <div className={classes.address}>
          <label htmlFor="">Address</label>
          <input type="text" value={address} onChange={addressHandler} />
        </div>

        <div className={classes.payDate}>
          <label htmlFor="">Pay Date</label>
          <input type="text" value={payDate} onChange={payDateHandler} />
        </div>

        <div className={classes.rent}>
          <label htmlFor="">Rent</label>
          <input type="text" value={rent} onChange={rentHandler} />
        </div>

        <div className={classes.end}>
          <label htmlFor="">End Date</label>
          <input type="text" value={endDate} onChange={endDateHandler} />
        </div>

        <div className={classes.comment}>
          <label htmlFor="">Comment</label>
          <textarea value={comment} onChange={commentHandler}></textarea>
        </div>

        <div className={classes.btns}>
          <button onClick={addDateHandler}>Confirm</button>
          <button>Clear</button>
        </div>
      </form>
    </div>
  );
};

export default HouseDetail;

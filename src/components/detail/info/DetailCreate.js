import React, { useState, useEffect } from "react";
import classes from "./DetailCreate.module.css";
import { useNavigate, useLocation } from "react-router-dom";

const HouseDetail = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!props.token) {
      navigate("/login");
      return;
    }
  }, [props.token, navigate]);

  let editInfo = false;
  if (props.keyId && props.editDetailInfo) {
    editInfo = true;
  }
  let contentClass = `${classes.createContent} ${
    editInfo ? "" : classes.contentPaddingTop
  }`;
  const { onAdd } = props;
  const [name, setName] = useState(editInfo ? props.editDetailInfo.name : "");
  const [address, setAddress] = useState(
    editInfo ? props.editDetailInfo.address : ""
  );
  const [payDate, setPayDate] = useState(
    editInfo ? props.editDetailInfo.payDate : ""
  );
  const [rent, setRent] = useState(editInfo ? props.editDetailInfo.rent : "");
  const [endDate, setEndDate] = useState(
    editInfo ? props.editDetailInfo.endDate : ""
  );
  const [comment, setComment] = useState(
    editInfo ? props.editDetailInfo.comment : ""
  );
  const [accountNumber, setAccountNumber] = useState(
    editInfo ? props.editDetailInfo.accountNumber : ""
  );

  // input value Handler
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
  const accountNumberHandler = (e) => {
    setAccountNumber(e.target.value);
  };
  let detailObj = {
    name,
    address,
    payDate,
    rent,
    accountNumber,
    endDate,
    comment,
    balance: 0,
  };

  const addDateHandler = (e) => {
    e.preventDefault();

    if (
      name.trim().length > 0 &&
      address.trim().length > 0 &&
      payDate.trim().length > 0 &&
      rent.trim().length > 0 &&
      accountNumber.trim().length > 0 &&
      endDate.trim().length > 0
    ) {
      if (editInfo) {
        let newObj = {
          name,
          address,
          payDate,
          rent,
          accountNumber,
          endDate,
          comment,
        };
        props.onUpdate(newObj);
        props.onClose();
      } else {
        onAdd(detailObj, "rentData");
        navigate("/houseInfo");
      }
    } else {
      alert("有資料未填");
    }
  };
  const clearFormHandler = (e) => {
    e.preventDefault();
    setName("");
    setAddress("");
    setComment("");
    setEndDate("");
    setPayDate("");
    setRent("");
    setAccountNumber("");
  };
  const closeHandler = (e) => {
    e.preventDefault();
    if (editInfo) {
      props.onClose();
    } else {
      navigate("/houseInfo");
    }
  };

  return (
    <div className={contentClass}>
      <h2>Add House Detail</h2>
      <form className={classes.form}>
        <div className={classes.name}>
          <label htmlFor="">Name</label>
          <input
            type="text"
            value={name}
            onChange={nameHandler}
            placeholder={editInfo ? props.editDetailInfo.name : ""}
          />
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

        <div className={classes.accountNumber}>
          <label htmlFor="">Account Number</label>
          <input
            type="text"
            value={accountNumber}
            onChange={accountNumberHandler}
          />
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
          <button onClick={clearFormHandler}>Clear</button>
          <button onClick={closeHandler}>Close</button>
        </div>
      </form>
    </div>
  );
};

export default HouseDetail;

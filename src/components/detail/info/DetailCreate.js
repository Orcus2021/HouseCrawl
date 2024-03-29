import React, { useState, useEffect } from "react";
import classes from "./DetailCreate.module.css";
import { useNavigate, useParams } from "react-router-dom";

const HouseDetail = (props) => {
  const { token, keyId, editDetailInfo, onAdd, onUpdate, onClose } = props;
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.uid;
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
  }, [token, navigate]);

  let editInfo = false;
  if (keyId && editDetailInfo) {
    editInfo = true;
  }
  let contentClass = `${classes.createContent} ${
    editInfo ? "" : classes.contentPaddingTop
  }`;

  const [name, setName] = useState(editInfo ? editDetailInfo.name : "");
  const [address, setAddress] = useState(
    editInfo ? editDetailInfo.address : ""
  );
  const [payDate, setPayDate] = useState(
    editInfo ? editDetailInfo.payDate : ""
  );
  const [rent, setRent] = useState(editInfo ? editDetailInfo.rent : "");
  const [endDate, setEndDate] = useState(
    editInfo ? editDetailInfo.endDate : ""
  );
  const [comment, setComment] = useState(
    editInfo ? editDetailInfo.comment : ""
  );
  const [accountNumber, setAccountNumber] = useState(
    editInfo ? editDetailInfo.accountNumber : ""
  );
  const [fee, setFee] = useState(editInfo ? editDetailInfo.fee : "");
  const [feeDate, setFeeDate] = useState(
    editInfo ? editDetailInfo.feeDate : ""
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
  const feeHandler = (e) => {
    setFee(e.target.value);
  };
  const feeDateHandler = (e) => {
    setFeeDate(e.target.value);
  };
  let detailObj = {
    name,
    address,
    payDate,
    rent,
    accountNumber,
    endDate,
    comment,
    fee,
    feeDate,
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
      endDate.trim().length > 0 &&
      fee.trim().length > 0 &&
      feeDate.trim().length
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
          fee,
          feeDate,
        };
        onUpdate(newObj);
        onClose();
      } else {
        onAdd(detailObj, `/rentData/${userId}/houseInfo`);
        navigate(`/${userId}/houseInfo`);
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
    setFee("");
    setFeeDate("");
  };
  const closeHandler = (e) => {
    e.preventDefault();
    if (editInfo) {
      onClose();
    } else {
      navigate(`/${userId}/houseInfo`);
    }
  };

  return (
    <div className={contentClass}>
      <h2>{editInfo ? "Edit House Detail" : "Add House Detail"}</h2>
      <form className={classes.form}>
        <div className={classes.name}>
          <label htmlFor="">Name</label>
          <input
            type="text"
            value={name}
            onChange={nameHandler}
            placeholder={editInfo ? editDetailInfo.name : ""}
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
        <div className={classes.fee}>
          <label htmlFor="">Fee</label>
          <input type="text" value={fee} onChange={feeHandler} />
        </div>
        <div className={classes.feeDate}>
          <label htmlFor="">Fee Date</label>
          <input type="text" value={feeDate} onChange={feeDateHandler} />
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

import React from "react";
import classes from "./InfoItem.module.css";
import { useNavigate } from "react-router";

const InfoItem = (props) => {
  const navigate = useNavigate();
  const {
    dataIndex,
    rentalName,
    address,
    rent,
    payDate,
    end,
    balance,
    comment,
    keyId,
  } = props;
  const navHouseDetailHandler = () => {
    navigate(`/houseInfo/${keyId}`);
  };

  return (
    <div className={classes.content}>
      <div className={classes.item_no}>
        <p>{dataIndex}</p>
      </div>
      <div className={classes.item_name}>
        <p>{rentalName}</p>
      </div>
      <div className={classes.item_address}>
        <p>{address}</p>
      </div>
      <div className={classes.item_rent}>
        <p>${rent}</p>
      </div>
      <div className={classes.item_date}>
        <p>{payDate}</p>
      </div>
      <div className={classes.item_end}>
        <p>{end}</p>
      </div>
      <div className={classes.item_balance}>
        <p>${balance}</p>
      </div>
      <div className={classes.item_comment}>
        <p>{comment}</p>
      </div>
      <div className={classes.item_edit} onClick={navHouseDetailHandler}>
        <i class="ri-arrow-right-s-line"></i>
      </div>
    </div>
  );
};

export default InfoItem;

import React from "react";
import classes from "./InfoItem.module.css";

const InfoItem = () => {
  return (
    <div className={classes.content}>
      <div className={classes.item_no}>1</div>
      <div className={classes.item_name}>科技大樓</div>
      <div className={classes.item_address}>Address</div>
      <div className={classes.item_rent}>$39000</div>
      <div className={classes.item_date}>1</div>
      <div className={classes.item_end}>2027-12-12</div>
      <div className={classes.item_balance}>$600000</div>
      <div className={classes.item_comment}>Lorem ipsum</div>
      <div className={classes.item_edit}>GO</div>
    </div>
  );
};

export default InfoItem;

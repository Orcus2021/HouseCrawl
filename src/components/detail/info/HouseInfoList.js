import React from "react";
import classes from "./HouseInfoList.module.css";
import InfoItem from "./InfoItem";

const HouseInfoList = () => {
  return (
    <div className={classes.container}>
      <h1>House Information List</h1>
      <div className={classes.content}>
        <button className={classes.btn}>Add+</button>
        <ul className={classes.items}>
          <li className={classes.item_no}>No.</li>
          <li className={classes.item_name}>Name</li>
          <li className={classes.item_address}>Address</li>
          <li className={classes.item_rent}>Rent</li>
          <li className={classes.item_date}>Pay Date</li>
          <li className={classes.item_end}>End Date</li>
          <li className={classes.item_balance}>Balance</li>
          <li className={classes.item_comment}>Comment</li>
          <li className={classes.item_edit}>Edit</li>
        </ul>
        <InfoItem />
      </div>
    </div>
  );
};

export default HouseInfoList;

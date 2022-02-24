import React from "react";
import classes from "./HouseInfoList.module.css";
import InfoItem from "./InfoItem";

const HouseInfoList = (props) => {
  let dataIndex = 0;

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
        {props.rentalData.map((d) => {
          dataIndex++;
          return (
            <InfoItem
              key={d.keyId}
              rentalName={d.name}
              address={d.address}
              rent={d.rent}
              payDate={d.payDate}
              end={d.endDate}
              balance={d.balance}
              comment={d.comment}
              dataIndex={dataIndex}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HouseInfoList;

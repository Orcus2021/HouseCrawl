import React from "react";
import classes from "./DetailCreate.module.css";

const DetailCreate = () => {
  return (
    <table className={classes.content}>
      <tr>
        <td colspan="2" className={classes.item_title}>
          HouseDetail
        </td>
      </tr>

      <tr>
        <td colspan="2" className={classes.item_no}>
          No.1
        </td>
      </tr>
      <tr>
        <td colspan="2" className={classes.item_name}>
          科技大樓
        </td>
      </tr>
      <tr>
        <td colspan="2" className={classes.item_address}>
          Address
        </td>
      </tr>
      <tr>
        <td className={classes.item_rent}>Rent：$39000</td>
        <td className={classes.item_date}>Pay Date：1</td>
      </tr>
      <tr>
        <td colspan="2" className={classes.item_end}>
          2027-12-12
        </td>
      </tr>
      <tr>
        <td colspan="2" className={classes.item_balance}>
          $600000
        </td>
      </tr>
      <tr>
        <td colspan="2" className={classes.item_comment}>
          Lorem ipsum
        </td>
      </tr>
      <tr>
        <td colspan="2" className={classes.item_edit}>
          <button>Edit</button>
        </td>
      </tr>
    </table>
  );
};

export default DetailCreate;

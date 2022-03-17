import React from "react";
import classes from "./EditTenant.module.css";
import useMutation from "../../Hook/useMutation";
import useInput from "../../Hook/useInput";
let titleName = "Add";
const EditTenant = (props) => {
  const { onClose, edit } = props;
  if (edit) {
    titleName = "Edit";
  }
  const { addCollectionData, updateFieldData, deleteDocData } = useMutation();
  const {
    value: room,
    valid: roomValid,
    changeHandler: roomHandler,
  } = useInput((d) => d.trim().length > 0);
  const {
    value: tenantName,
    valid: tenantNameValid,
    changeHandler: tenantNameHandler,
  } = useInput((d) => d.trim().length > 0);
  const {
    value: rent,
    valid: rentValid,
    changeHandler: rentHandler,
  } = useInput((d) => d.trim().length > 0);
  const {
    value: expire,
    valid: expireValid,
    changeHandler: expireHandler,
  } = useInput((d) => d.trim().length > 0);

  const dateToMilTranslate = (d) => {
    if (!typeof d === "string") {
      return "Invalid date";
    } else if (typeof d === "string") {
      let dateArr = d.split("-");
      let dateMilliseconds = new Date(
        dateArr[0],
        dateArr[1] - 1,
        dateArr[2]
      ).getTime();
      return dateMilliseconds;
    }
  };
  const mutationHandler = () => {
    let milExpire = dateToMilTranslate(expire);
    let tenantObj = {
      roomNumber: room,
      tenantName,
      rent,
      expire: milExpire,
    };
    if (roomValid && tenantNameValid && rentValid && expireValid) {
      addCollectionData(
        tenantObj,
        "/rentData/IAJiKr03ggdfNISJm44KKoQww333/houseInfo/Myt0e2HWEh98mrGmpMoW/tenant"
      );
      onClose();
    }
  };

  return (
    <div className={classes.edit_container}>
      <h2>{titleName} Tenant</h2>

      <div>
        <label htmlFor="">Room</label>
        <input type="text" value={room} onChange={roomHandler} />
      </div>
      <div>
        <label htmlFor="">Name</label>
        <input type="text" value={tenantName} onChange={tenantNameHandler} />
      </div>
      <div>
        <label htmlFor="">Rent</label>
        <input type="text" value={rent} onChange={rentHandler} />
      </div>
      <div>
        <label htmlFor="">Expire</label>
        <input type="date" value={expire} onChange={expireHandler} />
      </div>

      <div className={classes.btns}>
        <button onClick={mutationHandler}>Confirm</button>
        <button onClick={onClose}>Close</button>
        <button>Delete</button>
      </div>
    </div>
  );
};

export default EditTenant;

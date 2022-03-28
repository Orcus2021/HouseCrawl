import React from "react";
import classes from "./EditTenant.module.css";
import useMutation from "../../Hook/useMutation";
import useInput from "../../Hook/useInput";

let titleName = "Add";
let expireDate = "";
const EditTenant = (props) => {
  let condition = (d) => {
    return d.trim().length > 0;
  };
  const { onClose, edit, keyId, tenantData, userId, houseId } = props;
  const { addCollectionData, updateFieldData, deleteDocData } = useMutation();
  let url = `/rentData/${userId}/houseInfo/${houseId}/tenant`;
  if (edit) {
    titleName = "Edit";
    expireDate = tenantData.expire.split("-");

    for (let i = 0; i < expireDate.length; i++) {
      if (expireDate[i].length < 2) {
        expireDate[i] = "0" + expireDate[i];
      }
    }
    expireDate = expireDate.join("-");
  }

  const {
    value: room,
    valid: roomValid,
    changeHandler: roomHandler,
    // initValueHandler: setInitRoom,
  } = useInput(condition, tenantData.roomNumber);

  const {
    value: tenantName,
    valid: tenantNameValid,
    changeHandler: tenantNameHandler,
    // initValueHandler: setInitTenantName,
  } = useInput(condition, tenantData.tenantName);
  const {
    value: rent,
    valid: rentValid,
    changeHandler: rentHandler,
    // initValueHandler: setInitRent,
  } = useInput(condition, tenantData.rent);
  const {
    value: expire,
    valid: expireValid,
    changeHandler: expireHandler,
    // initValueHandler: setInitExpire,
  } = useInput(condition, expireDate);
  // useEffect(() => {
  //   if (edit) {
  //     let expireDate = tenantData.expire.split("-");
  //     for (let i = 0; i < expireDate.length; i++) {
  //       if (expireDate[i].length < 2) {
  //         expireDate[i] = "0" + expireDate[i];
  //       }
  //     }
  //     expireDate = expireDate.join("-");
  //     setInitRoom(tenantData.roomNumber);
  //     setInitTenantName(tenantData.tenantName);
  //     setInitRent(tenantData.rent);
  //     setInitExpire(expireDate);
  //   }
  // }, [
  //   edit,
  //   tenantData,
  //   setInitRoom,
  //   setInitTenantName,
  //   setInitRent,
  //   setInitExpire,
  // ]);

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
    console.log(tenantObj);
    if (roomValid && tenantNameValid && rentValid && expireValid) {
      console.log(url + `/${keyId}`);
      if (edit) {
        updateFieldData(tenantObj, url + `/${keyId}`);
      } else {
        addCollectionData(tenantObj, url);
      }

      onClose();
    } else {
      alert("Please input valid value.");
    }
  };

  const deleteHandler = () => {
    if (window.confirm("你確定刪除嗎?")) {
      deleteDocData(url + `/${keyId}`);
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
        {edit && (
          <button className={classes.delBtn} onClick={deleteHandler}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default EditTenant;

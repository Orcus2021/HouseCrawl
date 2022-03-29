import React, { Fragment, useState } from "react";
import classes from "./Tenant.module.css";
import EditTenant from "./EditTenant";
import Modal from "../../Layout/Modal";
import useGetData from "../../Hook/useGetData";
import TenantItem from "./TenantItem";

const Tenant = (props) => {
  const { userId, houseId } = props;

  const [editShow, setEditShow] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const { allData } = useGetData(
    `/rentData/${userId}/houseInfo/${houseId}/tenant`,
    "allDocs"
  );
  const milToDateTranslate = (d) => {
    if (typeof d === "object") {
      let year = new Date(d.expire).getFullYear();
      let month = new Date(d.expire).getMonth();
      let day = new Date(d.expire).getDate();
      d.expire = `${year}-${month + 1}-${day}`;
      return d;
    } else {
      console.log("Error Type");
    }
  };
  const editHandler = () => {
    setEditShow((pre) => !pre);
  };
  const showContentHandler = () => {
    setShowContent((pre) => !pre);
  };
  let arrowClassName = "ri-arrow-right-s-line";
  let tenantClassName = `${classes.list} ${classes.hide}`;
  if (showContent) {
    arrowClassName = `ri-arrow-right-s-line ${classes.active}`;
    tenantClassName = classes.list;
  }

  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.title}>
          <h2>Tenant</h2>
          <span onClick={showContentHandler}>
            <i className={arrowClassName}></i>
          </span>
        </div>

        <div className={tenantClassName}>
          <ul className={classes.listTitle}>
            <li>Room</li>
            <li>Name</li>
            <li>Rent</li>
            <li>Expire</li>
            <li>Edit</li>
          </ul>
          {allData.map((d) => {
            let dataObj = milToDateTranslate(d);

            return (
              <TenantItem
                key={dataObj.keyId}
                data={dataObj}
                userId={userId}
                houseId={houseId}
              />
            );
          })}

          <div>
            <button className={classes.btn} onClick={editHandler}>
              Add+
            </button>
          </div>
        </div>
      </div>
      {editShow && (
        <Modal onClose={editHandler}>
          <EditTenant onClose={editHandler} userId={userId} houseId={userId} />
        </Modal>
      )}
    </Fragment>
  );
};

export default Tenant;

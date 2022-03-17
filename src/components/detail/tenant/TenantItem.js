import React, { Fragment, useState } from "react";
import classes from "./TenantItem.module.css";
import Modal from "../../Layout/Modal";
import EditTenant from "./EditTenant";

const TenantItem = (props) => {
  const { data } = props;
  const [showEdit, setShowEdit] = useState(false);
  const editTenantHandler = () => {
    setShowEdit((pre) => !pre);
  };
  return (
    <Fragment>
      <div className={classes.listItem}>
        <p>{data.roomNumber}</p>
        <p>{data.tenantName}</p>
        <p>{data.rent}</p>
        <p>{data.expire}</p>
        <p onClick={editTenantHandler}>go</p>
      </div>
      {showEdit && (
        <Modal onClose={editTenantHandler}>
          <EditTenant
            onClose={editTenantHandler}
            edit={true}
            keyId={data.keyId}
            tenantData={data}
          />
        </Modal>
      )}
    </Fragment>
  );
};

export default TenantItem;

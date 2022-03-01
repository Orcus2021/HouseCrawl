import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css";

// const Backdrop = (props) => {
//   const closeView = () => {
//     props.onClose();
//   };
//   return <div className={classes.backdrop} onClick={closeView}></div>;
// };

const ModalOverlay = (props) => {
  const closeView = () => {
    props.onClose();
  };
  return (
    <div className={classes.container}>
      <div className={classes.modal}>
        <div>{props.children}</div>
      </div>
      <div className={classes.backdrop} onClick={closeView}></div>
    </div>
  );
};

const Modal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <ModalOverlay onClose={props.onClose}>{props.children}</ModalOverlay>,
        document.getElementById("overlays")
      )}
      {/* {ReactDOM.createPortal(
        <Backdrop onClose={props.onClose}>{props.children}</Backdrop>,
        document.getElementById("overlays")
      )} */}
    </Fragment>
  );
};

export default Modal;

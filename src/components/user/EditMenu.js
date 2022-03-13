import React, { useState } from "react";
import classes from "./EditMenu.module.css";
import useInput from "../Hook/useInput";
import useAuth from "../Hook/useAuth";
let title = "Edit";
let condition = () => {};
let inputType = "text";
let updateMethod = () => {};

const EditMenu = (props) => {
  const { onClose, type, onUpdate } = props;
  const [confirmInput, setConfirmInput] = useState("");
  const [sameValue, setSameValue] = useState(false);
  const { message, error, updateEmailHandler, updatePasswordHandler } =
    useAuth();
  if (type === "mail") {
    title = "Email";
    condition = (value) => {
      return value.includes("@");
    };
    updateMethod = updateEmailHandler;
  } else if (type === "password") {
    title = "Password";
    condition = (value) => {
      return value.trim().length >= 6;
    };
    inputType = "password";
    updateMethod = updatePasswordHandler;
  } else if (type === "lineToken") {
    title = "Token";
    condition = (value) => {
      return value.trim().length >= 35;
    };
    updateMethod = onUpdate;
  }
  const {
    value: newValue,
    valid: newValid,
    blur: newBlur,
    changeHandler: newChangeHandler,
    resetHandler: newResetHandler,
    blurHandler: newBlurHandler,
  } = useInput(condition);

  const closeHandler = () => {
    onClose();
  };
  const updateHandler = async () => {
    if (newValid && sameValue) {
      await updateMethod(newValue);
      if (error) {
        alert(message);
      } else {
        newResetHandler();
        onClose();
      }
    } else {
      alert(`Please input valid ${title}.`);
    }
  };

  const confirmHandler = (e) => {
    setConfirmInput(e.target.value);
  };
  const inputSameHandler = () => {
    if (newValue === confirmInput) {
      setSameValue(true);
    } else {
      alert("Please input the same value.");
    }
  };

  return (
    <div className={classes.edit_container}>
      <h2>Edit {title}</h2>

      <div>
        <label htmlFor="">New {title}</label>
        <input
          type={inputType}
          value={newValue}
          onChange={newChangeHandler}
          onBlur={newBlurHandler}
          autoComplete="off"
        />
        {!newValid && newBlur && <p>wrong</p>}
      </div>
      <div>
        <label htmlFor="">Confirm New {title}</label>
        <input
          type={inputType}
          value={confirmInput}
          onChange={confirmHandler}
          autoComplete="off"
          onBlur={inputSameHandler}
        />
      </div>

      <div className={classes.btns}>
        <button onClick={updateHandler}>Confirm</button>
        <button onClick={closeHandler}>Close</button>
      </div>
    </div>
  );
};

export default EditMenu;

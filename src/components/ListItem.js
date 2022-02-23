import React, { Fragment, useState, useEffect } from "react";
import classes from "./ListItem.module.css";

function ListItem(props) {
  const [comment, setComment] = useState(props.comment);
  const [saveShow, setSaveShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [waitShow, setWaitShow] = useState(false);
  const [btnName, setBtnName] = useState("");

  useEffect(() => {
    if (props.state === "standby") {
      setBtnName("待看");
    } else if (props.state === "save") {
      setBtnName("發財");
      setSaveShow(true);
    } else if (props.state === "wait") {
      setBtnName("待看");
      setWaitShow(true);
    }
  }, [props.state]);

  const saveHandler = () => {
    if (btnName === "發財") {
      setSaveShow(false);
      setDeleteShow(false);
      setWaitShow(true);
      setBtnName("待看");
      props.onSent("wait");
      props.onUpdate("wait");
    } else if (btnName === "待看") {
      setSaveShow(true);
      setDeleteShow(false);
      setWaitShow(false);
      setBtnName("發財");
      props.onSent("save");
      props.onUpdate("save");
    }
  };

  const deleteHandler = () => {
    setDeleteShow(true);
    setSaveShow(false);
    props.onSent("delete");
  };

  const returnHandler = () => {
    setDeleteShow(false);
    setSaveShow(false);
    props.onSent("standby");
    props.onUpdate("standby");
  };

  const commentHandler = () => {
    let data = { comment: comment };
    props.onSent(data);
  };
  const commentValueHandler = (event) => {
    const comment = event.target.value;
    setComment(comment);
  };

  let state = `${classes.listContent}`;

  if (saveShow) {
    state = `${classes.listContent} ${classes.active}`;
  } else if (deleteShow) {
    state = `${classes.listContent} ${classes.bad}`;
  } else if (waitShow) {
    state = `${classes.listContent} ${classes.wait}`;
  }
  return (
    <Fragment>
      <div className={state}>
        <p className={classes.id}>{props.id}</p>
        <p className={classes.title}>
          <a href={props.link} rel="noreferrer">
            {props.title}
          </a>
        </p>
        <p className={classes.pattern}>{props.pattern}</p>
        <p className={classes.floor}>
          {props.floor} <span className={classes.type}>{props.type}</span>
        </p>
        <p className={classes.distant}>{props.distant}</p>
        <p className={classes.price}>${props.price}</p>
        <textarea
          className={classes.state}
          placeholder="Comment"
          onBlur={commentHandler}
          value={comment}
          onChange={commentValueHandler}
        ></textarea>
        <div className={classes.btns}>
          <button className={classes.save} onClick={saveHandler}>
            {btnName}
          </button>
          <button className={classes.return} onClick={returnHandler}>
            待問
          </button>
          <button className={classes.delete} onClick={deleteHandler}>
            刪除
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default ListItem;

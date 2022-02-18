import React, { Fragment, useState, useEffect } from "react";
import classes from "./ListItem.module.css";

function ListItem(props) {
  const [comment, setComment] = useState(props.comment);
  const [saveShow, setSaveShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  useEffect(() => {
    if (props.state === "save") {
      setSaveShow(true);
    }
  }, [props.state]);

  const saveHandler = () => {
    let data = { state: "save" };
    setSaveShow(true);
    setDeleteShow(false);
    props.onSent(data);
  };
  const deleteHandler = () => {
    let data = { state: "delete" };
    setDeleteShow(true);
    setSaveShow(false);
    props.onSent(data);
  };
  const commentHandler = () => {
    let data = { comment: comment };
    props.onSent(data);
  };
  const commentValueHandler = (event) => {
    const comment = event.target.value;
    setComment(comment);
  };
  useEffect(() => {
    if (props.state === "save") {
      setSaveShow(true);
    }
  }, []);
  let state = `${classes.listContent}`;

  if (saveShow) {
    state = `${classes.listContent} ${classes.active}`;
  } else if (deleteShow) {
    state = `${classes.listContent} ${classes.bad}`;
  }
  return (
    <Fragment>
      <div className={state}>
        <h1>hi</h1>
        <p className={classes.id}>{props.id}</p>
        <p className={classes.title}>
          <a href={props.link} target="_blank">
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
            save
          </button>
          <button className={classes.delete} onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default ListItem;

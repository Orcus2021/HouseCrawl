import React, { useState } from "react";
import classes from "./Nav.module.css";
import { Link } from "react-router-dom";

const Nav = (props) => {
  const [menuShow, setMenuShow] = useState(false);
  const menuHandler = () => {
    setMenuShow((pre) => {
      return !pre;
    });
  };
  const logoutHandler = () => {
    props.onLogout();
  };
  let menuClasses = `${classes.nav_item} ${menuShow ? classes.menuActive : ""}`;

  return (
    <div className={classes.nav_contain}>
      <h1 className={classes.logo}>Dream</h1>
      <div className={classes.nav_items}>
        <ul className={menuClasses}>
          {props.token ? (
            <p className={classes.nav} onClick={logoutHandler}>
              LOGOUT
            </p>
          ) : (
            <Link to="/" className={classes.nav}>
              LOGIN
            </Link>
          )}

          <Link to="/list" className={classes.nav}>
            LIST
          </Link>
        </ul>
        <div className={classes.menu} onClick={menuHandler}>
          <p>—</p>
          <p>—</p>
          <p>—</p>
        </div>
      </div>
    </div>
  );
};

export default Nav;

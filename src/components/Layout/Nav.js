import React, { useState } from "react";
import classes from "./Nav.module.css";
import { Link, useNavigate } from "react-router-dom";

const Nav = (props) => {
  const navigate = useNavigate();
  const [menuShow, setMenuShow] = useState(false);
  const menuHandler = () => {
    setMenuShow((pre) => {
      return !pre;
    });
  };
  const logoutHandler = () => {
    props.onLogout();
    navigate("/");
    menuHandler();
  };
  let menuClasses = `${classes.nav_item} ${menuShow ? classes.menuActive : ""}`;

  return (
    <div className={classes.nav_contain}>
      <h1 className={classes.logo}>Dream</h1>
      <div className={classes.nav_items}>
        <ul className={menuClasses}>
          <Link to="/" className={classes.nav} onClick={menuHandler}>
            HOME
          </Link>
          {props.token ? (
            <p className={classes.nav} onClick={logoutHandler}>
              LOGOUT
            </p>
          ) : (
            <Link to="/login" className={classes.nav} onClick={menuHandler}>
              LOGIN
            </Link>
          )}

          <Link to="/list" className={classes.nav} onClick={menuHandler}>
            LIST
          </Link>
          <Link to="/houseInfo" className={classes.nav} onClick={menuHandler}>
            INFORMATION
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

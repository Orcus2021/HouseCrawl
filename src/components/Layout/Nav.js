import React, { useState, useEffect } from "react";
import classes from "./Nav.module.css";
import { useNavigate, useLocation, NavLink } from "react-router-dom";

let navBgClasses = "";
let logoName = process.env.REACT_APP_LOGO + "asset/Slice1.png";
const Nav = (props) => {
  const { onLogout, token, uid } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const [menuShow, setMenuShow] = useState(false);
  const [hamburgerShow, setHamburgerShow] = useState(false);
  const [scrollShow, setScrollShow] = useState(false);
  let houseInfoUrl = `/${uid}/houseInfo`;
  let houseUser = `/${uid}/api/user`;

  const screenWidth = () => {
    let width = window.innerWidth;
    if (width <= 550) {
      setHamburgerShow((pre) => {
        return (pre = true);
      });
    } else {
      setHamburgerShow((pre) => {
        return (pre = false);
      });
    }
  };
  const scrollScreen = () => {
    let lastScrollY = window.scrollY;
    if (lastScrollY > 0) {
      setScrollShow(true);
    } else {
      setScrollShow(false);
    }
  };
  // get screen width
  useEffect(() => {
    window.addEventListener("resize", screenWidth);
    screenWidth();

    return () => {
      window.removeEventListener("resize", screenWidth);
    };
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", scrollScreen);
    scrollScreen();
    return () => {
      window.removeEventListener("scroll", scrollScreen);
    };
  });

  if (location.pathname === "/") {
    navBgClasses = `${classes.nav_contain} ${classes.active}`;
  } else {
    if (scrollShow) {
      navBgClasses = `${classes.nav_contain} ${classes.scrollFixed}`;
    } else {
      navBgClasses = `${classes.nav_contain}`;
    }
  }
  const menuHandler = () => {
    if (hamburgerShow) {
      setMenuShow((pre) => {
        return !pre;
      });
    }
  };
  const logoutHandler = () => {
    onLogout();
    navigate("/");
    menuHandler();
  };
  const navHomeHandler = () => {
    navigate("/");
  };

  let menuClasses = `${classes.nav_item} ${menuShow ? classes.menuActive : ""}`;

  return (
    <div className={navBgClasses}>
      <h1 className={classes.logo} onClick={navHomeHandler}>
        <img src={logoName} alt="Logo" />
      </h1>
      <div className={classes.nav_items}>
        <ul className={menuClasses}>
          <NavLink
            to="/"
            data-text="HOME"
            className={(navState) =>
              navState.isActive ? classes.nav_1 : classes.nav
            }
            onClick={menuHandler}
          >
            HOME
          </NavLink>
          {token ? (
            <p className={classes.nav} onClick={logoutHandler}>
              LOGOUT
            </p>
          ) : (
            <NavLink
              to="/login"
              data-text="LOGIN"
              className={(navState) =>
                navState.isActive ? classes.nav_1 : classes.nav
              }
              onClick={menuHandler}
            >
              LOGIN
            </NavLink>
          )}
          {token && (
            <NavLink
              to="/list"
              data-text="LIST"
              className={(navState) =>
                navState.isActive ? classes.nav_1 : classes.nav
              }
              onClick={menuHandler}
            >
              LIST
            </NavLink>
          )}
          {token && (
            <NavLink
              to={houseInfoUrl}
              data-text="INFORMATION"
              className={(navState) =>
                navState.isActive ? classes.nav_1 : classes.nav
              }
              onClick={menuHandler}
            >
              INFORMATION
            </NavLink>
          )}

          {token && (
            <NavLink
              to={houseUser}
              className={(navState) =>
                navState.isActive ? classes.nav_1 : classes.nav
              }
              onClick={menuHandler}
            >
              <i className="ri-user-line"></i>
            </NavLink>
          )}
        </ul>
        {hamburgerShow && (
          <div className={classes.menu} onClick={menuHandler}>
            <p>—</p>
            <p>—</p>
            <p>—</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;

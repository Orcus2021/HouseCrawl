import React, { useState } from "react";
import classes from "./Home.module.css";
import { useNavigate } from "react-router";
let left = 0;
let top = 0;
const Home = () => {
  const navigate = useNavigate();
  const [showRipple, setShowRipple] = useState(false);

  const toListHandler = (e) => {
    let x = e.clientX - e.target.offsetLeft;
    let y = e.clientY - e.target.offsetTop;
    left = x + "px";
    top = y + "px";

    setShowRipple(true);
    setTimeout(() => {
      setShowRipple(false);
    }, 300);
    setTimeout(() => {
      navigate("/list");
    }, 400);
  };

  return (
    <div className={classes.homeContent}>
      <div className={classes.titleContent}>
        <h2 className={classes.title}> FIGHT </h2>
        <h2 className={classes.title2}>FOR YOUR LIFE</h2>
        <button className={classes.loginBtn} onClick={toListHandler}>
          GO
          {showRipple && (
            <span style={{ left: `${left}`, top: `${top}` }}></span>
          )}
        </button>
      </div>

      <div className={classes.imgBx}>
        <img src="./asset/pexels-math-21380.jpg" alt="background" />
        <div className={classes.back}></div>
      </div>
    </div>
  );
};

export default Home;

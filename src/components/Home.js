import React from "react";
import classes from "./Home.module.css";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const toListHandler = () => {
    navigate("/list");
  };
  return (
    <div className={classes.homeContent}>
      <div className={classes.titleContent}>
        <h2 className={classes.title}> FIGHT </h2>
        <h2 className={classes.title2}>FOR YOUR LIFE</h2>
        <button className={classes.loginBtn} onClick={toListHandler}>
          GO
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

import React from "react";
import classes from "./Home.module.css";
import img from "../asset/pexels-math-21380.jpg";
const Home = () => {
  return (
    <div className={classes.homeContent}>
      <h2 className={classes.title}> FIGHT </h2>
      <h2 className={classes.title2}>FOR YOUR LIFE</h2>

      <div className={classes.imgBx}>
        <img src={img} alt="background" />
      </div>
      <div className={classes.back}></div>
    </div>
  );
};

export default Home;

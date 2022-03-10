import React, { useState, useEffect } from "react";
import classes from "./Login.module.css";
import { useNavigate } from "react-router-dom";

import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

let isChecked = false;

const Login = (props) => {
  const { firebaseApp, onToken, onUserId } = props;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [checked, setChecked] = useState(false);

  const auth = getAuth(firebaseApp);

  let emailClass = emailValid ? "" : `${classes.wrong}`;
  let passwordClass = passwordValid ? "" : `${classes.wrong}`;

  useEffect(() => {
    let localEmail = localStorage.getItem("houseListEmail");
    let localChecked = localStorage.getItem("houseListChecked");

    if (localEmail) {
      setEmail(localEmail);
    }
    if (localChecked === "true") {
      setChecked(true);
    }
  }, []);
  // input Handler
  const emailHandler = (e) => {
    setEmail(e.target.value);
  };
  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };
  const emailValidHandler = () => {
    if (!email.includes("@")) {
      setEmailValid(false);
    } else {
      setEmailValid(true);
    }
  };
  const passwordValidHandler = () => {
    if (password.length < 6) {
      setPasswordValid(false);
    } else {
      setPasswordValid(true);
    }
  };

  // login Handler
  const loginHandler = () => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => signInWithEmailAndPassword(auth, email, password))
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        localStorage.setItem("houseListToken", `hrent${user.accessToken}`);
        localStorage.setItem("houseListChecked", "true");
        localStorage.setItem("houseUserID", user.uid);
        onToken(user.accessToken);
        onUserId(user.uid);
        navigate("/list");
        if (isChecked) {
          localStorage.setItem("houseListEmail", email);
        } else {
          localStorage.removeItem("houseListEmail");
          localStorage.removeItem("houseListChecked");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`code:${errorCode},message:${errorMessage}`);
        alert("帳號或密碼錯誤");
      });
  };

  const checkHandler = (e) => {
    isChecked = e.target.checked;
    setChecked(isChecked);
  };

  return (
    <div className={classes.container}>
      <h2>LOGIN</h2>
      <div className={classes.content}>
        <div className={classes.email}>
          <label htmlFor="email">Username</label>
          <input
            className={emailClass}
            id="email"
            type="text"
            value={email}
            onChange={emailHandler}
            onBlur={emailValidHandler}
          />
          {!emailValid && <p>Please input valid email.</p>}
        </div>
        <div className={classes.password}>
          <label htmlFor="password">Password</label>
          <input
            className={passwordClass}
            id="password"
            type="password"
            value={password}
            onChange={passwordHandler}
            onBlur={passwordValidHandler}
          />
          {!passwordValid && <p>Please input at least 6 letters.</p>}
        </div>
        <div className={classes.check}>
          <input type="checkbox" onChange={checkHandler} checked={checked} />
          <span>Remember Username</span>
        </div>

        <button onClick={loginHandler}>Login</button>
      </div>
    </div>
  );
};

export default Login;

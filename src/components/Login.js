import React, { useState, useEffect } from "react";
import classes from "./Login.module.css";
import { useNavigate } from "react-router-dom";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

let isChecked = false;

const Login = (props) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const auth = getAuth(props.firebaseApp);

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

  // const loginCount = async () => {
  //   const response = await fetch(url, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       email: email,
  //       password: password,
  //       returnSecureToken: true,
  //     }),
  //   });
  //   if (!response.ok) {
  //     let data = await response.json();

  //     throw new Error(data.error.message || "Register Fail");
  //   }

  //   const data = await response.json();
  //   return data;
  // };
  const emailHandler = (e) => {
    setEmail(e.target.value);
  };
  const passwordHandler = (e) => {
    setPassword(e.target.value);
  };
  const loginHandler = () => {
    // loginCount()
    //   .then((d) => {
    //     let token = d.idToken;
    //     localStorage.setItem("houseListToken", token);
    //     localStorage.setItem("houseListChecked", "true");
    //     props.onToken(token);
    //     navigate("/list");
    //     if (isChecked) {
    //       localStorage.setItem("houseListEmail", email);
    //     } else {
    //       localStorage.removeItem("houseListEmail");
    //       localStorage.removeItem("houseListChecked");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     localStorage.removeItem("houseListEmail");
    //   });

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem("houseListToken", user.accessToken);
        localStorage.setItem("houseListChecked", "true");
        props.onToken(user.accessToken);
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
      });
  };

  const checkHandler = (e) => {
    isChecked = e.target.checked;
    setChecked(isChecked);
  };

  return (
    <div className={classes.container}>
      <h1>LOGIN</h1>
      <div className={classes.content}>
        <div className={classes.email}>
          <label htmlFor="email">Username</label>
          <input id="email" type="text" value={email} onChange={emailHandler} />
        </div>
        <div className={classes.password}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={passwordHandler}
          />
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

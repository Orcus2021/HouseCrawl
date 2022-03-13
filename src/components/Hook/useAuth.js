import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, updateEmail, updatePassword } from "firebase/auth";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL:
    "https://crawl-e3835-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
};

const useAuth = () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const updateEmailHandler = (value) => {
    updateEmail(auth.currentUser, value)
      .then(() => {
        setMessage("Alter successfully");
      })
      .catch((error) => {
        setMessage(error || "Input invalid value.");
      });
  };
  const updatePasswordHandler = (value) => {
    console.log(value);
    updatePassword(auth.currentUser, value)
      .then(() => {
        setMessage("Alter successfully");
      })
      .catch((error) => {
        setMessage(error || "Input invalid value.");
        setError(true);
      });
  };
  return { message, error, updateEmailHandler, updatePasswordHandler };
};

export default useAuth;

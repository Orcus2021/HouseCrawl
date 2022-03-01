import React, { useState, useEffect, lazy, Suspense, useCallback } from "react";
import "./App.css";
import Login from "./components/Login";
import Nav from "./components/Layout/Nav";
import Home from "./components/Home";
import DetailCreate from "./components/detail/info/DetailCreate";
import { Routes, Route } from "react-router";
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

const HouseInfoList = lazy(() =>
  import("./components/detail/info/HouseInfoList")
);
const HouseList = lazy(() => import("./components/HouseList"));
const HouseDetail = lazy(() => import("./components/detail/info/HouseDetail"));

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

function App() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [token, setToken] = useState("");
  const [rentalData, setRentData] = useState([]);
  useEffect(() => {
    let localToken = localStorage.getItem("houseListToken");
    setToken(localToken);
  }, []);
  // get houseInfo
  const getInfoDataChange = useCallback(async () => {
    await onSnapshot(collection(db, "rentData"), (querySnapshot) => {
      let rentalArr = [];
      querySnapshot.forEach((doc) => {
        let docObj = doc.data();
        docObj.keyId = doc.id;
        rentalArr.push(docObj);
      });

      setRentData(rentalArr);
      rentalArr = [];
    });
  }, [onSnapshot, collection, db]);

  useEffect(() => {
    getInfoDataChange();
  }, [getInfoDataChange]);

  const tokenHandler = (d) => {
    setToken(d);
  };
  // logout handler
  const logoutHandler = () => {
    localStorage.removeItem("houseListToken");
    signOut(auth)
      .then(() => {
        console.log("logout");
      })
      .catch((error) => {
        console.log(error);
      });

    setToken("");
  };

  // processing firestore data

  const addCollectionData = async (data, url) => {
    let refUrl = url;

    let collRef = await collection(db, refUrl);
    await addDoc(collRef, data);
  };

  const updateFieldData = async (data, url) => {
    const ref = doc(db, url);

    await updateDoc(ref, data);
  };

  const deleteDocData = async (url) => {
    const ref = doc(db, url);
    await deleteDoc(ref);
  };

  // element onClick Handler
  const addHandler = (data, url) => {
    console.log("add");
    addCollectionData(data, url);
  };
  const updateHandler = (data, url) => {
    updateFieldData(data, url);
  };
  const deleteHandler = (url) => {
    deleteDocData(url);
  };

  return (
    <div className="app">
      <Nav onLogout={logoutHandler} token={token} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<Login onToken={tokenHandler} firebaseApp={app} />}
        />
        <Route
          path="/list"
          element={
            <Suspense fallback="Loading...">
              <HouseList token={token} firebaseApp={app} />
            </Suspense>
          }
        />
        <Route
          path="houseInfo"
          element={
            <Suspense fallback="Loading...">
              <HouseInfoList rentalData={rentalData} token={token} />
            </Suspense>
          }
        />
        <Route
          path="houseInfo/:id"
          element={
            <Suspense fallback="Loading...">
              <HouseDetail
                firebaseApp={app}
                onAdd={addHandler}
                onUpdate={updateHandler}
                onDelete={deleteHandler}
                token={token}
              />
            </Suspense>
          }
        />
        <Route
          path="houseInfo/create"
          element={<DetailCreate onAdd={addHandler} token={token} />}
        />
      </Routes>
    </div>
  );
}

export default App;

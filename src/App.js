import React, { useState, useEffect, lazy, Suspense } from "react";
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
  apiKey: "AIzaSyATHxfMJPgi6L2ca7OZmD21ZcrqLwcPgyo",
  authDomain: "crawl-e3835.firebaseapp.com",
  databaseURL:
    "https://crawl-e3835-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "crawl-e3835",
  storageBucket: "crawl-e3835.appspot.com",
  messagingSenderId: "1004800967247",
  appId: "1:1004800967247:web:eb1982820ade5255c3203a",
};

function App() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const [token, setToken] = useState("");
  const [rentalData, setRentData] = useState([]);

  useEffect(() => {
    getInfoDataChange();
  }, []);
  useEffect(() => {
    let localToken = localStorage.getItem("houseListToken");
    setToken(localToken);
  }, []);

  const tokenHandler = (d) => {
    setToken(d);
  };

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

  const getInfoDataChange = async () => {
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

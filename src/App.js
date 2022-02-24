import { useState, useEffect } from "react";
import "./App.css";
import HouseList from "./components/HouseList";
import Login from "./components/Login";
import Nav from "./components/Layout/Nav";
import HouseInfoList from "./components/detail/info/HouseInfoList";
import HouseDetail from "./components/detail/info/HouseDetail";
import DetailCreate from "./components/detail/info/DetailCreate";
import { Routes, Route, useNavigate } from "react-router";
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDocs,
  doc,
} from "firebase/firestore";

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
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [rentalData, setRentData] = useState([]);

  useEffect(() => {
    const localToken = localStorage.getItem("houseListToken");
    if (localToken) {
      setToken(localToken);

      navigate("/list");
    }
    getAllRentalData();
  }, [navigate]);

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

  const addRentalData = async (dataObj) => {
    const docRef = await addDoc(collection(db, "rentData"), dataObj);
    // console.log("Document written with ID: ", docRef.id);
    // await setDoc(doc(db, "rentData", "LA"), dataObj);
  };
  const getAllRentalData = async () => {
    const querySnapshot = await getDocs(collection(db, "rentData"));
    let rentalArr = [];
    querySnapshot.forEach((doc) => {
      let docObj = doc.data();
      docObj.keyId = doc.id;
      rentalArr.push(docObj);
    });
    console.log(rentalArr);
    setRentData(rentalArr);
  };
  const addHandler = (dataObj) => {
    addRentalData(dataObj);
  };

  return (
    <div className="app">
      <Nav onLogout={logoutHandler} token={token} />
      <Routes>
        <Route
          path="/"
          element={
            <Login onToken={tokenHandler} firebaseApp={app} token={token} />
          }
        />
        <Route
          path="/list"
          element={<HouseList token={token} firebaseApp={app} />}
        />
        <Route
          path="houseInfo"
          element={<HouseInfoList rentalData={rentalData} />}
        />
        <Route
          path="houseInfo/create"
          element={<DetailCreate onAdd={addHandler} />}
        />
      </Routes>
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import "./App.css";
import HouseList from "./components/HouseList";
import Login from "./components/Login";
import Nav from "./components/Layout/Nav";
import { Routes, Route, useNavigate } from "react-router";
import { initializeApp } from "firebase/app";

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
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  useEffect(() => {
    const localToken = localStorage.getItem("houseListToken");
    if (localToken) {
      setToken(localToken);
      navigate("/list");
    }
  }, []);
  const tokenHandler = (d) => {
    setToken(d);
  };
  const app = initializeApp(firebaseConfig);
  const logoutHandler = () => {
    localStorage.removeItem("houseListToken");
    setToken("");
  };

  return (
    <div className="app">
      <Nav onLogout={logoutHandler} token={token} />
      <Routes>
        <Route
          path="/"
          element={<Login onToken={tokenHandler} firebaseApp={app} />}
        />
        <Route
          path="/list"
          element={<HouseList token={token} firebaseApp={app} />}
        />
      </Routes>
    </div>
  );
}

export default App;

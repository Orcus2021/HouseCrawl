import { useState } from "react";
import "./App.css";
import HouseList from "./components/HouseList";
import Login from "./components/Login";
import Nav from "./components/Layout/Nav";
import { Routes, Route } from "react-router";

function App() {
  const [token, setToken] = useState();
  const tokenHandler = (d) => {
    setToken(d);
  };

  return (
    <div className="app">
      <Nav />
      <Routes>
        <Route path="/" element={<Login onToken={tokenHandler} />} />
        <Route path="/list" element={<HouseList token={token} />} />
      </Routes>
    </div>
  );
}

export default App;

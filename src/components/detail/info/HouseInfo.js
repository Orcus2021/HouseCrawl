import React from "react";

const HouseInfo = () => {
  return (
    <div className="container">
      <h1>House Information</h1>
      <div className="phoneContent">
        <div className="index">No.</div>
        <div className="name">name</div>
        <div className="address">
          <span>icon:</span>
          Address
        </div>
        <div className="rent">
          <h3>Rent</h3>
          <div className="rentDetail">
            <p>
              <span>icon</span>$3000
            </p>
            <p>
              <span>icon</span>2號
            </p>
          </div>
        </div>
        <div className="endDate">
          <p>2020-10-5</p>
        </div>

        <ul>
          <li>No.</li>
          <li>Name</li>
          <li>Address</li>
          <li>Rent</li>
          <li>Pay Date</li>
          <li>End Date</li>
          <li>Balance</li>
          <li>Comment</li>
          <li>Edit</li>
        </ul>
      </div>
    </div>
  );
};

export default HouseInfo;

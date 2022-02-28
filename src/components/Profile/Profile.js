import React from "react";
import "./Profile.css";

function Profile() {
  return (
    <div>
      <div className="container" style={{ justifyContent: "center" }}>
        <h1>Profile</h1>
      </div>
      <div className="container" style={{ justifyContent: "center" }}>
        {/* Balance */}
        <h1 className="balance">200</h1>
        <h3 className="ETH">ETH</h3>
      </div>
      <div className="container">
        {/* Deposit */}
        <div>
          <input placeholder="amount"></input>
          <button>Deposit</button>
        </div>
        {/* Withdraw */}
        <div>
          <input placeholder="amount"></input>
          <button>Withdraw</button>
        </div>
        {/* Withdraw All */}
        <div>
          <button>Withdraw All</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

import React from "react";
import "./Transfer.css";

function Transfer() {
  return (
    <div className="">
      <h1>Transfer</h1>
      <div className="container">
        <div>Send</div>
        <input placeholder="eth"></input>
        <div> to </div>
        <input placeholder="address"></input>
        <button>Send</button>
      </div>
    </div>
  );
}

export default Transfer;

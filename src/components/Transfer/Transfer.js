import React, { useState } from "react";
import "./Transfer.css";

function Transfer(props) {
  const { web3, Contract, from } = props;
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");

  const handleTransfer = () => {
    Contract.methods
      .transfer(web3.utils.toWei(amount, "ether"), to)
      .send({ from: from /*, gas: 3000000*/ });
  };

  const handleTransferInput = (event) => {
    setAmount(event.target.value);
  };

  const handleAddressInput = (event) => {
    setTo(event.target.value);
  };

  return (
    <div className="">
      <h1>Transfer</h1>
      <div className="container">
        <div>Send</div>
        <input
          type="number"
          placeholder="eth"
          onChange={(text) => handleTransferInput(text)}
        ></input>
        <div> to </div>
        <input
          placeholder="address"
          onChange={(text) => handleAddressInput(text)}
        ></input>
        <button onClick={() => handleTransfer()}>Send</button>
      </div>
    </div>
  );
}

export default Transfer;

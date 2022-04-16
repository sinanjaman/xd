import React, { useState } from "react";
import "./Transfer.css";

function Transfer(props) {
  const { web3, Bitirium, from } = props;
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");

  const handleTransfer = async () => {
    Bitirium.methods
      .transferETH(to, web3.utils.toWei(amount, "ether"))
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
          placeholder="ETH"
          onChange={(text) => handleTransferInput(text)}
        ></input>
        <div> to </div>
        <input
          placeholder="0x..."
          onChange={(text) => handleAddressInput(text)}
        ></input>
        <button onClick={() => handleTransfer()}>Send</button>
      </div>
    </div>
  );
}

export default Transfer;

import React, { useState } from "react";
import "./Swap.css";
import { BittAddress } from "../../Credentials";

function Swap(props) {
  const { web3, Bitirium, account, Bitt } = props;
  const [bitt, setBitt] = useState(0);
  const [balance, setBalance] = useState(0);

  const handleSwap = async () => {
    Bitirium.methods
      .getBITT(
        BittAddress,
        props.web3.utils.toWei((bitt / 1000).toString(), "ether")
      )
      .send({ from: account });

    await Bitt.once("Transfer", (error, result) => {
      if (!error) {
        console.log("BITT_Buy: ", result);
        handleBalance();
      }
    });
  };

  const handleBITTInput = (text) => {
    setBitt(text.target.value);
  };

  const handleBalance = () => {
    Bitt.methods
      .balanceOf(account)
      .call()
      .then((balance) => {
        const balanceEth = web3.utils.fromWei(balance, "ether");
        setBalance(balanceEth);
      });
  };

  return (
    <div>
      <h1>Buy BITT</h1>
      <h1>{balance} BITT</h1>
      <div className="container">
        <div>{bitt / 1000} ETH</div>
        <div>for</div>
        <input
          type="number"
          placeholder="BITT"
          onChange={(text) => handleBITTInput(text)}
        />
        <button onClick={() => handleSwap()}>Swap</button>
      </div>
    </div>
  );
}

export default Swap;

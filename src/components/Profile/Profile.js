import React, { useState } from "react";
import "./Profile.css";

function Profile(props) {
  const { web3, Bitirium, account, balance, setBalance } = props;
  const [deposit, setDeposit] = useState("");
  const [withdraw, setWithdraw] = useState("");

  Bitirium.events.Transfer(
    { filter: account, fromBlock: "latest" },
    (error, result) => {
      if (!error) {
        if (
          result.returnValues[0] === account ||
          result.returnValues[1] === account
        ) {
          console.log("Transfer: ", result);
          handleBalance();
          return;
        }
      }
    }
  );

  const handleDeposit = async () => {
    Bitirium.methods.deposit().send({
      from: props.account,
      value: web3.utils.toWei(deposit, "ether"),
    });

    await Bitirium.once("Deposit", (error, result) => {
      if (!error) {
        console.log("Deposit: ", result);
        handleBalance();
      }
    });
  };

  const handleWithdraw = async () => {
    Bitirium.methods
      .withdraw(props.web3.utils.toWei(withdraw, "ether"))
      .send({ from: account });

    await Bitirium.once("Withdraw", (error, result) => {
      if (!error) {
        console.log("Withdraw: ", result);
        handleBalance();
      }
    });
  };

  const handleWithdrawAll = async () => {
    Bitirium.methods.withdrawAll().send({ from: account /* gas: 3000000 */ });

    await Bitirium.once("Withdraw", (error, result) => {
      if (!error) {
        console.log("Withdraw: ", result);
        handleBalance();
      }
    });
  };

  const handleBalance = () => {
    Bitirium.methods
      .getBalance(account)
      .call()
      .then((balance) => {
        const balanceEth = web3.utils.fromWei(balance, "ether");
        setBalance(balanceEth);
      });
  };

  const handleDepositInput = (text) => {
    setDeposit(text.target.value);
  };

  const handleWithdrawInput = (text) => {
    setWithdraw(text.target.value);
  };

  return (
    <div>
      <div className="container" style={{ justifyContent: "center" }}>
        <h1>Profile</h1>
        <button onClick={() => handleBalance()}>refresh</button>
      </div>
      <div className="container" style={{ justifyContent: "center" }}>
        <h1 className="balance">{balance}</h1>
        {balance !== "..." && <h3 className="ETH">ETH</h3>}
      </div>
      {/* Balance */}
      <div className="container">
        {/* Deposit */}
        <div>
          <input
            type="number"
            onChange={(text) => {
              handleDepositInput(text);
            }}
            placeholder="ETH"
          ></input>
          <button onClick={() => handleDeposit()}>Deposit</button>
        </div>
        {/* Withdraw */}
        <div>
          <input
            type="number"
            onChange={(text) => {
              handleWithdrawInput(text);
            }}
            placeholder="ETH"
          ></input>
          <button onClick={() => handleWithdraw()}>Withdraw</button>
        </div>
        {/* Withdraw All */}
        <div>
          <button onClick={() => handleWithdrawAll()}>Withdraw All</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;

import React, { useState } from "react";
import "./Profile.css";

function Profile(props) {
  const { web3, Contract, account } = props;
  const [balance, setBalance] = useState("...");
  const [deposit, setDeposit] = useState("");
  const [withdraw, setWithdraw] = useState("");

  const handleDeposit = () => {
    Contract.methods.Deposit().send({
      from: props.account,
      value: web3.utils.toWei(deposit, "ether"),
    });
  };

  const handleWithdraw = () => {
    Contract.methods
      .Withdraw(props.web3.utils.toWei(withdraw, "ether"))
      .send({ from: account });
  };

  const handleWithdrawAll = () => {
    Contract.methods
      .WithdrawAll()
      .send({ from: account /* gas: 3000000 */ });
  };

  const handleBalance = () => {
    Contract.methods
      .GetBalance(account)
      .call()
      .then((balance) => {
        const balanceEth = web3.utils.fromWei(balance, "ether");
        setBalance(balanceEth);
      });
  };

  const handleDepositInput = (event) => {
    setDeposit(event.target.value);
  };

  const handleWithdrawInput = (event) => {
    setWithdraw(event.target.value);
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
            onChange={(event) => {
              handleDepositInput(event);
            }}
            placeholder="amount"
          ></input>
          <button onClick={() => handleDeposit()}>Deposit</button>
        </div>
        {/* Withdraw */}
        <div>
          <input
            onChange={(event) => {
              handleWithdrawInput(event);
            }}
            placeholder="amount"
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

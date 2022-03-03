import React, { useState } from "react";
import "./App.css";
import Web3 from "web3";
import localhost from "./localhost";
import { ContractABI } from "./ABI";
import Header from "./components/Header/Header";
import Profile from "./components/Profile/Profile";
import Transfer from "./components/Transfer/Transfer";

function App() {
  const web3 = new Web3(Web3.givenProvider || `http://${localhost}:7545`);
  const [account, setAccount] = useState(null);
  const Contract = new web3.eth.Contract(
    ContractABI,
    "0x34117ABFFd5D03a8aaB18ECAae48Baaa3fD41fb0"
  );

  return (
    <div className="App">
      <Header
        web3={web3}
        setAccount={(account) => setAccount(account)}
        account={account}
      />
      <Profile web3={web3} Contract={Contract} account={account} />
      <Transfer />
    </div>
  );
}

export default App;

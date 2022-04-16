import React, { useState } from "react";
import "./App.css";
import Web3 from "web3";
import localhost from "./localhost";
import { BitiriumABI, BittABI, BitiriumAddress, BittAddress } from "./Credentials";
import Header from "./components/Header/Header";
import Profile from "./components/Profile/Profile";
import Transfer from "./components/Transfer/Transfer";
import Swap from "./components/Swap/Swap";

function App() {
  const web3 = new Web3(Web3.givenProvider || `http://${localhost}:7545`);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("...");
  const Bitirium = new web3.eth.Contract(BitiriumABI, BitiriumAddress);
  const Bitt = new web3.eth.Contract(BittABI, BittAddress);

  return (
    <div className="App">
      <Header
        web3={web3}
        setAccount={(account) => setAccount(account)}
        account={account}
      />
      <Profile
        web3={web3}
        Bitirium={Bitirium}
        account={account}
        setBalance={(balance) => setBalance(balance)}
        balance={balance}
        Bitt={Bitt}
      />
      <Transfer
        web3={web3}
        Bitirium={Bitirium}
        from={account}
        setBalance={setBalance}
      />
      <Swap
        web3={web3}
        Bitirium={Bitirium}
        account={account}
        setBalance={(balance) => setBalance(balance)}
        Bitt={Bitt}
      />
    </div>
  );
}

export default App;

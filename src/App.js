import React, { useState } from "react";
import "./App.css";
import Web3 from "web3";
import localhost from "./localhost";
import Header from "./components/Header/Header";
import Profile from "./components/Profile/Profile";
import Transfer from "./components/Transfer/Transfer";

function App() {
  const web3 = new Web3(Web3.givenProvider || `http://${localhost}:7545`);
  const [account, setAccount] = useState(null);

  return (
    <div className="App">
      <Header
        web3={web3}
        setAccount={(account) => setAccount(account)}
        account={account}
      />
      <Profile />
      <Transfer />
    </div>
  );
}

export default App;

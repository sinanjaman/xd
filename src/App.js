import React, { useState } from "react";
import "./App.css";
import Web3 from "web3";
import localhost from "./localhost";
import { ContractABI } from "./ABI";
import Header from "./components/Header/Header";
import Profile from "./components/Profile/Profile";
import Transfer from "./components/Transfer/Transfer";
import Swap from "./components/Swap/Swap";

function App() {
  const web3 = new Web3(Web3.givenProvider || `http://${localhost}:7545`);
  const [account, setAccount] = useState(null);
  const Contract = new web3.eth.Contract(
    ContractABI,
    "0x4DBE89607CAB8273f381E49d9dA429B557982A57"
  );

  return (
    <div className="App">
      <Header
        web3={web3}
        setAccount={(account) => setAccount(account)}
        account={account}
      />
      <Profile web3={web3} Contract={Contract} account={account} />
      <Transfer web3={web3} Contract={Contract} from={account} />
      <Swap />
    </div>
  );
}

export default App;

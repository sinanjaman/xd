import { useState } from "react";
import Web3 from "web3";
import {
  BitiriumABI,
  RiumABI,
  BitiriumAddress,
  RiumAddress,
  localhost,
} from "./Credentials";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Transfer from "./components/Transfer";
import Swap from "./components/Swap";
import Admin from "./components/Admin";

function App() {
  const web3 = new Web3(Web3.givenProvider || `http://${localhost}:7545`);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("");
  const [admin, setAdmin] = useState(false);
  const Bitirium = new web3.eth.Contract(BitiriumABI, BitiriumAddress);
  const Rium = new web3.eth.Contract(RiumABI, RiumAddress);

  return (
    <div className="min-h-screen h-full bg-secondary">
      <Header
        web3={web3}
        Bitirium={Bitirium}
        setAccount={(account) => setAccount(account)}
        setAdmin={(admin) => setAdmin(admin)}
        account={account}
        admin={admin}
      />
      <div className="grid md:grid-cols-10">
        <div className="md:col-start-2 md:col-end-10">
          <Profile
            web3={web3}
            Bitirium={Bitirium}
            account={account}
            setBalance={(balance) => setBalance(balance)}
            balance={balance}
            Rium={Rium}
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
            Rium={Rium}
          />
          {admin && <Admin Bitirium={Bitirium} account={account} web3={web3} />}
        </div>
      </div>
    </div>
  );
}

export default App;

import { useState } from "react";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { BitiriumAddress, RiumAddress, localhost } from "./Credentials";
// import BitiriumJSON from "../build/contracts/Bitirium.json";
// import RiumJSON from "../build/contracts/RIUM.json";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Transfer from "./components/Transfer";
import Swap from "./components/Rium";
import Admin from "./components/Admin";
const BitiriumJSON = require("../build/contracts/Bitirium.json");
const RiumJSON = require("../build/contracts/RIUM.json");

function App() {
  const web3 = new Web3(Web3.givenProvider || `http://${localhost}:7545`);
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [balance, setBalance] = useState<string>("");
  const [admin, setAdmin] = useState<boolean>(false);
  const Bitirium = new web3.eth.Contract(BitiriumJSON.abi as AbiItem, BitiriumAddress);
  const Rium = new web3.eth.Contract(RiumJSON.abi as AbiItem, RiumAddress);

  return (
    <div className="min-h-screen h-full bg-secondary">
      <Header
        web3={web3}
        Bitirium={Bitirium}
        setAccount={(account: string) => setAccount(account)}
        setAdmin={(admin: boolean) => setAdmin(admin)}
        account={account}
        admin={admin}
      />
      <div className="grid md:grid-cols-10">
        <div className="md:col-start-2 md:col-end-10">
          <Profile
            web3={web3}
            Bitirium={Bitirium}
            account={account}
            setBalance={(balance: string) => setBalance(balance)}
            balance={balance}
          />
          <Transfer web3={web3} Bitirium={Bitirium} from={account} />
          <Swap web3={web3} Bitirium={Bitirium} account={account} Rium={Rium} />
          {admin && <Admin Bitirium={Bitirium} account={account} />}
        </div>
      </div>
    </div>
  );
}

export default App;

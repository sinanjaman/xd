import { ChangeEvent, useState } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { RiumAddress } from "../Credentials";

type RiumProps = {
  web3: Web3;
  Bitirium: Contract;
  account?: string;
  Rium: Contract;
};

function Rium(props: RiumProps) {
  const { web3, Bitirium, account, Rium } = props;
  const [rium, setRium] = useState<string>("");

  const emptyCheck = (input: string) => {
    if (input === "" || input === "0") return false;
    return true;
  };

  const handleBuy = async () => {
    Bitirium.methods
      .buyRium(
        RiumAddress,
        web3.utils.toWei((rium && parseFloat(rium) / 100).toString(), "ether")
      )
      .send({ from: account });

    await Rium.once("Transfer", (error, result) => {
      setRium("");
    });
  };

  const handleSell = async () => {
    Bitirium.methods
      .sellRium(
        RiumAddress,
        web3.utils.toWei((rium && parseFloat(rium) / 100).toString(), "ether")
      )
      .send({ from: account });

    await Rium.once("Transfer", (error, result) => {
      setRium("");
    });
  };

  const handleRIUMInput = (event: ChangeEvent<HTMLInputElement>) => {
    setRium(event.target.value);
  };

  return (
    <div className="p-4 m-4 bg-gray-100 rounded-2xl">
      <div className="grid grid-rows-3 gap-2">
        <h1 className="text-3xl font-bold text-main">Buy & Sell RIUM</h1>
        <div className="grid grid-cols-2 gap-4">
          <input
            className=""
            min={0}
            type="number"
            placeholder="RIUM"
            onChange={(text) => handleRIUMInput(text)}
            value={rium}
          />
          <div className="text-center self-center text-secondary">
            {parseFloat(rium) / 100} ETH
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            className=""
            onClick={() => emptyCheck(rium) && handleBuy()}
            disabled={parseFloat(rium) / 100 == NaN}
          >
            Buy RIUM
          </button>
          <button
            className=" bg-secondary border-secondary"
            onClick={() => emptyCheck(rium) && handleSell()}
            disabled={parseFloat(rium) / 100 == NaN}
          >
            Sell RIUM
          </button>
        </div>
      </div>
    </div>
  );
}

export default Rium;

import { useState } from "react";
import { RiumAddress } from "../Credentials";

function Swap(props) {
  const { web3, Bitirium, account, Rium } = props;
  const [rium, setRium] = useState("");

  const emptyCheck = (input) => {
    if (input === "" || input === "0") return false;
    return true;
  };

  const handleBuy = async () => {
    Bitirium.methods
      .buyRium(RiumAddress, web3.utils.toWei((rium / 100).toString(), "ether"))
      .send({ from: account });

    await Rium.once("Transfer", (error, result) => {
      if (!error) {
        console.log("RIUM_Buy: ", result);
      }
      setRium("");
    });
  };

  const handleSell = async () => {
    Bitirium.methods
      .sellRium(RiumAddress, web3.utils.toWei((rium / 100).toString(), "ether"))
      .send({ from: account });

    await Rium.once("Transfer", (error, result) => {
      if (!error) {
        console.log("RIUM_Sell: ", result);
      }
      setRium("");
    });
  };

  const handleRIUMInput = (text) => {
    setRium(text.target.value);
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
            {rium / 100} ETH
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button className="" onClick={() => emptyCheck(rium) && handleBuy()}>
            Buy RIUM
          </button>
          <button
            className=" bg-secondary border-secondary"
            onClick={() => emptyCheck(rium) && handleSell()}
          >
            Sell RIUM
          </button>
        </div>
      </div>
    </div>
  );
}

export default Swap;

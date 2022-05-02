import { useState } from "react";

function Transfer(props) {
  const { web3, Bitirium, from } = props;
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");

  const handleTransfer = async () => {
    Bitirium.methods
      .transferETH(to, web3.utils.toWei(amount, "ether"))
      .send({ from: from /*, gas: 3000000*/ });
  };

  const handleTransferInput = (event) => {
    setAmount(event.target.value);
  };

  const handleAddressInput = (event) => {
    setTo(event.target.value);
  };

  return (
    <div className="p-4 m-4 bg-gray-100 rounded-2xl shadow-md">
      <div className="grid grid-rows-4 gap-2">
        <h1 className="text-3xl font-bold text-main">Transfer</h1>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center self-center">Send</div>
          <div className="col-span-3">
            <input
              className="shadow-md w-full"
              min={0}
              type="number"
              placeholder="ETH"
              onChange={(text) => handleTransferInput(text)}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center self-center col-span-1">to</div>
          <div className="col-span-3">
            <input
              className="shadow-md w-full"
              placeholder="0x..."
              onChange={(text) => handleAddressInput(text)}
            />
          </div>
        </div>
        <button
          className="shadow-md"
          onClick={() => amount !== "" && amount !== "0" && handleTransfer()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Transfer;

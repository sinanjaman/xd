import React, { ChangeEvent, useState } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

interface TransferProps {
  web3: Web3;
  Bitirium: Contract;
  from?: string;
}

const Transfer: React.FC<TransferProps> = (props) => {
  const { web3, Bitirium, from } = props;
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");

  const emptyCheck = (input: string) => {
    if (input === "" || input === "0") return false;
    return true;
  };

  const handleTransfer = async () => {
    await Bitirium.methods
      .transferEthereum(to, web3.utils.toWei(amount, "ether"))
      .send({ from: from });
    setAmount("");
    setTo("");
  };

  const handleTransferInput = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleAddressInput = (event: ChangeEvent<HTMLInputElement>) => {
    setTo(event.target.value);
  };

  return (
    <div className="p-4 m-4 bg-gray-100 rounded-2xl">
      <div className="grid grid-rows-4 gap-2 md:grid-rows-2">
        <h1 className="text-3xl font-bold text-main">Transfer</h1>
        <div className="row-span-3 grid grid-rows-3 gap-2 md:grid-rows-1 md:row-span-1 md:grid-cols-9 md:gap-4">
          <div className="grid grid-cols-4 gap-4 md:col-span-4">
            <div className="text-center self-center text-lg text-secondary">
              SEND
            </div>
            <div className="col-span-3">
              <input
                className="w-full"
                min={0}
                type="number"
                placeholder="ETH"
                onChange={(text) => handleTransferInput(text)}
                value={amount}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 md:col-span-4">
            <div className="text-center self-center text-lg text-secondary">
              TO
            </div>
            <div className="col-span-3">
              <input
                className="w-full"
                placeholder="0x..."
                onChange={(text) => handleAddressInput(text)}
                value={to}
              />
            </div>
          </div>
          <button
            className=""
            onClick={() => emptyCheck(amount) && handleTransfer()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transfer;

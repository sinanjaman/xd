import { useState, useEffect, ChangeEvent } from "react";
import Web3 from "web3";
import { Contract, EventData } from "web3-eth-contract";

interface ProfileProps {
  web3: Web3;
  Bitirium: Contract;
  account?: string;
  balance: string;
  setBalance: (balanceAsBigNumber: string) => void;
}

const Profile: React.FC<ProfileProps> = (props) => {
  const { web3, Bitirium, account, balance, setBalance } = props;
  const [deposit, setDeposit] = useState("");
  const [withdraw, setWithdraw] = useState("");

  Bitirium.events.Transfer(
    { filter: account, fromBlock: "latest" },
    (error: Error, result: EventData) => {
      if (!error) {
        if (
          result.returnValues[0] === account ||
          result.returnValues[1] === account
        ) {
          handleBalance();
          return;
        }
      }
    }
  );

  const emptyCheck = (input: string) => {
    if (input === "" || input === "0") return false;
    return true;
  };

  const handleDeposit = async () => {
    Bitirium.methods.deposit().send({
      from: account,
      value: web3.utils.toWei(deposit, "ether"),
    });

    await Bitirium.once("Deposit", (error, result) => {
      if (!error) {
        handleBalance();
        setDeposit("");
      }
    });
  };

  const handleWithdraw = async () => {
    Bitirium.methods
      .withdraw(web3.utils.toWei(withdraw, "ether"))
      .send({ from: account });

    await Bitirium.once("Withdraw", (error, result) => {
      if (!error) {
        handleBalance();
        setWithdraw("");
      }
    });
  };

  const handleWithdrawAll = async () => {
    Bitirium.methods.withdrawAll().send({ from: account });

    await Bitirium.once("Withdraw", (error, result) => {
      if (!error) {
        handleBalance();
      }
    });
  };

  const handleBalance = () => {
    Bitirium.methods
      .getBalance(account)
      .call()
      .then((balance: string) => {
        const balanceEth = web3.utils.fromWei(balance, "ether");
        setBalance(balanceEth);
      });
  };

  const handleDepositInput = (text: ChangeEvent<HTMLInputElement>) => {
    setDeposit(text.target.value);
  };

  const handleWithdrawInput = (text: ChangeEvent<HTMLInputElement>) => {
    setWithdraw(text.target.value);
  };

  useEffect(() => {
    account && handleBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <div className="p-4 m-4 bg-gray-100 rounded-2xl">
      <div className="grid grid-rows-4 gap-2 md:grid-rows-2">
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-3xl font-bold text-main">Profile</h1>
          <div className="flex items-center mx-2 gap-1">
            <h1 className="text-3xl font-bold text-secondary">{balance}</h1>
            {balance !== "" && (
              <h3 className="text-xl font-bold text-secondary self-end">ETH</h3>
            )}
          </div>
        </div>
        <div className="row-span-3 grid grid-rows-3 md:grid-rows-1 md:row-span-1 gap-2 md:grid-cols-3 md:gap-8">
          <div className="grid grid-cols-2 gap-4">
            <input
              min={0}
              type="number"
              onChange={(text) => {
                handleDepositInput(text);
              }}
              value={deposit}
              placeholder="ETH"
            />
            <button
              className=""
              onClick={() => emptyCheck(deposit) && handleDeposit()}
            >
              Deposit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              min={0}
              type="number"
              onChange={(text) => {
                handleWithdrawInput(text);
              }}
              value={withdraw}
              placeholder="ETH"
            />
            <button onClick={() => emptyCheck(withdraw) && handleWithdraw()}>
              Withdraw
            </button>
          </div>
          <button
            className="md:w-full md:mx-auto"
            onClick={() => emptyCheck(balance) && handleWithdrawAll()}
          >
            Withdraw All
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

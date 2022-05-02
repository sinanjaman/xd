import { useState, useEffect } from "react";

function Profile(props) {
  const { web3, Bitirium, account, balance, setBalance } = props;
  const [deposit, setDeposit] = useState("");
  const [withdraw, setWithdraw] = useState("");

  Bitirium.events.Transfer(
    { filter: account, fromBlock: "latest" },
    (error, result) => {
      if (!error) {
        if (
          result.returnValues[0] === account ||
          result.returnValues[1] === account
        ) {
          console.log("Transfer: ", result);
          handleBalance();
          return;
        }
      }
    }
  );

  const handleDeposit = async () => {
    Bitirium.methods.deposit().send({
      from: props.account,
      value: web3.utils.toWei(deposit, "ether"),
    });

    await Bitirium.once("Deposit", (error, result) => {
      if (!error) {
        console.log("Deposit: ", result);
        handleBalance();
      }
    });
  };

  const handleWithdraw = async () => {
    Bitirium.methods
      .withdraw(props.web3.utils.toWei(withdraw, "ether"))
      .send({ from: account });

    await Bitirium.once("Withdraw", (error, result) => {
      if (!error) {
        console.log("Withdraw: ", result);
        handleBalance();
      }
    });
  };

  const handleWithdrawAll = async () => {
    Bitirium.methods.withdrawAll().send({ from: account /* gas: 3000000 */ });

    await Bitirium.once("Withdraw", (error, result) => {
      if (!error) {
        console.log("Withdraw: ", result);
        handleBalance();
      }
    });
  };

  const handleBalance = () => {
    Bitirium.methods
      .getBalance(account)
      .call()
      .then((balance) => {
        const balanceEth = web3.utils.fromWei(balance, "ether");
        setBalance(balanceEth);
      });
  };

  const handleDepositInput = (text) => {
    setDeposit(text.target.value);
  };

  const handleWithdrawInput = (text) => {
    setWithdraw(text.target.value);
  };

  useEffect(() => {
    account && handleBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <div className="p-4 m-4 bg-gray-100 rounded-2xl shadow-md">
      <div className="grid grid-rows-4 gap-2">
        <div className="flex flex-row items-center gap-2">
          <h1 className="text-3xl font-bold text-main">Profile</h1>
          <div className="flex items-center mx-2 gap-1">
            <h1 className="text-3xl font-bold text-secondary">{balance}</h1>
            {balance !== "..." && (
              <h3 className="text-xl font-bold text-secondary self-end">ETH</h3>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            className="shadow-md"
            min={0}
            type="number"
            onChange={(text) => {
              handleDepositInput(text);
            }}
            placeholder="ETH"
          />
          <button
            className="shadow-md"
            onClick={() => deposit !== "" && deposit !== "0" && handleDeposit()}
          >
            Deposit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            className="shadow-md"
            min={0}
            type="number"
            onChange={(text) => {
              handleWithdrawInput(text);
            }}
            placeholder="ETH"
          />
          <button
            className="shadow-md"
            onClick={() =>
              withdraw !== "" && withdraw !== "0" && handleWithdraw()
            }
          >
            Withdraw
          </button>
        </div>
        <button className="shadow-md" onClick={() => handleWithdrawAll()}>
          Withdraw All
        </button>
      </div>
    </div>
  );
}

export default Profile;

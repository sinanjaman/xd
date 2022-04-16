import React, { useEffect } from "react";
import "./Header.css";

function Header(props) {
  const { web3, account, setAccount } = props;

  useEffect(() => {
    const { web3, setAccount } = props;
    const getAccount = async () =>
      await web3.eth.getAccounts((e, accounts) => {
        setAccount(accounts[0]);
      });

    getAccount();
  });

  const handleConnect = async () => {
    await web3.eth.requestAccounts().then((accounts) => {
      setAccount(accounts[0]);
    });
  };

  const printAccount = () => {
    const accountPrint = account
      .slice(0, 6)
      .concat("...")
      .concat(account.slice(-4, 42));

    return <div>{accountPrint}</div>;
  };

  return (
    <div className="container">
      <div className="logo">BITIRIUM</div>
      <div>
        {account ? (
          printAccount()
        ) : (
          <button onClick={() => handleConnect()}>Connect Metamask</button>
        )}
      </div>
    </div>
  );
}

export default Header;

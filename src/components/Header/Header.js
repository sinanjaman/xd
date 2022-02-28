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

  return (
    <div className="container">
      {/* Logo */}
      <div className="logo">PROJE</div>
      <div>
        {account ? (
          // Address
          <div
            className="address no-btn"
          >
            {account}
          </div>
        ) : (
          // Connect Metamask Button
          <button
            onClick={async () =>
              await web3.eth.requestAccounts().then((accounts) => {
                setAccount(accounts[0]);
              })
            }
          >
            Connect Metamask
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;

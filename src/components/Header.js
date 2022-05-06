import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Header(props) {
  const { web3, account, setAccount } = props;
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const { web3, setAccount, Bitirium } = props;
    const getAccount = async () =>
      await web3.eth.getAccounts((e, accounts) => {
        setAccount(accounts[0]);
        accounts[0] &&
          Bitirium.methods
            .isAdmin(accounts[0])
            .call()
            .then((admin) => {
              setAdmin(admin);
            });
      });
    getAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="w-screen bg-main rounded-b-md">
      <div className="p-2 mx-4 flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          <Link to="/" className="bitirium-logo">
            BITIRIUM
          </Link>
        </h1>
        <div className="text-bold text-white">
          {account ? (
            <div className="flex flex-row items-center gap-2 sm:gap-4">
              {admin ? (
                <button className="bg-secondary text-white font-light border-none px-1 py-0 xs:px-4 xs:py-1">
                  Admin
                </button>
              ) : (
                <></>
              )}
              <div className="text-md md:text-lg">{printAccount()}</div>
            </div>
          ) : (
            <button
              className="bg-secondary text-white font-light border-none"
              onClick={() => handleConnect()}
            >
              Connect Metamask
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;

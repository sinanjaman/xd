import { useEffect } from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

interface HeaderProps {
  web3: Web3;
  account?: string;
  setAccount: (account: string) => void;
  admin: boolean;
  setAdmin: (isAdmin: boolean) => void;
  Bitirium: Contract;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { web3, account, setAccount, admin, setAdmin, Bitirium } = props;

  useEffect(() => {
    const { web3, setAccount } = props;

    const getAccount = async () =>
      await web3.eth.getAccounts((error: Error, accounts: string[]) => {
        setAccount(accounts[0]);
        accounts[0] && checkUser(accounts[0]);
        accounts[0] && checkAdmin(accounts[0]);
      });

    getAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  (window as any).ethereum.on("accountsChanged", function () {
    window.location.reload();
  });

  const handleConnect = async () => {
    await web3.eth.requestAccounts().then((accounts: string[]) => {
      setAccount(accounts[0]);
      checkUser(accounts[0]);
      checkAdmin(accounts[0]);
    });
  };

  const checkUser = (account: string) => {
    Bitirium.methods
      .isUser(account)
      .call()
      .then(async (user: boolean) => {
        !user &&
          (await Bitirium.methods.createUser().send({
            from: account,
            // value: web3.utils.toWei("2", "ether"),
          }));
      });
  };

  const checkAdmin = (account: string) => {
    Bitirium.methods
      .isAdmin(account)
      .call()
      .then((admin: boolean) => {
        setAdmin(admin);
      });
  };

  const printAccount = () => {
    let accountPrint = "";
    if (account) {
      accountPrint = account
        .slice(0, 6)
        .concat("...")
        .concat(account.slice(-4, 42));
    }

    return <div>{accountPrint}</div>;
  };

  return (
    <div className="w-full bg-main rounded-b-md">
      <div className="grid grid-cols-10">
        <div className="p-2 mx-8 flex justify-between items-center col-span-10 col-start-1 md:col-start-2 md:col-end-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            BITIRIUM
          </h1>
          <div className="text-bold text-white">
            {account ? (
              <div className="flex flex-row items-center gap-2 sm:gap-4">
                {admin ? (
                  <div className="bg-secondary text-white py-1 px-4 rounded-md text-md md:text-lg">
                    {printAccount()}
                  </div>
                ) : (
                  <div className="text-white text-md md:text-lg">
                    {printAccount()}
                  </div>
                )}
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
    </div>
  );
};

export default Header;

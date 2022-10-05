import { useState, useEffect, ChangeEvent } from "react";
import Table from "./Table";
import { Contract, EventData } from "web3-eth-contract";

type AdminProps = {
  Bitirium: Contract;
  account?: string;
};

function Admin(props: AdminProps) {
  const { Bitirium, account } = props;
  const [address, setAddress] = useState("");
  const [events, setEvents] = useState<Array<EventData>>([]);

  const emptyCheck = (input: string) => {
    if (input === "" || input === "0") return false;
    return true;
  };

  const getEvents = () => {
    Bitirium.getPastEvents("allEvents", {
      fromBlock: "earliest",
      toBlock: "latest",
    }).then((events: Array<EventData>) => {
      setEvents(events.reverse());
    });
  };

  Bitirium.events.allEvents({ fromBlock: "earliest" }, () => {
    getEvents();
  });

  useEffect(() => {
    getEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdministrate = async () => {
    await Bitirium.methods.administrateUser(address).send({ from: account });
    setAddress("");
  };

  const handleDelete = async () => {
    await Bitirium.methods.deleteUser(address).send({ from: account });
    setAddress("");
  };

  const handleAddressInput = (text: ChangeEvent<HTMLInputElement>) => {
    setAddress(text.target.value);
  };

  return (
    <div className="p-4 m-4 bg-gray-100 rounded-2xl">
      <div className="grid grid-rows-9 gap-2">
        <div className="flex">
          <h1 className="text-3xl font-bold text-secondary">./</h1>
          <h1 className="text-3xl font-bold text-main">Admin</h1>
        </div>
        <div className="grid grid-rows-2 gap-2 row-span-2">
          <input
            className="w-full"
            placeholder="0x..."
            value={address}
            onChange={(text) => {
              handleAddressInput(text);
            }}
          />
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => emptyCheck(address) && handleAdministrate()}>
              Administrate User
            </button>
            <button
              className="bg-secondary border-secondary"
              onClick={() => emptyCheck(address) && handleDelete()}
            >
              Delete User
            </button>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-main mt-2">Transactions</h1>
        <div className="row-span-6 bg-white p-4 rounded-xl shadow-lg">
          <Table events={events} />
        </div>
      </div>
    </div>
  );
}

export default Admin;

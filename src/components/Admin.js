import { useState } from "react";

function Admin(props) {
  const { Bitirium, account } = props;
  const [address, setAddress] = useState("");

  const handleAdministrate = async () => {
    await Bitirium.methods.makeAdmin(address).send({ from: account });
  };

  const handleDelete = async () => {
    await Bitirium.methods.deleteUser(address).send({ from: account });
  };

  const handleAddressInput = (event) => {
    setAddress(event.target.value);
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
            <button onClick={() => handleAdministrate()}>
              Administrate User
            </button>
            <button
              className="bg-secondary border-secondary"
              onClick={() => handleDelete()}
            >
              Delete User
            </button>
          </div>
        </div>
        <div className="row-span-6 bg-white p-4 rounded-xl shadow-lg">
          {/* <table className="w-full">
            <th className="text-secondary text-2xl">Transactions</th>
            <tr>Deposit</tr>
            <tr>Transfer</tr>
            <tr>Deposit</tr>
            <tr>Withdraw</tr>
            <tr>Transfer</tr>
            <tr>Deposit</tr>
            <tr>Withdraw</tr>
            <tr>Transfer</tr>
            <tr>Deposit</tr>
          </table> */}
        </div>
      </div>
    </div>
  );
}

export default Admin;

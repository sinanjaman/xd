import Web3 from "web3";
import useWindowDimensions from "../hooks/windowHook";

const zeroAddress = "0x0000000000000000000000000000000000000000";

function Table(props) {
  const { events } = props;
  const { width } = useWindowDimensions();

  const printAddress = (address, digits = 4) => {
    const addressToPrint = address
      .slice(0, digits + 2)
      .concat("...")
      .concat(address.slice(-1 * digits, 42));

    return <div>{addressToPrint}</div>;
  };

  const displayEvents = events.map((event) => {
    if (event.event === "Deposit" || event.event === "Withdraw") {
      return (
        <div
          className="bg-gray-100 rounded-lg my-1 p-2 shadow-sm"
          key={event.id}
        >
          <div className="grid grid-cols-10">
            <div className="font-bold col-span-2 md:col-span-1">
              {event.event}
            </div>
            <div className="col-span-6 md:col-span-8">
              {width <= 768
                ? printAddress(event.returnValues.user)
                : event.returnValues.user}
            </div>
            <div className="font-bold col-span-2 md:col-span-1">
              {Web3.utils.fromWei(event.returnValues.amount)}
            </div>
          </div>
        </div>
      );
    } else if (event.event === "Transfer") {
      if (event.returnValues.to === zeroAddress)
        return (
          <div
            className="bg-gray-100 rounded-lg my-1 p-2 shadow-sm"
            key={event.id}
          >
            <div className="grid grid-cols-10">
              <div className="font-bold col-span-2 md:col-span-1">Buy</div>
              <div className="col-span-6 md:col-span-8 ">
                {width <= 768
                  ? printAddress(event.returnValues.from)
                  : event.returnValues.from}
              </div>
              <div className="font-bold col-span-2 md:col-span-1">
                {Web3.utils.fromWei(event.returnValues.amount)}
              </div>
            </div>
          </div>
        );
      else if (event.returnValues.from === zeroAddress)
        return (
          <div
            className="bg-gray-100 rounded-lg my-1 p-2 shadow-sm"
            key={event.id}
          >
            <div className="grid grid-cols-10">
              <div className="font-bold col-span-2 md:col-span-1">Sell</div>
              <div className="col-span-6 md:col-span-8">
                {width <= 768
                  ? printAddress(event.returnValues.to)
                  : event.returnValues.to}
              </div>
              <div className="font-bold col-span-2 md:col-span-1">
                {Web3.utils.fromWei(event.returnValues.amount)}
              </div>
            </div>
          </div>
        );
      else
        return (
          <div
            className="bg-gray-100 rounded-lg my-1 p-2 shadow-sm"
            key={event.id}
          >
            <div className="grid grid-cols-10">
              <div className="font-bold col-span-2 md:col-span-1">
                {event.event}
              </div>
              <div className="col-span-3 md:col-span-4">
                {width <= 768
                  ? printAddress(event.returnValues.from, 1)
                  : width <= 1368
                  ? printAddress(event.returnValues.from, 6)
                  : event.returnValues.from}
              </div>
              <div className="col-span-3 md:col-span-4">
                {width <= 768
                  ? printAddress(event.returnValues.to, 1)
                  : width <= 1368
                  ? printAddress(event.returnValues.to, 6)
                  : event.returnValues.to}
              </div>
              <div className="font-bold col-span-2 md:col-span-1">
                {Web3.utils.fromWei(event.returnValues.amount)}
              </div>
            </div>
          </div>
        );
    }
    return <></>;
  });

  return (
    <div className="text-center">
      <div className="grid grid-cols-10 text-secondary font-bold p-2 pt-0">
        <div className="text-lg col-span-2 md:col-span-1">Type</div>
        <div className="text-lg col-span-6 md:col-span-8">Address</div>
        <div className="text-lg col-span-2 md:col-span-1">Amount</div>
      </div>
      <div className="">
        {events.length === 0 ? "No transactions yet." : displayEvents}
      </div>
    </div>
  );
}

export default Table;

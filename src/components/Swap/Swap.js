import React, { useState } from "react";
import "./Swap.css";

function Swap(props) {
  const [tkn, setTKN] = useState(0);

  const handleSwap = () => {};

  const handleTKNInput = (text) => {
    setTKN(text.target.value);
  };

  return (
    <div>
      <h1>Buy TKN</h1>
      <div className="container">
        <div>{tkn / 1000} ETH</div>
        <div>for</div>
        <input
          type="number"
          placeholder="0"
          onChange={(text) => handleTKNInput(text)}
        />
        <button onClick={() => handleSwap()}>Swap</button>
      </div>
    </div>
  );
}

export default Swap;

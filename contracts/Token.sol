// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

interface ERC20 {
    function balanceOf(address _owner) external view returns (uint256 balance);
    function transfer(address _to, uint256 _value)  external returns (bool success);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
}

contract MyToken is ERC20 {
    mapping (address => uint256) public balances;
    uint256 public maxSupply;

    address private owner = 0x0000000000000000000000000000000000000000;
    string public name;
    uint8 public decimals;
    string public symbol;

    constructor() {
        name = "Token";
        symbol = "TKN";
        decimals = 18;
        maxSupply = 1000000000000000000000000000;
        balances[owner] = maxSupply;
    }

    function transfer(address _to, uint256 _value) public override returns (bool success) {
        require(balances[msg.sender] >= _value, "token balance is lower than the value requested");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function balanceOf(address _user) public override view returns (uint256 balance) {
        return balances[_user];
    }

    function burn(uint256 _burnAmount) public returns (bool success) {
        if (balances[owner] > _burnAmount) {
            balances[owner] -= _burnAmount;
            maxSupply -= _burnAmount;
            return true;
        }
        return false;
    }
}
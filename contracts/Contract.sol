// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Contract {
    mapping (address => uint256) balances;

    // Get Users Balance
    function GetBalance(address user) public view returns(uint256) {
        return balances[user];
    }

    // Deposit
    function Deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // Withdraw
    function Withdraw() public {

    }

    // Withdraw All
    function WithdrawAll() public {
        payable(msg.sender).transfer(balances[msg.sender]);
        balances[msg.sender] = 0;
    }
}
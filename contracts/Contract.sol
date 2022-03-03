// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Contract {
    mapping(address => uint256) balances;

    // Get User Balance
    function GetBalance(address user) public view returns (uint256) {
        return balances[user];
    }

    // Deposit
    function Deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // Withdraw
    function Withdraw(uint256 amount) public {
        payable(msg.sender).transfer(amount);
        balances[msg.sender] -= amount;
    }

    // Withdraw All
    function WithdrawAll() public {
        payable(msg.sender).transfer(balances[msg.sender]);
        balances[msg.sender] = 0;
    }

    // Transfer
    function Transfer() public {}
}

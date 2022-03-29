// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Contract {
    mapping(address => uint256) balances;
    mapping(address => bool) admins;
    mapping(address => bool) users;

    
    modifier onlyAdmin() {
        require(admins[msg.sender], "Only admins can make this happen.");
        _;
    }
    
    function makeAdmin(address _user) public onlyAdmin {
        admins[_user] = true;
    }

    function deleteUser(address _user) public onlyAdmin {
        users[_user] = false;
    }

    // function giveUserETH(address _user, uint256 _amount) public {
    //     require(_amount <= this.balance, "Too much ETH.");
    //     _user.transfer(_amount);
    // }

    function getBalance(address _user) public view returns (uint256) {
        return balances[_user];
    }

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount) public {
        payable(msg.sender).transfer(_amount);
        balances[msg.sender] -= _amount;
    }

    function withdrawAll() public {
        payable(msg.sender).transfer(balances[msg.sender]);
        balances[msg.sender] = 0;
    }

    function transfer(uint256 _amount, address _to) public {
        require(balances[msg.sender] >= _amount, "Not enough ETH.");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }
}

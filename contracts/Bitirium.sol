// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

import "./RIUM.sol";

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        uint256 c = a - b;
        return c;
    }
}

contract Bitirium {
    struct User {
        uint256 balance;
        bool isAdmin;
        bool isUser;
    }

    mapping(address => User) users;

    event Deposit(address user, uint256 amount);
    event Withdraw(address user, uint256 amount);
    event Transfer(address from, address to, uint256 amount);

    using SafeMath for uint256;

    constructor() {
        address sinan = 0x40EC82dfd76f17Ca42c8744AB9aA70787fA97234;
        users[sinan].isAdmin = users[sinan].isUser = true;
    }

    modifier onlyAdmin() {
        _onlyAdmin();
        _;
    }

    modifier onlyUser() {
        _onlyUser();
        _;
    }

    function _onlyAdmin() public view {
        require(users[msg.sender].isAdmin, "Only admins can make this happen.");
    }

    function _onlyUser() public view {
        require(users[msg.sender].isUser, "Only users can make this happen.");
    }

    function createUser() public {
        users[msg.sender].isUser = true;
    }

    function makeAdmin(address _user) public onlyAdmin {
        users[_user].isAdmin = true;
    }

    function deleteUser(address _user) public onlyAdmin {
        require(!users[_user].isAdmin, "Admins can't be deleted.");
        users[_user] = User(0, false, false);
    }

    function isUser(address _user) public view returns (bool) {
        return users[_user].isUser;
    }

    function isAdmin(address _user) public view returns (bool) {
        return users[_user].isAdmin;
    }

    function getBalance(address _user) public view returns (uint256) {
        return users[_user].balance;
    }

    function deposit() public payable onlyUser {
        users[msg.sender].balance = users[msg.sender].balance.add(msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) public onlyUser {
        require(
            users[msg.sender].balance >= _amount,
            "Are you trying to rob me?"
        );
        users[msg.sender].balance = users[msg.sender].balance.sub(_amount);
        payable(msg.sender).transfer(_amount);
        emit Withdraw(msg.sender, _amount);
    }

    function withdrawAll() public onlyUser {
        uint256 _balance = users[msg.sender].balance;
        payable(msg.sender).transfer(users[msg.sender].balance);
        users[msg.sender].balance = 0;
        emit Withdraw(msg.sender, _balance);
    }

    function transferETH(address _to, uint256 _amount) public onlyUser {
        require(users[msg.sender].balance >= _amount, "Not enough ETH.");
        users[msg.sender].balance = users[msg.sender].balance.sub(_amount);
        users[_to].balance = users[_to].balance.add(_amount);
        emit Transfer(msg.sender, _to, _amount);
    }

    function buyRIUM(RIUM _rium, uint256 _amount) public onlyUser {
        users[msg.sender].balance = users[msg.sender].balance.sub(_amount);
        _rium.buy(msg.sender, _amount);
        emit Transfer(msg.sender, address(0), _amount);
    }

    function sellRIUM(RIUM _rium, uint256 _amount) public onlyUser {
        _rium.sell(msg.sender, _amount);
        users[msg.sender].balance = users[msg.sender].balance.add(_amount);
        emit Transfer(address(0), msg.sender, _amount);
    }
}

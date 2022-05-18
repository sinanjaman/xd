// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.11;

import "./Bitirium.sol";

interface ERC20 {
    function balanceOf(address _owner) external view returns (uint256 balance);

    function transfer(address _to, uint256 _value)
        external
        returns (bool success);

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool success);

    function approve(address _spender, uint256 _value)
        external
        returns (bool success);

    function allowance(address _owner, address _spender)
        external
        view
        returns (uint256 remaining);

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
}

contract RIUM is ERC20 {
    uint256 private constant MAX_UINT256 = 2**256 - 1;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowed;
    uint256 public totalSupply;

    address private owner = 0x64450e634547D82b3AFed1B0e8fB79033Da09306;
    string public name;
    uint8 public decimals;
    string public symbol;

    using SafeMath for uint256;

    constructor() {
        name = "Bitirium";
        symbol = "RIUM";
        decimals = 18;
        totalSupply = 1000000000000000000000000000;
        balances[owner] = totalSupply;
        emit Transfer(address(0), owner, totalSupply);
        approve(0x2045654D66198E35821Dd1ABAA598d1d9c4FFAB9, totalSupply);
    }

    function balanceOf(address _user)
        public
        view
        override
        returns (uint256 balance)
    {
        return balances[_user];
    }

    function transfer(address _to, uint256 _value)
        public
        override
        returns (bool success)
    {
        require(
            balances[msg.sender] >= _value,
            "token balance is lower than the value requested"
        );
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public override returns (bool success) {
        uint256 _allowance = allowed[_from][msg.sender];
        require(
            balances[_from] >= _value && _allowance >= _value,
            "token balance or allowance is lower than amount requested"
        );
        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        if (_allowance < MAX_UINT256) {
            allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
        }
        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        override
        returns (bool success)
    {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender)
        public
        view
        override
        returns (uint256 remaining)
    {
        return allowed[_owner][_spender];
    }

    function buy(address _account, uint256 _amount) public {
        uint256 _rium = _amount * 100;
        balances[owner] = balances[owner].sub(_rium);
        balances[_account] = balances[_account].add(_rium);
        emit Transfer(address(0), _account, _rium);
    }

    function sell(address _account, uint256 _amount) public {
        uint256 _rium = _amount * 100;
        balances[_account] = balances[_account].sub(_rium);
        balances[owner] = balances[owner].add(_rium);
        emit Transfer(_account, address(0), _rium);
    }
}

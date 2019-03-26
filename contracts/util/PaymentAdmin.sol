pragma solidity >=0.4.21 <0.6.0;

import "../token/ERC20Basic.sol";

contract PaymentAdmin {
    address public owner = msg.sender;

    function () external payable {
        owner.transfer(msg.value);
    }

    function retriveTokens (ERC20Basic token, address receiver) public {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(receiver, balance);
    }
}

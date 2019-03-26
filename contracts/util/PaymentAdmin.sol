pragma solidity >=0.4.21 <0.6.0;

contract PaymentAdmin {
    address public owner = msg.sender;

    function () external payable {
        owner.transfer(msg.value);
    }
}

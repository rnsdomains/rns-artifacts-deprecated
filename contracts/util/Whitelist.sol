pragma solidity >=0.4.21 <0.6.0;

contract Whitelist {
	address public owner;

	mapping (address => bool) public isManager;

	modifier isOwner () {
		require(msg.sender == owner);
		_;
	}

	constructor () public {
		owner = msg.sender;
	}

	function addManager (address manager) public isOwner() {
		isManager[manager] = true;
	}
}

pragma solidity >=0.4.21 <0.6.0;

contract Whitelist {
	address public owner;

	mapping (address => bool) public isManager;
	mapping (address => bool) public isWhitelisted;

	modifier onlyOwner () {
		require(msg.sender == owner);
		_;
	}

	modifier onlyManagers () {
		require(isManager[msg.sender]);
		_;
	}

	constructor () public {
		owner = msg.sender;
	}

	function addManager (address manager) public onlyOwner() {
		isManager[manager] = true;
	}

	function removeManager (address manager) public onlyOwner() {
		isManager[manager] = false;
	}

	function addWhitelisted (address whitelisted) public onlyManagers() {
		isWhitelisted[whitelisted] = true;
	}

	function removeWhitelisted (address whitelisted) public onlyManagers() {
		isWhitelisted[whitelisted] = false;
	}
}

pragma solidity >=0.4.21 <0.6.0;

contract Whitelist {
	address public owner;

	constructor () public {
		owner = msg.sender;
	}
}

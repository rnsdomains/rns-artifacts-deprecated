pragma solidity >=0.4.21 <0.6.0;

contract AbstractWhitelist {
	function isWhitelisted (address whitelisted) public view returns (bool);
	function removeWhitelisted (address whitelisted) public;
}

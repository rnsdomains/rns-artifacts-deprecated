pragma solidity >=0.4.21 <0.6.0;

contract AbstractResolver {
    function supportsInterface(bytes4 interfaceID) public pure returns (bool);
}

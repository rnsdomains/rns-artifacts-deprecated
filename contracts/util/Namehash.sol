pragma solidity ^0.5.2;

import "./Strings.sol";

contract Namehash {
    using Strings for *;

    event I(uint);

    function hash (string memory name) public pure returns (bytes32) {
        bytes32 node = 0x0000000000000000000000000000000000000000000000000000000000000000;

        if (bytes(name).length == 0) {
            return node;
        }

        Strings.slice memory s = name.toSlice();
        Strings.slice memory delim = ".".toSlice();
        string[] memory parts = new string[](s.count(delim) + 1);

        uint i;

        for(i = 0; i < parts.length; i++) {
            parts[i] = s.split(delim).toString();
        }

        for(i = 0; i < parts.length; i++) {
            string memory part = parts[parts.length - i - 1];
            bytes32 label = keccak256(bytes(part));
            node = keccak256(abi.encodePacked(node, label));
        }

        return node;
    }
}
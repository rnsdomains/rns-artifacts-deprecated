pragma solidity >=0.4.21 <0.6.0;

contract AddressHelper {
    function addressToString (address data) public pure returns (string memory) {
        bytes memory s = new bytes(42);
        s[0] = "0";
        s[1] = "x";
        for (uint i = 0; i < 20; i++) {
            byte b = byte(uint8(uint(data) / (2**(8*(19 - i)))));
            byte hi = byte(uint8(b) / 16);
            byte lo = byte(uint8(b) - 16 * uint8(hi));
            s[2*i + 2] = char(hi);
            s[2*i + 3] = char(lo);
        }
        return string(s);
    }

    function char (byte b) internal pure returns (byte c) {
        if (b < 10) return byte(uint8(b) + 0x30);
        else return byte(uint8(b) + 0x57);
    }

    // source: https://github.com/riflabs/RIF-Token/blob/master/contracts/util/AddressHelper.sol
    function stringToAddress(string memory s) public pure returns(address) {
        bytes memory ss = bytes(s);

        // it should have 40 or 42 characters
        if (ss.length != 40 && ss.length != 42) revert();

        uint r = 0;
        uint offset = 0;

        if (ss.length == 42) {
            offset = 2;

            if (ss[0] != byte('0')) revert();
            if (ss[1] != byte('x') && ss[1] != byte('X')) revert();
        }

        uint i;
        uint x;
        uint v;

        // loads first 32 bytes from array,
        // skipping array length (32 bytes to skip)
        // offset == 0x20
        assembly { v := mload(add(0x20, ss)) }

        // converts the first 32 bytes, adding to result
        for (i = offset; i < 32; ++i) {
            assembly { x := byte(i, v) }
            r = r * 16 + fromHexChar(x);
        }

        // loads second 32 bytes from array,
        // skipping array length (32 bytes to skip)
        // and first 32 bytes
        // offset == 0x40
        assembly { v := mload(add(0x40, ss)) }

        // converts the last 8 bytes, adding to result
        for (i = 0; i < 8 + offset; ++i) {
            assembly { x := byte(i, v) }
            r = r * 16 + fromHexChar(x);
        }

        return address(r);
    }

    function fromHexChar(uint c) public pure returns (uint) {
        if (c >= uint(byte('0')) && c <= uint(byte('9'))) {
            return c - uint(byte('0'));
        }

        if (c >= uint(byte('a')) && c <= uint(byte('f'))) {
            return 10 + c - uint(byte('a'));
        }

        if (c >= uint(byte('A')) && c <= uint(byte('F'))) {
            return 10 + c - uint(byte('A'));
        }

        // Reaching this point means the ordinal is not for a hex char.
        revert();
    }
}
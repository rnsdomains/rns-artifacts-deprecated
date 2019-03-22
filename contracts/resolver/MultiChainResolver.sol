pragma solidity >=0.4.21 <0.6.0;

import "../registry/AbstractRNS.sol";
import "./AbstractPublicResolver.sol";
import "./AbstractAddrResolver.sol";

contract MultiChainResolver is AbstractAddrResolver {
    AbstractRNS rns;
    AbstractPublicResolver publicResolver;

    mapping (bytes32 => address) addresses;
    mapping (bytes32 => bytes32) contents;

    bytes4 constant ADDR_SIGN = 0x3b3b57de;
    bytes4 constant CONTENT_SIGN = 0x2dff6941;

    event ContentChanged (bytes32 node, bytes32 content);

    modifier onlyOwner (bytes32 node) {
        require(rns.owner(node) == msg.sender);
        _;
    }

    constructor (AbstractRNS _rns, AbstractPublicResolver _publicResolver) public {
        rns = _rns;
        publicResolver = _publicResolver;
    }

    function () external {
        revert();
    }

    function supportsInterface (bytes4 interfaceId) public pure returns (bool) {
        return ((interfaceId == ADDR_SIGN) || (interfaceId == CONTENT_SIGN));
    }

    function addr (bytes32 node) public view returns (address) {
        address _addr = addresses[node];

        if (_addr != address(0)) {
            return _addr;
        }

        return publicResolver.addr(node);
    }

    function setAddr (bytes32 node, address addrValue) public onlyOwner(node) {
        addresses[node] = addrValue;
        emit AddrChanged(node, addrValue);
    }

    function content (bytes32 node) public view returns (bytes32) {
        bytes32 _content = contents[node];

        if (_content != 0) {
            return _content;
        }

        return publicResolver.content(node);
    }

    function setContent (bytes32 node, bytes32 contentValue) public onlyOwner(node) {
        contents[node] = contentValue;
        emit ContentChanged(node, contentValue);
    }
    function chainAddr(bytes32 node, bytes4 chain) view returns (string) {
        address _addr = addr(node);

        return addrToString(_addr);
    }

    function addrToString(address data) internal pure returns (string) {
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

    function char(byte b) internal pure returns (byte c) {
        if (b < 10) return byte(uint8(b) + 0x30);
        else return byte(uint8(b) + 0x57);
    }
}

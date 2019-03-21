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

    function setContent (bytes32 node, bytes32 contentValue) public {
        contents[node] = contentValue;
        emit ContentChanged(node, contentValue);
    }
}

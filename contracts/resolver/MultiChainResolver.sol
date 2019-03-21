pragma solidity >=0.4.21 <0.6.0;

import "./AbstractPublicResolver.sol";

contract MultiChainResolver {
    AbstractPublicResolver publicResolver;

    mapping (bytes32 => address) addresses;
    mapping (bytes32 => bytes32) contents;

    constructor (AbstractPublicResolver _publicResolver) public {
        publicResolver = _publicResolver;
    }

    function addr (bytes32 node) public view returns (address) {
        address _addr = addresses[node];

        if (_addr != address(0)) {
            return _addr;
        }

        return publicResolver.addr(node);
    }

    function setAddr (bytes32 node, address addrValue) public {
        addresses[node] = addrValue;
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
    }
}

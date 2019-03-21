pragma solidity >=0.4.21 <0.6.0;

import "./AbstractPublicResolver.sol";

contract MultiChainResolver {
    AbstractPublicResolver publicResolver;

    mapping (bytes32 => address) addresses;

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
        return publicResolver.content(node);
    }
}

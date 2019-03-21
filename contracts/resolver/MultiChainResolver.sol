pragma solidity >=0.4.21 <0.6.0;

import "./AbstractPublicResolver.sol";

contract MultiChainResolver {
    AbstractPublicResolver publicResolver;

    constructor (AbstractPublicResolver _publicResolver) public {
        publicResolver = _publicResolver;
    }

    function addr (bytes32 node) public view returns (address) {
        return publicResolver.addr(node);
    }

    function content (bytes32 node) public view returns (bytes32) {
        return publicResolver.content(node);
    }
}

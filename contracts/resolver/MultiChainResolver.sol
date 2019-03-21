pragma solidity >=0.4.21 <0.6.0;

import "./AbstractAddrResolver.sol";

contract MultiChainResolver {
    AbstractAddrResolver publicResolver;

    constructor (AbstractAddrResolver _publicResolver) public {
        publicResolver = _publicResolver;
    }

    function addr(bytes32 node) public view returns (address) {
        return publicResolver.addr(node);
    }
}

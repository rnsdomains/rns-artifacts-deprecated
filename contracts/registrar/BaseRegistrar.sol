pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/introspection/ERC165.sol";
import "../registry/AbstractRNS.sol";

contract BaseRegistrar is Ownable, ERC165 {
    AbstractRNS public rns;
    bytes32 public rootNode;

    bytes4 constant BASE_REGISTRAR_INTERFACE_ID = 0x657efd4f; // this.setRootResolver.selector ^ this.setRootTTL.selector

    constructor (AbstractRNS _rns, bytes32 _rootNode) public Ownable() {
        rns = _rns;
        rootNode = _rootNode;

        _registerInterface(BASE_REGISTRAR_INTERFACE_ID);
    }

    function setRootResolver (address resolver) public onlyOwner {
        rns.setResolver(rootNode, resolver);
    }

    function setRootTTL (uint64 ttl) public onlyOwner {
        rns.setTTL(rootNode, ttl);
    }
}

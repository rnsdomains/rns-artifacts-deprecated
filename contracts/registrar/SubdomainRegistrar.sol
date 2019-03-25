pragma solidity >=0.4.21 <0.6.0;

import "../registry/AbstractRNS.sol";

contract SubdomainRegistrar {
  AbstractRNS public rns;
  bytes32 public rootNode;

  constructor (AbstractRNS _rns, bytes32 _rootNode) public {
    rns = _rns;
    rootNode = _rootNode;
  }
}

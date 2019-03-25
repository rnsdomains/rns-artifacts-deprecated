pragma solidity >=0.4.21 <0.6.0;

import "../registry/AbstractRNS.sol";

contract SubdomainRegistrar {
  AbstractRNS public rns;
  bytes32 public rootNode;

  constructor (AbstractRNS _rns, bytes32 _rootNode) public {
    rns = _rns;
    rootNode = _rootNode;
  }

  function register (bytes32 label) public {
    bytes32 node = keccak256(abi.encodePacked(rootNode, label));
    require(rns.owner(node) == address(0));

    rns.setSubnodeOwner(rootNode, label, msg.sender);
  }
}

pragma solidity ^0.5.2;

import "../registry/AbstractRNS.sol";

contract SubdomainRegistrar {
  AbstractRNS public rns;
  bytes32 public rootNode;
  address owner;

  modifier onlyOwner () {
    require(msg.sender == owner);
    _;
  }

  constructor (AbstractRNS _rns, bytes32 _rootNode) public {
    rns = _rns;
    rootNode = _rootNode;
    owner = msg.sender;
  }

  function register (bytes32 label) public {
    bytes32 node = keccak256(abi.encodePacked(rootNode, label));
    require(rns.owner(node) == address(0));

    rns.setSubnodeOwner(rootNode, label, msg.sender);
  }

  function transferBack () public onlyOwner() {
    rns.setOwner(rootNode, owner);
  }
}

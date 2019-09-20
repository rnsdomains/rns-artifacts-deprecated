pragma solidity ^0.5.2;

import "../registry/AbstractRNS.sol";
import "./BaseRegistrar.sol";

/**
 * @title SubdomainRegistrar
 * Allows anyone to create subnodes under a given and owned RNS node.
 */
contract SubdomainRegistrar is BaseRegistrar {
  /**
   * @dev Constructor
   * @param _rns AbstractRNS RNS registry address
   * @param _rootNode An owned node. The contract emits subnodes under this node.
   */
  constructor (AbstractRNS _rns, bytes32 _rootNode) public BaseRegistrar(_rns, _rootNode) {
  }

  /**
   * @dev Registers a new subnode under the root node. The new node owner is the sender
   * @param label bytes32 The label of the new subnode.
   */
  function register (bytes32 label) public {
    bytes32 node = keccak256(abi.encodePacked(rootNode, label));
    require(rns.owner(node) == address(0));

    rns.setSubnodeOwner(rootNode, label, msg.sender);
  }

  /**
   * @dev Transfers back the root node ownership to the contract's owner.
   */
  function transferBack () public onlyOwner() {
    rns.setOwner(rootNode, owner());
  }
}

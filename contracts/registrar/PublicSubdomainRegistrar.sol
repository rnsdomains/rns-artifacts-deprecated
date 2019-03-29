pragma solidity ^0.5.2;

import "../registry/AbstractRNS.sol";

contract PublicSubdomainRegistrar {
    AbstractRNS public rns;

    mapping (bytes32 => address) delegated;

    modifier onlyOwned (bytes32 node) {
        require(rns.owner(node) == address(this));
        _;
    }

    modifier onlyPreviousOwner (bytes32 node) {
        require(msg.sender == delegated[node]);
        _;
    }

    constructor (AbstractRNS _rns) public {
        rns = _rns;
    }

    function delegate (bytes32 node) public onlyOwned(node) {
        delegated[node] = msg.sender;
    }

    function isDelegated (bytes32 node) public view returns (bool) {
        return delegated[node] != address(0);
    }

    function transferBack (bytes32 node) public onlyPreviousOwner(node) {
        rns.setOwner(node, delegated[node]);
        delegated[node] = address(0);
    }

    function register (bytes32 node, bytes32 label) public {
        address subnodeOwner = rns.owner(keccak256(abi.encodePacked(node, label)));
        require(subnodeOwner == address(0));

        rns.setSubnodeOwner(node, label, msg.sender);
    }
}

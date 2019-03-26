pragma solidity >=0.4.21 <0.6.0;

import "../registry/AbstractRNS.sol";

contract PublicSubdomainRegistrar {
    AbstractRNS public rns;

    mapping (bytes32 => bool) delegated;

    modifier onlyOwned (bytes32 node) {
        require(rns.owner(node) == address(this));
        _;
    }

    constructor (AbstractRNS _rns) public {
        rns = _rns;
    }

    function delegate (bytes32 node) public onlyOwned(node) {
        delegated[node] = true;
    }

    function isDelegated (bytes32 node) public view returns(bool) {
        return delegated[node];
    }
}

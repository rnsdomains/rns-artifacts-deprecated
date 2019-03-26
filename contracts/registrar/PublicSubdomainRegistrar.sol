pragma solidity >=0.4.21 <0.6.0;

import "../registry/AbstractRNS.sol";

contract PublicSubdomainRegistrar {
    AbstractRNS public rns;

    constructor (AbstractRNS _rns) public {
        rns = _rns;
    }
}
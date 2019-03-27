pragma solidity >=0.4.21 <0.6.0;

import "../registry/AbstractRNS.sol";
import "../util/PaymentAdmin.sol";

contract PriceSubdomainRegistrar {
    PaymentAdmin public admin = new PaymentAdmin();
    AbstractRNS public rns;

    constructor (AbstractRNS _rns) public {
        rns = _rns;
    }
}

pragma solidity >=0.4.21 <0.6.0;

import "../registry/AbstractRNS.sol";
import "../util/PaymentAdmin.sol";
import "../util/AbstractWhitelist.sol";

contract PriceSubdomainRegistrar {
    PaymentAdmin public admin = new PaymentAdmin();
    AbstractRNS public rns;
    AbstractWhitelist public whitelist;

    constructor (AbstractRNS _rns, AbstractWhitelist _whitelist) public {
        rns = _rns;
        whitelist = _whitelist;
    }
}

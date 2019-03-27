pragma solidity >=0.4.21 <0.6.0;

import "../registry/AbstractRNS.sol";
import "../util/PaymentAdmin.sol";
import "../util/AbstractWhitelist.sol";

contract PriceSubdomainRegistrar {
    PaymentAdmin public admin = new PaymentAdmin();
    AbstractRNS public rns;
    AbstractWhitelist public whitelist;
    bytes32 public rootNode;

    modifier onlyWhitelisted () {
        require(whitelist.isWhitelisted(msg.sender));
        _;
    }

    constructor (AbstractRNS _rns, AbstractWhitelist _whitelist, bytes32 _rootNode) public {
        rns = _rns;
        whitelist = _whitelist;
        rootNode = _rootNode;
    }

    function register (bytes32 label) public onlyWhitelisted() {
        rns.setSubnodeOwner(rootNode, label, msg.sender);
    }
}

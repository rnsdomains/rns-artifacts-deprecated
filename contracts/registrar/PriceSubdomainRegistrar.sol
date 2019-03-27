pragma solidity >=0.4.21 <0.6.0;

import "../registry/AbstractRNS.sol";
import "../util/PaymentAdmin.sol";
import "../util/AbstractWhitelist.sol";
import "../token/ERC20Basic.sol";

contract PriceSubdomainRegistrar {
    PaymentAdmin public admin = new PaymentAdmin();
    AbstractRNS public rns;
    AbstractWhitelist public whitelist;
    ERC20Basic public token;
    bytes32 public rootNode;

    uint256 constant PRICE = 1 * (10 ** 18);

    modifier onlyWhitelisted () {
        require(whitelist.isWhitelisted(msg.sender));
        _;
    }

    constructor (AbstractRNS _rns, AbstractWhitelist _whitelist, ERC20Basic _token, bytes32 _rootNode) public {
        rns = _rns;
        whitelist = _whitelist;
        rootNode = _rootNode;
        token = _token;
    }

    function register (bytes32 label) public onlyWhitelisted() {
        rns.setSubnodeOwner(rootNode, label, msg.sender);
        whitelist.removeWhitelisted(msg.sender);
        admin.transfer(msg.sender, token, PRICE);
    }
}

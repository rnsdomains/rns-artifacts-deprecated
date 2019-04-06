pragma solidity ^0.5.2;

import "../registry/AbstractRNS.sol";
import "../resolver/PublicResolver.sol";
import "../util/PaymentAdmin.sol";
import "../util/AbstractWhitelist.sol";
import "../token/ERC20Basic.sol";

/**
 * @title PriceSubdomainRegistrar
 * Allows anyone who is whitelisted to create subnodes under a given
 * RNS node and receive a price for doing this.
 * 
 */
contract PriceSubdomainRegistrar {
    address owner = msg.sender;

    PaymentAdmin public admin = new PaymentAdmin();
    AbstractRNS public rns;
    PublicResolver public resolver;
    AbstractWhitelist public whitelist;
    ERC20Basic public token;
    bytes32 public rootNode;

    uint256 public price = 1 * (10 ** 18);

    modifier onlyOwner () {
        require(msg.sender == owner);
        _;
    }

    modifier onlyWhitelisted () {
        require(whitelist.isWhitelisted(msg.sender));
        _;
    }

    /**
     * @dev Constructor
     * @param _rns AbstractRNS RNS registry address.
     * @param _whitelist AbstractWhitelist Whitelist to manage who can register domains.
     * @param _token ERC20Basic ERC-20 token address.
     * @param _rootNode bytes32 An owned node. The contract emits subnodes under this node.
     */
    constructor (AbstractRNS _rns, PublicResolver _resolver, AbstractWhitelist _whitelist, ERC20Basic _token, bytes32 _rootNode) public {
        rns = _rns;
        resolver = _resolver;
        whitelist = _whitelist;
        rootNode = _rootNode;
        token = _token;
    }

    /**
     * @dev Registrers a subnode under a given and delegated node. Who registers a domain
     * receives a token price.
     * @param label bytres32 The label of the new subnode.
     */
    function register (bytes32 label, address addr) public onlyWhitelisted() {           
        bytes32 subnode = keccak256(abi.encodePacked(rootNode, label));   
        address hashOwner = rns.owner(subnode);      

        if (hashOwner != address(0)) {
            revert("Subdomain already has owner");
        }

        rns.setSubnodeOwner(rootNode, label, address(this));        
        resolver.setAddr(subnode, addr);                
        rns.setOwner(subnode, addr);

        whitelist.removeWhitelisted(msg.sender);
        admin.transfer(addr, token, price);
    }

    /**
     * @dev Sets the price given for regstring a subnode.
     * @param _price uint256 The new price.
     */
    function setPrice (uint256 _price) public onlyOwner() {
        price = _price;
    }

    /**
     * @dev Transfer the tokens stored in the token admin contract.
     * @param receiver address The address of the token receiver.
     * @param _token ERC20Basic The token to retrieve the founds of.
     */
    function retrieveTokens (address receiver, ERC20Basic _token) public onlyOwner() {
        admin.retrieveTokens(receiver, _token);
    }
}

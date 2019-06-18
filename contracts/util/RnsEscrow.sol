pragma solidity ^0.5.2;

import "../token/ERC20Basic.sol";
import "./ConditionalEscrow.sol";
import "../registry/AbstractRNS.sol";
import "../util/SafeMath.sol";


contract RnsEscrow is ConditionalEscrow {

    AbstractRNS rns;
    uint256 paymentValue;
    address domainOwner;
    address domainBuyer;
    bytes32 node;

    struct Order {
      uint256 paymentValue;
      address domainOwner;
      address domainBuyer;
      bytes32 node;
    }
    enum State {CREATED, START, DOMAIN_TRANSFERRED, PAYMENT_TRANSFERRED, END}

    //previous owner
    mapping (bytes32 => address) delegated;
    //deposited
    mapping(address => uint256) private _deposits;

    modifier contractTransfered (bytes32 _node) {
        require(rns.owner(_node) == address(this), "You must transfer the domain before calling this method");
        _;
    }

    modifier onlyPreviousOwner (bytes32 _node) {
        require(msg.sender == delegated[_node]);
        _;
    }

    /**
     * Constructor.
     * @param _rns The RNS registrar contract.
     * @param _domainOwner The owner of the domain.
     * @param _domainBuyer The buyer of the domain.
     * @param _node The domain in question.
     * @param _value The value of the domain.
     */
    constructor(AbstractRNS _rns, address _domainOwner, address _domainBuyer, bytes32 _node, uint256 _value) public {
        rns = _rns;
        paymentValue = _value;
        domainOwner = _domainOwner;
        domainBuyer = _domainBuyer;
        node = _node;
    }

    /**
     * @dev Returns whether an address is allowed to withdraw their funds. To be
     * implemented by derived contracts.
     * @param payee The destination address of the funds.
     */

    function withdrawalAllowed(address payee) public view returns (bool) {
        return _deposits[domainOwner] == paymentValue && rns.owner(node) == address(this) ;
    }

    function withdraw(address payable payee) public onlyPrimary {
        require(withdrawalAllowed(payee), "RnsEscrow: payee is not allowed to withdraw");
        uint256 payment = _deposits[payee];

        _deposits[payee] = 0;

        payee.transfer(payment);

        emit Withdrawn(payee, payment);
    }

    /*
      @param _node
      @dev This is a notification that the contract has the ownership of the domain
    */

    function notify(bytes32 _node) public contractTransfered(_node) {
      delegated[_node] = msg.sender;
    }

    function cashbackDomain (bytes32 node) public onlyPreviousOwner(node) {
        rns.setOwner(node, delegated[node]);
        delegated[node] = address(0);
    }

}

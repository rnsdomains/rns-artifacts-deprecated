const assert = require('assert');
const PaymentAdmin = artifacts.require('PaymentAdmin');

contract('PaymentAdmin', async accounts => {
  var paymentAdmin;
  const owner = accounts[0];

  beforeEach(async () => {
    paymentAdmin = await PaymentAdmin.new({ from: owner });
  });

  it('should create PaymentAdmin contract', async () => {
    assert.ok(paymentAdmin.address);
  });

  it('should store deployer as owner', async () => {
    const actualOwner = await paymentAdmin.owner();

    assert.equal(actualOwner, owner);
  });

  it('should fallback to owner address', async () => {
    const balance = await web3.eth.getBalance(owner);
    const value = 1e18;

    await web3.eth.sendTransaction({ from: accounts[1], to: paymentAdmin.address, value });

    const actualBalance = await web3.eth.getBalance(owner);

    assert.equal(actualBalance, balance.toNumber() + value);
  });
});

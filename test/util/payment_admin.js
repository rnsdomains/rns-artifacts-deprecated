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
});

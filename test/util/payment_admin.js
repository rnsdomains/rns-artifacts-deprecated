const assert = require('assert');
const PaymentAdmin = artifacts.require('PaymentAdmin');

contract('PaymentAdmin', async () => {
  var paymentAdmin;

  beforeEach(async () => {
    paymentAdmin = await PaymentAdmin.new();
  });

  it('should create PaymentAdmin contract', async () => {
    assert.ok(paymentAdmin.address);
  });
});

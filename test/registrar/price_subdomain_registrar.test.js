const assert = require('assert');
const PriceSubdomainRegistrar = artifacts.require('PriceSubdomainRegistrar');

contract('PriceSubdomainRegistrar', async () => {
  var registrar;

  beforeEach(async () => {
    registrar = await PriceSubdomainRegistrar.new();
  });

  it('should create PriceSubdomainRegistrar contract', async () => {
    assert.ok(registrar.address);
  });

  it('should manage payments with PaymentAdmin', async () => {
    const admin = await registrar.admin();

    assert.ok(admin);
  });
});

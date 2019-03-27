const assert = require('assert');
const PriceSubdomainRegistrar = artifacts.require('PriceSubdomainRegistrar');
const RNS = artifacts.require('RNS');

contract('PriceSubdomainRegistrar', async () => {
  var rns, registrar;

  beforeEach(async () => {
    rns = await RNS.new();
    registrar = await PriceSubdomainRegistrar.new(rns.address);
  });

  it('should create PriceSubdomainRegistrar contract', async () => {
    assert.ok(registrar.address);
  });

  it('should manage payments with PaymentAdmin', async () => {
    const admin = await registrar.admin();

    assert.ok(admin);
  });

  it('should store RNS address', async () => {
    const actualRns = await registrar.rns();

    assert.equal(actualRns, rns.address);
  });
});

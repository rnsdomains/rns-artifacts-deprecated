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
});

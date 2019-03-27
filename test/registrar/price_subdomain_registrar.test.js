const assert = require('assert');
const PriceSubdomainRegistrar = artifacts.require('PriceSubdomainRegistrar');
const RNS = artifacts.require('RNS');
const Whitelist = artifacts.require('Whitelist');

contract('PriceSubdomainRegistrar', async () => {
  var rns, whitelist, registrar;

  beforeEach(async () => {
    rns = await RNS.new();
    whitelist = await Whitelist.new();
    registrar = await PriceSubdomainRegistrar.new(rns.address, whitelist.address);
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

  it('should have a whitelist', async () => {
    const actualWhitelist = await registrar.whitelist();

    assert.equal(actualWhitelist, whitelist.address);
  });
});

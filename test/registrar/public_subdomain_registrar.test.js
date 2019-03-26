const assert = require('assert');
const PublicSubdomainRegistrar = artifacts.require('PublicSubdomainRegistrar');
const RNS = artifacts.require('RNS');

contract('PublicSubdomainRegistrar', async () => {
  var publicSubdomainRegistrar, rns;

  beforeEach(async () => {
    rns = await RNS.new();
    publicSubdomainRegistrar = await PublicSubdomainRegistrar.new(rns.address);
  });

  it('should create PublicSubdomainRegistrar contract', async () => { return });

  it('should store RNS address', async () => {
    const rnsAddress = await publicSubdomainRegistrar.rns();

    assert.equal(rnsAddress, rns.address);
  });
});

const assert = require('assert');
const RNS = artifacts.require('RNS');
const SubdomainRegistrar = artifacts.require('SubdomainRegistrar');
const namehash = require('eth-ens-namehash').hash;

contract('SubdomainRegistrar', async () => {
  var rns, subdomainRegistrar;
  const hash = namehash('rsk');

  beforeEach(async () => {
    rns = await RNS.new();
    subdomainRegistrar = await SubdomainRegistrar.new(rns.address, hash);
  });

  it('should create SubdomainRegistrar contract', async () => { return });

  it('should store deployed rns address', async () => {
    const rnsAddress = await subdomainRegistrar.rns();

    assert.equal(rnsAddress, rns.address);
  });

  it('should store root domain', async () => {
    const actualRoot = await subdomainRegistrar.rootNode();

    assert.equal(actualRoot, hash);
  });
});

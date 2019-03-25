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

    await rns.setSubnodeOwner(0, web3.sha3('rsk'), subdomainRegistrar.address);
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

  it('should own root node on rns registry', async () => { return });
});

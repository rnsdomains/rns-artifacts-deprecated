const assert = require('assert');
const PublicSubdomainRegistrar = artifacts.require('PublicSubdomainRegistrar');
const RNS = artifacts.require('RNS');
const namehash = require('eth-ens-namehash').hash;

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

  it('should receive delegated root nodes only if owned', async () => {
    const hash = namehash('rsk');
    const label = web3.sha3('rsk');

    try {
      await publicSubdomainRegistrar.delegate(hash);
    } catch {
      await rns.setSubnodeOwner(0, label, publicSubdomainRegistrar.address);
      await publicSubdomainRegistrar.delegate(hash);
      return;
    }

    assert.fail();
  });
});

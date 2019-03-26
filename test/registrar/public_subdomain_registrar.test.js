const assert = require('assert');
const PublicSubdomainRegistrar = artifacts.require('PublicSubdomainRegistrar');
const RNS = artifacts.require('RNS');
const namehash = require('eth-ens-namehash').hash;

contract('PublicSubdomainRegistrar', async () => {
  var publicSubdomainRegistrar, rns;

  const label = web3.sha3('rsk');
  const node = namehash('rsk');

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
    try {
      await publicSubdomainRegistrar.delegate(node);
    } catch {
      await rns.setSubnodeOwner(0, label, publicSubdomainRegistrar.address);
      await publicSubdomainRegistrar.delegate(node);
      return;
    }

    assert.fail();
  });

  it('should store one delegated node', async () => {
    await rns.setSubnodeOwner(0, label, publicSubdomainRegistrar.address);
    await publicSubdomainRegistrar.delegate(node);

    const isDelegated = await publicSubdomainRegistrar.isDelegated(node);

    assert.ok(isDelegated);
  });

  it('should store many delegated nodes', async () => {
    const otherLabel = web3.sha3('rif');
    const otherNode = namehash('rif');

    await rns.setSubnodeOwner(0, label, publicSubdomainRegistrar.address);
    await publicSubdomainRegistrar.delegate(node);
    await rns.setSubnodeOwner(0, otherLabel, publicSubdomainRegistrar.address);
    await publicSubdomainRegistrar.delegate(otherNode);

    const isDelegated = await publicSubdomainRegistrar.isDelegated(node);
    const isOtherDelegated = await publicSubdomainRegistrar.isDelegated(otherNode);

    assert.ok(isDelegated && isOtherDelegated);
  });
});

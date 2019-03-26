const assert = require('assert');
const PublicSubdomainRegistrar = artifacts.require('PublicSubdomainRegistrar');
const RNS = artifacts.require('RNS');
const namehash = require('eth-ens-namehash').hash;

contract('PublicSubdomainRegistrar', async accounts => {
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

  it('should transfer back nodes to previous owners', async () => {
    await rns.setSubnodeOwner(0, label, publicSubdomainRegistrar.address);
    await publicSubdomainRegistrar.delegate(node, { from: accounts[0] });

    await publicSubdomainRegistrar.transferBack(node);

    const owner = await rns.owner(node);

    assert.equal(owner, accounts[0]);
  });

  it('should allow only previous owner to transfer back nodes', async () => {
    await rns.setSubnodeOwner(0, label, publicSubdomainRegistrar.address);
    await publicSubdomainRegistrar.delegate(node, { from: accounts[0] });

    try {
      await publicSubdomainRegistrar.transferBack(node, { from: accounts[1] });
    } catch {
      return;
    }

    assert.fail();
  });

  it('should register subdomains', async () => {
    await rns.setSubnodeOwner(0, label, publicSubdomainRegistrar.address);
    await publicSubdomainRegistrar.delegate(node);

    await publicSubdomainRegistrar.register(node, web3.sha3('ilan'), { from: accounts[1] });

    const owner = await rns.owner(namehash('ilan.rsk'));

    assert.equal(owner, accounts[1]);
  });

  it('should not allow to register owned subdomains', async () => {
    await rns.setSubnodeOwner(0, label, publicSubdomainRegistrar.address);
    await publicSubdomainRegistrar.delegate(node);
    await publicSubdomainRegistrar.register(node, web3.sha3('ilan'));

    try {
      await publicSubdomainRegistrar.register(node, web3.sha3('ilan'), { from: accounts[1] });
    } catch {
      return;
    }

    assert.fail();
  });
});

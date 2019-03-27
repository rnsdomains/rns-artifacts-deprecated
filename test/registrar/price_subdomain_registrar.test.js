const assert = require('assert');
const PriceSubdomainRegistrar = artifacts.require('PriceSubdomainRegistrar');
const RNS = artifacts.require('RNS');
const Whitelist = artifacts.require('Whitelist');
const namehash = require('eth-ens-namehash').hash;

contract('PriceSubdomainRegistrar', async () => {
  var rns, whitelist, registrar;

  const rootNode = namehash('rsk');

  beforeEach(async () => {
    rns = await RNS.new();
    whitelist = await Whitelist.new();
    registrar = await PriceSubdomainRegistrar.new(rns.address, whitelist.address, rootNode);

    rns.setSubnodeOwner(0, web3.sha3('rsk'), registrar.address);
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

  it('should store a root node', async () => {
    const actualRootNode = await registrar.rootNode();

    assert.equal(actualRootNode, rootNode);
  });

  it('should own the root node', async () => {
    const actualRootNode = await registrar.rootNode();
    const owner = await rns.owner(actualRootNode);

    assert.equal(owner, registrar.address);
  });
});

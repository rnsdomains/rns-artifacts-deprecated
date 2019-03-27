const assert = require('assert');
const PriceSubdomainRegistrar = artifacts.require('PriceSubdomainRegistrar');
const RNS = artifacts.require('RNS');
const Whitelist = artifacts.require('Whitelist');
const namehash = require('eth-ens-namehash').hash;

contract('PriceSubdomainRegistrar', async accounts => {
  var rns, whitelist, registrar;

  const whitelistManager = accounts[1];
  const whitelisted = accounts[2];

  const rootNode = namehash('rsk');

  beforeEach(async () => {
    rns = await RNS.new();
    whitelist = await Whitelist.new();
    registrar = await PriceSubdomainRegistrar.new(rns.address, whitelist.address, rootNode);

    await rns.setSubnodeOwner(0, web3.sha3('rsk'), registrar.address);

    await whitelist.addManager(whitelistManager);
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

  it('should register subdomains for whitelisted accounts', async () => {
    await whitelist.addWhitelisted(whitelisted, { from: whitelistManager });

    const label = web3.sha3('whitelisted');
    await registrar.register(label, { from: whitelisted });

    const subdomain = namehash('whitelisted.rsk');
    const owner = await rns.owner(subdomain);

    assert.equal(owner, whitelisted);
  });

  it('should not register subdomains for not-whitelisted accounts', async () => {
    const label = web3.sha3('whitelisted');

    try {
      await registrar.register(label, { from: whitelisted });
    } catch {
      const subdomain = namehash('whitelisted.rsk');
      const owner = await rns.owner(subdomain);
      assert.equal(owner, '0x0000000000000000000000000000000000000000');
      return;
    }

    assert.fail();
  });
});

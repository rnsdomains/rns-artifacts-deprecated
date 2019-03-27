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
  const label = web3.sha3('whitelisted');
  const subdomain = namehash('whitelisted.rsk');

  beforeEach(async () => {
    rns = await RNS.new();
    whitelist = await Whitelist.new();
    registrar = await PriceSubdomainRegistrar.new(rns.address, whitelist.address, rootNode);

    await rns.setSubnodeOwner(0, web3.sha3('rsk'), registrar.address);

    await whitelist.addManager(registrar.address);

    await whitelist.addManager(whitelistManager);
    await whitelist.addWhitelisted(whitelisted, { from: whitelistManager });
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
    await registrar.register(label, { from: whitelisted });

    const owner = await rns.owner(subdomain);

    assert.equal(owner, whitelisted);
  });

  it('should not register subdomains for not-whitelisted accounts', async () => {
    const owner = await rns.owner(subdomain);

    try {
      await registrar.register(label, { from: accounts[3] });
    } catch {
      const actualOwner = await rns.owner(subdomain);
      assert.equal(actualOwner, owner);
      return;
    }

    assert.fail();
  });

  it('should be a whitelist manager', async () => {
    const isWhitelisted = whitelist.isWhitelisted(registrar.address);

    assert.ok(isWhitelisted);
  })

  it('should remove whitelisted after registration', async () => {
    await registrar.register(label, { from: whitelisted });

    const isWhitelisted = await whitelist.isWhitelisted(whitelisted);

    assert.ok(!isWhitelisted);
  });
});

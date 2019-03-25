const assert = require('assert');
const RNS = artifacts.require('RNS');
const SubdomainRegistrar = artifacts.require('SubdomainRegistrar');
const namehash = require('eth-ens-namehash').hash;

contract('SubdomainRegistrar', async accounts => {
  var rns, subdomainRegistrar;
  const rootHash = namehash('rsk');
  const hash = namehash('subdomain.rsk');

  beforeEach(async () => {
    rns = await RNS.new();
    subdomainRegistrar = await SubdomainRegistrar.new(rns.address, rootHash);

    await rns.setSubnodeOwner(0, web3.sha3('rsk'), subdomainRegistrar.address);
  });

  it('should create SubdomainRegistrar contract', async () => { return });

  it('should store deployed rns address', async () => {
    const rnsAddress = await subdomainRegistrar.rns();

    assert.equal(rnsAddress, rns.address);
  });

  it('should store root domain', async () => {
    const actualRoot = await subdomainRegistrar.rootNode();

    assert.equal(actualRoot, rootHash);
  });

  it('should own root node on rns registry', async () => { return });

  it('should register a subnode in rns', async () => {
    await subdomainRegistrar.register(web3.sha3('subdomain'), { from: accounts[0] });

    const owner = await rns.owner(hash);

    assert.equal(owner, accounts[0]);
  });

  it('should register a subnode if it\'s not owned', async () => {
    await subdomainRegistrar.register(web3.sha3('subdomain'), { from: accounts[0] });

    try {
      await subdomainRegistrar.register(web3.sha3('subdomain'), { from: accounts[1] });
    } catch {
      const owner = await rns.owner(hash);
      assert.equal(owner, accounts[0]);
      return;
    }

    assert.fail();
  });

  it('should allow to retrive domain ownership', async () => {
    await subdomainRegistrar.transferBack();

    const owner = await rns.owner(rootHash);

    assert.equal(owner, accounts[0]);
  });
});

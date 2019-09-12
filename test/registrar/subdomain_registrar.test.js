const RNS = artifacts.require('RNS');
const SubdomainRegistrar = artifacts.require('SubdomainRegistrar');

const namehash = require('eth-ens-namehash').hash;
const zeroNode = require('../constants').BYTES32_ZERO;

var chai = require('chai');
var BN = require('bn.js');
var bnChai = require('bn-chai');
chai.use(bnChai(BN));
const expect = chai.expect;

contract('SubdomainRegistrar', async accounts => {
  var rns, subdomainRegistrar;
  const rootNode = namehash('rsk');
  const label = web3.utils.sha3('subdomain');
  const node = namehash('subdomain.rsk');

  beforeEach(async () => {
    rns = await RNS.new();
    subdomainRegistrar = await SubdomainRegistrar.new(rns.address, rootNode);

    await rns.setSubnodeOwner(zeroNode, web3.utils.sha3('rsk'), subdomainRegistrar.address);
  });

  it('should create SubdomainRegistrar contract', async () => { return });

  it('should store deployed rns address', async () => {
    const rnsAddress = await subdomainRegistrar.rns();

    assert.equal(rnsAddress, rns.address);
  });

  it('should store root domain', async () => {
    const actualRoot = await subdomainRegistrar.rootNode();

    assert.equal(actualRoot, rootNode);
  });

  it('should own root node on rns registry', async () => {
    const owner = await rns.owner(rootNode);

    assert.equal(owner, subdomainRegistrar.address);
  });

  it('should register a subnode in rns', async () => {
    await subdomainRegistrar.register(label, { from: accounts[0] });

    const owner = await rns.owner(node);

    assert.equal(owner, accounts[0]);
  });

  it('should register a subnode if it\'s not owned', async () => {
    await subdomainRegistrar.register(label, { from: accounts[0] });

    try {
      await subdomainRegistrar.register(label, { from: accounts[1] });
    } catch {
      const owner = await rns.owner(node);
      assert.equal(owner, accounts[0]);
      return;
    }

    assert.fail();
  });

  it('should allow to retrieve domain ownership', async () => {
    await subdomainRegistrar.transferBack();

    const owner = await rns.owner(rootNode);

    assert.equal(owner, accounts[0]);
  });

  it('should allow only owner to transfer back', async () => {
    try {
      await subdomainRegistrar.transferBack({ from: accounts[1] });
    } catch {
      const owner = await rns.owner(rootNode);
      assert.equal(owner, subdomainRegistrar.address);
      return;
    }
  });

  describe('should implement Registrar Interface', async () => {
    it('should allow owner to set resolver', async () => {
      const resolver = '0x0000000000111111111122222222223333333333';

      await subdomainRegistrar.setRootResolver(resolver);

      const actualResolver = await rns.resolver(rootNode);

      assert.equal(actualResolver, resolver);
    });

    it('should allow only owner to set resolver', async () => {
      const resolver = '0x0000000000111111111122222222223333333333';

      try {
        await subdomainRegistrar.setRootResolver(resolver, { from: accounts[1] });
      } catch {
        const previousResolver = '0x0000000000000000000000000000000000000000';

        const actualResolver = await rns.resolver(rootNode);

        assert.equal(actualResolver, previousResolver);

        return;
      }

      assert.fail();
    });

    it('should allow owner to set ttl', async () => {
      const ttl = web3.utils.toBN(1000);

      await subdomainRegistrar.setRootTTL(ttl);

      const actualTtl = await rns.ttl(rootNode);

      expect(actualTtl).to.eq.BN(ttl);
    });

    it('should allow only owner to set ttl', async () => {
      const ttl = web3.utils.toBN(1000);

      try {
        await subdomainRegistrar.setRootTTL(ttl, { from: accounts[1] });
      } catch {
        const previousTtl = web3.utils.toBN(0);

        const actualTtl = await rns.ttl(rootNode);

        expect(actualTtl).to.eq.BN(previousTtl);

        return;
      }

      assert.fail();
    });

    it('should support base registrar interface', async () => {
      const interfaceID = '0x657efd4f';

      const supportsInterface = await subdomainRegistrar.supportsInterface(interfaceID);

      assert(supportsInterface);
    })
  });
});

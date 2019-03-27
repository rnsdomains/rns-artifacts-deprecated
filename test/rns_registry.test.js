const assert = require('assert');
const RNS = artifacts.require('RNS');
const namehash = require('eth-ens-namehash').hash;

contract('RNS', async (accounts) => {
  var rns;

  beforeEach(async () => {
    rns = await RNS.new({ from: accounts[0] });
  });

  it('should set root node ownership to deployer', async () => {
    const owner = await rns.owner(0);

    assert.equal(owner, accounts[0]);
  });

  it('should transfer ownership of a subnode', async () => {
    const sha3 = web3.sha3('rsk');
    await rns.setSubnodeOwner(0, sha3, accounts[1]);

    const hash = namehash('rsk');
    const owner = await rns.owner(hash);

    assert.equal(owner, accounts[1]);
  });

  it('should set resolver', async () => {
    const sha3 = web3.sha3('rsk');
    await rns.setSubnodeOwner(0, sha3, accounts[0]);

    const hash = namehash('rsk');
    const resolver = '0x0000000000111111111122222222223333333333';
    await rns.setResolver(hash, resolver);

    const actualResolver = await rns.resolver(hash);

    assert.equal(actualResolver, resolver);
  });
});

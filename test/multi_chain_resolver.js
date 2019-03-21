const assert = require('assert');
const RNS = artifacts.require('RNS');
const PublicResolver = artifacts.require('PublicResolver');
const MultiChainResolver = artifacts.require('MultiChainResolver');
const namehash = require('eth-ens-namehash').hash;

contract('MultiChainResolver', async (accounts) => {
  var publicResolver, multiChainResolver;

  const hash = namehash('rsk');

  beforeEach(async () => {
    const rns = await RNS.new();
    publicResolver = await PublicResolver.new(rns.address);

    await rns.setSubnodeOwner(0, web3.sha3('rsk'), accounts[0]);
    await rns.setResolver(hash, publicResolver.address);

    multiChainResolver = await MultiChainResolver.new(publicResolver.address);
  });

  it('should create smart contracts', async () => { return });

  it('should return public resolver address', async () => {
    const addr = '0x0000000000111111111122222222223333333333';

    await publicResolver.setAddr(hash, addr);

    const actualAddr = await multiChainResolver.addr(hash);

    assert.equal(actualAddr, addr);
  });

  it('should return public resolver content', async () => {
    const content = '0x524e5320544c4400000000000000000000000000000000000000000000000000'; // bytes for 'RNS TLD'

    await publicResolver.setContent(hash, content);

    const actualContent = await publicResolver.content(hash);

    assert.equal(actualContent, content);
  });

  it('should be able to set addr', async () => {
    const addr = '0x0000000000111111111122222222223333333333';

    await multiChainResolver.setAddr(hash, addr);

    const actualAddr = await multiChainResolver.addr(hash);

    assert.equal(actualAddr, addr);
  });

  it('should be able to set content', async () => {
    const content = '0x524e5320544c4400000000000000000000000000000000000000000000000000'; // bytes for 'RNS TLD'

    await multiChainResolver.setContent(hash, content);

    const actualContent = await multiChainResolver.content(hash);

    assert.equal(actualContent, content);
  });

  it('should implement RNSIP-02 - supportsInterface', async () => {
    const addrSign = web3.sha3('addr(bytes32)').slice(0, 10);
    const contentSign = web3.sha3('content(bytes32)').slice(0, 10);

    const supportsAddr = await multiChainResolver.supportsInterface(addrSign);
    const supportsContent = await multiChainResolver.supportsInterface(contentSign);

    assert.ok(supportsAddr && supportsContent);
  });

  it('should implement RNSIP-02 - fallback function that throws', async () => {
    try {
      web3.eth.sendTransaction({ from: accounts[0], to: multiChainResolver.address, value: 1e18 });
    } catch (e) {
      return;
    }
    assert.fail();
  });
});

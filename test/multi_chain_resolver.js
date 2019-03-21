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

    multiChainResolver = await MultiChainResolver.new(rns.address, publicResolver.address);
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

  it('should implement RNSIP-02 - AddrChanged event', async () => {
    const addr = '0x0000000000111111111122222222223333333333';
    const tx = await multiChainResolver.setAddr(hash, addr);

    const addrChangedLog = tx.logs.find(log => log.event === 'AddrChanged');

    assert(addrChangedLog);
    assert.equal(addrChangedLog.args.node, hash);
    assert.equal(addrChangedLog.args.addr, addr);
  });

  it('should implement RNSIP-02 - AddrChanged event', async () => {
    const content = '0x524e5320544c4400000000000000000000000000000000000000000000000000'; // bytes for 'RNS TLD'
    const tx = await multiChainResolver.setContent(hash, content);

    const contentChangedLog = tx.logs.find(log => log.event === 'ContentChanged');

    assert(contentChangedLog);
    assert.equal(contentChangedLog.args.node, hash);
    assert.equal(contentChangedLog.args.content, content);
  });

  it('should allow only RNS owner to set addr', async () => {
    const addr = '0x0000000000111111111122222222223333333333';
    await multiChainResolver.setAddr(hash, addr);

    try {
      const newAddr = '0x4444444444555555555566666666667777777777';
      await multiChainResolver.setAddr(hash, newAddr, { from: accounts[1] });
    } catch {
      const actualAddr = await multiChainResolver.addr(hash);
      assert.equal(actualAddr, addr);
      return;
    }

    assert.fail();
  });
});

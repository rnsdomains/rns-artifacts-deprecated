const assert = require('assert');
const RNS = artifacts.require('RNS');
const PublicResolver = artifacts.require('PublicResolver');
const MultiChainResolver = artifacts.require('MultiChainResolver');
const namehash = require('eth-ens-namehash').hash;

contract('MultiChainResolver', async (accounts) => {
  var publicResolver, multiChainResolver;

  const hash = namehash('rsk');

  const chainId = {
    rsk: '0x80000089',
    eth: '0x8000003c',
    btc: '0x80000000'
  };

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

  it('should allow only RNS owner to set conetnt', async () => {
    const content = '0x524e5320544c4400000000000000000000000000000000000000000000000000'; // bytes for 'RNS TLD'
    await multiChainResolver.setContent(hash, content);


    try {
      const newContent = '0x61747461636b0000000000000000000000000000000000000000000000000000'; // bytes for 'attack'
      await multiChainResolver.setContent(hash, newContent, { from: accounts[1] });
    } catch {
      const actualContent = await multiChainResolver.content(hash);
      assert.equal(actualContent, content);
      return;
    }

    assert.fail();
  });

  describe('RNSIP-02', async () => {
    it('should implement supportsInterface method', async () => {
      const addrSign = web3.sha3('addr(bytes32)').slice(0, 10);
      const contentSign = web3.sha3('content(bytes32)').slice(0, 10);
      const chainAddrSign = web3.sha3('chainAddr(bytes32,bytes4)').slice(0, 10);

      const supportsAddr = await multiChainResolver.supportsInterface(addrSign);
      const supportsContent = await multiChainResolver.supportsInterface(contentSign);
      const supportsChainAddr = await multiChainResolver.supportsInterface(chainAddrSign);

      assert.ok(supportsAddr && supportsContent && supportsChainAddr);
    });

    it('should implement fallback function that throws', async () => {
      try {
        web3.eth.sendTransaction({ from: accounts[0], to: multiChainResolver.address, value: 1e18 });
      } catch (e) {
        return;
      }
      assert.fail();
    });

    it('should emit AddrChanged event', async () => {
      const addr = '0x0000000000111111111122222222223333333333';
      const tx = await multiChainResolver.setAddr(hash, addr);

      const addrChangedLog = tx.logs.find(log => log.event === 'AddrChanged');

      assert(addrChangedLog);
      assert.equal(addrChangedLog.args.node, hash);
      assert.equal(addrChangedLog.args.addr, addr);
    });

    it('should emit ContentChanged event', async () => {
      const content = '0x524e5320544c4400000000000000000000000000000000000000000000000000'; // bytes for 'RNS TLD'
      const tx = await multiChainResolver.setContent(hash, content);

      const contentChangedLog = tx.logs.find(log => log.event === 'ContentChanged');

      assert(contentChangedLog);
      assert.equal(contentChangedLog.args.node, hash);
      assert.equal(contentChangedLog.args.content, content);
    });

    it('should emit AddrChanged event setting rsk address', async () => {
      const addr = '0x0000000000111111111122222222223333333333';
      const tx = await multiChainResolver.setChainAddr(hash, chainId.rsk, addr);

      const addrChangedLog = tx.logs.find(log => log.event === 'AddrChanged');

      assert(addrChangedLog);
      assert.equal(addrChangedLog.args.node, hash);
      assert.equal(addrChangedLog.args.addr, addr);
    });
  });

  describe('RNSIP-03', async () => {
    it('should return rsk address', async () => {
      const addr = '0x0000000000111111111122222222223333333333';
      await multiChainResolver.setAddr(hash, addr);

      const actualAddr = await multiChainResolver.chainAddr(hash, chainId.rsk);

      assert.equal(actualAddr, addr);
    });

    it('should not return rsk address for other id', async () => {
      const addr = '0x0000000000111111111122222222223333333333';
      await multiChainResolver.setAddr(hash, addr);

      const actualAddr = await multiChainResolver.chainAddr(hash, '0x00000000');

      assert.notEqual(actualAddr, addr);
    });

    it('should set rsk address with setChainAddr', async () => {
      const addr = '0x0000000000111111111122222222223333333333';
      await multiChainResolver.setChainAddr(hash, chainId.rsk, addr);

      const actualAddr = await multiChainResolver.chainAddr(hash, chainId.rsk);

      assert.equal(actualAddr, addr);
    });

    it('should allow only RNS owner to set rsk addr', async () => {
      const addr = '0x0000000000111111111122222222223333333333';
      await multiChainResolver.setAddr(hash, addr);

      try {
        const newAddr = '0x4444444444555555555566666666667777777777';
        await multiChainResolver.setChainAddr(hash, chainId.rsk, newAddr, { from: accounts[1] });
      } catch {
        const actualAddr = await multiChainResolver.addr(hash);
        assert.equal(actualAddr, addr);
        return;
      }

      assert.fail();
    });

    describe('supporting chains', async () => {
      it('should store eth address', async () => {
        const addr = '0x44444444445555555555666666666677777777777';

        await multiChainResolver.setChainAddr(hash, chainId.eth, addr);

        const actualAddr = await multiChainResolver.chainAddr(hash, chainId.eth);

        assert.equal(actualAddr, addr);
      });

      it('should store btc address', async () => {
        const addr = '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2';

        await multiChainResolver.setChainAddr(hash, chainId.btc, addr);

        const actualAddr = await multiChainResolver.chainAddr(hash, chainId.btc);

        assert.equal(actualAddr, addr);
      });

      it('should store all addresses', async () => {
        const rskAddr = '0x0000000000111111111122222222223333333333';
        const ethAddr = '0x44444444445555555555666666666677777777777';
        const btcAddr = '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2';

        await multiChainResolver.setChainAddr(hash, chainId.rsk, rskAddr);
        await multiChainResolver.setChainAddr(hash, chainId.eth, ethAddr);
        await multiChainResolver.setChainAddr(hash, chainId.btc, btcAddr);

        const actualRskAddr = await multiChainResolver.chainAddr(hash, chainId.rsk);
        const actualEthAddr = await multiChainResolver.chainAddr(hash, chainId.eth);
        const actualBtcAddr = await multiChainResolver.chainAddr(hash, chainId.btc);

        assert.equal(actualRskAddr, rskAddr);
        assert.equal(actualEthAddr, ethAddr);
        assert.equal(actualBtcAddr, btcAddr);
      });
    });

    it('should allow only RNS owner to set chian address', async () => {
      const addr = '0x0000000000111111111122222222223333333333';
      await multiChainResolver.setChainAddr(hash, chainId.eth, addr);

      try {
        const newAddr = '0x4444444444555555555566666666667777777777';
        await multiChainResolver.setChainAddr(hash, chainId.eth, newAddr, { from: accounts[1] });
      } catch {
        const actualAddr = await multiChainResolver.chainAddr(hash, chainId.eth);
        assert.equal(actualAddr, addr);
        return;
      }

      assert.fail();
    });

    it('should emit ChainAddrChanged event', async () => {
      const addr = '0x0000000000111111111122222222223333333333';
      const tx = await multiChainResolver.setChainAddr(hash, chainId.eth, addr);

      const addrChangedLog = tx.logs.find(log => log.event === 'ChainAddrChanged');

      assert(addrChangedLog);
      assert.equal(addrChangedLog.args.node, hash);
      assert.equal(addrChangedLog.args.chain, chainId.eth);
      assert.equal(addrChangedLog.args.addr, addr);
    });
  });
});

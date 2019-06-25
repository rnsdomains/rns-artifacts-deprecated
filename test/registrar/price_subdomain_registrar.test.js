var chai = require('chai');
var BN = require('bn.js');
var bnChai = require('bn-chai');
chai.use(bnChai(BN));
const expect = chai.expect;

const PriceSubdomainRegistrar = artifacts.require('PriceSubdomainRegistrar');
const RNS = artifacts.require('RNS');
const Whitelist = artifacts.require('Whitelist');
const Token = artifacts.require('BasicToken');
const PublicResolver = artifacts.require('PublicResolver');
const namehash = require('eth-ens-namehash').hash;
const zeroNode = require('../constants').BYTES32_ZERO;
const tokens = require('../constants').tokens;

contract('PriceSubdomainRegistrar', async accounts => {
  var rns, whitelist, token, registrar, resolver;

  var adminAddress;

  const whitelistManager = accounts[1];
  const whitelisted = accounts[2];

  const addr = '0x0123456789012345678901234567890123456789';

  const adminInitialBalance = tokens(10);

  const rootNode = namehash('rsk');
  const label = web3.utils.sha3('whitelisted');
  const subdomain = namehash('whitelisted.rsk');

  const initialPrice = tokens(1);

  beforeEach(async () => {
    rns = await RNS.new();
    whitelist = await Whitelist.new();
    token = await Token.new(tokens(1000));
    registrar = await PriceSubdomainRegistrar.new(rns.address, whitelist.address, token.address, rootNode);
    resolver = await PublicResolver.new(rns.address);

    await rns.setDefaultResolver(resolver.address);

    await rns.setSubnodeOwner(zeroNode, web3.utils.sha3('rsk'), registrar.address);

    await whitelist.addManager(registrar.address);

    await whitelist.addManager(whitelistManager);
    await whitelist.addWhitelisted(whitelisted, { from: whitelistManager });

    adminAddress = await registrar.admin();
    await token.transfer(adminAddress, adminInitialBalance);
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
    await registrar.register(label, addr, { from: whitelisted });

    const owner = await rns.owner(subdomain);

    assert.equal(owner, addr);
  });

  it('should not register subdomains for not-whitelisted accounts', async () => {
    const owner = await rns.owner(subdomain);

    try {
      await registrar.register(label, addr, { from: accounts[3] });
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
  });

  it('should receive tokens on payment admin', async () => {
    const balance = await token.balanceOf(adminAddress);

    expect(balance).to.eq.BN(adminInitialBalance);
  });

  it('should remove whitelisted after registration', async () => {
    await registrar.register(label, addr, { from: whitelisted });

    const isWhitelisted = await whitelist.isWhitelisted(whitelisted);

    assert.ok(!isWhitelisted);
  });

  it('should transfer one token to who registers a domain', async () => {
    const balance = await token.balanceOf(addr);

    await registrar.register(label, addr, { from: whitelisted });

    const actualBalance = await token.balanceOf(addr);

    expect(actualBalance).to.eq.BN(balance.add(initialPrice));
  });

  it('should register only not owned names', async () => {
    await registrar.register(label, addr, { from: whitelisted });

    const otherWhitelisted = accounts[7];
    await whitelist.addWhitelisted(otherWhitelisted, { from: whitelistManager });

    try {
      await registrar.register(label, addr, { from: otherWhitelisted });
    } catch {
      const owner = await rns.owner(subdomain);
      assert.equal(owner, addr);
      return;
    }

    assert.fail();
  });

  it('should set addr in resolver', async () => {
    const addr = '0x0123456789012345678901234567890123456789';

    await registrar.register(label, addr, { from: whitelisted });

    const actualAddr = await resolver.addr(subdomain);

    assert.equal(actualAddr, addr);
  });

  it('should update token price', async () => {
    const price = tokens(2);

    await registrar.setPrice(price);

    const actualPrice = await registrar.price();

    expect(actualPrice).to.eq.BN(price);
  });

  it('should allow only owner to update token price', async () => {
    const price = tokens(10);

    try {
      await registrar.setPrice(price, { from: accounts[4]});
    } catch {
      const actualPrice = await registrar.price();
      expect(actualPrice).to.eq.BN(initialPrice);
      return;
    }

    assert.fail();
  });

  it('should allow to retrieve tokens', async () => {
    const receiver = accounts[4];
    const balance = await token.balanceOf(receiver);

    await registrar.retrieveTokens(receiver, token.address);

    const actualBalance = await token.balanceOf(receiver);

    expect(actualBalance).to.eq.BN(balance.add(adminInitialBalance));
  });

  it('should allow only owner to retrieve tokens', async () => {
    const receiver = accounts[6];
    const balance = await token.balanceOf(receiver);

    try {
      await registrar.retrieveTokens(receiver, token.address, { from: receiver});
    } catch {
      const actualBalance = await token.balanceOf(receiver);
      expect(actualBalance).to.eq.BN(balance);
      return;
    }

    assert.fail();
  });

  it('should allow to retrieve domain ownership', async () => {
    await registrar.transferBack();

    const owner = await rns.owner(rootNode);

    assert.equal(owner, accounts[0]);
  });

  it('should allow only owner to transfer back', async () => {
    try {
      await registrar.transferBack({ from: accounts[1] });
    } catch {
      const owner = await rns.owner(rootNode);
      assert.equal(owner, registrar.address);
      return;
    }
  });
});

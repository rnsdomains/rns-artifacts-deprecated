var chai = require('chai');
var BN = require('bn.js');
var bnChai = require('bn-chai');
chai.use(bnChai(BN));
const expect = chai.expect;

const PaymentAdmin = artifacts.require('PaymentAdmin');
const Token = artifacts.require('BasicToken');

const tokens = require('../constants').tokens;

contract('PaymentAdmin', async accounts => {
  var paymentAdmin, token;
  const owner = accounts[0];
  const tokenHolder = accounts[1];

  beforeEach(async () => {
    paymentAdmin = await PaymentAdmin.new({ from: owner });
    token = await Token.new(tokens(100), { from: tokenHolder });
  });

  it('should create PaymentAdmin contract', async () => {
    assert.ok(paymentAdmin.address);
  });

  it('should store deployer as owner', async () => {
    const actualOwner = await paymentAdmin.owner();

    assert.equal(actualOwner, owner);
  });

  it('should fallback to owner address', async () => {
    const balance = web3.utils.toBN(await web3.eth.getBalance(owner));
    const value = web3.utils.toBN(1);

    await web3.eth.sendTransaction({ from: accounts[1], to: paymentAdmin.address, value });

    const actualBalance = await web3.eth.getBalance(owner);

    expect(actualBalance).to.eq.BN(balance.add(value));
  });

  it('should receive tokens', async () => {
    const balance = await token.balanceOf(paymentAdmin.address);
    const value = tokens(10);

    await token.transfer(paymentAdmin.address, value, { from: tokenHolder });

    const actualBalance = await token.balanceOf(paymentAdmin.address);

    expect(actualBalance).to.eq.BN(balance.add(value));
  });

  it('should retrieve received tokens', async () => {
    const value = tokens(10);
    const receiver = accounts[2];

    const balance = await token.balanceOf(paymentAdmin.address);
    const receiverBalance = await token.balanceOf(receiver);

    await token.transfer(paymentAdmin.address, value, { from: tokenHolder });
    await paymentAdmin.retrieveTokens(receiver, token.address);

    const actualBalance = await token.balanceOf(paymentAdmin.address);
    const actualReceiverBalance = await token.balanceOf(receiver);

    expect(actualBalance).to.eq.BN(balance);
    expect(actualReceiverBalance).to.eq.BN(receiverBalance.add(value));
  });

  it('should allow only owner to retrieve tokens', async () => {
    const value = tokens(10);
    await token.transfer(paymentAdmin.address, value, { from: tokenHolder });

    const balance = await token.balanceOf(paymentAdmin.address);

    try {
      await paymentAdmin.retrieveTokens(accounts[3], token.address, { from: accounts[3] });
    } catch {
      const actualBalance = await token.balanceOf(paymentAdmin.address);
      expect(actualBalance).to.eq.BN(balance);
      return;
    }

    assert.fail();
  });

  it('should transfer tokens to another account', async () => {
    const value = tokens(10);
    const receiver = accounts[2];

    await token.transfer(paymentAdmin.address, value, { from: tokenHolder });

    const balance = await token.balanceOf(receiver);

    await paymentAdmin.transfer(receiver, token.address, value);

    const actualBalance = await token.balanceOf(receiver);

    expect(actualBalance).to.eq.BN(balance.add(value));
  });

  it('should allow only owner to send tokens', async () => {
    const value = tokens(10);
    await token.transfer(paymentAdmin.address, value, { from: tokenHolder });

    const balance = await token.balanceOf(paymentAdmin.address);

    try {
      await paymentAdmin.transfer(accounts[4], token.address, value, { from: accounts[4] });
    } catch {
      const actualBalance = await token.balanceOf(paymentAdmin.address);
      expect(actualBalance).to.eq.BN(balance);
      return;
    }

    assert.fail();
  });
});

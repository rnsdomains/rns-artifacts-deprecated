const assert = require('assert');
const PaymentAdmin = artifacts.require('PaymentAdmin');
const Token = artifacts.require('BasicToken');

contract('PaymentAdmin', async accounts => {
  var paymentAdmin, token;
  const owner = accounts[0];
  const tokenHolder = accounts[1];

  beforeEach(async () => {
    paymentAdmin = await PaymentAdmin.new({ from: owner });
    token = await Token.new(1e20, { from: tokenHolder });
  });

  it('should create PaymentAdmin contract', async () => {
    assert.ok(paymentAdmin.address);
  });

  it('should store deployer as owner', async () => {
    const actualOwner = await paymentAdmin.owner();

    assert.equal(actualOwner, owner);
  });

  it('should fallback to owner address', async () => {
    const balance = await web3.eth.getBalance(owner);
    const value = 1e18;

    await web3.eth.sendTransaction({ from: accounts[1], to: paymentAdmin.address, value });

    const actualBalance = await web3.eth.getBalance(owner);

    assert.equal(actualBalance, balance.toNumber() + value);
  });

  it('should receive tokens', async () => {
    const balance = await token.balanceOf(paymentAdmin.address);
    const value = 1e19;

    await token.transfer(paymentAdmin.address, value, { from: tokenHolder });

    const actualBalance = await token.balanceOf(paymentAdmin.address);

    assert.equal(actualBalance, balance.toNumber() + value);
  });

  it('should retrive received tokens', async () => {
    const value = 1e19;
    const receiver = accounts[2];

    const balance = await token.balanceOf(paymentAdmin.address);
    const receiverBalance = await token.balanceOf(receiver);

    await token.transfer(paymentAdmin.address, value, { from: tokenHolder });
    await paymentAdmin.retriveTokens(token.address, receiver);

    const actualBalance = await token.balanceOf(paymentAdmin.address);
    const actualReceiverBalance = await token.balanceOf(receiver);

    assert.equal(actualBalance.toNumber(), balance.toNumber());
    assert.equal(actualReceiverBalance, receiverBalance.toNumber() + value);
  });

  it('should allow only owner to retrive tokens', async () => {
    const value = 1e19;
    await token.transfer(paymentAdmin.address, value, { from: tokenHolder });

    const balance = await token.balanceOf(paymentAdmin.address);

    try {
      await paymentAdmin.retriveTokens(token.address, accounts[3], { from: accounts[3] });
    } catch {
      const actualBalance = await token.balanceOf(paymentAdmin.address);
      assert.equal(actualBalance, balance);
    }
  });
});

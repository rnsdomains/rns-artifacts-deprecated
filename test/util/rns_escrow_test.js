var chai = require('chai');
var BN = require('bn.js');
var bnChai = require('bn-chai');
chai.use(bnChai(BN));

const expect = chai.expect;

const RNS = artifacts.require('RNS');
const RnsEscrow = artifacts.require('RnsEscrow');
const Token = artifacts.require('BasicToken');

const tokens = require('../constants').tokens;
const namehash = require('eth-ens-namehash').hash;
const rootNode = require('../constants').BYTES32_ZERO;
const label = web3.utils.sha3('rsk');
const node = namehash('rsk');

contract('RnsEscrow', async accounts => {
  var rnsEscrow, token;
  const escrowOwner = accounts[0];
  const domainOwner = accounts[1];
  const domainBuyerCarl = accounts[2];
  const domainBuyerSusy = accounts[3];

  beforeEach(async () => {
    rns = await RNS.new();
    rnsEscrow = await RnsEscrow.new(rns.address, domainOwner, domainBuyerCarl, node, 100, { from: escrowOwner });
    token = await Token.new(tokens(100), { from: domainBuyerCarl });
    await rns.setSubnodeOwner(rootNode, label, domainOwner);
  });

  it('Test deposit', async () => {
    const balance = parseInt(await web3.eth.getBalance(domainOwner));
    await rnsEscrow.deposit(domainOwner, {from:escrowOwner, value:100});
    const escrowBalanceForDomainOwner = (await rnsEscrow.depositsOf(domainOwner)).words[0];
    assert.ok(escrowBalanceForDomainOwner === 100);
  });

  it('Test notify', async () => {
    const currentOwner = await rns.owner(node);
    assert.ok(currentOwner === domainOwner);
    await rns.setSubnodeOwner(rootNode, label, rnsEscrow.address);
    assert.ok(await rns.owner(node) === rnsEscrow.address);
    await rnsEscrow.notify(node, {from:domainOwner});
  });

  it('Test notify contractTransfered modifier', async () => {
    try {
      const currentOwner = await rns.owner(node);
      assert.ok(currentOwner === domainOwner);
      await rnsEscrow.notify(node, {from:domainOwner});
    } catch(e) {
      assert.ok("You must transfer the domain before calling this method", e.reason);
    }
  });


});

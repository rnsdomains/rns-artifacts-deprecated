const assert = require('assert');
const Whitelist = artifacts.require('Whitelist');

contract('Whitelist', async accounts => {
  var whitelist;

  beforeEach(async () => {
    whitelist = await Whitelist.new();
  });

  it('should create Whitelist contract', async () => {
    assert(whitelist.address);
   });

  it('should store deployer as owner', async () => {
    const owner = await whitelist.owner();

    assert.equal(owner, accounts[0]);
  });
});

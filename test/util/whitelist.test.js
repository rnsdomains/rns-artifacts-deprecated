const assert = require('assert');
const Whitelist = artifacts.require('Whitelist');

contract('Whitelist', async () => {
  it('should create Whitelist contract', async () => {
    const whitelist = await Whitelist.new();
    assert(whitelist.address);
  });
});

const RNS = artifacts.require('RNS');
const MultiChainResolver = artifacts.require('MultiChainResolver');

contract('MultiChainResolver', async () => {
  beforeEach(async () => {
    await RNS.new();
    await MultiChainResolver.new();
  });

  it('should create smart contracts', async () => { return });
});

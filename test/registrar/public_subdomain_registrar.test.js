const PublicSubdomainRegistrar = artifacts.require('PublicSubdomainRegistrar');

contract('PublicSubdomainRegistrar', async () => {
  it('should create PublicSubdomainRegistrar contract', async () => {
    await PublicSubdomainRegistrar.new();
  });
});

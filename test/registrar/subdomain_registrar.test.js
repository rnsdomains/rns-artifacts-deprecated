const SubdomainRegistrar = artifacts.require('SubdomainRegistrar');

contract('SubdomainRegistrar', async () => {
  it('should create SubdomainRegistrar contract', async () => {
    await SubdomainRegistrar.new();
  });
});

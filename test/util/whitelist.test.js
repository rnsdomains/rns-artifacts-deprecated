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

  it('should be able to sotre managers', async () => {
    const manager1 = accounts[1];
    const manager2 = accounts[2];

    await whitelist.addManager(manager1);
    await whitelist.addManager(manager2);

    const isManager1 = await whitelist.isManager(manager1);
    const isManager2 = await whitelist.isManager(manager2);

    assert.ok(isManager1);
    assert.ok(isManager2);
  });

  it('should let only owner to add managers', async () => {
    const manager = accounts[1];

    try {
      await whitelist.addManager(manager, { from: accounts[1] });
    } catch {
      const isManager = await whitelist.isManager(accounts[1]);
      assert.ok(!isManager);
      return;
    }

    assert.fail();
  });

  it('should allow managers to store whitelisted accounts', async () => {
    const manager = accounts[1];
    const whitelisted = accounts[2];

    await whitelist.addManager(manager);

    await whitelist.addWhitelisted(whitelisted, { from: accounts[1] });

    const isWhitelisted = await whitelist.isWhitelisted(accounts[2]);

    assert.ok(isWhitelisted);
  });

  it('should allow only managers to whitelist', async () => {
    try {
      await whitelist.addWhitelisted(accounts[1], { from: accounts[1] });
    } catch {
      const isWhitelisted = await whitelist.isWhitelisted(accounts[1]);
      assert.ok(!isWhitelisted);
      return;
    }

    assert.fail();
  });

  it('should be able to remove managers', async () => {
    const manager = accounts[1];

    await whitelist.addManager(manager);

    await whitelist.removeManager(manager);

    const isManager = await whitelist.isManager(manager);

    assert.ok(!isManager);
  });

  it('should let only owner to remove managers', async () => {
    const manager = accounts[1];
    await whitelist.addManager(manager);

    try {
      await whitelist.removeManager(manager, { from: accounts[2] });
    } catch {
      const isManager = await whitelist.isManager(accounts[1]);
      assert.ok(isManager);
      return;
    }

    assert.fail();
  });

  it('should not allow managers to remove managers', async () => {
    const manager = accounts[0];
    const otherManager = accounts[1]

    await whitelist.addManager(manager);
    await whitelist.addManager(otherManager);

    try {
      await whitelist.removeManager(manager, { from: otherManager });
    } catch {
      const isManager = await whitelist.isManager(manager);
      assert.ok(isManager);
      return;
    }

    assert.fail();
  });

  it('should be able to remove whitelisted', async () => {
    const manager = accounts[1];
    const whitelisted = accounts[2];

    await whitelist.addManager(manager);
    await whitelist.addWhitelisted(whitelisted, { from: manager });

    await whitelist.removeWhitelisted(whitelisted, { from: manager });

    const isWhitelisted = await whitelist.isWhitelisted(whitelisted);

    assert.ok(!isWhitelisted);
  });

  it('should let only managers to remove whitelisted', async () => {
    const manager = accounts[1];
    const whitelisted = accounts[2];

    await whitelist.addManager(manager);
    await whitelist.addWhitelisted(whitelisted, { from: manager });

    try {
      await whitelist.removeWhitelisted(whitelisted, { from: accounts[3] });
    } catch {
      const isWhitelisted = await whitelist.isWhitelisted(whitelisted);
      assert.ok(isWhitelisted);
      return;
    }

    assert.fail();
  });
});

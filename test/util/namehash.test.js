const Strings = artifacts.require('Strings');
const Namehash = artifacts.require('Namehash');
const testCases = require('./namehash.cases.json');

contract('Namehash', async () => {
  it('should hash correctly', async () => {
    let strings = await Strings.new();
    await Namehash.link('Strings', strings.address);
    const namehash = await Namehash.new();

    for (const testCase of testCases) {
      const hash = await namehash.hash(testCase.name);
      assert.equal(hash, testCase.hash);
    };
  });
});

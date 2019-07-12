<img src="/logo.png" alt="logo" height="200" />

# `rns-artifacts`

[![npm @RSKSmart/rns-artifacts](https://badge.fury.io/js/%40rsksmart%2Frns-artifacts.svg)](https://badge.fury.io/js/%40rsksmart%2Frns-artifacts)

RNS library for smart contract development.

It provides implementations of RNS Registry, Registrars, and Resolvers which you can deploy as-is or extend to suit your needs, as well as Solidity components to build custom contracts and more complex decentralized systems.

## Install

```
npm install rns-artifacts
```

## Usage

To write your custom contracts, import ours and extend them through inheritance.

```solidity
pragma solidity ^0.5.2;

import 'rns-artifacts/contracts/registry/AbstractRNS.sol';
import 'rns-artifacts/contracts/resolver/AbstractResolver.sol';

contract MyResolver is AbstractResolver {
    AbstractRNS public rns;

    constructor(AbstractRNS _rns) public {
        rns = _rns;
    }

    function supportsInterface(bytes4) public pure returns (bool) {
        return false;
    }
}
```

To test your custom contracts in Truffle, import ours and deploy them through `truffle-contract`.

```js
const assert = require('assert');
const truffleContract = require('truffle-contract');

const RNS = truffleContract(
  require('rns-artifacts/build/contracts/RNS.json')
);
RNS.setProvider(web3.currentProvider);

const MyResolver = artifacts.require('MyResolver');

contract('RNS', async accounts => {
  it('should create MyResolver', async () => {
    const rns = await RNS.new({ from: accounts[0] });
    const resolver = await MyResolver.new(rns.address);

    const rnsAddress = await resolver.rns();

    assert.equal(rnsAddress, rns.address);
  });
});
```

---

## Related links

- [RSK](https://rsk.co)
    - [Docs](https://github.com/rsksmart/rskj/wiki)
- [RIF](https://rifos.org)
    - [Docs](https://www.rifos.org/documentation/)
    - [Whitepaper](https://docs.rifos.org/rif-whitepaper-en.pdf)
    - [Testnet faucet](https://faucet.rifos.org)
- RNS
    - [Docs](https://docs.rns.rifos.org)
    - [Manager](https://rns.rifos.org)
    - [Testnet registrar](https://testnet.rns.rifos.org)

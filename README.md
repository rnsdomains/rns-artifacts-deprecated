<p align="middle">
    <img src="https://www.rifos.org/assets/img/logo.svg" alt="logo" height="100" >
</p>
<h3 align="middle"><code>rns-artifacts-depreacted</code></h3>
<p align="middle">
    <b>(deprecated)</b> RNS library for smart contract development.
</p>
<p align="middle">
    <a href="https://circleci.com/gh/rnsdomains/rns-artifacts-depreacted">
        <img src="https://circleci.com/gh/rnsdomains/rns-artifacts-deprecated.svg?style=svg" alt="CircleCI" />
    </a>
    <a href="https://badge.fury.io/js/%40rnsdomains%2Frns-artifacts">
        <img src="https://badge.fury.io/js/%40rsksmart%2Frns-artifacts.svg" alt="logo" />
    </a>
    <a href="https://crytic.io/rnsdomains/rns-artifacts-deprecated"><img src="https://crytic.io/api/repositories/EINEI5coSh-ZW6dICU3oCA/badge.svg?token=fe91d693-ecee-459f-ab16-2f29ebc51d4d" /></a>
</p>

```
npm i @rsksmart/rns-artifacts
```

> :warning: **Deprecated**: [View new implementation](/rnsdomains/rns-artifacts/)

## Usage

This package provides implementations of RNS Registry, Registrars, and Resolvers which you can deploy as-is or extend to suit your needs, as well as Solidity components to build custom contracts and more complex decentralized systems.

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
